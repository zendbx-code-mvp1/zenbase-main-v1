from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID
from app.models.deployment import DeploymentStatus


class DeploymentBase(BaseModel):
    """Base deployment schema"""
    commit_sha: str
    commit_message: Optional[str] = None


class DeploymentCreate(DeploymentBase):
    """Deployment creation schema"""
    project_id: UUID


class DeploymentResponse(DeploymentBase):
    """Deployment response schema"""
    id: UUID
    project_id: UUID
    status: DeploymentStatus
    build_logs: Optional[str] = None
    container_id: Optional[str] = None
    deployed_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class DeploymentTrigger(BaseModel):
    """Manual deployment trigger schema"""
    branch: Optional[str] = None
