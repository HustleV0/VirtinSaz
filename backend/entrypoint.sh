#!/bin/sh

if [ $# -eq 0 ]; then
    # Only run these in the main Django container
    echo "Running migrations..."
    python manage.py migrate --noinput
    
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
    
    # Start Gunicorn
    exec gunicorn --bind 0.0.0.0:8000 --workers 3 --timeout 120 core.wsgi:application
else
    # For Celery or other commands, just execute them directly
    exec "$@"
fi
