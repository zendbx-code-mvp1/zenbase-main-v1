"""GitHub integration service"""
from typing import List, Dict, Optional
import httpx
from github import Github, GithubException
from app.core.config import settings


class GitHubService:
    """Service for GitHub API interactions"""
    
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.client = Github(access_token)
        
    def get_user_info(self) -> Dict:
        """Get GitHub user information"""
        try:
            user = self.client.get_user()
            return {
                "github_id": str(user.id),
                "username": user.login,
                "email": user.email,
                "avatar_url": user.avatar_url,
                "name": user.name
            }
        except GithubException as e:
            raise Exception(f"Failed to get user info: {str(e)}")
    
    def list_repositories(self) -> List[Dict]:
        """List user's repositories"""
        try:
            user = self.client.get_user()
            repos = user.get_repos(sort="updated", direction="desc")
            
            return [
                {
                    "id": repo.id,
                    "name": repo.name,
                    "full_name": repo.full_name,
                    "description": repo.description,
                    "url": repo.html_url,
                    "clone_url": repo.clone_url,
                    "default_branch": repo.default_branch,
                    "private": repo.private,
                    "language": repo.language,
                    "updated_at": repo.updated_at.isoformat() if repo.updated_at else None
                }
                for repo in repos[:50]  # Limit to 50 repos
            ]
        except GithubException as e:
            raise Exception(f"Failed to list repositories: {str(e)}")
    
    def list_branches(self, repo_full_name: str) -> List[str]:
        """List branches for a repository"""
        try:
            repo = self.client.get_repo(repo_full_name)
            branches = repo.get_branches()
            return [branch.name for branch in branches]
        except GithubException as e:
            raise Exception(f"Failed to list branches: {str(e)}")
    
    def get_latest_commit(self, repo_full_name: str, branch: str = "main") -> Dict:
        """Get latest commit information"""
        try:
            repo = self.client.get_repo(repo_full_name)
            commits = repo.get_commits(sha=branch)
            latest = commits[0]
            
            return {
                "sha": latest.sha,
                "message": latest.commit.message,
                "author": latest.commit.author.name,
                "date": latest.commit.author.date.isoformat(),
                "url": latest.html_url
            }
        except GithubException as e:
            raise Exception(f"Failed to get latest commit: {str(e)}")
    
    def create_webhook(self, repo_full_name: str, webhook_url: str) -> Dict:
        """Create webhook for repository"""
        try:
            repo = self.client.get_repo(repo_full_name)
            
            config = {
                "url": webhook_url,
                "content_type": "json",
                "insecure_ssl": "0"
            }
            
            hook = repo.create_hook(
                name="web",
                config=config,
                events=["push"],
                active=True
            )
            
            return {
                "id": hook.id,
                "url": hook.url,
                "active": hook.active
            }
        except GithubException as e:
            raise Exception(f"Failed to create webhook: {str(e)}")
    
    def delete_webhook(self, repo_full_name: str, hook_id: int):
        """Delete webhook from repository"""
        try:
            repo = self.client.get_repo(repo_full_name)
            hook = repo.get_hook(hook_id)
            hook.delete()
        except GithubException as e:
            raise Exception(f"Failed to delete webhook: {str(e)}")


async def exchange_code_for_token(code: str) -> str:
    """Exchange OAuth code for access token"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": settings.GITHUB_REDIRECT_URI
            }
        )
        
        if response.status_code != 200:
            raise Exception("Failed to exchange code for token")
        
        data = response.json()
        
        if "error" in data:
            raise Exception(f"GitHub OAuth error: {data.get('error_description', 'Unknown error')}")
        
        return data["access_token"]
