from celery import Task
from celery.utils.log import get_task_logger
import uuid
from app.workers.celery_app import celery_app
from app.core.database import SessionLocal
from app.models.database_instance import DatabaseInstance
from app.services.database_service import DatabaseService

logger = get_task_logger(__name__)


class DatabaseProvisionTask(Task):
    """Custom task class with error handling"""
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """Handle task failure"""
        logger.error(f"Task {task_id} failed: {exc}")
        
        # Update database status to failed
        db_instance_id = args[0] if args else None
        if db_instance_id:
            db = SessionLocal()
            try:
                db_instance = db.query(DatabaseInstance).filter(
                    DatabaseInstance.id == uuid.UUID(db_instance_id)
                ).first()
                
                if db_instance:
                    db_instance.status = "failed"
                    db.commit()
                    logger.info(f"Updated database {db_instance_id} status to failed")
            except Exception as e:
                logger.error(f"Failed to update database status: {str(e)}")
            finally:
                db.close()


@celery_app.task(
    bind=True,
    base=DatabaseProvisionTask,
    name="provision_database",
    max_retries=3,
    default_retry_delay=60
)
def provision_database_task(self, db_instance_id: str, password: str):
    """
    Celery task to provision PostgreSQL database asynchronously.
    
    Args:
        db_instance_id: Database instance UUID as string
        password: Plain text password for database user
    
    This task:
    1. Creates the PostgreSQL database
    2. Creates the database user
    3. Grants privileges
    4. Updates status to 'active'
    
    On failure, it will retry up to 3 times with 60 second delays.
    """
    db = SessionLocal()
    
    try:
        logger.info(f"Starting database provisioning for {db_instance_id}")
        
        # Get database instance
        db_instance = db.query(DatabaseInstance).filter(
            DatabaseInstance.id == uuid.UUID(db_instance_id)
        ).first()
        
        if not db_instance:
            logger.error(f"Database instance {db_instance_id} not found")
            raise ValueError(f"Database instance {db_instance_id} not found")
        
        # Check if already provisioned
        if db_instance.status == "active":
            logger.info(f"Database {db_instance_id} already active")
            return {"status": "already_active", "database_id": db_instance_id}
        
        # Provision database using service
        service = DatabaseService(db)
        service.provision_database(db_instance, password)
        
        logger.info(f"Successfully provisioned database {db_instance_id}")
        
        return {
            "status": "success",
            "database_id": db_instance_id,
            "database_name": db_instance.database_name
        }
        
    except Exception as exc:
        logger.error(f"Failed to provision database {db_instance_id}: {str(exc)}")
        
        # Retry the task
        try:
            raise self.retry(exc=exc)
        except self.MaxRetriesExceededError:
            logger.error(f"Max retries exceeded for database {db_instance_id}")
            raise
    
    finally:
        db.close()


@celery_app.task(name="cleanup_failed_databases")
def cleanup_failed_databases_task():
    """
    Periodic task to clean up failed database provisioning attempts.
    
    This task can be scheduled to run periodically to clean up
    databases that failed to provision after multiple retries.
    """
    db = SessionLocal()
    
    try:
        logger.info("Starting cleanup of failed databases")
        
        # Find failed databases older than 1 hour
        from datetime import datetime, timedelta
        cutoff_time = datetime.utcnow() - timedelta(hours=1)
        
        failed_databases = db.query(DatabaseInstance).filter(
            DatabaseInstance.status == "failed",
            DatabaseInstance.created_at < cutoff_time
        ).all()
        
        logger.info(f"Found {len(failed_databases)} failed databases to clean up")
        
        service = DatabaseService(db)
        
        for db_instance in failed_databases:
            try:
                # Attempt to clean up any partially created resources
                if service.admin_service.database_exists(db_instance.database_name):
                    service.admin_service.drop_database(db_instance.database_name)
                    logger.info(f"Cleaned up database: {db_instance.database_name}")
                
                if service.admin_service.user_exists(db_instance.database_user):
                    service.admin_service.drop_user(db_instance.database_user)
                    logger.info(f"Cleaned up user: {db_instance.database_user}")
                
                # Mark as deleted
                db_instance.status = "deleted"
                db.commit()
                
            except Exception as e:
                logger.error(f"Failed to clean up database {db_instance.id}: {str(e)}")
                continue
        
        logger.info("Completed cleanup of failed databases")
        
        return {
            "status": "success",
            "cleaned_up": len(failed_databases)
        }
        
    except Exception as e:
        logger.error(f"Failed to run cleanup task: {str(e)}")
        raise
    
    finally:
        db.close()
