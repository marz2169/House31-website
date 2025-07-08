# House31 Website Docker Commands
# Use these commands to manage your Docker containers

.PHONY: help dev prod build up down logs clean restart seed

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev      - Start development environment"
	@echo "  make prod     - Start production environment"
	@echo "  make build    - Build all Docker images"
	@echo "  make up       - Start containers (development)"
	@echo "  make down     - Stop and remove containers"
	@echo "  make logs     - Show container logs"
	@echo "  make clean    - Remove all containers, images, and volumes"
	@echo "  make restart  - Restart all containers"
	@echo "  make seed     - Seed database with sample data"

# Development environment
dev:
	@echo "Starting development environment..."
	docker-compose up -d
	@echo "Development environment started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:5000"
	@echo "MongoDB: localhost:27017"

# Production environment
prod:
	@echo "Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d
	@echo "Production environment started!"

# Build all images
build:
	@echo "Building Docker images..."
	docker-compose build
	docker-compose -f docker-compose.prod.yml build

# Start containers (development)
up:
	docker-compose up -d

# Stop and remove containers
down:
	docker-compose down
	docker-compose -f docker-compose.prod.yml down

# Show logs
logs:
	docker-compose logs -f

# Clean everything
clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down -v --rmi all --remove-orphans
	docker-compose -f docker-compose.prod.yml down -v --rmi all --remove-orphans
	docker system prune -f
	@echo "Cleanup completed!"

# Restart containers
restart:
	docker-compose restart

# Seed database
seed:
	@echo "Seeding database..."
	docker-compose exec backend npm run seed

# Database backup
backup:
	@echo "Creating database backup..."
	docker-compose exec mongodb mongodump --out /data/backup --db house31-website

# Database restore
restore:
	@echo "Restoring database..."
	docker-compose exec mongodb mongorestore /data/backup

# View container status
status:
	docker-compose ps

# Enter backend container
backend-shell:
	docker-compose exec backend sh

# Enter frontend container
frontend-shell:
	docker-compose exec frontend sh

# Enter MongoDB container
mongo-shell:
	docker-compose exec mongodb mongosh house31-website
