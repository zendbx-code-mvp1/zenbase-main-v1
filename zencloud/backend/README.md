# ZenCloud Backend API

FastAPI backend for ZenCloud deployment platform.

## Features

- ✅ User authentication (JWT)
- ✅ Project management
- ✅ Deployment tracking
- ✅ Environment variables
- ✅ PostgreSQL database
- ✅ Clean architecture
- ✅ Type hints with Pydantic

## Tech Stack

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database
- **PostgreSQL** - Database
- **Redis** - Cache & queue
- **Celery** - Background tasks
- **Docker** - Container management

## Project Structure

```
backend/
├── app/
│   ├── api/              # API routes
│   │   ├── auth.py       # Authentication endpoints
│   │   └── projects.py   # Project endpoints
│   ├── core/             # Core functionality
│   │   ├── config.py     # Configuration
│   │   ├── database.py   # Database setup
│   │   └── security.py   # Security utilities
│   ├── models/           # Database models
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── deployment.py
│   │   └── environment.py
│   ├── schemas/          # Pydantic schemas
│   │   ├── user.py
│   │   ├── project.py
│   │   └── deployment.py
│   └── main.py           # FastAPI app
├── requirements.txt      # Python dependencies
├── Dockerfile           # Docker configuration
└── .env.example         # Environment variables template
```

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Setup Database

```bash
# Install PostgreSQL
# Create database
createdb zencloud

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost:5432/zencloud
```

### 4. Run Server

```bash
# Development
uvicorn app.main:app --reload

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user

### Projects

- `GET /projects/` - List all projects
- `POST /projects/` - Create new project
- `GET /projects/{id}` - Get project details
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project
- `POST /projects/{id}/start` - Start project
- `POST /projects/{id}/stop` - Stop project
- `POST /projects/{id}/restart` - Restart project

### Health

- `GET /` - Root endpoint
- `GET /health` - Health check

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Database Models

### User
- id, email, username, password
- GitHub OAuth support
- Timestamps

### Project
- id, name, repository_url, branch
- subdomain, custom_domain
- status, framework
- Container info

### Deployment
- id, commit_sha, commit_message
- status, build_logs
- Container ID

### EnvironmentVariable
- id, key, value (encrypted)
- Project relationship

## Development

### Run Tests
```bash
pytest
```

### Format Code
```bash
black app/
isort app/
```

### Type Checking
```bash
mypy app/
```

## Docker

### Build Image
```bash
docker build -t zencloud-backend .
```

### Run Container
```bash
docker run -p 8000:8000 --env-file .env zencloud-backend
```

## Environment Variables

See `.env.example` for all required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SECRET_KEY` - JWT secret key
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth secret

## Next Steps

- [ ] Implement GitHub OAuth flow
- [ ] Add deployment engine
- [ ] Integrate Docker SDK
- [ ] Setup Celery workers
- [ ] Add WebSocket for logs
- [ ] Implement environment variable encryption
- [ ] Add rate limiting
- [ ] Setup monitoring

## License

Proprietary
