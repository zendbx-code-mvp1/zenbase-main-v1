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
    port = Column(String, nullable=True)           # host-mapped port (legacy / fallback URL)
    internal_port = Column(String, nullable=True)  # port the app listens on inside the container
    container_name = Column(String, nullable=True, unique=True, index=True)  # e.g. zencloud-portfolio
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="projects")
    deployments = relationship("Deployment", back_populates="project", cascade="all, delete-orphan")
    env_vars = relationship("EnvironmentVariable", back_populates="project", cascade="all, delete-orphan")
    
    @property
    def deployment_url(self) -> str:
        """Generate deployment URL based on configuration"""
        from app.core.config import settings

        # Use custom domain if configured
        if self.custom_domain:
            return f"http://{self.custom_domain}"

        # Use subdomain routing when a real domain is configured
        if settings.BASE_DOMAIN and settings.BASE_DOMAIN not in ("zencloud.dev", "localhost"):
            return f"http://{self.subdomain}.{settings.BASE_DOMAIN}"

        # Local dev: use host-mapped port
        if self.port:
            return f"http://localhost:{self.port}"

        return "Not deployed"
