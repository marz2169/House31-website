#!/bin/sh
# Docker health check script for backend

# Check if the health endpoint responds
curl -f http://localhost:5000/health || exit 1

# Check if the API is responding
curl -f http://localhost:5000/api/posts || exit 1

echo "Backend health check passed"
