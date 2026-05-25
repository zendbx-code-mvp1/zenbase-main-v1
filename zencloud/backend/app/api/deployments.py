"""Deployment management endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.models import User
from app.models.deployment import Deployment
from app.models.project import Project
from app.schemas.deployment import DeploymentResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/deployments", tags=["Deployments"])


@router.get("/recent", response_model=List[DeploymentResponse])
async def list_recent_deployments(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List recent deployments across all projects owned by the current user"""
    # Get all project IDs owned by the user
    project_ids = [
        p.id for p in db.query(Project).filter(Project.user_id == current_user.id).all()
    ]
    if not project_ids:
        return []

    deployments = (
        db.query(Deployment)
        .filter(Deployment.project_id.in_(project_ids))
        .order_by(Deployment.created_at.desc())
        .limit(limit)
        .all()
    )
    return deployments


@router.get("/{deployment_id}", response_model=DeploymentResponse)
async def get_deployment(
    deployment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get deployment details"""
    deployment = db.query(Deployment).filter(Deployment.id == deployment_id).first()
    
    if not deployment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deployment not found"
        )
    
    # Check if user owns the project
    project = db.query(Project).filter(
        Project.id == deployment.project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return deployment


@router.get("/project/{project_id}", response_model=List[DeploymentResponse])
async def list_project_deployments(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all deployments for a project"""
    # Check if user owns the project
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    deployments = db.query(Deployment).filter(
        Deployment.project_id == project_id
    ).order_by(Deployment.created_at.desc()).all()
    
    return deployments


@router.get("/{deployment_id}/logs")
async def get_deployment_logs(
    deployment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get deployment build logs"""
    deployment = db.query(Deployment).filter(Deployment.id == deployment_id).first()
    
    if not deployment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deployment not found"
        )
    
    # Check if user owns the project
    project = db.query(Project).filter(
        Project.id == deployment.project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return {
        "deployment_id": str(deployment.id),
        "logs": deployment.build_logs or "No logs available",
        "status": deployment.status
    }
