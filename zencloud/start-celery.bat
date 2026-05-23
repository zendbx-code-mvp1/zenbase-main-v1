@echo off
echo Starting ZenCloud Celery Worker...
echo.

cd backend

echo Celery worker starting...
echo This will handle background deployment tasks.
echo.

celery -A app.workers.celery_app worker --loglevel=info --pool=solo

pause
