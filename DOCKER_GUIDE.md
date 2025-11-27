# 🐳 Docker Deployment Guide

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Build & Run](#build--run)
- [Database Management](#database-management)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### 1. Clone and Setup
```bash
# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
# Important: Change NEXTAUTH_SECRET in production!
```

### 2. Build and Run
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Check status
docker-compose ps
```

### 3. Initialize Database
```bash
# Run Prisma migrations
docker-compose exec app npx prisma migrate deploy

# (Optional) Seed initial data
docker-compose exec app npx prisma db seed
```

### 4. Access Application
- **Application**: http://localhost:3000
- **Adminer (DB Manager)**: http://localhost:8080
- **Admin Login**: http://localhost:3000/admin/login

## ✅ Prerequisites

- **Docker**: v20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: v2.0+ ([Install Compose](https://docs.docker.com/compose/install/))
- **Disk Space**: ~2GB for images and volumes

## 🔧 Environment Setup

### Development (.env)
```env
# Database
DATABASE_URL="mysql://cms_user:cms_password_123@localhost:3307/nextjs_cms"
MYSQL_ROOT_PASSWORD=root_password_123
MYSQL_DATABASE=nextjs_cms
MYSQL_USER=cms_user
MYSQL_PASSWORD=cms_password_123
MYSQL_PORT=3307

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-min-32-characters

# App
APP_PORT=3000
NODE_ENV=development
```

### Production (.env.production)
```env
# Database - Use strong passwords!
DATABASE_URL="mysql://prod_user:STRONG_PASSWORD_HERE@db:3306/prod_cms"
MYSQL_ROOT_PASSWORD=STRONG_ROOT_PASSWORD
MYSQL_DATABASE=prod_cms
MYSQL_USER=prod_user
MYSQL_PASSWORD=STRONG_PASSWORD_HERE

# NextAuth - Generate secret with: openssl rand -base64 32
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=GENERATED_SECRET_HERE

# App
APP_PORT=3000
NODE_ENV=production
```

## 🏗️ Build & Run

### Development Mode
```bash
# Start all services
docker-compose up -d

# Rebuild if you made code changes
docker-compose up -d --build

# View real-time logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes database!)
docker-compose down -v
```

### Production Mode
```bash
# Use production environment file
docker-compose --env-file .env.production up -d --build

# Or set NODE_ENV
NODE_ENV=production docker-compose up -d --build
```

## 🗄️ Database Management

### Access MySQL
```bash
# Using Docker exec
docker-compose exec db mysql -u cms_user -p nextjs_cms

# Using Adminer Web UI
# Visit: http://localhost:8080
# Server: db
# Username: cms_user
# Password: (from .env)
# Database: nextjs_cms
```

### Backup Database
```bash
# Export database
docker-compose exec db mysqldump -u cms_user -p nextjs_cms > backup_$(date +%Y%m%d).sql

# Or using root
docker-compose exec db mysqldump -u root -p${MYSQL_ROOT_PASSWORD} nextjs_cms > backup.sql
```

### Restore Database
```bash
# Import database
docker-compose exec -T db mysql -u cms_user -p${MYSQL_PASSWORD} nextjs_cms < backup.sql
```

### Run Migrations
```bash
# Deploy migrations
docker-compose exec app npx prisma migrate deploy

# Generate Prisma Client
docker-compose exec app npx prisma generate

# View migration status
docker-compose exec app npx prisma migrate status
```

## 📦 Production Deployment

### 1. Server Setup
```bash
# Install Docker & Docker Compose on your server
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker
```

### 2. Deploy Application
```bash
# Clone repository
git clone <your-repo-url>
cd my-app

# Setup environment
cp .env.example .env.production
nano .env.production  # Edit with production values

# Build and start
docker-compose --env-file .env.production up -d --build

# Run migrations
docker-compose exec app npx prisma migrate deploy
```

### 3. Setup Reverse Proxy (Nginx)
```nginx
# /etc/nginx/sites-available/yourdomain.com
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Upload file size limit
    client_max_body_size 10M;
}
```

### 4. SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already set up by certbot)
sudo systemctl status certbot.timer
```

## 🔍 Troubleshooting

### Container Issues
```bash
# View container logs
docker-compose logs app
docker-compose logs db

# Restart specific service
docker-compose restart app

# Rebuild without cache
docker-compose build --no-cache app
docker-compose up -d app
```

### Database Connection Issues
```bash
# Check database health
docker-compose exec db mysqladmin ping -h localhost -u root -p

# Check connection from app
docker-compose exec app npx prisma db pull
```

### Port Conflicts
```bash
# If port 3000 or 3307 is already in use
# Edit .env:
APP_PORT=3001
MYSQL_PORT=3308

# Then restart
docker-compose down
docker-compose up -d
```

### Reset Everything
```bash
# ⚠️ WARNING: This deletes all data!
docker-compose down -v
docker-compose up -d --build
docker-compose exec app npx prisma migrate deploy
```

### Permission Issues with Uploads
```bash
# Fix upload directory permissions
chmod -R 755 public/uploads
chown -R 1001:1001 public/uploads

# Or from container
docker-compose exec app chown -R nextjs:nodejs /app/public/uploads
```

## 📊 Monitoring

### View Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df

# Cleanup unused resources
docker system prune -a
```

### Health Checks
```bash
# Check all services
docker-compose ps

# Test database health
docker-compose exec db mysqladmin ping -h localhost -u root -p

# Test app health
curl http://localhost:3000
```

## 🔐 Security Best Practices

1. **Change Default Passwords**: Always use strong passwords in production
2. **Secure NEXTAUTH_SECRET**: Generate with `openssl rand -base64 32`
3. **Use HTTPS**: Always use SSL in production
4. **Regular Updates**: Keep Docker images updated
5. **Backup Database**: Schedule regular backups
6. **Limit Database Access**: Don't expose MySQL port in production
7. **Use .env Files**: Never commit secrets to Git

## 📚 Useful Commands

```bash
# Shell into app container
docker-compose exec app sh

# Shell into database
docker-compose exec db mysql -u root -p

# View Next.js build logs
docker-compose logs app | grep "compiled"

# Update specific service
docker-compose up -d --no-deps --build app

# Export/Import volumes
docker run --rm -v nextjs-cms_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql_backup.tar.gz /data
```

## 🎯 Next Steps

1. Access http://localhost:3000/admin/login
2. Create your first admin user
3. Start adding content (Posts, Projects, etc.)
4. Configure settings in Admin Panel
5. Test all CRUD operations
6. Setup automated backups
7. Configure monitoring and alerts

## 🆘 Support

- **Issues**: Check logs with `docker-compose logs -f`
- **Database**: Use Adminer at http://localhost:8080
- **Reset**: `docker-compose down -v && docker-compose up -d`

---

**Built with**: Next.js 15 + MySQL + Docker 🚀
