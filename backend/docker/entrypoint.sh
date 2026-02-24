#!/bin/sh
set -e

echo "Running migrations (waiting for database if needed)..."
until python manage.py migrate --noinput; do
  echo "Database is unavailable - retrying in 3s..."
  sleep 3
done

if [ "$#" -gt 0 ]; then
  echo "Starting custom command: $*"
  exec "$@"
fi

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Django with Gunicorn..."
exec gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120
