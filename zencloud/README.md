# ZenCloud - Cloud Deployment Platform

> Push Code → Deploy → Go Live

ZenCloud is a next-generation cloud deployment platform that eliminates DevOps complexity. Deploy applications from GitHub in minutes, not hours.

## 🎯 Vision

Build the easiest cloud platform for deployment — not another complicated AWS clone. Eliminate DevOps dependency for developers and small teams by automating every step from code to live URL.

## 🚀 Current Status

**Phase 1 - Frontend Complete** ✅

- Landing page with hero, features, pricing
- Login/Signup pages (GitHub OAuth ready)
- Dashboard with project overview
- Black & Orange theme (inspired by ZenDBX)
- Fully responsive design

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

### Backend (Planned)
- **FastAPI** - Python web framework
- **PostgreSQL** - Database
- **Redis** - Queue & cache
- **Celery** - Async workers
- **Docker** - Containerization

## 🚦 Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:3000

See [frontend/SETUP.md](frontend/SETUP.md) for detailed instructions.

## 📋 Phase 1 Features (MVP)

### ✅ Completed
- [x] Landing page
- [x] Login/Signup UI
- [x] Dashboard layout
- [x] Project cards
- [x] Stats overview
- [x] Activity feed

### 🔄 In Progress
- [ ] Backend API setup
- [ ] GitHub OAuth integration
- [ ] Deployment engine
- [ ] Container management
- [ ] Nginx reverse proxy
- [ ] SSL automation

### 📅 Coming Soon
- [ ] Real-time logs
- [ ] Environment variables
- [ ] Custom domains
- [ ] Monitoring dashboard

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

- [Development Plan](DEVELOPMENT_PLAN.md) - Complete 10-week roadmap
- [Frontend Setup](frontend/SETUP.md) - Frontend installation guide
- [Frontend README](frontend/README.md) - Frontend documentation

## 🤝 Contributing

This is currently a private project. Contribution guidelines will be added later.

## 📝 License

Proprietary - All rights reserved

## 🎉 Next Steps

1. ✅ Frontend complete
2. 🔄 Build FastAPI backend
3. 🔄 Implement GitHub OAuth
4. 🔄 Create deployment engine
5. 🔄 Setup Docker management
6. 🔄 Configure Nginx + SSL

---

**Built with ❤️ for developers who hate DevOps complexity**

*Last Updated: May 20, 2026*
