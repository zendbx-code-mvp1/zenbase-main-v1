"""Deployment service for building and deploying applications"""
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Dict, Optional, Tuple
import json

from app.models.project import Framework


class DeploymentService:
    """Service for handling application deployments"""
    
    def __init__(self, work_dir: Optional[str] = None):
        self.work_dir = work_dir or tempfile.gettempdir()
    
    def clone_repository(self, repo_url: str, branch: str, access_token: Optional[str] = None) -> str:
        """Clone Git repository to temporary directory"""
        # Create unique directory for this deployment
        deploy_dir = tempfile.mkdtemp(dir=self.work_dir)
        
        try:
            # Add token to URL for private repos (only if token is provided)
            if access_token and "github.com" in repo_url:
                auth_url = repo_url.replace("https://", f"https://{access_token}@")
            else:
                auth_url = repo_url
            
            # Clone repository
            result = subprocess.run(
                ["git", "clone", "-b", branch, "--depth", "1", auth_url, deploy_dir],
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            if result.returncode != 0:
                raise Exception(f"Git clone failed: {result.stderr}")
            
            return deploy_dir
            
        except subprocess.TimeoutExpired:
            shutil.rmtree(deploy_dir, ignore_errors=True)
            raise Exception("Git clone timed out after 5 minutes")
        except Exception as e:
            shutil.rmtree(deploy_dir, ignore_errors=True)
            raise Exception(f"Failed to clone repository: {str(e)}")
    
    def detect_framework(self, project_dir: str) -> Tuple[Framework, Dict]:
        """Detect framework and return build configuration"""
        project_path = Path(project_dir)
        
        # Check for package.json (Node.js projects)
        package_json = project_path / "package.json"
        if package_json.exists():
            with open(package_json) as f:
                package_data = json.load(f)
                dependencies = package_data.get("dependencies", {})
                dev_dependencies = package_data.get("devDependencies", {})
                scripts = package_data.get("scripts", {})
                
                # Check Next.js FIRST (only in dependencies, not devDependencies)
                if "next" in dependencies:
                    return Framework.NEXTJS, {
                        "build_command": scripts.get("build", "npm run build"),
                        "start_command": scripts.get("start", "npm start"),
                        "port": 3000,
                        "node_version": "20"
                    }
                
                # Check TanStack Start
                if "@tanstack/start" in dependencies or "@tanstack/start" in dev_dependencies:
                    return Framework.NODEJS, {
                        "build_command": scripts.get("build", "npm run build"),
                        "start_command": scripts.get("start", "npm start"),
                        "port": 3000,
                        "node_version": "20"
                    }
                
                # Check React (Vite or CRA)
                if "react" in dependencies or "react" in dev_dependencies:
                    is_vite = "vite" in dependencies or "vite" in dev_dependencies
                    build_dir = "dist" if is_vite else "build"
                    
                    return Framework.REACT, {
                        "build_command": scripts.get("build", "npm run build"),
                        "start_command": "npx serve -s " + build_dir,
                        "port": 3000,
                        "node_version": "20",
                        "build_dir": build_dir
                    }
                
                # Generic Node.js
                return Framework.NODEJS, {
                    "build_command": scripts.get("build", ""),
                    "start_command": scripts.get("start", "node index.js"),
                    "port": 3000,
                    "node_version": "20"
                }
        
        # Check for requirements.txt (Python)
        requirements = project_path / "requirements.txt"
        if requirements.exists():
            return Framework.PYTHON, {
                "build_command": "pip install -r requirements.txt",
                "start_command": "python app.py",
                "port": 8000,
                "python_version": "3.11"
            }
        
        # Check for index.html (Static)
        index_html = project_path / "index.html"
        if index_html.exists():
            return Framework.STATIC, {
                "build_command": "",
                "start_command": "npx serve .",
                "port": 3000,
                "node_version": "20"
            }
        
        # Default to Node.js
        return Framework.NODEJS, {
            "build_command": "",
            "start_command": "node index.js",
            "port": 3000,
            "node_version": "20"
        }
    
    def generate_dockerfile(self, framework: Framework, config: Dict) -> str:
        """Generate Dockerfile based on detected framework"""
        
        if framework == Framework.NEXTJS:
            return f"""FROM node:{config['node_version']}-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:{config['node_version']}-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN if ! grep -q "output.*standalone" next.config.* 2>/dev/null; then \\
    echo "const nextConfig = {{ output: 'standalone' }}; export default nextConfig;" > next.config.mjs; fi
RUN npm run build

FROM node:{config['node_version']}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE {config['port']}
ENV PORT={config['port']} HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
"""
        
        elif framework == Framework.REACT:
            build_dir = config.get('build_dir', 'dist')
            
            return f"""FROM node:{config['node_version']}-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:{config['node_version']}-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/{build_dir} ./{build_dir}
EXPOSE {config['port']}
CMD ["serve", "-s", "{build_dir}", "-l", "{config['port']}"]
"""
        
        elif framework == Framework.NODEJS:
            build_cmd = config.get('build_command', '')
            build_step = f"RUN {build_cmd}" if build_cmd else ""
            start_cmd = config.get('start_command', 'node index.js')
            
            return f"""FROM node:{config['node_version']}-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
{build_step}
EXPOSE {config['port']}
CMD {json.dumps(start_cmd.split())}
"""
        
        elif framework == Framework.PYTHON:
            return f"""FROM python:{config['python_version']}-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE {config['port']}
CMD {json.dumps(config['start_command'].split())}
"""
        
        elif framework == Framework.STATIC:
            return f"""FROM node:{config['node_version']}-alpine
WORKDIR /app
RUN npm install -g serve
COPY . .
EXPOSE {config['port']}
CMD ["serve", ".", "-l", "{config['port']}"]
"""
        
        else:
            raise Exception(f"Unsupported framework: {framework}")
    
    def build_docker_image(self, project_dir: str, image_name: str, dockerfile_content: str) -> Tuple[bool, str]:
        """Build Docker image from Dockerfile"""
        try:
            project_path = Path(project_dir)
            
            # Create minimal .dockerignore
            dockerignore_path = project_path / ".dockerignore"
            if not dockerignore_path.exists():
                with open(dockerignore_path, "w") as f:
                    f.write("node_modules\n.git\n.env\n*.log\n.DS_Store\n")
            
            # Write Dockerfile
            dockerfile_path = project_path / "Dockerfile"
            with open(dockerfile_path, "w") as f:
                f.write(dockerfile_content)
            
            # Build image
            result = subprocess.run(
                ["docker", "build", "-t", image_name, "."],
                cwd=project_dir,
                capture_output=True,
                text=True,
                timeout=600
            )
            
            if result.returncode != 0:
                return False, result.stderr
            
            return True, result.stdout
            
        except subprocess.TimeoutExpired:
            return False, "Docker build timed out"
        except Exception as e:
            return False, f"Build failed: {str(e)}"
    
    def cleanup(self, project_dir: str):
        """Clean up temporary files"""
        try:
            if os.path.exists(project_dir):
                shutil.rmtree(project_dir)
        except Exception as e:
            print(f"Failed to cleanup {project_dir}: {str(e)}")
