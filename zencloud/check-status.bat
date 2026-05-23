@echo off
echo ========================================
echo ZenCloud Deployment Status Check
echo ========================================
echo.

echo [1/4] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Docker is installed
    docker ps >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✓ Docker is running
    ) else (
        echo ✗ Docker is NOT running - Please start Docker Desktop
    )
) else (
    echo ✗ Docker is NOT installed
)
echo.

echo [2/4] Checking Redis...
docker ps | findstr zencloud-redis >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Redis is running
) else (
    echo ✗ Redis is NOT running
    echo   Run: docker run -d --name zencloud-redis -p 6379:6379 redis:7-alpine
)
echo.

echo [3/4] Checking Backend...
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Backend API is running on port 8000
) else (
    echo ✗ Backend API is NOT running
    echo   Run: cd backend ^&^& python -m uvicorn app.main:app --reload
)
echo.

echo [4/4] Checking Frontend...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Frontend is running on port 3000
) else (
    echo ✗ Frontend is NOT running
    echo   Run: cd frontend ^&^& npm run dev
)
echo.

echo ========================================
echo Running Containers:
echo ========================================
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.

echo ========================================
echo Next Steps:
echo ========================================
echo 1. If all checks pass, start Celery worker:
echo    cd zencloud ^&^& start-celery.bat
echo.
echo 2. Then go to: http://localhost:3000/dashboard
echo.
echo 3. Create a project and click Deploy!
echo ========================================

pause
