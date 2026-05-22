"""Docker container management service"""
import docker
from docker.errors import DockerException, NotFound, APIError
from typing import Dict, Optional, List
import random


class DockerService:
    """Service for managing Docker containers"""
    
    def __init__(self):
        try:
            self.client = docker.from_env()
            # Test connection
            self.client.ping()
        except DockerException as e:
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
        env_vars: Dict[str, str] = None
    ) -> Dict:
        """Create and start a Docker container"""
        try:
            # Remove existing container with same name
            try:
                old_container = self.client.containers.get(container_name)
                old_container.stop()
                old_container.remove()
            except NotFound:
                pass
            
            # Create container
            container = self.client.containers.run(
                image=image_name,
                name=container_name,
                ports={'3000/tcp': port},  # Map container port to host port
                environment=env_vars or {},
                detach=True,
                restart_policy={"Name": "unless-stopped"},
                mem_limit="512m",  # 512MB RAM limit
                cpu_quota=50000,  # 50% CPU limit
            )
            
            return {
                "container_id": container.id,
                "container_name": container.name,
                "status": container.status,
                "port": port
            }
            
        except APIError as e:
            raise Exception(f"Failed to create container: {str(e)}")
        except Exception as e:
            raise Exception(f"Container creation error: {str(e)}")
    
    def start_container(self, container_id: str) -> bool:
        """Start a stopped container"""
        try:
            container = self.client.containers.get(container_id)
            container.start()
            return True
        except NotFound:
            raise Exception(f"Container {container_id} not found")
        except APIError as e:
            raise Exception(f"Failed to start container: {str(e)}")
    
    def stop_container(self, container_id: str) -> bool:
        """Stop a running container"""
        try:
            container = self.client.containers.get(container_id)
            container.stop(timeout=10)
            return True
        except NotFound:
            raise Exception(f"Container {container_id} not found")
        except APIError as e:
            raise Exception(f"Failed to stop container: {str(e)}")
    
    def restart_container(self, container_id: str) -> bool:
        """Restart a container"""
        try:
            container = self.client.containers.get(container_id)
            container.restart(timeout=10)
            return True
        except NotFound:
            raise Exception(f"Container {container_id} not found")
        except APIError as e:
            raise Exception(f"Failed to restart container: {str(e)}")
    
    def delete_container(self, container_id: str) -> bool:
        """Delete a container"""
        try:
            container = self.client.containers.get(container_id)
            container.stop(timeout=10)
            container.remove()
            return True
        except NotFound:
            raise Exception(f"Container {container_id} not found")
        except APIError as e:
            raise Exception(f"Failed to delete container: {str(e)}")
    
    def get_container_status(self, container_id: str) -> Dict:
        """Get container status and stats"""
        try:
            container = self.client.containers.get(container_id)
            stats = container.stats(stream=False)
            
            # Calculate CPU percentage
            cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - \
                       stats['precpu_stats']['cpu_usage']['total_usage']
            system_delta = stats['cpu_stats']['system_cpu_usage'] - \
                          stats['precpu_stats']['system_cpu_usage']
            cpu_percent = (cpu_delta / system_delta) * 100.0 if system_delta > 0 else 0.0
            
            # Calculate memory usage
            memory_usage = stats['memory_stats']['usage']
            memory_limit = stats['memory_stats']['limit']
            memory_percent = (memory_usage / memory_limit) * 100.0 if memory_limit > 0 else 0.0
            
            return {
                "status": container.status,
                "cpu_percent": round(cpu_percent, 2),
                "memory_usage_mb": round(memory_usage / (1024 * 1024), 2),
                "memory_limit_mb": round(memory_limit / (1024 * 1024), 2),
                "memory_percent": round(memory_percent, 2)
            }
        except NotFound:
            raise Exception(f"Container {container_id} not found")
        except Exception as e:
            raise Exception(f"Failed to get container status: {str(e)}")
    
    def get_container_logs(self, container_id: str, tail: int = 100) -> str:
        """Get container logs"""
        try:
            container = self.client.containers.get(container_id)
            logs = container.logs(tail=tail, timestamps=True)
            return logs.decode('utf-8')
        except NotFound:
            raise Exception(f"Container {container_id} not found")
        except Exception as e:
            raise Exception(f"Failed to get logs: {str(e)}")
    
    def list_containers(self, all_containers: bool = False) -> List[Dict]:
        """List all containers"""
        try:
            containers = self.client.containers.list(all=all_containers)
            return [
                {
                    "id": c.id,
                    "name": c.name,
                    "status": c.status,
                    "image": c.image.tags[0] if c.image.tags else "unknown"
                }
                for c in containers
            ]
        except Exception as e:
            raise Exception(f"Failed to list containers: {str(e)}")
    
    def remove_image(self, image_name: str) -> bool:
        """Remove Docker image"""
        try:
            self.client.images.remove(image_name, force=True)
            return True
        except NotFound:
            return False
        except Exception as e:
            raise Exception(f"Failed to remove image: {str(e)}")
