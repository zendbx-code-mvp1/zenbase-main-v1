# Deploy Your First Project - Quick Guide

## ✅ What's Ready

1. ✅ Docker Desktop - Running
2. ✅ Redis - Running in Docker
3. ✅ Backend API - Running on port 8000
4. ✅ Frontend - Running on port 3000

## 🚀 Next Steps

### Step 1: Start Celery Worker

Open a **NEW terminal** and run:

```bash
cd zencloud
start-celery.bat
```

**OR** manually:

```bash
cd zencloud/backend
celery -A app.workers.celery_app worker --loglevel=info --pool=solo
```

**What you should see:**
```
-------------- celery@DESKTOP v5.x.x
--- ***** -----
-- ******* ---- Windows-10
- *** --- * ---
- ** ---------- [config]
- ** ---------- .> app:         app.workers.celery_app
- ** ---------- .> transport:   redis://localhost:6379/0
- *** --- * --- .> results:     redis://localhost:6379/0
-- ******* ----
--- ***** -----

[tasks]
  . app.workers.tasks.deploy_project

[2024-05-23 10:00:00] celery@DESKTOP ready.
```

### Step 2: Test Deployment

1. **Go to Dashboard**: http://localhost:3000/dashboard

2. **Create a New Project**:
   - Click "New Project" button
   - Fill in the form:
     - **Name**: `my-test-app`
     - **Repository URL**: `https://github.com/vercel/next.js`
     - **Branch**: `canary`
   - Click "Create Project"

3. **Deploy the Project**:
   - You'll see your project in the dashboard
   - Click the "Deploy" button
   - Watch the deployment status change

4. **Monitor Progress**:
   - Check the Celery worker terminal for logs
   - Check the backend terminal for API logs
   - Refresh the dashboard to see status updates

### Step 3: View Deployment

Once deployment completes:
- Click "View" on your project
- See deployment history
- View build logs
- Access your deployed app

## 📊 What Happens During Deployment

```
1. Frontend sends deploy request to backend
   ↓
2. Backend creates deployment record in database
   ↓
3. Celery worker picks up the task
   ↓
4. Worker clones the GitHub repository
   ↓
5. Worker detects framework (Next.js, React, etc.)
   ↓
6. Worker generates Dockerfile
   ↓
7. Worker builds Docker image
   ↓
8. Worker starts Docker container
   ↓
9. Deployment status updated to "running"
   ↓
10. Your app is live!
```

## 🔍 Monitoring

### Check Running Containers
```bash
docker ps
```

You should see:
- `zencloud-redis` - Redis server
- `my-test-app-xxx` - Your deployed app (after deployment)

### Check Container Logs
```bash
docker logs <container-name>
```

### Check Celery Worker
Look at the terminal where Celery is running - you'll see:
```
[2024-05-23 10:00:00] Task app.workers.tasks.deploy_project[xxx] received
[2024-05-23 10:00:05] Cloning repository...
[2024-05-23 10:00:10] Framework detected: nextjs
[2024-05-23 10:00:15] Building Docker image...
[2024-05-23 10:02:00] Container started successfully
[2024-05-23 10:02:01] Task app.workers.tasks.deploy_project[xxx] succeeded
```

## 🎯 Test Repositories

### Easy (Static HTML)
- **URL**: `https://github.com/github/personal-website`
- **Branch**: `main`
- **Time**: ~1 minute

### Medium (React)
- **URL**: `https://github.com/facebook/create-react-app`
- **Branch**: `main`
- **Time**: ~3-5 minutes

### Advanced (Next.js)
- **URL**: `https://github.com/vercel/next.js`
- **Branch**: `canary`
- **Time**: ~5-10 minutes

## ⚠️ Troubleshooting

### Celery Worker Won't Start

**Error**: `ModuleNotFoundError: No module named 'celery'`

**Solution**:
```bash
cd zencloud/backend
pip install celery redis
```

### Deployment Stays "Pending"

**Cause**: Celery worker not running

**Solution**: Start the Celery worker (see Step 1)

### Docker Build Fails

**Check**:
1. Docker Desktop is running
2. Enough disk space (Docker images can be large)
3. Internet connection (to download base images)

**View Logs**:
- Check Celery worker terminal
- Check backend terminal
- Click "View" on project to see build logs

### Redis Connection Error

**Error**: `Connection refused to redis://localhost:6379`

**Solution**:
```bash
docker ps
# If zencloud-redis is not running:
docker start zencloud-redis
```

## 🎉 Success Indicators

You'll know deployment worked when:

1. ✅ Celery worker shows "Task succeeded"
2. ✅ Dashboard shows project status as "running"
3. ✅ `docker ps` shows your app container
4. ✅ You can access the app (if port is exposed)

## 🛑 Stop Everything

When you're done testing:

```bash
# Stop Celery worker
# Press Ctrl+C in the Celery terminal

# Stop Redis
docker stop zencloud-redis

# Stop deployed containers
docker stop $(docker ps -q)

# Remove containers (optional)
docker rm zencloud-redis
```

## 📝 Current Limitations

- No custom domains yet (containers run on random ports)
- No SSL/HTTPS yet
- No environment variables UI yet
- No automatic port mapping yet
- No load balancing yet

These will be added in future updates!

## 🚀 Ready to Deploy?

1. Open a new terminal
2. Run: `cd zencloud && start-celery.bat`
3. Go to: http://localhost:3000/dashboard
4. Click "New Project"
5. Enter a GitHub repo URL
6. Click "Deploy"
7. Watch the magic happen! ✨
