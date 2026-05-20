from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum as SQLEnum, Uuid
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.core.database import Base


class DeploymentStatus(str, enum.Enum):
    """Deployment status enum"""
    PENDING = "pending"
    BUILDING = "building"
    SUCCESS = "success"
    FAILED = "failed"


class Deployment(Base):
    """Deployment model"""
    __tablename__ = "deployments"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id = Column(Uuid, ForeignKey("projects.id"), nullable=False)
    
    # Git info
    commit_sha = Column(String, nullable=False)
    commit_message = Column(String, nullable=True)
    
    # Deployment info
    status = Column(SQLEnum(DeploymentStatus), default=DeploymentStatus.PENDING)
    build_logs = Column(Text, nullable=True)
    container_id = Column(String, nullable=True)
    
    # Timestamps
    deployed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="deployments")
