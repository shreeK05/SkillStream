# SkillStream Database Quick Start Script
# This script helps you start PostgreSQL and Redis using Docker

Write-Host "🚀 SkillStream Database Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking for Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Docker Desktop from:" -ForegroundColor Yellow
    Write-Host "https://www.docker.com/products/docker-desktop/" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if docker-compose.yml exists
if (-Not (Test-Path "docker-compose.yml")) {
    Write-Host "❌ docker-compose.yml not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Start Docker containers
Write-Host "Starting PostgreSQL and Redis containers..." -ForegroundColor Yellow
Write-Host ""

try {
    docker-compose up -d
    Write-Host ""
    Write-Host "✅ Databases started successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Wait a moment for containers to fully start
    Start-Sleep -Seconds 3
    
    # Check container status
    Write-Host "Container Status:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host ""
    Write-Host "📊 Database Information:" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "PostgreSQL:" -ForegroundColor Yellow
    Write-Host "  Host: localhost" -ForegroundColor White
    Write-Host "  Port: 5432" -ForegroundColor White
    Write-Host "  Database: skillstream_db" -ForegroundColor White
    Write-Host "  User: skillstream_user" -ForegroundColor White
    Write-Host "  Password: skillstream_pass" -ForegroundColor White
    Write-Host ""
    Write-Host "Redis:" -ForegroundColor Yellow
    Write-Host "  Host: localhost" -ForegroundColor White
    Write-Host "  Port: 6379" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "1. Start the backend:" -ForegroundColor White
    Write-Host "   cd backend" -ForegroundColor Gray
    Write-Host "   python main.py" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Check health:" -ForegroundColor White
    Write-Host "   http://localhost:8000/health" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. To stop databases:" -ForegroundColor White
    Write-Host "   docker-compose down" -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host "❌ Failed to start containers!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "- Docker Desktop is running" -ForegroundColor White
    Write-Host "- Ports 5432 and 6379 are not in use" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Read-Host "Press Enter to continue"
