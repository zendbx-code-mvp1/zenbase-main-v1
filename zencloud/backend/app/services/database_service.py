from sqlalchemy.orm import Session
from sqlalchemy import func
import logging
from typing import Optional, List
import uuid
from app.models.database_instance import DatabaseInstance
from app.core.security import (
    generate_secure_password,
    generate_random_suffix,
    encrypt_password,
    decrypt_password,
    build_connection_string
)
from app.services.postgres_admin_service import postgres_admin_service
from app.core.config import settings

logger = logging.getLogger(__name__)


class DatabaseService:
    """
    Database Business Logic Service
    
    Handles database provisioning, management, and validation.
    Coordinates between application DB and PostgreSQL admin operations.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.admin_service = postgres_admin_service
    
    def generate_database_name(self, user_id: uuid.UUID, custom_suffix: Optional[str] = None) -> str:
        """
        Generate unique database name.
        
        Format: zencloud_u{user_id_short}_{suffix}
        
        Args:
            user_id: User UUID
            custom_suffix: Optional custom suffix
        
        Returns:
            Unique database name
        """
        user_id_short = str(user_id).replace('-', '')[:8]
        suffix = custom_suffix if custom_suffix else generate_random_suffix(6)
        database_name = f"{settings.DATABASE_NAME_PREFIX}_u{user_id_short}_{suffix}"
        
        # Ensure uniqueness
        while self.db.query(DatabaseInstance).filter(
            DatabaseInstance.database_name == database_name
        ).first():
            suffix = generate_random_suffix(6)
            database_name = f"{settings.DATABASE_NAME_PREFIX}_u{user_id_short}_{suffix}"
        
        return database_name
    
    def generate_database_user(self, database_name: str) -> str:
        """
        Generate database username based on database name.
        
        Args:
            database_name: Database name
        
        Returns:
            Database username
        """
        return f"{database_name}_user"
    
    def check_user_quota(self, user_id: uuid.UUID) -> bool:
        """
        Check if user has reached database quota.
        
        Args:
            user_id: User UUID
        
        Returns:
            True if user can create more databases
        """
        count = self.db.query(func.count(DatabaseInstance.id)).filter(
            DatabaseInstance.user_id == user_id,
            DatabaseInstance.status.in_(["pending", "active"])
        ).scalar()
        
        return count < settings.MAX_DATABASES_PER_USER
    
    def create_database_record(
        self,
        user_id: uuid.UUID,
        database_name: str,
        database_user: str,
        encrypted_password: str
    ) -> DatabaseInstance:
        """
        Create database instance record in application DB.
        
        Args:
            user_id: User UUID
            database_name: Database name
            database_user: Database username
            encrypted_password: Encrypted password
        
        Returns:
            DatabaseInstance object
        """
        db_instance = DatabaseInstance(
            user_id=user_id,
            database_name=database_name,
            database_user=database_user,
            encrypted_password=encrypted_password,
            host=settings.POSTGRES_ADMIN_HOST,
            port=settings.POSTGRES_ADMIN_PORT,
            status="pending"
        )
        
        self.db.add(db_instance)
        self.db.commit()
        self.db.refresh(db_instance)
        
        logger.info(f"Created database record: {database_name} for user {user_id}")
        return db_instance
    
    def provision_database(self, db_instance: DatabaseInstance, password: str) -> bool:
        """
        Provision actual PostgreSQL database and user.
        
        Args:
            db_instance: DatabaseInstance object
            password: Plain text password
        
        Returns:
            True if successful
        
        Raises:
            Exception if provisioning fails
        """
        try:
            # Step 1: Create database
            logger.info(f"Creating database: {db_instance.database_name}")
            self.admin_service.create_database(db_instance.database_name)
            
            # Step 2: Create user
            logger.info(f"Creating user: {db_instance.database_user}")
            self.admin_service.create_user(db_instance.database_user, password)
            
            # Step 3: Grant privileges
            logger.info(f"Granting privileges to {db_instance.database_user} on {db_instance.database_name}")
            self.admin_service.grant_privileges(db_instance.database_name, db_instance.database_user)
            
            # Update status to active
            db_instance.status = "active"
            self.db.commit()
            
            logger.info(f"Successfully provisioned database: {db_instance.database_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to provision database {db_instance.database_name}: {str(e)}")
            
            # Rollback: Clean up any created resources
            try:
                if self.admin_service.database_exists(db_instance.database_name):
                    self.admin_service.drop_database(db_instance.database_name)
                if self.admin_service.user_exists(db_instance.database_user):
                    self.admin_service.drop_user(db_instance.database_user)
            except Exception as cleanup_error:
                logger.error(f"Cleanup failed: {str(cleanup_error)}")
            
            # Update status to failed
            db_instance.status = "failed"
            self.db.commit()
            
            raise
    
    def get_user_databases(self, user_id: uuid.UUID) -> List[DatabaseInstance]:
        """
        Get all databases for a user.
        
        Args:
            user_id: User UUID
        
        Returns:
            List of DatabaseInstance objects
        """
        return self.db.query(DatabaseInstance).filter(
            DatabaseInstance.user_id == user_id,
            DatabaseInstance.status != "deleted"
        ).order_by(DatabaseInstance.created_at.desc()).all()
    
    def get_database_by_id(self, database_id: uuid.UUID, user_id: uuid.UUID) -> Optional[DatabaseInstance]:
        """
        Get database by ID with ownership check.
        
        Args:
            database_id: Database UUID
            user_id: User UUID
        
        Returns:
            DatabaseInstance object or None
        """
        return self.db.query(DatabaseInstance).filter(
            DatabaseInstance.id == database_id,
            DatabaseInstance.user_id == user_id,
            DatabaseInstance.status != "deleted"
        ).first()
    
    def get_connection_string(self, db_instance: DatabaseInstance) -> str:
        """
        Get connection string for database.
        
        Args:
            db_instance: DatabaseInstance object
        
        Returns:
            PostgreSQL connection string
        """
        password = decrypt_password(db_instance.encrypted_password)
        return build_connection_string(
            host=db_instance.host,
            port=db_instance.port,
            database=db_instance.database_name,
            user=db_instance.database_user,
            password=password
        )
    
    def delete_database(self, db_instance: DatabaseInstance) -> bool:
        """
        Delete database and user from PostgreSQL.
        
        Args:
            db_instance: DatabaseInstance object
        
        Returns:
            True if successful
        """
        try:
            # Update status to deleting
            db_instance.status = "deleting"
            self.db.commit()
            
            # Drop database
            logger.info(f"Dropping database: {db_instance.database_name}")
            self.admin_service.drop_database(db_instance.database_name)
            
            # Drop user
            logger.info(f"Dropping user: {db_instance.database_user}")
            self.admin_service.drop_user(db_instance.database_user)
            
            # Update status to deleted
            db_instance.status = "deleted"
            self.db.commit()
            
            logger.info(f"Successfully deleted database: {db_instance.database_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete database {db_instance.database_name}: {str(e)}")
            db_instance.status = "active"  # Revert status
            self.db.commit()
            raise
    
    def reset_database_password(self, db_instance: DatabaseInstance) -> str:
        """
        Reset database user password.
        
        Args:
            db_instance: DatabaseInstance object
        
        Returns:
            New connection string
        """
        try:
            # Generate new password
            new_password = generate_secure_password()
            
            # Reset password in PostgreSQL
            logger.info(f"Resetting password for user: {db_instance.database_user}")
            self.admin_service.reset_user_password(db_instance.database_user, new_password)
            
            # Encrypt and update password in DB
            db_instance.encrypted_password = encrypt_password(new_password)
            self.db.commit()
            
            logger.info(f"Successfully reset password for database: {db_instance.database_name}")
            
            # Return new connection string
            return build_connection_string(
                host=db_instance.host,
                port=db_instance.port,
                database=db_instance.database_name,
                user=db_instance.database_user,
                password=new_password
            )
            
        except Exception as e:
            logger.error(f"Failed to reset password for database {db_instance.database_name}: {str(e)}")
            raise
