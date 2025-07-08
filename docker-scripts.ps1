# House31 Website Docker Management Scripts for PowerShell
# Run these commands to manage your Docker containers on Windows

# Start development environment
function Start-Dev {
    Write-Host "Starting development environment..." -ForegroundColor Green
    docker-compose up -d
    Write-Host "Development environment started!" -ForegroundColor Green
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "MongoDB: localhost:27017" -ForegroundColor Cyan
}

# Start production environment
function Start-Prod {
    Write-Host "Starting production environment..." -ForegroundColor Green
    docker-compose -f docker-compose.prod.yml up -d
    Write-Host "Production environment started!" -ForegroundColor Green
}

# Build all Docker images
function Build-Images {
    Write-Host "Building Docker images..." -ForegroundColor Yellow
    docker-compose build
    docker-compose -f docker-compose.prod.yml build
    Write-Host "Build completed!" -ForegroundColor Green
}

# Stop containers
function Stop-Containers {
    Write-Host "Stopping containers..." -ForegroundColor Yellow
    docker-compose down
    docker-compose -f docker-compose.prod.yml down
}

# Show logs
function Show-Logs {
    docker-compose logs -f
}

# Clean up Docker resources
function Clean-Docker {
    Write-Host "Cleaning up Docker resources..." -ForegroundColor Red
    docker-compose down -v --rmi all --remove-orphans
    docker-compose -f docker-compose.prod.yml down -v --rmi all --remove-orphans
    docker system prune -f
    Write-Host "Cleanup completed!" -ForegroundColor Green
}

# Restart containers
function Restart-Containers {
    docker-compose restart
}

# Seed database
function Seed-Database {
    Write-Host "Seeding database..." -ForegroundColor Yellow
    docker-compose exec backend npm run seed
}

# Show container status
function Show-Status {
    docker-compose ps
}

# Export functions
Export-ModuleMember -Function Start-Dev, Start-Prod, Build-Images, Stop-Containers, Show-Logs, Clean-Docker, Restart-Containers, Seed-Database, Show-Status

# Display help
Write-Host "House31 Docker Management Commands:" -ForegroundColor Cyan
Write-Host "  Start-Dev           - Start development environment" -ForegroundColor White
Write-Host "  Start-Prod          - Start production environment" -ForegroundColor White
Write-Host "  Build-Images        - Build all Docker images" -ForegroundColor White
Write-Host "  Stop-Containers     - Stop all containers" -ForegroundColor White
Write-Host "  Show-Logs          - Show container logs" -ForegroundColor White
Write-Host "  Clean-Docker       - Remove all containers and images" -ForegroundColor White
Write-Host "  Restart-Containers - Restart all containers" -ForegroundColor White
Write-Host "  Seed-Database      - Seed database with sample data" -ForegroundColor White
Write-Host "  Show-Status        - Show container status" -ForegroundColor White
