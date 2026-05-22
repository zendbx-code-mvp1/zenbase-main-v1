"""GitHub OAuth and repository management endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.config import settings
from app.models import User
from app.schemas.user import UserResponse
from app.api.auth import get_current_user
from app.services.github_service import GitHubService, exchange_code_for_token
from pydantic import BaseModel

router = APIRouter(prefix="/github", tags=["GitHub"])


class RepositoryResponse(BaseModel):
    """Repository response schema"""
    id: int
    name: str
    full_name: str
    description: str | None
    url: str
    clone_url: str
    default_branch: str
    private: bool
    language: str | None
    updated_at: str | None


class BranchResponse(BaseModel):
    """Branch response schema"""
    name: str


@router.get("/authorize")
async def github_authorize():
    """Redirect to GitHub OAuth authorization"""
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.GITHUB_CLIENT_ID}"
        f"&redirect_uri={settings.GITHUB_REDIRECT_URI}"
        f"&scope=repo,user:email"
    )
    return RedirectResponse(github_auth_url)


@router.get("/callback")
async def github_callback(
    code: str = Query(...),
    db: Session = Depends(get_db)
):
    """Handle GitHub OAuth callback"""
    try:
        # Exchange code for access token
        access_token = await exchange_code_for_token(code)
        
        # Get user info from GitHub
        github_service = GitHubService(access_token)
        user_info = github_service.get_user_info()
        
        # Find or create user
        user = db.query(User).filter(User.github_id == user_info["github_id"]).first()
        
        if not user:
            # Create new user
            user = User(
                github_id=user_info["github_id"],
                username=user_info["username"],
                email=user_info["email"] or f"{user_info['username']}@github.com",
                avatar_url=user_info["avatar_url"],
                github_access_token=access_token,
                is_active=True,
                is_verified=True
            )
            db.add(user)
        else:
            # Update existing user
            user.github_access_token = access_token
            user.avatar_url = user_info["avatar_url"]
        
        db.commit()
        
        # Redirect to frontend with success
        return RedirectResponse(
            f"{settings.FRONTEND_URL}/auth/callback?success=true"
        )
        
    except Exception as e:
        return RedirectResponse(
            f"{settings.FRONTEND_URL}/auth/callback?error={str(e)}"
        )


@router.get("/repositories", response_model=List[RepositoryResponse])
async def list_repositories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List user's GitHub repositories"""
    if not current_user.github_access_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GitHub account not connected"
        )
    
    try:
        github_service = GitHubService(current_user.github_access_token)
        repos = github_service.list_repositories()
        return repos
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch repositories: {str(e)}"
        )


@router.get("/repositories/{repo_full_name}/branches", response_model=List[BranchResponse])
async def list_branches(
    repo_full_name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List branches for a repository"""
    if not current_user.github_access_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GitHub account not connected"
        )
    
    try:
        # Replace URL encoding
        repo_full_name = repo_full_name.replace("%2F", "/")
        
        github_service = GitHubService(current_user.github_access_token)
        branches = github_service.list_branches(repo_full_name)
        return [{"name": branch} for branch in branches]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch branches: {str(e)}"
        )


@router.post("/disconnect")
async def disconnect_github(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Disconnect GitHub account"""
    current_user.github_access_token = None
    current_user.github_id = None
    db.commit()
    
    return {"message": "GitHub account disconnected"}
