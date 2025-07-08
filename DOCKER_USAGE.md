# House31 Website - Docker Usage Guide

## Overview
The House31 website is now fully containerized with Docker, including:
- **Frontend**: React/Vite application (port 3000)
- **Backend**: Node.js/Express API (port 5000)
- **Database**: MongoDB (port 27017)

## Quick Start

### Start all services
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### Check service status
```bash
docker-compose ps
```

## Service Details

### Frontend (React/Vite)
- **URL**: http://localhost:3000
- **Container**: house31-frontend
- **Image**: house31-website-frontend

### Backend (Node.js/Express)
- **URL**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API**: http://localhost:5000/api
- **Container**: house31-backend
- **Image**: house31-website-backend

### Database (MongoDB)
- **URL**: mongodb://localhost:27017
- **Container**: house31-mongodb
- **Image**: mongo:7.0
- **Database**: house31-website
- **Credentials**: 
  - Username: house31admin
  - Password: house31password

## Development Commands

### Rebuild services
```bash
# Rebuild all
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

### Restart services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Access container shell
```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh

# MongoDB container
docker-compose exec mongodb mongosh
```

### View real-time logs
```bash
# Follow logs for all services
docker-compose logs -f

# Follow logs for specific service
docker-compose logs -f backend
```

## API Testing

### Test backend health
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing

# Or visit in browser
# http://localhost:5000/health
```

### Test posts API
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/api/posts" -UseBasicParsing

# Or visit in browser
# http://localhost:5000/api/posts
```

## Database Management

### Connect to MongoDB
```bash
# Using Docker exec
docker-compose exec mongodb mongosh -u house31admin -p house31password --authenticationDatabase admin

# Using external MongoDB client
mongodb://house31admin:house31password@localhost:27017/house31-website?authSource=admin
```

### Seed database
```bash
docker-compose exec backend npm run seed
```

## Troubleshooting

### Container won't start
1. Check logs: `docker-compose logs <service-name>`
2. Verify environment files exist:
   - `backend/.env`
   - `frontend/.env`
3. Rebuild image: `docker-compose build <service-name>`

### MongoDB connection issues
1. Ensure MongoDB container is healthy: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Verify MongoDB URI in `backend/.env`

### Port conflicts
1. Check if ports are already in use:
   - Frontend: 3000
   - Backend: 5000
   - MongoDB: 27017
2. Stop conflicting services or modify ports in `docker-compose.yml`

### Performance issues
1. Check resource usage: `docker stats`
2. Adjust memory limits in `docker-compose.yml`
3. Monitor logs for errors: `docker-compose logs -f`

## Production Deployment

For production deployment, use:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Environment Variables

### Backend (.env)
- `MONGODB_URI`: Database connection string
- `MONGODB_DB_NAME`: Database name
- `JWT_SECRET`: JWT token secret
- `PORT`: Server port (default: 5000)

### Frontend (.env)
- `VITE_API_URL`: Backend API URL
- `VITE_APP_NAME`: Application name

## File Structure
```
.
├── docker-compose.yml          # Development configuration
├── docker-compose.prod.yml     # Production configuration
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env
└── scripts/
    └── mongo-init.js           # MongoDB initialization
```
