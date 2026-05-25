from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging
import uuid
from app.core.database import get_db
from app.core.security import encrypt_password, generate_secure_password
from app.schemas.database import (
    DatabaseCreate,
    DatabaseResponse,
    DatabaseListItem,
    DatabaseDetail,
    PasswordResetRequest,
    PasswordResetResponse,
    DatabaseDeleteResponse
)
from app.services.database_service import DatabaseService
from app.api.auth import get_current_user
from app.models.user import User
from app.workers.database_tasks import provision_database_task

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/databases", tags=["databases"])


@router.post("", response_model=DatabaseResponse, status_code=status.HTTP_201_CREATED)
async def create_database(
    request: DatabaseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new PostgreSQL database for the current user.
    
    The database will be provisioned asynchronously.
    Initial status will be 'pending', then 'active' once ready.
    """
    try:
        service = DatabaseService(db)
        
        # Check user quota
        if not service.check_user_quota(current_user.id):
            from app.core.config import settings
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Database quota exceeded. Maximum {settings.MAX_DATABASES_PER_USER} databases per user."
            )
        
        # Generate database name and user
        database_name = service.generate_database_name(current_user.id, request.name)
        database_user = service.generate_database_user(database_name)
        
        # Generate secure password
        password = generate_secure_password()
        encrypted_password = encrypt_password(password)
        
        # Create database record
        db_instance = service.create_database_record(
            user_id=current_user.id,
            database_name=database_name,
            database_user=database_user,
            encrypted_password=encrypted_password
        )
        
        # Trigger async provisioning task
        provision_database_task.delay(str(db_instance.id), password)
        
        # Return response with connection string
        connection_string = service.get_connection_string(db_instance)
        
        return DatabaseResponse(
            id=db_instance.id,
            user_id=db_instance.user_id,
            database_name=db_instance.database_name,
            database_user=db_instance.database_user,
            host=db_instance.host,
            port=db_instance.port,
            status=db_instance.status,
            connection_string=connection_string,
            created_at=db_instance.created_at,
            updated_at=db_instance.updated_at
        )
        
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to create database: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create database"
        )


@router.get("", response_model=List[DatabaseListItem])
async def list_databases(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all databases for the current user.
    """
    try:
        service = DatabaseService(db)
        databases = service.get_user_databases(current_user.id)
        
        return [
            DatabaseListItem(
                id=db_instance.id,
                database_name=db_instance.database_name,
                host=db_instance.host,
                port=db_instance.port,
                status=db_instance.status,
                created_at=db_instance.created_at
            )
            for db_instance in databases
        ]
        
    except Exception as e:
        logger.error(f"Failed to list databases: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list databases"
        )


@router.get("/{database_id}", response_model=DatabaseDetail)
async def get_database(
    database_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific database including connection string.
    """
    try:
        service = DatabaseService(db)
        db_instance = service.get_database_by_id(database_id, current_user.id)
        
        if not db_instance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Database not found"
            )
        
        connection_string = service.get_connection_string(db_instance)
        
        return DatabaseDetail(
            id=db_instance.id,
            user_id=db_instance.user_id,
            database_name=db_instance.database_name,
            database_user=db_instance.database_user,
            host=db_instance.host,
            port=db_instance.port,
            status=db_instance.status,
            connection_string=connection_string,
            created_at=db_instance.created_at,
            updated_at=db_instance.updated_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get database: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get database"
        )


@router.delete("/{database_id}", response_model=DatabaseDeleteResponse)
async def delete_database(
    database_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a database and its associated user.
    
    This operation is irreversible and will permanently delete all data.
    """
    try:
        service = DatabaseService(db)
        db_instance = service.get_database_by_id(database_id, current_user.id)
        
        if not db_instance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Database not found"
            )
        
        if db_instance.status == "deleting":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Database is already being deleted"
            )
        
        database_name = db_instance.database_name
        
        # Delete database
        service.delete_database(db_instance)
        
        return DatabaseDeleteResponse(
            message="Database deleted successfully",
            database_id=database_id,
            database_name=database_name
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete database: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete database"
        )


@router.post("/{database_id}/reset-password", response_model=PasswordResetResponse)
async def reset_password(
    database_id: uuid.UUID,
    request: PasswordResetRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Reset the password for a database user.
    
    Returns a new connection string with the updated password.
    """
    try:
        service = DatabaseService(db)
        db_instance = service.get_database_by_id(database_id, current_user.id)
        
        if not db_instance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Database not found"
            )
        
        if db_instance.status != "active":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot reset password for database with status: {db_instance.status}"
            )
        
        # Reset password
        new_connection_string = service.reset_database_password(db_instance)
        
        return PasswordResetResponse(
            message="Password reset successfully",
            new_connection_string=new_connection_string,
            database_id=database_id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to reset password: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reset password"
        )
