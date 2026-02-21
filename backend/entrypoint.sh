#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Run migrations (usually only in web service)
if [ "${RUN_MIGRATIONS:-1}" = "1" ]; then
  echo "Running migrations..."
  python manage.py migrate --noinput
fi

# Collect static files (usually only in web service)
if [ "${COLLECT_STATIC:-1}" = "1" ]; then
  echo "Collecting static files..."
  python manage.py collectstatic --noinput
fi

# Start Gunicorn
echo "Starting Gunicorn..."
exec "$@"
