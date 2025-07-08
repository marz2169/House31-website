# House31 Website - Production Deployment Script
# This script deploys the House31 website to production using Docker

Write-Host "🚀 Starting House31 Website Production Deployment..." -ForegroundColor Green

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

# Check if production environment file exists
if (-not (Test-Path ".env.prod")) {
    Write-Host "❌ Production environment file (.env.prod) not found!" -ForegroundColor Red
    Write-Host "Please ensure .env.prod exists with production configuration." -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Checking current containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml ps

# Stop any existing production containers
Write-Host "🛑 Stopping existing production containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml down

# Remove old images to ensure fresh build
Write-Host "🗑️ Removing old images..." -ForegroundColor Yellow
docker image prune -f

# Build production images
Write-Host "🔨 Building production images..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml build --no-cache

# Start production services
Write-Host "🚀 Starting production services..." -ForegroundColor Green
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check service health
Write-Host "🏥 Checking service health..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml ps

# Test backend health
Write-Host "🔍 Testing backend health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend health check passed" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Backend health check returned: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Backend health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test frontend
Write-Host "🔍 Testing frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend is accessible" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Frontend returned: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Frontend test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Show deployment summary
Write-Host "`n🎉 Production Deployment Complete!" -ForegroundColor Green
Write-Host "📊 Services Summary:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   Health:   http://localhost:5000/health" -ForegroundColor White
Write-Host "   API:      http://localhost:5000/api" -ForegroundColor White

Write-Host "`n📈 Monitoring Commands:" -ForegroundColor Cyan
Write-Host "   View logs:    docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor White
Write-Host "   Check status: docker-compose -f docker-compose.prod.yml ps" -ForegroundColor White
Write-Host "   Stop all:     docker-compose -f docker-compose.prod.yml down" -ForegroundColor White

Write-Host "`n🔧 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Set up SSL certificates for HTTPS" -ForegroundColor White
Write-Host "   2. Configure domain name and DNS" -ForegroundColor White
Write-Host "   3. Set up monitoring and alerting" -ForegroundColor White
Write-Host "   4. Configure backup strategy" -ForegroundColor White
