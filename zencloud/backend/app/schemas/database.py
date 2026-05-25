from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional
import uuid
import re


class DatabaseCreate(BaseModel):
    """Schema for creating a new database"""
    name: Optional[str] = Field(None, description="Optional custom database name suffix")
    
    @validator('name')
    def validate_name(cls, v):
        if v:
            # Only allow lowercase alphanumeric and underscores
            if not re.match(r'^[a-z0-9_]+$', v):
                raise ValueError('Database name must contain only lowercase letters, numbers, and underscores')
            if len(v) > 20:
                raise ValueError('Database name suffix must be 20 characters or less')
        return v


class DatabaseResponse(BaseModel):
    """Schema for database response"""
    id: uuid.UUID
    user_id: uuid.UUID
    database_name: str
    database_user: str
    host: str
    port: int
    status: str
    connection_string: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DatabaseListItem(BaseModel):
    """Schema for database list item (without sensitive data)"""
    id: uuid.UUID
    database_name: str
    host: str
    port: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class DatabaseDetail(BaseModel):
    """Schema for detailed database view with connection string"""
    id: uuid.UUID
    user_id: uuid.UUID
    database_name: str
    database_user: str
    host: str
    port: int
    status: str
    connection_string: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PasswordResetRequest(BaseModel):
    """Schema for password reset request"""
    pass  # No input needed, just trigger the reset


class PasswordResetResponse(BaseModel):
    """Schema for password reset response"""
    message: str
    new_connection_string: str
    database_id: uuid.UUID


class DatabaseDeleteResponse(BaseModel):
    """Schema for database deletion response"""
    message: str
    database_id: uuid.UUID
    database_name: str
