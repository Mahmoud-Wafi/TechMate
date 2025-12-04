#!/bin/bash
echo "Starting gunicorn..."
exec gunicorn techmate.wsgi:application --bind 0.0.0.0:8080 --timeout 120 --workers 1
