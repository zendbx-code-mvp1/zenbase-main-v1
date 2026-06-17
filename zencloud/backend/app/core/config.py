from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # App
    APP_NAME: str = "ZenCloud"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str = "sqlite:///./zencloud.db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT
    SECRET_KEY: str = "dev-secret-key-change-in-production-please"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # GitHub OAuth
    GITHUB_CLIENT_ID: str = "your_github_client_id"
    GITHUB_CLIENT_SECRET: str = "your_github_client_secret"
    GITHUB_REDIRECT_URI: str = "http://localhost:3000/auth/callback"
    
    # Docker
    DOCKER_HOST: str = "unix:///var/run/docker.sock"
    DOCKER_NETWORK: str = "zenbase-net"

    # Domain
    BASE_DOMAIN: str = "zencloud.dev"

    # Nginx
    NGINX_CONTAINER: str = "zenbase-nginx"
    NGINX_CONF_DIR: str = "/etc/nginx/conf.d"
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # PostgreSQL Admin Configuration
    POSTGRES_ADMIN_HOST: str = "localhost"
    POSTGRES_ADMIN_PORT: int = 5432
    POSTGRES_ADMIN_USER: str = "postgres"
    POSTGRES_ADMIN_PASSWORD: str = "Pawan@121"
    POSTGRES_ADMIN_DATABASE: str = "postgres"
    
    # Database Encryption
    DATABASE_ENCRYPTION_KEY: str = "your-fernet-key-here-generate-with-Fernet.generate_key()"
    
    # Database Limits
    MAX_DATABASES_PER_USER: int = 5
    DATABASE_NAME_PREFIX: str = "zencloud"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
