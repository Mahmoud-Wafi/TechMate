#!/bin/bash
set -e

echo "Running migrations..."
python manage.py migrate --noinput 2>&1 || echo "Migrations warning (may already exist)"

echo "Starting gunicorn..."
gunicorn techmate.wsgi:application --bind 0.0.0.0:8080 --timeout 120 --workers 1
