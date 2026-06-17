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
        
        # Update status to building
        deployment.status = DeploymentStatus.BUILDING
        project.status = ProjectStatus.BUILDING
        db.commit()
        
        logs = []
        
        # Clone repository
        logs.append("📦 Cloning repository...")
        project_dir = deployment_service.clone_repository(
            project.repository_url,
            project.branch,
            access_token
        )
        logs.append(f"✅ Repository cloned")
        
        # Detect framework
        logs.append("🔍 Detecting framework...")
        framework, config = deployment_service.detect_framework(project_dir)
        project.framework = framework
        logs.append(f"✅ Detected: {framework.value}")
        
        # Generate Dockerfile
        logs.append("📝 Generating Dockerfile...")
        dockerfile = deployment_service.generate_dockerfile(framework, config)
        logs.append("✅ Dockerfile generated")
        
        # Update logs before long build
        deployment.build_logs = "\n".join(logs)
        db.commit()
        
        # Build Docker image
        logs.append("🔨 Building Docker image...")
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
        
        logs.append("✅ Image built")
        
        # Get environment variables
        env_vars = {env_var.key: env_var.value for env_var in project.env_vars}
        
        # Allocate port
        used_ports = [int(p.port) for p in db.query(Project).filter(Project.port.isnot(None)).all()]
        port = docker_service.allocate_port(used_ports)
        logs.append(f"✅ Port allocated: {port}")
        
        # Start container
        logs.append("🚀 Starting container...")
        container_name = f"zencloud-{project.subdomain}"
        container_info = docker_service.create_container(
            image_name=image_name,
            container_name=container_name,
            port=port,
            env_vars=env_vars
        )

        # Determine internal app port from framework config
        internal_port = str(config.get("port", 3000))

        # Generate URL
        from app.core.config import settings
        if settings.BASE_DOMAIN and settings.BASE_DOMAIN not in ("zencloud.dev", "localhost"):
            deployment_url = f"http://{project.subdomain}.{settings.BASE_DOMAIN}"
        else:
            deployment_url = f"http://localhost:{port}"

        logs.append(f"✅ Container started: {container_info['container_id'][:12]}")
        logs.append(f"\n🎉 Deployment successful!")
        logs.append(f"   URL: {deployment_url}")

        # Final database update
        deployment.build_logs = "\n".join(logs)
        deployment.status = DeploymentStatus.SUCCESS
        deployment.container_id = container_info['container_id']
        project.status = ProjectStatus.ACTIVE
        project.container_id = container_info['container_id']
        project.port = str(port)
        project.internal_port = internal_port
        project.container_name = container_name
        db.commit()

        # Generate Nginx reverse proxy config for this project
        try:
            from app.services.reverse_proxy_service import ReverseProxyService
            ReverseProxyService().generate_project_config(project)
            logs.append("   Reverse proxy configured ✅")
            deployment.build_logs = "\n".join(logs)
            db.commit()
        except Exception as proxy_err:
            # Non-fatal — app still runs via direct port
            logs.append(f"   ⚠️  Proxy config skipped: {proxy_err}")
            deployment.build_logs = "\n".join(logs)
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
