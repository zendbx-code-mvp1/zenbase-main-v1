@echo off
echo Restarting ZenCloud Backend...
echo.

cd backend

echo Stopping any running backend processes...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *uvicorn*" 2>nul

echo.
echo Starting backend server...
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
