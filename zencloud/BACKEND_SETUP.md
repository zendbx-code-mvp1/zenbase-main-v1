# ZenCloud Backend - Setup Guide

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

**Easiest way to run everything:**

```bash
# Start all services (PostgreSQL, Redis, Backend)
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

**Access:**
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Option 2: Manual Setup

**1. Install PostgreSQL**
```bash
# Windows (using Chocolatey)
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/
```

**2. Create Database**
```bash
# Open psql
psql -U postgres

# Create database and user
CREATE DATABASE zencloud;
CREATE USER zencloud WITH PASSWORD 'zencloud';
GRANT ALL PRIVILEGES ON DATABASE zencloud TO zencloud;
\q
```

**3. Install Redis**
```bash
# Windows (using Chocolatey)
choco install redis-64

# Or use Docker
docker run -d -p 6379:6379 redis:7-alpine
```

**4. Setup Backend**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run server
uvicorn app.main:app --reload
```

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/                    # API Routes
│   │   ├── __init__.py
│   │   ├── auth.py            # Authentication endpoints
│   │   └── projects.py        # Project management
│   │
│   ├── core/                   # Core functionality
│   │   ├── __init__.py
│   │   ├── config.py          # Configuration
│   │   ├── database.py        # Database setup
│   │   └── security.py        # JWT & password hashing
│   │
│   ├── models/                 # Database models
│   │   ├── __init__.py
│   │   ├── user.py            # User model
│   │   ├── project.py         # Project model
│   │   ├── deployment.py      # Deployment model
│   │   └── environment.py     # Environment variables
│   │
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py            # User schemas
│   │   ├── project.py         # Project schemas
│   │   └── deployment.py      # Deployment schemas
│   │
│   ├── __init__.py
│   └── main.py                # FastAPI application
│
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Docker configuration
├── .env.example               # Environment template
├── .gitignore
└── README.md
```

---

## 🔧 Configuration

### Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://zencloud:zencloud@localhost:5432/zencloud

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
SECRET_KEY=your-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# GitHub OAuth (optional for now)
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback

# Docker
DOCKER_HOST=unix:///var/run/docker.sock

# Domain
BASE_DOMAIN=zencloud.dev

# CORS
FRONTEND_URL=http://localhost:3000
```

---

## 📡 API Endpoints

### Authentication

**Register User**
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword"
}
```

**Login**
```http
POST /auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=securepassword
```

**Get Current User**
```http
GET /auth/me
Authorization: Bearer <token>
```

### Projects

**List Projects**
```http
GET /projects/
Authorization: Bearer <token>
```

**Create Project**
```http
POST /projects/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "my-app",
  "repository_url": "https://github.com/user/repo",
  "branch": "main"
}
```

**Get Project**
```http
GET /projects/{project_id}
Authorization: Bearer <token>
```

**Update Project**
```http
PUT /projects/{project_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "updated-name",
  "branch": "develop"
}
```

**Delete Project**
```http
DELETE /projects/{project_id}
Authorization: Bearer <token>
```

**Control Project**
```http
POST /projects/{project_id}/start
POST /projects/{project_id}/stop
POST /projects/{project_id}/restart
Authorization: Bearer <token>
```

---

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"test123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=test123"
```

**Create Project:**
```bash
curl -X POST http://localhost:8000/projects/ \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"my-app","repository_url":"https://github.com/user/repo","branch":"main"}'
```

### Using Swagger UI

Visit http://localhost:8000/docs for interactive API documentation.

---

## 🗄️ Database Models

### User
- `id` (UUID) - Primary key
- `email` (String) - Unique email
- `username` (String) - Unique username
- `hashed_password` (String) - Bcrypt hashed
- `github_id` (String) - GitHub OAuth ID
- `avatar_url` (String) - Profile picture
- `is_active` (Boolean) - Account status
- `created_at` (DateTime) - Creation timestamp

### Project
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to User
- `name` (String) - Project name
- `repository_url` (String) - GitHub repo URL
- `branch` (String) - Git branch
- `subdomain` (String) - Unique subdomain
- `custom_domain` (String) - Custom domain
- `framework` (Enum) - Detected framework
- `status` (Enum) - Project status
- `container_id` (String) - Docker container ID

### Deployment
- `id` (UUID) - Primary key
- `project_id` (UUID) - Foreign key to Project
- `commit_sha` (String) - Git commit hash
- `commit_message` (String) - Commit message
- `status` (Enum) - Deployment status
- `build_logs` (Text) - Build output
- `deployed_at` (DateTime) - Deployment time

---

## 🔍 Troubleshooting

### Database Connection Error
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solution:**
- Check PostgreSQL is running: `pg_isctl status`
- Verify DATABASE_URL in .env
- Check PostgreSQL logs

### Import Errors
```
ModuleNotFoundError: No module named 'app'
```

**Solution:**
```bash
# Make sure you're in backend directory
cd backend

# Reinstall dependencies
pip install -r requirements.txt
```

### Port Already in Use
```
ERROR: [Errno 48] Address already in use
```

**Solution:**
```bash
# Find process on port 8000
# Windows
netstat -ano | findstr :8000

# Kill process
taskkill /PID <pid> /F

# Or use different port
uvicorn app.main:app --port 8001
```

---

## 📊 Database Management

### Create Tables
```bash
# Tables are created automatically on startup
# Or manually:
python -c "from app.core.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

### Reset Database
```bash
# Drop all tables
psql -U zencloud -d zencloud -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Restart backend to recreate tables
```

### View Data
```bash
# Connect to database
psql -U zencloud -d zencloud

# List tables
\dt

# Query users
SELECT * FROM users;

# Query projects
SELECT * FROM projects;
```

---

## 🚀 Next Steps

### Immediate
1. ✅ Backend API running
2. 🔄 Test authentication endpoints
3. 🔄 Test project CRUD operations
4. 🔄 Connect frontend to backend

### Short Term
1. Implement GitHub OAuth
2. Add deployment engine
3. Integrate Docker SDK
4. Setup Celery workers
5. Add WebSocket for logs

### Long Term
1. Environment variable encryption
2. Rate limiting
3. Monitoring & logging
4. Backup system
5. Production deployment

---

## 📚 Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **SQLAlchemy**: https://docs.sqlalchemy.org/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Pydantic**: https://docs.pydantic.dev/

---

## ✅ Checklist

- [ ] PostgreSQL installed and running
- [ ] Redis installed and running
- [ ] Backend dependencies installed
- [ ] .env file configured
- [ ] Database created
- [ ] Backend server running
- [ ] API accessible at http://localhost:8000
- [ ] Swagger docs accessible at http://localhost:8000/docs
- [ ] Can register a user
- [ ] Can login and get token
- [ ] Can create a project

---

**Backend is ready! Time to connect it to the frontend.** 🎉
