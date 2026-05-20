# ZenCloud Phase 1 - Development Plan

## Project Overview

**Goal**: Build ZenDeploy MVP - Deploy apps from GitHub with one click

**Timeline**: 10 weeks to production-ready MVP

**Core Flow**: Push Code → Deploy → Go Live

---

## Architecture

### System Components

```
┌─────────────────┐
│  Next.js        │  User Dashboard (Frontend)
│  Dashboard      │  - Project management
└────────┬────────┘  - Deployment triggers
         │           - Real-time logs
         │
         ▼
┌─────────────────┐
│  FastAPI        │  Control Plane (Backend)
│  Backend        │  - REST APIs
└────────┬────────┘  - GitHub webhooks
         │           - Container orchestration
         │
         ▼
┌─────────────────┐
│  Celery         │  Build Workers
│  Workers        │  - Git clone
└────────┬────────┘  - Framework detection
         │           - Docker build
         │           - Deploy containers
         ▼
┌─────────────────┐
│  Docker         │  Container Runtime
│  Engine         │  - Run applications
└────────┬────────┘  - Lifecycle management
         │
         ▼
┌─────────────────┐
│  Nginx          │  Reverse Proxy
│  + Certbot      │  - Domain routing
└─────────────────┘  - SSL/HTTPS
```

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **Tailwind CSS** - Styling
- **ShadcN UI** - Component library
- **WebSocket** - Real-time log streaming
- **React Query** - API state management

### Backend (Python)
- **FastAPI** - Web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **Redis** - Queue & cache
- **Celery** - Async task workers
- **Docker SDK for Python** - Container management
- **PyGithub** - GitHub API client
- **python-jose** - JWT authentication
- **cryptography** - Secret encryption
- **Pydantic** - Data validation

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy
- **Certbot** - Let's Encrypt SSL
- **Linux VPS** - Initial hosting

---

## Database Schema

### Users
```sql
- id (UUID)
- github_id (unique)
- username
- email
- avatar_url
- access_token (encrypted)
- created_at
- updated_at
```

### Projects
```sql
- id (UUID)
- user_id (FK)
- name
- repository_url
- branch (default: main)
- framework (react/nextjs/nodejs/static)
- subdomain (unique)
- custom_domain (nullable)
- status (active/stopped/failed)
- created_at
- updated_at
```

### Deployments
```sql
- id (UUID)
- project_id (FK)
- commit_sha
- commit_message
- status (pending/building/success/failed)
- build_logs (text)
- container_id
- deployed_at
- created_at
```

### Environment Variables
```sql
- id (UUID)
- project_id (FK)
- key
- value (encrypted)
- created_at
- updated_at
```

---

## Development Phases

### Week 1-2: Foundation & Setup

#### Tasks
1. **Project Initialization**
   - [ ] Create monorepo structure
   - [ ] Setup Next.js frontend
   - [ ] Setup FastAPI backend
   - [ ] Configure PostgreSQL
   - [ ] Setup Redis
   - [ ] Configure Celery workers
   - [ ] Docker Compose for local development

2. **Database & Models**
   - [ ] Create SQLAlchemy models
   - [ ] Database migrations (Alembic)
   - [ ] Seed data for testing

3. **GitHub OAuth Integration**
   - [ ] Register GitHub OAuth app
   - [ ] Implement OAuth flow in FastAPI
   - [ ] Store access tokens securely
   - [ ] Frontend login page
   - [ ] Session management (JWT)

**Deliverable**: Users can log in with GitHub

---

### Week 3-4: Core Deployment Engine

#### Tasks
4. **GitHub Integration**
   - [ ] Fetch user repositories via GitHub API
   - [ ] Display repos in dashboard
   - [ ] Select repo + branch for deployment
   - [ ] Setup GitHub webhook endpoint
   - [ ] Register webhooks on repo selection

5. **Build Pipeline - Part 1**
   - [ ] Celery task: Clone Git repository
   - [ ] Framework detection logic:
     - Detect `package.json` → React/Next.js/Node.js
     - Detect `index.html` → Static site
     - Detect `requirements.txt` → Python (future)
   - [ ] Generate Dockerfile based on framework
   - [ ] Store build metadata in database

6. **Build Pipeline - Part 2**
   - [ ] Docker build from generated Dockerfile
   - [ ] Stream build logs to database
   - [ ] Handle build failures gracefully
   - [ ] Cleanup failed builds

