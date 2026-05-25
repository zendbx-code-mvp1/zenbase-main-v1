import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import logging
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class PostgresAdminService:
    def __init__(self):
        self.host = settings.POSTGRES_ADMIN_HOST
        self.port = settings.POSTGRES_ADMIN_PORT
        self.user = settings.POSTGRES_ADMIN_USER
        self.password = settings.POSTGRES_ADMIN_PASSWORD
        self.database = settings.POSTGRES_ADMIN_DATABASE
    
    def _get_connection(self):
        try:
            conn = psycopg2.connect(
                host=self.host,
                port=self.port,
                user=self.user,
                password=self.password,
                database=self.database
            )
            conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            return conn
        except Exception as e:
            logger.error(f'Failed to connect to PostgreSQL: {str(e)}')
            raise
    
    def create_database(self, database_name: str) -> bool:
        conn = None
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            query = sql.SQL('CREATE DATABASE {}').format(sql.Identifier(database_name))
            cursor.execute(query)
            cursor.close()
            logger.info(f'Successfully created database: {database_name}')
            return True
        except psycopg2.errors.DuplicateDatabase:
            logger.warning(f'Database {database_name} already exists')
            raise ValueError(f'Database {database_name} already exists')
        except Exception as e:
            logger.error(f'Failed to create database {database_name}: {str(e)}')
            raise
        finally:
            if conn:
                conn.close()
    
    def create_user(self, username: str, password: str) -> bool:
        conn = None
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            query = sql.SQL('CREATE USER {} WITH PASSWORD {}').format(
                sql.Identifier(username),
                sql.Literal(password)
            )
            cursor.execute(query)
            cursor.close()
            logger.info(f'Successfully created user: {username}')
            return True
        except psycopg2.errors.DuplicateObject:
            logger.warning(f'User {username} already exists')
            raise ValueError(f'User {username} already exists')
        except Exception as e:
            logger.error(f'Failed to create user {username}: {str(e)}')
            raise
        finally:
            if conn:
                conn.close()
    
    def grant_privileges(self, database_name: str, username: str) -> bool:
        conn = None
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            grant_db_query = sql.SQL('GRANT ALL PRIVILEGES ON DATABASE {} TO {}').format(
                sql.Identifier(database_name),
                sql.Identifier(username)
            )
            cursor.execute(grant_db_query)
            cursor.close()
            conn.close()
            
            conn = psycopg2.connect(
                host=self.host,
                port=self.port,
                user=self.user,
                password=self.password,
                database=database_name
            )
            conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            cursor = conn.cursor()
            
            cursor.execute(sql.SQL('GRANT ALL PRIVILEGES ON SCHEMA public TO {}').format(sql.Identifier(username)))
            cursor.execute(sql.SQL('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO {}').format(sql.Identifier(username)))
            cursor.execute(sql.SQL('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO {}').format(sql.Identifier(username)))
            cursor.execute(sql.SQL('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO {}').format(sql.Identifier(username)))
            cursor.close()
            
            logger.info(f'Successfully granted privileges on {database_name} to {username}')
            return True
        except Exception as e:
            logger.error(f'Failed to grant privileges on {database_name} to {username}: {str(e)}')
            raise
        finally:
            if conn:
                conn.close()
    
    def drop_database(self, database_name: str) -> bool:
        conn = None
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            terminate_query = sql.SQL(
                'SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = {} AND pid <> pg_backend_pid()'
            ).format(sql.Literal(database_name))
            cursor.execute(terminate_query)
            drop_query = sql.SQL('DROP DATABASE IF EXISTS {}').format(sql.Identifier(database_name))
            cursor.execute(drop_query)
            cursor.close()
            logger.info(f'Successfully dropped database: {database_name}')
            return True
        except Exception as e:
            logger.error(f'Failed to drop database {database_name}: {str(e)}')
            raise
        finally:
            if conn:
                conn.close()
    
    def drop_user(self, username: str) -> bool:
        conn = None
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            drop_query = sql.SQL('DROP USER IF EXISTS {}').format(sql.Identifier(username))
            cursor.execute(drop_query)
            cursor.close()
            logger.info(f'Successfully dropped user: {username}')
            return True
        except Exception as e:
            logger.error(f'Failed to drop user {username}: {str(e)}')
            raise
        finally:
            if conn:
                conn.close()
    
    def reset_user_password(self, username: str, new_password: str) -> bool:
        conn = None
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            alter_query = sql.SQL('ALTER USER {} WITH PASSWORD {}').format(
                sql.Identifier(username),
                sql.Literal(new_password)
            )
            cursor.execute(alter_query)
            cursor.close()
            logger.info(f'Successfully reset password for user: {username}')
            return True
        except Exception as e:
            logger.error(f'Failed to reset password for user {username}: {str(e)}')
            raise
        finally:
            if conn:
                conn.close()
    
    def database_exists(self, database_name: str) -> bool:
        conn = None
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            cursor.execute('SELECT 1 FROM pg_database WHERE datname = %s', (database_name,))
            exists = cursor.fetchone() is not None
            cursor.close()
            return exists
        except Exception as e:
            logger.error(f'Failed to check if database {database_name} exists: {str(e)}')
            return False
        finally:
            if conn:
                conn.close()
    
    def user_exists(self, username: str) -> bool:
        conn = None
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            cursor.execute('SELECT 1 FROM pg_user WHERE usename = %s', (username,))
            exists = cursor.fetchone() is not None
            cursor.close()
            return exists
        except Exception as e:
            logger.error(f'Failed to check if user {username} exists: {str(e)}')
            return False
        finally:
            if conn:
                conn.close()


postgres_admin_service = PostgresAdminService()
