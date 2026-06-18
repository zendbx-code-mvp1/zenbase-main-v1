"""Docker container management service using CLI"""
import os
import subprocess
import json
from typing import Dict, Optional, List
import random

# The Docker network shared by all zencloud services.
# Matches the DOCKER_NETWORK env var set in docker-compose.
DOCKER_NETWORK = os.environ.get("DOCKER_NETWORK", "zencloud_zenbase-net")


class DockerService:
    """Service for managing Docker containers using CLI"""
    
    def __init__(self):
        try:
            # Test Docker CLI is available
            result = subprocess.run(
                ["docker", "version", "--format", "{{.Server.Version}}"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode != 0:
                raise Exception(f"Docker CLI not available: {result.stderr}")
        except FileNotFoundError:
            raise Exception("Docker CLI not found in PATH")
        except Exception as e:
            raise Exception(f"Failed to connect to Docker: {str(e)}")
    
    def allocate_port(self, used_ports: List[int] = None) -> int:
        """Allocate a random available port"""
        used_ports = used_ports or []
        port_range = range(8000, 9000)
        available_ports = [p for p in port_range if p not in used_ports]
        
        if not available_ports:
            raise Exception("No available ports in range 8000-9000")
        
        return random.choice(available_ports)
    
    def create_container(
        self,
        image_name: str,
        container_name: str,
        port: int,
        env_vars: Dict[str, str] = None,
        internal_port: int = 3000,
        network: str = None,
    ) -> Dict:
        """Create and start a Docker container using CLI"""
        try:
            network = network or DOCKER_NETWORK
            # Remove existing container with same name
            subprocess.run(
                ["docker", "rm", "-f", container_name],
                capture_output=True,
                timeout=30
            )
            
            # Build docker run command
            cmd = [
                "docker", "run",
                "-d",  # Detached
                "--name", container_name,
                "--network", network,          # Attach to shared network so Nginx can reach by name
                "-p", f"{port}:{internal_port}",  # Host port mapping (fallback / direct access)
                "--restart", "unless-stopped",
                "--memory", "512m",  # Memory limit
                "--cpus", "0.5",  # CPU limit
            ]
            
            # Add environment variables
            if env_vars:
                for key, value in env_vars.items():
                    cmd.extend(["-e", f"{key}={value}"])
            
            # Add image name
            cmd.append(image_name)
            
            # Run container
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode != 0:
                raise Exception(f"Failed to create container: {result.stderr}")
            
            container_id = result.stdout.strip()
            
            # Get container status
            inspect_result = subprocess.run(
                ["docker", "inspect", container_id, "--format", "{{.State.Status}}"],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            status = inspect_result.stdout.strip() if inspect_result.returncode == 0 else "unknown"
            
            return {
                "container_id": container_id,
                "container_name": container_name,
                "status": status,
                "port": port
            }
            
        except subprocess.TimeoutExpired:
            raise Exception("Container creation timed out")
        except Exception as e:
            raise Exception(f"Container creation error: {str(e)}")
    
    def start_container(self, container_id: str) -> bool:
        """Start a stopped container"""
        try:
            result = subprocess.run(
                ["docker", "start", container_id],
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode != 0:
                raise Exception(f"Failed to start container: {result.stderr}")
            return True
        except subprocess.TimeoutExpired:
            raise Exception("Start container timed out")
        except Exception as e:
            raise Exception(f"Failed to start container: {str(e)}")
    
    def stop_container(self, container_id: str) -> bool:
        """Stop a running container"""
        try:
            result = subprocess.run(
                ["docker", "stop", "-t", "10", container_id],
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode != 0:
                raise Exception(f"Failed to stop container: {result.stderr}")
            return True
        except subprocess.TimeoutExpired:
            raise Exception("Stop container timed out")
        except Exception as e:
            raise Exception(f"Failed to stop container: {str(e)}")
    
    def restart_container(self, container_id: str) -> bool:
        """Restart a container"""
        try:
            result = subprocess.run(
                ["docker", "restart", "-t", "10", container_id],
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode != 0:
                raise Exception(f"Failed to restart container: {result.stderr}")
            return True
        except subprocess.TimeoutExpired:
            raise Exception("Restart container timed out")
        except Exception as e:
            raise Exception(f"Failed to restart container: {str(e)}")
    
    def delete_container(self, container_id: str) -> bool:
        """Delete a container"""
        try:
            result = subprocess.run(
                ["docker", "rm", "-f", container_id],
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode != 0:
                raise Exception(f"Failed to delete container: {result.stderr}")
            return True
        except subprocess.TimeoutExpired:
            raise Exception("Delete container timed out")
        except Exception as e:
            raise Exception(f"Failed to delete container: {str(e)}")
    
    def get_container_status(self, container_id: str) -> Dict:
        """Get container status and stats"""
        try:
            # Get container stats
            result = subprocess.run(
                ["docker", "stats", container_id, "--no-stream", "--format", "{{json .}}"],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode != 0:
                raise Exception(f"Container not found: {result.stderr}")
            
            stats = json.loads(result.stdout.strip())
            
            # Parse CPU and memory
            cpu_percent = float(stats.get("CPUPerc", "0%").rstrip("%"))
            mem_usage = stats.get("MemUsage", "0B / 0B").split(" / ")[0]
            mem_limit = stats.get("MemUsage", "0B / 0B").split(" / ")[1]
            mem_percent = float(stats.get("MemPerc", "0%").rstrip("%"))
            
            # Get status
            status_result = subprocess.run(
                ["docker", "inspect", container_id, "--format", "{{.State.Status}}"],
                capture_output=True,
                text=True,
                timeout=5
            )
            status = status_result.stdout.strip() if status_result.returncode == 0 else "unknown"
            
            return {
                "status": status,
                "cpu_percent": round(cpu_percent, 2),
                "memory_usage_mb": mem_usage,
                "memory_limit_mb": mem_limit,
                "memory_percent": round(mem_percent, 2)
            }
        except subprocess.TimeoutExpired:
            raise Exception("Get container status timed out")
        except Exception as e:
            raise Exception(f"Failed to get container status: {str(e)}")
    
    def get_container_logs(self, container_id: str, tail: int = 100) -> str:
        """Get container logs"""
        try:
            result = subprocess.run(
                ["docker", "logs", "--tail", str(tail), "--timestamps", container_id],
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode != 0:
                raise Exception(f"Failed to get logs: {result.stderr}")
            return result.stdout
        except subprocess.TimeoutExpired:
            raise Exception("Get logs timed out")
        except Exception as e:
            raise Exception(f"Failed to get logs: {str(e)}")
    
    def list_containers(self, all_containers: bool = False) -> List[Dict]:
        """List all containers"""
        try:
            cmd = ["docker", "ps", "--format", "{{json .}}"]
            if all_containers:
                cmd.insert(2, "-a")
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode != 0:
                raise Exception(f"Failed to list containers: {result.stderr}")
            
            containers = []
            for line in result.stdout.strip().split("\n"):
                if line:
                    container = json.loads(line)
                    containers.append({
                        "id": container.get("ID", ""),
                        "name": container.get("Names", ""),
                        "status": container.get("Status", ""),
                        "image": container.get("Image", "")
                    })
            
            return containers
        except subprocess.TimeoutExpired:
            raise Exception("List containers timed out")
        except Exception as e:
            raise Exception(f"Failed to list containers: {str(e)}")
    
    def remove_image(self, image_name: str) -> bool:
        """Remove Docker image"""
        try:
            result = subprocess.run(
                ["docker", "rmi", "-f", image_name],
                capture_output=True,
                text=True,
                timeout=60
            )
            return result.returncode == 0
        except subprocess.TimeoutExpired:
            raise Exception("Remove image timed out")
        except Exception as e:
            raise Exception(f"Failed to remove image: {str(e)}")
