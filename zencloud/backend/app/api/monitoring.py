"""Real-time monitoring WebSocket endpoints"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Set
import asyncio
import json
import logging
from uuid import UUID

from app.core.database import get_db
from app.models import Project
from app.services.docker_service import DockerService
from app.api.auth import get_current_user_ws

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/monitoring", tags=["Monitoring"])


class ConnectionManager:
    """Manage WebSocket connections for real-time monitoring"""
    
    def __init__(self):
        # Map of project_id -> set of websockets
        self.active_connections: Dict[str, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, project_id: str):
        """Connect a websocket to a project's monitoring stream"""
        await websocket.accept()
        if project_id not in self.active_connections:
            self.active_connections[project_id] = set()
        self.active_connections[project_id].add(websocket)
        logger.info(f"WebSocket connected for project {project_id}")
    
    def disconnect(self, websocket: WebSocket, project_id: str):
        """Disconnect a websocket"""
        if project_id in self.active_connections:
            self.active_connections[project_id].discard(websocket)
            if not self.active_connections[project_id]:
                del self.active_connections[project_id]
        logger.info(f"WebSocket disconnected for project {project_id}")
    
    async def broadcast_stats(self, project_id: str, stats: dict):
        """Broadcast stats to all connected clients for a project"""
        if project_id not in self.active_connections:
            return
        
        disconnected = set()
        for websocket in self.active_connections[project_id]:
            try:
                await websocket.send_json(stats)
            except Exception as e:
                logger.error(f"Error sending to websocket: {e}")
                disconnected.add(websocket)
        
        # Clean up disconnected websockets
        for websocket in disconnected:
            self.disconnect(websocket, project_id)


manager = ConnectionManager()


@router.websocket("/ws/{project_id}")
async def websocket_monitoring(
    websocket: WebSocket,
    project_id: str,
    db: Session = Depends(get_db)
):
    """
    WebSocket endpoint for real-time container monitoring.
    
    Sends container stats every 2 seconds:
    - CPU usage percentage
    - Memory usage and limit
    - Memory percentage
    - Container status
    - Network I/O (if available)
    - Uptime
    """
    # Verify project exists and get container_id
    try:
        project = db.query(Project).filter(Project.id == UUID(project_id)).first()
        if not project:
            await websocket.close(code=4004, reason="Project not found")
            return
        
        if not project.container_id:
            await websocket.close(code=4004, reason="No container for this project")
            return
        
        container_id = project.container_id
    except Exception as e:
        logger.error(f"Error validating project: {e}")
        await websocket.close(code=4000, reason="Invalid project ID")
        return
    
    # Connect websocket
    await manager.connect(websocket, project_id)
    
    try:
        docker_service = DockerService()
        
        while True:
            try:
                # Get real-time stats
                stats = docker_service.get_container_status(container_id)
                
                # Add timestamp
                import datetime
                stats["timestamp"] = datetime.datetime.utcnow().isoformat()
                stats["project_id"] = project_id
                
                # Send to client
                await websocket.send_json(stats)
                
                # Wait 2 seconds before next update
                await asyncio.sleep(2)
                
            except Exception as e:
                logger.error(f"Error getting container stats: {e}")
                error_msg = {
                    "error": str(e),
                    "project_id": project_id,
                    "timestamp": datetime.datetime.utcnow().isoformat()
                }
                await websocket.send_json(error_msg)
                await asyncio.sleep(5)  # Wait longer on error
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, project_id)
        logger.info(f"Client disconnected from project {project_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket, project_id)


@router.websocket("/ws/logs/{project_id}")
async def websocket_logs(
    websocket: WebSocket,
    project_id: str,
    db: Session = Depends(get_db)
):
    """
    WebSocket endpoint for real-time log streaming.
    
    Streams container logs in real-time with follow mode.
    """
    # Verify project exists
    try:
        project = db.query(Project).filter(Project.id == UUID(project_id)).first()
        if not project:
            await websocket.close(code=4004, reason="Project not found")
            return
        
        if not project.container_id:
            await websocket.close(code=4004, reason="No container for this project")
            return
        
        container_id = project.container_id
    except Exception as e:
        logger.error(f"Error validating project: {e}")
        await websocket.close(code=4000, reason="Invalid project ID")
        return
    
    await websocket.accept()
    
    try:
        import subprocess
        
        # Start docker logs with follow
        process = subprocess.Popen(
            ["docker", "logs", "-f", "--tail", "100", "--timestamps", container_id],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        # Stream logs line by line
        while True:
            line = process.stdout.readline()
            if not line:
                break
            
            await websocket.send_json({
                "log": line.strip(),
                "timestamp": datetime.datetime.utcnow().isoformat()
            })
            
    except WebSocketDisconnect:
        if process:
            process.terminate()
        logger.info(f"Log stream disconnected for project {project_id}")
    except Exception as e:
        logger.error(f"Log streaming error: {e}")
        if process:
            process.terminate()


@router.get("/stats/all")
async def get_all_stats(
    current_user = Depends(get_current_user_ws),
    db: Session = Depends(get_db)
):
    """
    Get stats for all user's projects at once.
    Useful for dashboard overview.
    """
    try:
        projects = db.query(Project).filter(
            Project.user_id == current_user.id
        ).all()
        
        docker_service = DockerService()
        all_stats = []
        
        for project in projects:
            if not project.container_id:
                continue
            
            try:
                stats = docker_service.get_container_status(project.container_id)
                stats["project_id"] = str(project.id)
                stats["project_name"] = project.name
                all_stats.append(stats)
            except Exception as e:
                logger.error(f"Error getting stats for project {project.id}: {e}")
                all_stats.append({
                    "project_id": str(project.id),
                    "project_name": project.name,
                    "error": str(e),
                    "status": "error"
                })
        
        return {"stats": all_stats}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
