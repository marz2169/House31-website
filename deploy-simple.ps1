# Simple Production Deployment Script
Write-Host "Starting House31 Production Deployment..." -ForegroundColor Green

# Check Docker
docker --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker not found. Please install Docker." -ForegroundColor Red
    exit 1
}

# Stop existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml --env-file .env.prod down

# Build and start production
Write-Host "Building and starting production containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# Wait for services
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check status
Write-Host "Checking container status..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml --env-file .env.prod ps

Write-Host "Production deployment completed!" -ForegroundColor Green
Write-Host "Frontend: http://localhost" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Health: http://localhost:5000/health" -ForegroundColor Cyan
