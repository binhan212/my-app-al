# 🐳 Docker Quick Start

## One-Command Setup

### Windows (PowerShell)
```powershell
.\docker-test.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x docker-test.sh
./docker-test.sh
```

## Manual Setup

### 1. Setup Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 2. Start Services
```bash
docker-compose up -d
```

### 3. Run Migrations
```bash
docker-compose exec app npx prisma migrate deploy
```

### 4. Access Application
- **App**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **DB Manager**: http://localhost:8080

## Common Commands

```bash
# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Restart app
docker-compose restart app

# Rebuild after code changes
docker-compose up -d --build

# Clean everything (⚠️ deletes data!)
docker-compose down -v
```

## Database Backup/Restore

```bash
# Backup
docker-compose exec db mysqldump -u cms_user -pcms_password_123 nextjs_cms > backup.sql

# Restore
docker-compose exec -T db mysql -u cms_user -pcms_password_123 nextjs_cms < backup.sql
```

## Troubleshooting

```bash
# Check container status
docker-compose ps

# View all logs
docker-compose logs

# Shell into app
docker-compose exec app sh

# Shell into database
docker-compose exec db mysql -u root -proot_password_123
```

---

📚 **Full Documentation**: See [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)
