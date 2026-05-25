from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.models import User, Project
from app.models.project import ProjectStatus
from app.schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from app.api.auth import get_current_user
import re

router = APIRouter(prefix="/projects", tags=["Projects"])


def generate_subdomain(name: str) -> str:
    """Generate subdomain from project name"""
    # Convert to lowercase and replace spaces/special chars with hyphens
    subdomain = re.sub(r'[^a-z0-9-]', '-', name.lower())
    subdomain = re.sub(r'-+', '-', subdomain)  # Remove multiple hyphens
    subdomain = subdomain.strip('-')  # Remove leading/trailing hyphens
    return subdomain


@router.get("/", response_model=List[ProjectResponse])
async def list_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all projects for current user"""
    projects = db.query(Project).filter(Project.user_id == current_user.id).all()
    return projects


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new project and immediately trigger a deployment"""
    from app.models.deployment import Deployment, DeploymentStatus
    import uuid as uuid_lib

    # Generate subdomain
    base_subdomain = generate_subdomain(project_data.name)
    subdomain = base_subdomain
    counter = 1
    while db.query(Project).filter(Project.subdomain == subdomain).first():
        subdomain = f"{base_subdomain}-{counter}"
        counter += 1

    # Create project with deploying status
    project = Project(
        user_id=current_user.id,
        name=project_data.name,
        repository_url=project_data.repository_url,
        branch=project_data.branch,
        subdomain=subdomain,
        status=ProjectStatus.BUILDING,
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # Create initial deployment record
    deployment = Deployment(
        id=uuid_lib.uuid4(),
        project_id=project.id,
        commit_sha="initial",
        commit_message=f"Initial deployment of {project_data.name}",
        status=DeploymentStatus.PENDING,
    )
    db.add(deployment)
    db.commit()
    db.refresh(deployment)

    # Try to kick off the Celery task; if Celery/Redis isn't available,
    # mark the deployment as failed gracefully so the project still appears.
    try:
        from app.workers.tasks import deploy_project as deploy_task
        github_token = current_user.github_access_token or None
        deploy_task.delay(str(project.id), str(deployment.id), github_token)
    except Exception:
        # Celery not available (no Redis) — mark deployment failed, project stopped
        deployment.status = DeploymentStatus.FAILED
        deployment.build_logs = "Deployment worker unavailable (Redis/Celery not running)."
        project.status = "stopped"
        db.commit()

    db.refresh(project)
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get project by ID"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    project_data: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Update fields
    if project_data.name is not None:
        project.name = project_data.name
    if project_data.branch is not None:
        project.branch = project_data.branch
    if project_data.custom_domain is not None:
        project.custom_domain = project_data.custom_domain
    
    db.commit()
    db.refresh(project)
    
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    db.delete(project)
    db.commit()
    
    return None


@router.post("/{project_id}/deploy")
async def deploy_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deploy project from GitHub"""
    from app.models.deployment import Deployment, DeploymentStatus
    from app.workers.tasks import deploy_project as deploy_task
    import uuid as uuid_lib
    import logging
    
    logger = logging.getLogger(__name__)
    logger.info(f"Deploy request received for project {project_id}")
    
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    try:
        # Create deployment record
        deployment = Deployment(
            id=uuid_lib.uuid4(),
            project_id=project.id,
            commit_sha="manual-deploy",
            commit_message="Manual deployment",
            status=DeploymentStatus.PENDING
        )
        db.add(deployment)
        project.status = ProjectStatus.BUILDING
        db.commit()
        db.refresh(deployment)
        
        logger.info(f"Deployment {deployment.id} created, sending to Celery")
        
        # Start deployment task (pass None for GitHub token if not connected)
        github_token = current_user.github_access_token if current_user.github_access_token else None
        task = deploy_task.delay(
            str(project.id),
            str(deployment.id),
            github_token
        )
        
        logger.info(f"Task sent to Celery with ID: {task.id}")
        return {
            "message": "Deployment started" if task_id else "Deployment worker unavailable",
            "deployment_id": str(deployment.id),
            "task_id": task_id,
        }

    except Exception as e:
        logger.error(f"Failed to start deployment: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start deployment: {str(e)}"
        )


@router.post("/{project_id}/start")
async def start_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start project container"""
    from app.services.docker_service import DockerService
    
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if not project.container_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No container found for this project"
        )
    
    try:
        docker_service = DockerService()
        docker_service.start_container(project.container_id)
        return {"message": "Project started", "project_id": str(project_id)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/{project_id}/stop")
async def stop_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Stop project container"""
    from app.services.docker_service import DockerService
    
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if not project.container_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No container found for this project"
        )
    
    try:
        docker_service = DockerService()
        docker_service.stop_container(project.container_id)
        return {"message": "Project stopped", "project_id": str(project_id)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/{project_id}/restart")
async def restart_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Restart project container"""
    from app.services.docker_service import DockerService
    
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if not project.container_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No container found for this project"
        )
    
    try:
        docker_service = DockerService()
        docker_service.restart_container(project.container_id)
        return {"message": "Project restarted", "project_id": str(project_id)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{project_id}/logs")
async def get_project_logs(
    project_id: UUID,
    tail: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get project container logs"""
    from app.services.docker_service import DockerService
    
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if not project.container_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No container found for this project"
        )
    
    try:
        docker_service = DockerService()
        logs = docker_service.get_container_logs(project.container_id, tail)
        return {"logs": logs}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{project_id}/stats")
async def get_project_stats(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get project container stats"""
    from app.services.docker_service import DockerService
    
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if not project.container_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No container found for this project"
        )
    
    try:
        docker_service = DockerService()
        stats = docker_service.get_container_status(project.container_id)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
