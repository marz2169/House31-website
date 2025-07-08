# 🐳 House31 Website - Docker Setup

This document provides complete instructions for running the House31 website using Docker containers.

## 📋 Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- Git

## 🏗️ Architecture

The Docker setup includes:
- **Frontend**: React + Vite (Development: Port 3000, Production: Port 80)
- **Backend**: Node.js + Express (Port 5000)
- **Database**: MongoDB (Port 27017)
- **Reverse Proxy**: Nginx (Production)

## 🚀 Quick Start

### Development Environment

1. **Clone and navigate to project**:
   ```bash
   git clone <your-repo-url>
   cd House31-website
   ```

2. **Start development environment**:
   ```bash
   # Using Docker Compose
   docker-compose up -d
   
   # Or using PowerShell script (Windows)
   .\docker-scripts.ps1
   Start-Dev
   
   # Or using Makefile (Linux/Mac)
   make dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api
   - MongoDB: localhost:27017

### Production Environment

1. **Configure environment**:
   ```bash
   cp .env.prod.example .env.prod
   # Edit .env.prod with your production values
   ```

2. **Start production environment**:
   ```bash
   # Using Docker Compose
   docker-compose -f docker-compose.prod.yml up -d
   
   # Or using scripts
   make prod  # Linux/Mac
   Start-Prod # PowerShell
   ```

## 📁 Docker Files Structure

```
House31-website/
├── docker-compose.yml           # Development environment
├── docker-compose.prod.yml      # Production environment
├── Makefile                     # Linux/Mac commands
├── docker-scripts.ps1           # PowerShell commands
├── .env.prod.example           # Production environment template
├── backend/
│   ├── Dockerfile              # Backend container definition
│   ├── .dockerignore           # Backend ignore file
│   └── healthcheck.js          # Health check script
├── frontend/
│   ├── Dockerfile              # Frontend container definition
│   ├── .dockerignore           # Frontend ignore file
│   └── nginx.conf              # Production Nginx config
└── scripts/
    └── mongo-init.js           # MongoDB initialization
```

## 🛠️ Available Commands

### Using Makefile (Linux/Mac)
```bash
make dev         # Start development environment
make prod        # Start production environment
make build       # Build all Docker images
make down        # Stop all containers
make logs        # Show container logs
make clean       # Remove all containers and images
make restart     # Restart all containers
make seed        # Seed database with sample data
make status      # Show container status
```

### Using PowerShell Scripts (Windows)
```powershell
# Load the scripts
. .\docker-scripts.ps1

# Available commands
Start-Dev           # Start development environment
Start-Prod          # Start production environment
Build-Images        # Build all Docker images
Stop-Containers     # Stop all containers
Show-Logs          # Show container logs
Clean-Docker       # Remove all containers and images
Restart-Containers # Restart all containers
Seed-Database      # Seed database with sample data
Show-Status        # Show container status
```

### Using Docker Compose Directly
```bash
# Development
docker-compose up -d                    # Start development
docker-compose down                     # Stop development
docker-compose logs -f                  # View logs
docker-compose exec backend npm run seed # Seed database

# Production
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml down
```

## 🔧 Configuration

### Environment Variables

#### Development (.env files in respective directories)
- Backend uses `backend/.env`
- Frontend uses `frontend/.env`

#### Production (.env.prod)
All production environment variables are centralized in `.env.prod`:
```bash
MONGODB_ROOT_USERNAME=house31admin
MONGODB_ROOT_PASSWORD=your-secure-password
MONGODB_URI=mongodb://house31admin:password@mongodb:27017/house31-website?authSource=admin
FRONTEND_URL=https://yourdomain.com
ADMIN_API_KEY=your-secure-api-key
JWT_SECRET=your-jwt-secret
```

### Database Configuration

#### Development
- MongoDB runs in a Docker container
- Data persists in Docker volume `mongodb_data`
- Sample data automatically loaded on first start

#### Production
- Can use containerized MongoDB or external service (MongoDB Atlas)
- Configured via `MONGODB_URI` environment variable

## 🔍 Monitoring and Debugging

### View Container Status
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Access Container Shell
```bash
# Backend container
docker-compose exec backend sh

# Frontend container (development)
docker-compose exec frontend sh

# MongoDB container
docker-compose exec mongodb mongosh house31-website
```

### Health Checks
All containers include health checks:
- **Backend**: HTTP check on `/health` endpoint
- **Frontend**: HTTP check on `/health` endpoint
- **MongoDB**: Database ping check

## 📊 Database Management

### Seed Database
```bash
# Using make
make seed

# Using PowerShell
Seed-Database

# Using docker-compose
docker-compose exec backend npm run seed
```

### Database Backup
```bash
# Create backup
docker-compose exec mongodb mongodump --out /data/backup --db house31-website

# Restore backup
docker-compose exec mongodb mongorestore /data/backup
```

### Direct Database Access
```bash
# Connect to MongoDB shell
docker-compose exec mongodb mongosh house31-website

# Using connection string
mongosh "mongodb://house31admin:house31password@localhost:27017/house31-website?authSource=admin"
```

## 🚀 Deployment

### Development Deployment
1. Ensure Docker and Docker Compose are installed
2. Clone repository
3. Run `make dev` or `Start-Dev`
4. Access application at http://localhost:3000

### Production Deployment
1. Set up production server with Docker
2. Configure `.env.prod` file
3. Run `make prod` or `Start-Prod`
4. Configure domain and SSL certificates
5. Set up monitoring and logging

## 🔒 Security Considerations

### Development
- Default passwords for local development
- MongoDB exposed on localhost:27017
- CORS enabled for localhost

### Production
- Use strong passwords and API keys
- MongoDB not exposed externally
- HTTPS with SSL certificates
- Proper CORS configuration
- Security headers in Nginx

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**:
   ```bash
   # Check what's using ports
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :5000
   netstat -tulpn | grep :27017
   ```

2. **Permission issues**:
   ```bash
   # Fix permissions (Linux/Mac)
   sudo chown -R $USER:$USER .
   ```

3. **Out of disk space**:
   ```bash
   # Clean Docker system
   docker system prune -a
   ```

4. **Database connection issues**:
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Restart MongoDB
   docker-compose restart mongodb
   ```

### Logs and Debugging
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# Debug specific service
docker-compose exec backend env  # Check environment
docker-compose exec backend ps   # Check processes
```

## 📈 Performance Optimization

### Development
- Use Docker volumes for node_modules to avoid rebuilds
- Enable file watching for hot reload
- Limit container resource usage if needed

### Production
- Multi-stage builds to reduce image size
- Nginx for static file serving and reverse proxy
- Gzip compression enabled
- Health checks for container orchestration
- Proper cache headers for static assets

## 🔄 Updates and Maintenance

### Updating Dependencies
```bash
# Rebuild containers after dependency changes
docker-compose build

# Or rebuild specific service
docker-compose build backend
```

### Database Migration
```bash
# Run migration scripts
docker-compose exec backend npm run migrate
```

### Backup Strategy
- Regular MongoDB backups
- Version control for configuration
- Image versioning for production deployments

---

## 📞 Support

For issues and questions:
1. Check container logs: `docker-compose logs`
2. Verify environment configuration
3. Check Docker and Docker Compose versions
4. Review this documentation

Happy containerizing! 🐳
