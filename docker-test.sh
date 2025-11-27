#!/bin/bash

# Docker Test Script for Next.js CMS

set -e

echo "🐳 Starting Docker Test..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env not found. Copying from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
fi

# Build and start containers
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker-compose build

echo -e "${YELLOW}🚀 Starting containers...${NC}"
docker-compose up -d

# Wait for database to be ready
echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
sleep 10

# Check database health
if docker-compose exec -T db mysqladmin ping -h localhost -u root -proot_password_123 --silent; then
    echo -e "${GREEN}✅ Database is healthy${NC}"
else
    echo -e "${RED}❌ Database is not healthy${NC}"
    exit 1
fi

# Run migrations
echo -e "${YELLOW}🔄 Running database migrations...${NC}"
docker-compose exec -T app npx prisma migrate deploy

echo -e "${GREEN}✅ Migrations complete${NC}"

# Check if app is running
echo -e "${YELLOW}🔍 Checking application health...${NC}"
sleep 5

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is running${NC}"
else
    echo -e "${RED}❌ Application is not responding${NC}"
    echo -e "${YELLOW}📋 Checking logs...${NC}"
    docker-compose logs app
    exit 1
fi

# Display status
echo -e "\n${GREEN}🎉 Docker setup complete!${NC}\n"
echo -e "Services:"
echo -e "  - Application: ${GREEN}http://localhost:3000${NC}"
echo -e "  - Admin Panel: ${GREEN}http://localhost:3000/admin${NC}"
echo -e "  - Adminer (DB): ${GREEN}http://localhost:8080${NC}"
echo -e "\nUseful commands:"
echo -e "  - View logs: ${YELLOW}docker-compose logs -f${NC}"
echo -e "  - Stop: ${YELLOW}docker-compose down${NC}"
echo -e "  - Restart: ${YELLOW}docker-compose restart app${NC}"
