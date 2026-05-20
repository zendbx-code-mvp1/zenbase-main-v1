from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLEnum, Uuid
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.core.database import Base


class ProjectStatus(str, enum.Enum):
    """Project status enum"""
    ACTIVE = "active"
    STOPPED = "stopped"
    FAILED = "failed"
    BUILDING = "building"


class Framework(str, enum.Enum):
    """Supported frameworks"""
    NEXTJS = "nextjs"
    REACT = "react"
    NODEJS = "nodejs"
    STATIC = "static"
    PYTHON = "python"


class Project(Base):
    """Project model"""
    __tablename__ = "projects"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    
    # Project details
    name = Column(String, nullable=False, index=True)
    repository_url = Column(String, nullable=False)
    branch = Column(String, default="main")
    framework = Column(SQLEnum(Framework), nullable=True)
    
    # Deployment
    subdomain = Column(String, unique=True, nullable=False, index=True)
    custom_domain = Column(String, nullable=True)
    status = Column(SQLEnum(ProjectStatus), default=ProjectStatus.ACTIVE)
    
    # Container
    container_id = Column(String, nullable=True)
    port = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="projects")
    deployments = relationship("Deployment", back_populates="project", cascade="all, delete-orphan")
    env_vars = relationship("EnvironmentVariable", back_populates="project", cascade="all, delete-orphan")
