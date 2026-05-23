# ZenCloud Deployment Testing Guide

## Current Status

The deployment functionality is **BUILT** but requires Docker and Redis to be running.

## Prerequisites

### 1. Docker Desktop
- **Status**: Installed but NOT running
- **Action Required**: Start Docker Desktop

**How to Start Docker:**
1. Open Docker Desktop application
2. Wait for it to fully start (whale icon in system tray should be steady)
3. Verify: Run `docker ps` in terminal (should not show error)

### 2. Redis (for Background Jobs)
- **Required for**: Async deployment tasks via Celery
- **Options**:
  - Use Docker Compose (recommended)
  - Install Redis locally
  - Use Redis Cloud (free tier)

## Deployment Architecture

```
User clicks "Deploy" 
  → Frontend calls API
    → Backend creates deployment record
      → Celery worker picks up task
        → Clone Git repo
        → Detect framework
        → Generate Dockerfile
        → Build Docker image
        → Start container
        → Update deployment status
```

## What's Already Built

✅ **Backend Services:**
- `DeploymentService` - Clones repos, detects frameworks, generates Dockerfiles
- `DockerService` - Manages Docker containers (start/stop/restart/delete)
- `GitHubService` - GitHub OAuth and repository access
- Celery workers for async deployment tasks

✅ **API Endpoints:**
- `POST /projects/{id}/deploy` - Trigger deployment
- `GET /deployments/{id}` - Get deployment details
- `GET /deployments/{id}/logs` - Get build logs
- `GET /deployments/project/{id}` - List project deployments

✅ **Frontend:**
- Dashboard with deploy buttons
- Project detail page
- Deployment history view

✅ **Supported Frameworks:**
- Next.js
- React
- Node.js
- Python
- Static HTML

## Setup Options

### Option 1: Quick Test (Without Full Deployment)

You can test the UI and API without Docker:

1. **Start Backend** (already running)
2. **Start Frontend** (already running)
3. **Create a Project** via UI
4. **Click Deploy** - It will fail gracefully with error message

This lets you test the UI flow without setting up Docker.

### Option 2: Full Deployment Setup (Docker Compose)

**Step 1: Start Docker Desktop**
```bash
# Open Docker Desktop app and wait for it to start
# Verify with:
docker ps
```

**Step 2: Start Services with Docker Compose**
```bash
cd zencloud
docker-compose up -d
```

This starts:
- PostgreSQL database
- Redis
- Backend API
- Celery worker

**Step 3: Check Services**
```bash
docker-compose ps
```

All services should show "Up" status.

**Step 4: Test Deployment**
1. Go to http://localhost:3000/dashboard
2. Click "New Project"
3. Enter project details:
   - Name: `test-app`
   - Repository URL: `https://github.com/vercel/next.js` (public repo)
   - Branch: `canary`
4. Click "Create Project"
5. Click "Deploy" button
6. Watch deployment progress

### Option 3: Manual Setup (Without Docker Compose)

**Step 1: Install Redis**
```bash
# Windows (using Chocolatey)
choco install redis-64

# Or download from: https://github.com/microsoftarchive/redis/releases
```

**Step 2: Start Redis**
```bash
redis-server
```

**Step 3: Start Celery Worker**
```bash
cd zencloud/backend
celery -A app.workers.celery_app worker --loglevel=info
```

**Step 4: Start Backend** (already running)

**Step 5: Start Frontend** (already running)

## Testing Deployment

### Test 1: Deploy a Public GitHub Repo

**Repository**: `https://github.com/vercel/next.js`
**Branch**: `canary`
**Expected**: Should clone, detect Next.js, build Docker image

### Test 2: Deploy a Simple Static Site

**Repository**: `https://github.com/github/personal-website`
**Branch**: `main`
**Expected**: Should detect static HTML, serve with nginx

### Test 3: Deploy a React App

**Repository**: `https://github.com/facebook/create-react-app`
**Branch**: `main`
**Expected**: Should detect React, build and serve

## Monitoring Deployment

### Backend Logs
Watch the terminal where backend is running:
```
INFO: Deployment started for project xxx
INFO: Cloning repository...
INFO: Framework detected: nextjs
INFO: Building Docker image...
INFO: Container started successfully
```

### Celery Worker Logs
If using Celery:
```
[2024-05-23 10:00:00] Task app.workers.tasks.deploy_project started
[2024-05-23 10:00:05] Cloning repository...
[2024-05-23 10:00:10] Building image...
[2024-05-23 10:02:00] Deployment completed
```

### Frontend
- Deployment status updates in real-time
- View logs in project detail page
- See deployment history

## Common Issues

### Issue 1: Docker Not Running
**Error**: `failed to connect to the docker API`
**Solution**: Start Docker Desktop

### Issue 2: Redis Not Running
**Error**: `Connection refused to redis://localhost:6379`
**Solution**: Start Redis server or use Docker Compose

### Issue 3: Celery Worker Not Running
**Error**: Deployment stays in "pending" status
**Solution**: Start Celery worker

### Issue 4: Git Clone Fails
**Error**: `Git clone failed: authentication required`
**Solution**: 
- Use public repositories for testing
- Or configure GitHub OAuth for private repos

### Issue 5: Docker Build Fails
**Error**: `Docker build failed`
**Solution**: 
- Check Dockerfile generation
- Verify project has correct structure
- Check Docker logs

## Current Limitations

⚠️ **What's NOT Implemented Yet:**
1. **Domain Management** - Custom domains not configured
2. **SSL Certificates** - HTTPS not set up
3. **Load Balancing** - Single instance only
4. **Auto-scaling** - Manual scaling only
5. **Database Provisioning** - No managed databases yet
6. **Environment Variables UI** - Must edit manually
7. **Rollback** - No one-click rollback yet

## What Works Now

✅ **Core Deployment:**
- Clone GitHub repositories
- Auto-detect framework
- Generate Dockerfile
- Build Docker image
- Start container
- View logs
- Start/Stop/Restart containers

✅ **Project Management:**
- Create projects
- List projects
- View project details
- Delete projects

✅ **Authentication:**
- User registration
- User login
- Protected routes
- JWT tokens

## Next Steps to Make It Production-Ready

1. **Start Docker Desktop** - Required for any deployment
2. **Set up Redis** - Required for background jobs
3. **Test with public repo** - Verify basic deployment works
4. **Configure GitHub OAuth** - For private repositories
5. **Set up reverse proxy** - Nginx for domain routing
6. **Add SSL** - Let's Encrypt for HTTPS
7. **Configure monitoring** - Logs and metrics
8. **Set up backups** - Database and container backups

## Quick Start Commands

```bash
# 1. Start Docker Desktop (GUI)

# 2. Start all services
cd zencloud
docker-compose up -d

# 3. Check services
docker-compose ps

# 4. View logs
docker-compose logs -f backend
docker-compose logs -f celery-worker

# 5. Stop services
docker-compose down

# 6. Restart services
docker-compose restart
```

## Testing Without Docker

If you want to test the UI without setting up Docker:

1. Backend and Frontend are already running
2. Go to http://localhost:3000/dashboard
3. Create a project
4. Click "Deploy"
5. You'll see an error (expected) but the UI flow works
6. This lets you test the interface before setting up infrastructure

## Summary

**To actually deploy projects, you need:**
1. ✅ Backend running (already done)
2. ✅ Frontend running (already done)
3. ❌ Docker Desktop running (needs to be started)
4. ❌ Redis running (needs to be started)
5. ❌ Celery worker running (needs to be started)

**Easiest way:** Run `docker-compose up -d` after starting Docker Desktop.
