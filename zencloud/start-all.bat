@echo off
echo ========================================
echo   ZenCloud - Starting All Services
echo ========================================
echo.

echo Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not running
    echo Please install Docker Desktop and try again
    pause
    exit /b 1
)

echo.
echo Starting services with Docker Compose...
docker-compose up -d

echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   Services Started!
echo ========================================
echo.
echo Backend API:     http://localhost:8000
echo API Docs:        http://localhost:8000/docs
echo PostgreSQL:      localhost:5432
echo Redis:           localhost:6379
echo.
echo To view logs:
echo   docker-compose logs -f backend
echo   docker-compose logs -f celery-worker
echo.
echo To stop services:
echo   docker-compose down
echo.
echo ========================================
echo.
echo Next steps:
echo 1. Setup GitHub OAuth app
echo 2. Create .env file with GitHub credentials
echo 3. Test deployment via API docs
echo.
echo See COMPLETION_GUIDE.md for detailed instructions
echo.
pause