**Deliverable**: System can clone repo, detect framework, and build Docker image

---

### Week 5-6: Container Management & Domains

#### Tasks
7. **Container Deployment**
   - [ ] Docker SDK integration
   - [ ] Run container from built image
   - [ ] Dynamic port allocation
   - [ ] Container health checks
   - [ ] Store container ID in database

8. **Container Lifecycle**
   - [ ] Start/Stop/Restart endpoints
   - [ ] Delete deployment (stop + remove container)
   - [ ] View running containers
   - [ ] Resource limits (CPU/RAM)

9. **Reverse Proxy Setup**
   - [ ] Generate Nginx config per deployment
   - [ ] Subdomain assignment (app-name.zencloud.dev)
   - [ ] Reload Nginx on new deployment
   - [ ] Health check proxying

10. **SSL Automation**
    - [ ] Certbot integration
    - [ ] Auto-generate SSL certificates
    - [ ] HTTPS redirect configuration
    - [ ] Auto-renewal cron job
    - [ ] Certificate storage

**Deliverable**: Deployed apps accessible via HTTPS subdomain

---

### Week 7-8: Dashboard & Monitoring

#### Tasks
11. **Frontend Dashboard**
    - [ ] Projects list page
    - [ ] Project detail page
    - [ ] Deployment history timeline
    - [ ] Deploy button (manual trigger)
    - [ ] Container controls (start/stop/restart)

12. **Real-time Logs**
    - [ ] WebSocket server in FastAPI
    - [ ] Stream build logs to frontend
    - [ ] Stream runtime logs (docker logs)
    - [ ] Log persistence in database
    - [ ] Log viewer UI with filtering

13. **Environment Variables**
    - [ ] Add/Edit/Delete env vars UI
    - [ ] Encrypt values before storage
    - [ ] Inject env vars into containers
    - [ ] Restart container on env change

14. **Basic Monitoring**
    - [ ] Docker stats API integration
    - [ ] CPU usage tracking
    - [ ] RAM usage tracking
    - [ ] Container uptime
    - [ ] Status indicators (running/stopped/failed)

**Deliverable**: Full-featured dashboard with logs and monitoring

---

### Week 9-10: Polish, Testing & Launch

#### Tasks
15. **Error Handling & Recovery**
    - [ ] Build failure notifications
    - [ ] Rollback to previous deployment
    - [ ] Automatic retry logic
    - [ ] User-friendly error messages
    - [ ] Deployment status webhooks (optional)

16. **Security Hardening**
    - [ ] Rate limiting on APIs
    - [ ] Input validation and sanitization
    - [ ] Secure secret storage
    - [ ] CORS configuration
    - [ ] Container isolation
    - [ ] Network security groups

17. **Testing**
    - [ ] Unit tests for critical functions
    - [ ] Integration tests for deployment flow
    - [ ] End-to-end deployment tests
    - [ ] Load testing
    - [ ] Security audit

18. **Documentation**
    - [ ] User guide (how to deploy)
    - [ ] Supported frameworks
    - [ ] Custom domain setup instructions
    - [ ] Troubleshooting guide
    - [ ] API documentation (auto-generated)

19. **Production Deployment**
    - [ ] Setup production VPS
    - [ ] Configure domain (zencloud.dev)
    - [ ] SSL for main domain
    - [ ] Monitoring and alerting
    - [ ] Backup strategy
    - [ ] CI/CD pipeline

**Deliverable**: Production-ready ZenDeploy MVP

---

## Minimum Viable Features

### Must Have (MVP)
✅ GitHub OAuth login  
✅ List user repositories  
✅ Deploy from main branch  
✅ Auto-detect: React, Next.js, Node.js, Static HTML  
✅ Assign subdomain (app-name.zencloud.dev)  
✅ HTTPS by default  
✅ View build logs  
✅ View runtime logs  
✅ Set environment variables  
✅ Start/Stop/Restart deployment  
✅ Delete deployment  
✅ Basic CPU/RAM monitoring  

### Nice to Have (Post-MVP)
⏳ Deploy from any branch  
⏳ Custom domain support (full automation)  
⏳ Multiple deployments per project  
⏳ Deployment rollback UI  
⏳ Advanced monitoring & alerts  
⏳ Team collaboration  
⏳ Usage analytics  

