#!/bin/bash
set -e

echo "🔄 Running database migrations..."
python manage.py migrate --noinput

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput || true

echo "🚀 Starting server..."
exec gunicorn techmate.wsgi:application --bind 0.0.0.0:$PORT --workers 2

