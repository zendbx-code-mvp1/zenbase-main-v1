from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base


class DatabaseInstance(Base):
    """
    Database Instance Model
    
    Represents a PostgreSQL database provisioned for a user.
    Each instance is an isolated database with dedicated credentials.
    """
    __tablename__ = "database_instances"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Database identifiers
    database_name = Column(String, unique=True, nullable=False, index=True)
    database_user = Column(String, unique=True, nullable=False)
    
    # Encrypted credentials (using Fernet encryption)
    encrypted_password = Column(String, nullable=False)
    
    # Connection details
    host = Column(String, nullable=False, default="localhost")
    port = Column(Integer, nullable=False, default=5432)
    
    # Status: pending, active, failed, deleting, deleted
    status = Column(String, nullable=False, default="pending", index=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="databases")
    
    def __repr__(self):
        return f"<DatabaseInstance(id={self.id}, name={self.database_name}, status={self.status})>"
