"""Celery tasks for background processing"""
from celery import Task
from app.workers.celery_app import celery_app
from app.services.deployment_service import DeploymentService
from app.services.docker_service import DockerService
from app.core.database import SessionLocal
from app.models.deployment import Deployment, DeploymentStatus
from app.models.project import Project, ProjectStatus
from sqlalchemy.orm import Session
import traceback


class DatabaseTask(Task):
    """Base task with database session"""
    _db = None
    
    @property
    def db(self) -> Session:
        if self._db is None:
            self._db = SessionLocal()
        return self._db
    
    def after_return(self, *args, **kwargs):
        if self._db is not None:
            self._db.close()
            self._db = None


@celery_app.task(bind=True, base=DatabaseTask)
def deploy_project(self, project_id: str, deployment_id: str, access_token: str = None):
    """Deploy a project from GitHub"""
    db = self.db
    deployment_service = DeploymentService()
    docker_service = DockerService()
    
    try:
        # Get project and deployment
        project = db.query(Project).filter(Project.id == project_id).first()
        deployment = db.query(Deployment).filter(Deployment.id == deployment_id).first()
        
        if not project or not deployment:
            raise Exception("Project or deployment not found")
        
        # Update status
        deployment.status = DeploymentStatus.BUILDING
        project.status = ProjectStatus.BUILDING
        db.commit()
        
        logs = []
        
        # Step 1: Clone repository
        logs.append("📦 Cloning repository...")
        deployment.build_logs = "\n".join(logs)
        db.commit()
        
        project_dir = deployment_service.clone_repository(
            project.repository_url,
            project.branch,
            access_token  # Can be None for public repos
        )
        logs.append(f"✅ Repository cloned to {project_dir}")
        deployment.build_logs = "\n".join(logs)
        db.commit()
        
        # Step 2: Detect framework
        logs.append("🔍 Detecting framework...")
        deployment.build_logs = "\n".join(logs)
        db.commit()
        
        framework, config = deployment_service.detect_framework(project_dir)
        project.framework = framework
        logs.append(f"✅ Detected framework: {framework.value}")
        logs.append(f"   Build command: {config.get('build_command', 'N/A')}")
        logs.append(f"   Start command: {config.get('start_command', 'N/A')}")
        logs.append(f"   Port: {config.get('port', 'N/A')}")
        deployment.build_logs = "\n".join(logs)
        db.commit()
        
        # Step 3: Generate Dockerfile
        logs.append("📝 Generating Dockerfile...")
        deployment.build_logs = "\n".join(logs)
        db.commit()
        
        dockerfile = deployment_service.generate_dockerfile(framework, config)
        logs.append("✅ Dockerfile generated")
        deployment.build_logs = "\n".join(logs)
        db.commit()
        
        # Step 4: Build Docker image
        logs.append("🔨 Building Docker image...")
        deployment.build_logs = "\n".join(logs)
        db.commit()
        
        image_name = f"zencloud-{project.subdomain}:latest"
        success, build_output = deployment_service.build_docker_image(
            project_dir,
            image_name,
            dockerfile
        )
        
        if not success:
            logs.append(f"❌ Build failed:\n{build_output}")
            deployment.build_logs = "\n".join(logs)
            deployment.status = DeploymentStatus.FAILED
            project.status = ProjectStatus.FAILED
            db.commit()
            deployment_service.cleanup(project_dir)
            return
        
        logs.append("✅ Docker image built successfully")
        deployment.build_logs = "\n".join(logs)
        db.commit()
        
        # Step 5: Get environment variables
        env_vars = {}
        for env_var in project.env_vars:
            env_vars[env_var.key] = env_var.value  # TODO: Decrypt
        
        # Step 6: Allocate port
        logs.append("🔌 Allocating port...")
        deployment.build_logs = "\n".join(logs)
        db.commit()
        
        # Get used ports from other projects
        used_ports = [int(p.port) for p in db.query(Project).filter(Project.port.isnot(None)).all()]
        port = docker_service.allocate_port(used_ports)
        logs.append(f"✅ Allocated port: {port}")
        deployment.build_logs = "\n".join(logs)
        db.commit()
        
        # Step 7: Create and start container
        logs.append("🚀 Starting container...")
        deployment.build_logs = "\n".join(logs)
        db.commit()
        
        container_info = docker_service.create_container(
            image_name=image_name,
            container_name=f"zencloud-{project.subdomain}",
            port=port,
            env_vars=env_vars
        )
        
        # Generate deployment URL
        from app.core.config import settings
        
        # Use subdomain-based URL if BASE_DOMAIN is configured, otherwise use localhost
        if settings.BASE_DOMAIN and settings.BASE_DOMAIN != "zencloud.dev":
            deployment_url = f"http://{project.subdomain}.{settings.BASE_DOMAIN}"
        else:
            deployment_url = f"http://localhost:{port}"
        
        logs.append(f"✅ Container started: {container_info['container_id'][:12]}")
        logs.append(f"   Status: {container_info['status']}")
        logs.append(f"   Port: {container_info['port']}")
        logs.append(f"\n🎉 Deployment successful!")
        logs.append(f"   URL: {deployment_url}")
        logs.append(f"   Access your app at the URL above")
        
        # Update database
        deployment.build_logs = "\n".join(logs)
        deployment.status = DeploymentStatus.SUCCESS
        deployment.container_id = container_info['container_id']
        
        project.status = ProjectStatus.ACTIVE
        project.container_id = container_info['container_id']
        project.port = str(port)
        
        db.commit()
        
        # Cleanup
        deployment_service.cleanup(project_dir)
        
        return {
            "success": True,
            "container_id": container_info['container_id'],
            "port": port
        }
        
    except Exception as e:
        error_msg = f"❌ Deployment failed: {str(e)}\n\n{traceback.format_exc()}"
        
        if deployment:
            deployment.build_logs = (deployment.build_logs or "") + "\n" + error_msg
            deployment.status = DeploymentStatus.FAILED
        
        if project:
            project.status = ProjectStatus.FAILED
        
        db.commit()
        
        # Cleanup
        try:
            if 'project_dir' in locals():
                deployment_service.cleanup(project_dir)
        except:
            pass
        
        raise
