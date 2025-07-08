#!/bin/sh
# Docker health check script for frontend

# Check if nginx is serving the frontend
curl -f http://localhost/ || exit 1

echo "Frontend health check passed"
