from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
import secrets
import string
from cryptography.fernet import Fernet
from app.core.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode JWT access token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None



# ============================================
# Database Credential Encryption & Generation
# ============================================

def generate_secure_password(length: int = 32) -> str:
    """
    Generate a cryptographically secure random password.
    
    Args:
        length: Password length (default 32 characters)
    
    Returns:
        Secure random password string
    """
    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return password


def generate_random_suffix(length: int = 6) -> str:
    """
    Generate a random alphanumeric suffix for database names.
    
    Args:
        length: Suffix length (default 6 characters)
    
    Returns:
        Random lowercase alphanumeric string
    """
    alphabet = string.ascii_lowercase + string.digits
    suffix = ''.join(secrets.choice(alphabet) for _ in range(length))
    return suffix


def get_encryption_key() -> bytes:
    """
    Get or generate Fernet encryption key.
    
    Returns:
        Fernet encryption key as bytes
    """
    key = settings.DATABASE_ENCRYPTION_KEY
    if not key:
        raise ValueError("DATABASE_ENCRYPTION_KEY not set in environment")
    return key.encode()


def encrypt_password(password: str) -> str:
    """
    Encrypt a database password using Fernet symmetric encryption.
    
    Args:
        password: Plain text password
    
    Returns:
        Encrypted password as string
    """
    fernet = Fernet(get_encryption_key())
    encrypted = fernet.encrypt(password.encode())
    return encrypted.decode()


def decrypt_password(encrypted_password: str) -> str:
    """
    Decrypt a database password.
    
    Args:
        encrypted_password: Encrypted password string
    
    Returns:
        Decrypted plain text password
    """
    fernet = Fernet(get_encryption_key())
    decrypted = fernet.decrypt(encrypted_password.encode())
    return decrypted.decode()


def build_connection_string(host: str, port: int, database: str, user: str, password: str) -> str:
    """
    Build PostgreSQL connection string.
    
    Args:
        host: Database host
        port: Database port
        database: Database name
        user: Database user
        password: Database password
    
    Returns:
        PostgreSQL connection string
    """
    return f"postgresql://{user}:{password}@{host}:{port}/{database}"
