# Docker Test Script for Next.js CMS (Windows PowerShell)

Write-Host "🐳 Starting Docker Test..." -ForegroundColor Cyan

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  .env not found. Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ Created .env file" -ForegroundColor Green
}

# Build and start containers
Write-Host "🔨 Building Docker images..." -ForegroundColor Yellow
docker-compose build

Write-Host "🚀 Starting containers..." -ForegroundColor Yellow
docker-compose up -d

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check database health
try {
    docker-compose exec -T db mysqladmin ping -h localhost -u root -proot_password_123 --silent
    Write-Host "✅ Database is healthy" -ForegroundColor Green
} catch {
    Write-Host "❌ Database is not healthy" -ForegroundColor Red
    exit 1
}

# Run migrations
Write-Host "🔄 Running database migrations..." -ForegroundColor Yellow
docker-compose exec -T app npx prisma migrate deploy

Write-Host "✅ Migrations complete" -ForegroundColor Green

# Check if app is running
Write-Host "🔍 Checking application health..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Application is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Application is not responding" -ForegroundColor Red
    Write-Host "📋 Checking logs..." -ForegroundColor Yellow
    docker-compose logs app
    exit 1
}

# Display status
Write-Host "`n🎉 Docker setup complete!`n" -ForegroundColor Green
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "  - Application: " -NoNewline; Write-Host "http://localhost:3000" -ForegroundColor Green
Write-Host "  - Admin Panel: " -NoNewline; Write-Host "http://localhost:3000/admin" -ForegroundColor Green
Write-Host "  - Adminer (DB): " -NoNewline; Write-Host "http://localhost:8080" -ForegroundColor Green

Write-Host "`nUseful commands:" -ForegroundColor Cyan
Write-Host "  - View logs: " -NoNewline; Write-Host "docker-compose logs -f" -ForegroundColor Yellow
Write-Host "  - Stop: " -NoNewline; Write-Host "docker-compose down" -ForegroundColor Yellow
Write-Host "  - Restart: " -NoNewline; Write-Host "docker-compose restart app" -ForegroundColor Yellow
