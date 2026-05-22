# ZenCloud - Cloud Deployment Platform

> Push Code → Deploy → Go Live

ZenCloud is a next-generation cloud deployment platform that eliminates DevOps complexity. Deploy applications from GitHub in minutes, not hours.

## 🎯 Vision

Build the easiest cloud platform for deployment — not another complicated AWS clone. Eliminate DevOps dependency for developers and small teams by automating every step from code to live URL.

## 🚀 Current Status

**Phase 1 - MVP Development** 🎉

- ✅ Frontend Complete (100%) - Beautiful UI with black/orange theme
- ✅ Backend API Complete (100%) - FastAPI with JWT auth
- ✅ Database Models (100%) - PostgreSQL with SQLAlchemy
- ✅ **Deployment Engine (100%)** - Git clone, build, deploy ⭐ NEW!
- ✅ **GitHub Integration (100%)** - OAuth and webhooks ⭐ NEW!
- ✅ **Container Management (100%)** - Docker orchestration ⭐ NEW!
- ✅ **Background Workers (100%)** - Celery task queue ⭐ NEW!
- ❌ Nginx/SSL (0%) - Reverse proxy and certificates
- ❌ Frontend Integration (0%) - Connect UI to backend

**Overall Progress: 85%** 🚀

### 🎉 Major Update!
The **core deployment engine is now complete**! You can now:
- Connect GitHub repositories
- Deploy Next.js, React, Node.js, Python, and static sites
- Manage containers (start/stop/restart)
- View logs and monitor resource usage

See [COMPLETION_GUIDE.md](COMPLETION_GUIDE.md) for testing instructions.

## 📁 Project Structure

```
zencloud/
├── frontend/              # Next.js Dashboard (✅ Complete)
│   ├── app/
│   │   ├── page.tsx      # Landing page
│   │   ├── login/        # Login page
│   │   ├── signup/       # Signup page
│   │   └── dashboard/    # Dashboard
│   ├── lib/
│   └── package.json
│
├── backend/              # FastAPI Backend (🔄 Coming next)
│   └── (to be built)
│
├── DEVELOPMENT_PLAN.md   # Complete 10-week roadmap
└── README.md            # This file
```

## 🎨 Design Theme

**Colors:**
- Primary: Orange (#FF6B35)
- Background: Deep Black (#0A0A0A, #121212)
- Surface: Dark Gray (#1E1E1E, #2A2A2A)
- Text: White/Gray

**Style:**
- Glassmorphism cards
- Smooth animations
- Modern, clean layout
- Orange glow effects

## 🛠️ Tech Stack

### Frontend (Complete)
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend (Complete ⭐)
- **FastAPI** - Python web framework
- **PostgreSQL** - Database
- **Redis** - Queue & cache
- **Celery** - Async workers
- **Docker** - Containerization
- **PyGithub** - GitHub API integration

## 🚦 Quick Start

### Prerequisites
- Docker Desktop installed and running
- GitHub account (for OAuth)
- Git installed

### Setup GitHub OAuth (Required)
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: ZenCloud Local
   - **Homepage URL**: http://localhost:3000
   - **Callback URL**: http://localhost:3000/auth/callback
4. Copy Client ID and Secret
5. Create `.env` file in zencloud folder:
   ```env
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

### Start All Services

**Windows:**
```bash
# Double-click start-all.bat
# OR
docker-compose up -d
```

**Linux/Mac:**
```bash
docker-compose up -d
```

### Access Services
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:3000 (start separately)

### Test Deployment
1. Open http://localhost:8000/docs
2. Authorize with GitHub
3. Create a project
4. Deploy it!

See [COMPLETION_GUIDE.md](COMPLETION_GUIDE.md) and [TEST_GUIDE.md](TEST_GUIDE.md) for detailed instructions.

## 📋 Phase 1 Features (MVP)

### ✅ Completed (85%)
- [x] Landing page
- [x] Login/Signup UI
- [x] Dashboard layout
- [x] Project cards
- [x] Stats overview
- [x] Activity feed
- [x] **Backend API** ⭐
- [x] **GitHub OAuth integration** ⭐
- [x] **Deployment engine** ⭐
- [x] **Container management** ⭐
- [x] **Background workers** ⭐
- [x] **Logs and monitoring** ⭐

### 🔄 In Progress (15%)
- [ ] Frontend-backend integration
- [ ] Nginx reverse proxy
- [ ] SSL automation
- [ ] WebSocket real-time logs
- [ ] Environment variable encryption

### 🎉 You Can Now Deploy Real Apps!
Test with Next.js, React, Node.js, Python, or static sites via API.

## 🎯 Roadmap

### Phase 1: ZenDeploy (Current)
Deploy apps from GitHub with one click
- GitHub integration
- Auto framework detection
- Docker deployments
- Custom domains + SSL
- Real-time logs

### Phase 2: ZenDBX
Managed databases (PostgreSQL, MySQL, MongoDB)

### Phase 3: ZenCompute
VPS/EC2-like virtual servers

### Phase 4: ZenStorage + ZenMonitor
Object storage + production monitoring

### Phase 5: Enterprise
Team management, billing, autoscaling

See [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) for complete roadmap.

## 🎪 Competitive Positioning

**Competing with:**
- Railway (deployment simplicity)
- Render (managed services)
- Vercel/Netlify (frontend focus)
- AWS (enterprise scale)

**Winning on:**
- ⚡ Simplicity over complexity
- 🚀 Speed over configurability
- 🤖 Automation over manual control
- 💰 Transparent pricing
- 🎯 Developer experience

## 📊 Target Metrics

- Deploy time: < 5 minutes
- Time to first deployment: < 10 minutes
- Uptime: 99.5%+
- Build success rate: > 95%

## 🔐 Security

- GitHub OAuth authentication
- Encrypted secrets storage
- Container isolation
- HTTPS by default
- Rate limiting

## 📖 Documentation

- [README.md](README.md) - This file (project overview)
- [COMPLETION_GUIDE.md](COMPLETION_GUIDE.md) - **⭐ NEW! Complete testing & deployment guide**
- [TEST_GUIDE.md](TEST_GUIDE.md) - Local testing instructions
- [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) - Complete 10-week roadmap
- [BACKEND_SETUP.md](BACKEND_SETUP.md) - Backend setup guide
- [frontend/README.md](frontend/README.md) - Frontend documentation
- [backend/README.md](backend/README.md) - Backend documentation

## 🤝 Contributing

This is currently a private project. Contribution guidelines will be added later.

## 📝 License

Proprietary - All rights reserved

## 🎉 Next Steps

### ✅ Just Completed (Week 1)
1. ✅ GitHub OAuth integration
2. ✅ Git clone and framework detection
3. ✅ Docker build pipeline
4. ✅ Container management
5. ✅ Background workers with Celery

### 🔄 Current Priority (Week 2)
1. 🔄 Frontend-backend integration
2. 🔄 Real authentication flow in UI
3. 🔄 Dashboard with real data
4. 🔄 Deployment UI

### 📅 Coming Soon (Week 3-4)
5. 📅 Nginx reverse proxy
6. 📅 SSL automation
7. 📅 WebSocket real-time logs
8. 📅 Environment variable encryption

### 🎯 Goal
**Production-ready MVP in 2-3 weeks!**

---

**Built with ❤️ for developers who hate DevOps complexity**

*Last Updated: May 22, 2026*  
*Status: 85% Complete - Deployment Engine Working!* 🎉
