from sqlalchemy import Column, String, DateTime, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base


class EnvironmentVariable(Base):
    """Environment variable model"""
    __tablename__ = "environment_variables"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id = Column(Uuid, ForeignKey("projects.id"), nullable=False)
    
    # Variable
    key = Column(String, nullable=False)
    value = Column(String, nullable=False)  # Encrypted
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="env_vars")