### Future Phases
🔮 Phase 2: ZenDBX (Managed Databases)  
🔮 Phase 3: ZenCompute (VPS)  
🔮 Phase 4: ZenStorage + ZenMonitor  
🔮 Phase 5: Enterprise Features  

---

## Project Structure

```
zencloud/
├── frontend/                 # Next.js Dashboard
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── callback/
│   │   ├── dashboard/
│   │   │   ├── projects/
│   │   │   └── [projectId]/
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/
│   └── package.json
│
├── backend/                  # FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── projects.py
│   │   │   ├── deployments.py
│   │   │   └── webhooks.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── database.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── github.py
│   │   │   ├── docker_manager.py
│   │   │   └── nginx_manager.py
│   │   ├── workers/
│   │   │   └── tasks.py
│   │   └── main.py
│   ├── alembic/              # Database migrations
│   ├── requirements.txt
│   └── Dockerfile
│
├── nginx/                    # Nginx configs
│   ├── templates/
│   └── nginx.conf
│
├── docker-compose.yml        # Local development
├── .env.example
└── README.md
```

---

## Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/zencloud

# Redis
REDIS_URL=redis://localhost:6379/0

# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback

# JWT
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Docker
DOCKER_HOST=unix:///var/run/docker.sock

# Domain
BASE_DOMAIN=zencloud.dev
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

---

## API Endpoints

### Authentication
- `GET /auth/github` - Redirect to GitHub OAuth
- `GET /auth/callback` - Handle OAuth callback
- `POST /auth/logout` - Logout user

### Projects
- `GET /projects` - List user projects
- `POST /projects` - Create new project
- `GET /projects/{id}` - Get project details
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

### Deployments
- `GET /projects/{id}/deployments` - List deployments
- `POST /projects/{id}/deploy` - Trigger deployment
- `GET /deployments/{id}` - Get deployment details
- `GET /deployments/{id}/logs` - Get deployment logs
- `POST /deployments/{id}/start` - Start container
- `POST /deployments/{id}/stop` - Stop container
- `POST /deployments/{id}/restart` - Restart container

### Environment Variables
- `GET /projects/{id}/env` - List env vars
- `POST /projects/{id}/env` - Add env var
- `PUT /projects/{id}/env/{key}` - Update env var
- `DELETE /projects/{id}/env/{key}` - Delete env var

### Webhooks
- `POST /webhooks/github` - GitHub push webhook

### Monitoring
- `GET /projects/{id}/stats` - Get resource usage

---

## Success Metrics

### Technical
- Deploy time: < 5 minutes for average app
- Uptime: 99.5%+
- Build success rate: > 95%
- SSL certificate generation: < 30 seconds

### User Experience
- Time to first deployment: < 10 minutes
- Zero manual server configuration
- One-click deployments
- Real-time feedback on all operations

---

## Risk Mitigation

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Docker build failures | High | Robust error handling, fallback Dockerfiles |
| SSL cert rate limits | Medium | Cache certificates, use staging for testing |
| Resource exhaustion | High | Container limits, monitoring, auto-scaling prep |
| Security vulnerabilities | Critical | Regular audits, dependency updates, isolation |

### Business Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Poor framework detection | Medium | Start with popular frameworks, iterate |
| Complex user repos | Medium | Clear documentation on supported patterns |
| Scaling costs | High | Efficient resource allocation, usage monitoring |

---

## Next Steps

### Immediate (This Week)
1. Setup development environment
2. Initialize project structure
3. Configure Docker Compose
4. Create database schema
5. Implement GitHub OAuth

### Short Term (Next 2 Weeks)
1. Build core deployment pipeline
2. Container management
3. Basic dashboard UI

### Medium Term (Month 2)
1. Nginx + SSL automation
2. Logs and monitoring
3. Environment variables

### Launch (Week 10)
1. Security audit
2. Performance testing
3. Documentation
4. Production deployment

---

## Support & Maintenance

### Post-Launch
- Monitor error rates and build failures
- Collect user feedback
- Fix critical bugs within 24 hours
- Iterate on framework detection
- Prepare for Phase 2 (ZenDBX)

---

**Last Updated**: May 20, 2026  
**Version**: 1.0  
**Status**: Planning Phase
