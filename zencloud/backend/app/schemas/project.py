from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID
from app.models.project import ProjectStatus, Framework


class ProjectBase(BaseModel):
    """Base project schema"""
    name: str
    repository_url: str
    branch: str = "main"


class ProjectCreate(ProjectBase):
    """Project creation schema"""
    pass


class ProjectUpdate(BaseModel):
    """Project update schema"""
    name: Optional[str] = None
    branch: Optional[str] = None
    custom_domain: Optional[str] = None


class ProjectResponse(ProjectBase):
    """Project response schema"""
    id: UUID
    user_id: UUID
    subdomain: str
    custom_domain: Optional[str] = None
    framework: Optional[Framework] = None
    status: ProjectStatus
    container_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProjectStats(BaseModel):
    """Project statistics schema"""
    cpu_usage: float
    memory_usage: float
    uptime: int
    status: str
