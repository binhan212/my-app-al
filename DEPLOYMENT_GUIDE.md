# 🚀 Hướng dẫn Deploy Next.js CMS lên Ubuntu 16.04 với Docker

## 📋 Tổng quan dự án

**Công nghệ:**
- Next.js 16.0.4 (App Router)
- Node.js 20 (trong Docker container)
- MySQL 8.0 (trong Docker container)
- Prisma ORM
- NextAuth.js v5
- CKEditor 5
- Docker & Docker Compose

**Yêu cầu server:**
- Ubuntu 16.04.7 LTS
- RAM: Tối thiểu 2GB (khuyến nghị 4GB+)
- Disk: Tối thiểu 20GB
- CPU: 2 cores+
- Docker 20.10+
- Docker Compose 1.29+

**Ưu điểm dùng Docker:**
- ✅ Không cần cài Node.js, MySQL thủ công
- ✅ Dễ dàng scale và backup
- ✅ Môi trường nhất quán (dev = production)
- ✅ Dễ rollback khi có vấn đề
- ✅ Quản lý dependencies tốt hơn

---

## 📦 BƯỚC 1: Cài đặt Docker & Docker Compose

### 1.1. Update hệ thống

```bash
# Update package list
sudo apt-get update
sudo apt-get upgrade -y

# Cài các packages cần thiết
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common
```

### 1.2. Cài Docker

```bash
# Thêm Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Verify fingerprint
sudo apt-key fingerprint 0EBFCD88

# Add Docker repository
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

# Update package index
sudo apt-get update

# Cài Docker CE (Community Edition)
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Verify Docker installation
sudo docker --version
sudo docker run hello-world
```

### 1.3. Cài Docker Compose

```bash
# Download Docker Compose binary
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
# Should show: docker-compose version 1.29.2
```

### 1.4. Thêm user vào Docker group (không cần sudo)

```bash
# Add current user to docker group
sudo usermod -aG docker $USER

# Apply changes (logout/login hoặc chạy)
newgrp docker

# Test without sudo
docker ps
# Should work without permission error
```

---

## 📂 BƯỚC 2: Tải source code lên server

### Cách 1: Dùng Git (khuyến nghị)

```bash
# Cài Git nếu chưa có
sudo apt-get install -y git

# Tạo thư mục cho project
sudo mkdir -p /var/www/phuongaulau
sudo chown -R $USER:$USER /var/www/phuongaulau
cd /var/www/phuongaulau

# Clone repository
git clone https://github.com/binhan212/my-app-al.git .
# Hoặc nếu dùng private repo với token:
# git clone https://<your-token>@github.com/binhan212/my-app-al.git .
```

### Cách 2: Upload qua SCP/FTP

Từ máy local (Windows):

```powershell
# Nén project (bỏ node_modules, .next, .git)
# Dùng WinSCP hoặc FileZilla upload lên server vào thư mục:
# /var/www/phuongaulau
```

---

## ⚙️ BƯỚC 3: Cấu hình môi trường

```bash
cd /var/www/phuongaulau

# Tạo file .env cho production
nano .env
```

Nội dung file `.env`:

```env
# MySQL Configuration
MYSQL_ROOT_PASSWORD=ThaiBinhAn2001VnptLaoCai
MYSQL_DATABASE=demo123_db
MYSQL_USER=demo123_user
MYSQL_PASSWORD=ThaiBinhAn2001VnptLaoCai
MYSQL_PORT=3307

# NextAuth.js
NEXTAUTH_URL=http://113.160.153.13
NEXTAUTH_SECRET=KhongCoGiQuyHonDocLapTuDoToQuocThaHiSinhTatCaChuNhatDinhKhongChiuMatNuocNhatDinhKhongChiuLamNoLe

# Application
NODE_ENV=production
APP_PORT=3000

# Adminer (Database Management Tool)
ADMINER_PORT=8080
```

**Lưu ý quan trọng:**

1. **Đổi tất cả passwords:**
   ```bash
   # Generate secure password
   openssl rand -base64 24
   
   # Generate NEXTAUTH_SECRET
   openssl rand -base64 32
   ```

2. **Thay domain:**
   - `your-domain.com` → domain/IP thực tế của bạn
   - Nếu dùng IP: `NEXTAUTH_URL=http://123.45.67.89`

3. **Port mapping:**
   - `MYSQL_PORT=3307` (để tránh conflict nếu server có MySQL cũ)
   - `APP_PORT=3000` (Next.js app)
   - `ADMINER_PORT=8080` (Database UI)

**Lưu file:** Ctrl+O, Enter, Ctrl+X

---

## 🏗️ BƯỚC 4: Build và Deploy với Docker

### 4.1. Build Docker images

```bash
cd /var/www/phuongaulau

# Build images (lần đầu sẽ mất 5-10 phút)
docker-compose build

# Check images đã build
docker images | grep nextjs-cms
```

### 4.2. Start containers

```bash
# Start tất cả services
docker-compose up -d

# Check containers running
docker-compose ps

# Phải thấy 3 containers:
# - nextjs-cms-db (MySQL)
# - nextjs-cms-app (Next.js)
# - nextjs-cms-adminer (Database UI)
```

### 4.3. Kiểm tra logs

```bash
# Xem logs tất cả services
docker-compose logs -f

# Xem logs riêng từng service
docker-compose logs -f app
docker-compose logs -f db
docker-compose logs -f adminer

# Nhấn Ctrl+C để thoát
```

### 4.4. Verify deployment

```bash
# Check MySQL container
docker exec -it nextjs-cms-db mysql -u demo123_user -pdemo123_password_strong_123 demo123_db -e "SHOW TABLES;"

# Phải thấy các bảng: users, posts, categories, projects, slides, videos, feedback, settings, about...
```

---

## 🗃️ BƯỚC 5: Setup Database

### 5.1. Prisma migrations đã tự động chạy

Docker Compose đã config tự động chạy:
```bash
npx prisma migrate deploy
```

Nếu cần chạy lại thủ công:

```bash
docker-compose exec app npx prisma migrate deploy
```

### 5.2. Tạo user admin đầu tiên

**Cách 1: Dùng Adminer UI** (Dễ nhất)

1. Truy cập: `http://your-server-ip:8080`
2. Login:
   - System: `MySQL`
   - Server: `db`
   - Username: `demo123_user`
   - Password: `demo123_password_strong_123`
   - Database: `demo123_db`
3. Click table `users` → `Insert`
4. Điền thông tin:
   ```
   username: admin
   email: admin@domain.com
   password_hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
   full_name: Administrator
   role: admin
   status: active
   ```
5. Click `Save`

**Password hash trên là của:** `admin123`

**Cách 2: MySQL CLI**

```bash
docker exec -it nextjs-cms-db mysql -u demo123_user -pdemo123_password_strong_123 demo123_db

# Trong MySQL prompt:
INSERT INTO users (username, email, password_hash, full_name, role, status, created_at, updated_at)
VALUES (
  'admin',
  'admin@domain.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Administrator',
  'admin',
  'active',
  NOW(),
  NOW()
);
EXIT;
```

---

## 🌐 BƯỚC 6: Setup Nginx Reverse Proxy

Docker containers chạy trên localhost, cần Nginx để expose ra ngoài:

```bash
# Cài Nginx
sudo apt-get install -y nginx

# Tạo config file
sudo nano /etc/nginx/sites-available/phuongaulau
```

Nội dung file config:

```nginx
# Redirect HTTP to HTTPS (uncomment sau khi có SSL)
# server {
#     listen 80;
#     server_name your-domain.com www.your-domain.com;
#     return 301 https://$host$request_uri;
# }

server {
    listen 80;
    # listen 443 ssl http2; # Uncomment sau khi có SSL
    
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (Uncomment sau khi có SSL)
    # ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    # ssl_protocols TLSv1.2 TLSv1.3;
    # ssl_ciphers HIGH:!aNULL:!MD5;

    # Logs
    access_log /var/log/nginx/phuongaulau-access.log;
    error_log /var/log/nginx/phuongaulau-error.log;

    # Max upload size
    client_max_body_size 10M;

    # Proxy to Next.js Docker container
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files từ Docker volume
    location /uploads/ {
        alias /var/www/phuongaulau/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

# Adminer Database Management (Optional - chỉ allow internal IP)
server {
    listen 8080;
    server_name localhost;
    
    # Chỉ allow truy cập từ localhost
    allow 127.0.0.1;
    deny all;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Thay `your-domain.com` bằng domain thực tế**

Enable site và restart Nginx:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/phuongaulau /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

## 🔒 BƯỚC 7: Setup SSL (Let's Encrypt) - Tùy chọn

**Chỉ làm nếu có domain:**

```bash
# Cài Certbot
sudo apt-get install -y software-properties-common
sudo add-apt-repository ppa:certbot/certbot -y
sudo apt-get update
sudo apt-get install -y python-certbot-nginx

# Tạo SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Certbot sẽ tự động sửa Nginx config

# Test auto-renewal
sudo certbot renew --dry-run

# Setup cron job để auto-renew
sudo crontab -e
# Thêm dòng:
0 3 * * * /usr/bin/certbot renew --quiet
```

Sau khi có SSL, uncomment các dòng SSL trong Nginx config ở Bước 6.

---

## 🔥 BƯỚC 8: Setup Firewall (UFW)

```bash
# Enable firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status

# Output phải có:
# 22/tcp (OpenSSH)
# 80/tcp (Nginx HTTP)
# 443/tcp (Nginx HTTPS)
```

---

## ✅ BƯỚC 9: Kiểm tra deployment

### 1. Truy cập website:
```
http://113.160.153.13
```

### 2. Test admin login:
```
http://113.160.153.13/admin/login
Username: admin
Password: admin123
```

### 3. Kiểm tra Docker containers:
```bash
# List containers
docker-compose ps

# Check health
docker-compose exec app node -v  # Should show v20.x.x
docker-compose exec db mysql --version  # Should show MySQL 8.0

# Check disk usage
docker system df
```

### 4. Kiểm tra logs:
```bash
# Docker logs
docker-compose logs -f app
docker-compose logs -f db

# Nginx logs
sudo tail -f /var/log/nginx/phuongaulau-error.log
sudo tail -f /var/log/nginx/phuongaulau-access.log
```

### 5. Test upload files:
- Login admin
- Vào Settings → Upload logo
- Check file được lưu: `/var/www/phuongaulau/public/uploads/`

---

## 🔄 BƯỚC 10: Update code sau này

Khi có code mới:

```bash
cd /var/www/phuongaulau

# Pull code mới
git pull origin master

# Rebuild và restart containers
docker-compose down
docker-compose build --no-cache app
docker-compose up -d

# Check logs
docker-compose logs -f app
```

**Lưu ý:** Nếu có thay đổi database schema:
```bash
docker-compose exec app npx prisma migrate deploy
```

---

## 🛠️ Docker Commands Hữu Ích

### Container Management
```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# Restart single service
docker-compose restart app

# View logs
docker-compose logs -f
docker-compose logs -f app
docker-compose logs -f db

# Execute command in container
docker-compose exec app sh
docker-compose exec db mysql -u root -p

# Check resource usage
docker stats
```

### Database Management
```bash
# Backup database
docker-compose exec db mysqldump -u demo123_user -pdemo123_password_strong_123 demo123_db > backup_$(date +%Y%m%d).sql

# Restore database
docker-compose exec -T db mysql -u demo123_user -pdemo123_password_strong_123 demo123_db < backup_20250127.sql

# Access MySQL shell
docker-compose exec db mysql -u demo123_user -pdemo123_password_strong_123 demo123_db
```

### Cleanup
```bash
# Remove stopped containers
docker-compose rm

# Remove unused images
docker image prune -a

# Remove unused volumes (⚠️ CẨN THẬN - sẽ xóa data)
docker volume prune

# Full cleanup
docker system prune -a --volumes
```

---

## 🛠️ Troubleshooting

### Lỗi: "Cannot connect to database"
```bash
# Check MySQL container running
docker-compose ps db

# Check MySQL logs
docker-compose logs db

# Restart database
docker-compose restart db

# Check connection từ app container
docker-compose exec app sh
# Trong container:
nc -zv db 3306
exit
```

### Lỗi: "Port already in use"
```bash
# Tìm process đang dùng port
sudo lsof -i :3000
sudo lsof -i :3307
sudo lsof -i :8080

# Kill process
sudo kill -9 <PID>

# Hoặc đổi port trong .env file
nano .env
# Sửa APP_PORT, MYSQL_PORT, ADMINER_PORT
docker-compose down
docker-compose up -d
```

### Lỗi: "Permission denied" khi upload file
```bash
# Fix permissions cho thư mục uploads
cd /var/www/phuongaulau
sudo chown -R $USER:www-data public/uploads
sudo chmod -R 775 public/uploads

# Restart container
docker-compose restart app
```

### Lỗi: "502 Bad Gateway" từ Nginx
```bash
# Check app container running
docker-compose ps app

# Check app logs
docker-compose logs app

# Restart app
docker-compose restart app

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx config
sudo nginx -t
```

### Lỗi: Build failed
```bash
# Clean build
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

### Lỗi: Out of memory
```bash
# Check Docker memory
docker stats

# Tăng swap
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify
free -h
```

### Lỗi: Container keeps restarting
```bash
# Check logs
docker-compose logs app

# Common issues:
# 1. Database not ready → Wait or check db logs
# 2. Environment variable missing → Check .env file
# 3. Port conflict → Change ports in .env

# Debug mode
docker-compose up app  # Without -d to see real-time output
```

---

## 📊 Monitoring & Maintenance

### 1. Auto-backup Database (Daily)

```bash
# Tạo script backup
sudo nano /root/backup-docker-db.sh
```

Nội dung:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups/db"
mkdir -p $BACKUP_DIR

cd /var/www/phuongaulau

# Backup database
docker-compose exec -T db mysqldump -u demo123_user -pdemo123_password_strong_123 demo123_db > $BACKUP_DIR/db_backup_$DATE.sql

# Compress
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Giữ 7 ngày backup
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
```

Setup cron:
```bash
sudo chmod +x /root/backup-docker-db.sh
sudo crontab -e

# Thêm dòng: Backup mỗi ngày lúc 2h sáng
0 2 * * * /root/backup-docker-db.sh >> /var/log/db-backup.log 2>&1
```

### 2. Auto-backup Uploads Folder

```bash
# Tạo script
sudo nano /root/backup-uploads.sh
```

Nội dung:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups/uploads"
mkdir -p $BACKUP_DIR

tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C /var/www/phuongaulau/public uploads

# Giữ 7 ngày
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +7 -delete

echo "Uploads backup completed: uploads_$DATE.tar.gz"
```

Setup cron:
```bash
sudo chmod +x /root/backup-uploads.sh
sudo crontab -e

# Thêm dòng: Backup uploads mỗi ngày lúc 3h sáng
0 3 * * * /root/backup-uploads.sh >> /var/log/uploads-backup.log 2>&1
```

### 3. Monitor Docker Resources

```bash
# Real-time monitoring
docker stats

# Check disk usage
docker system df

# Check specific container
docker stats nextjs-cms-app
```

### 4. Log Rotation

Docker logs có thể lớn rất nhanh. Config log rotation:

```bash
sudo nano /etc/docker/daemon.json
```

Nội dung:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart Docker:
```bash
sudo systemctl restart docker
docker-compose up -d
```

### 5. Health Check Script

```bash
sudo nano /root/check-health.sh
```

Nội dung:
```bash
#!/bin/bash
cd /var/www/phuongaulau

# Check if containers are running
if ! docker-compose ps | grep -q "Up"; then
    echo "⚠️ Some containers are down!"
    docker-compose ps
    docker-compose up -d
fi

# Check website response
if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "⚠️ Website not responding!"
    docker-compose restart app
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠️ Disk usage is $DISK_USAGE%"
fi
```

Setup cron:
```bash
sudo chmod +x /root/check-health.sh
sudo crontab -e

# Check every 5 minutes
*/5 * * * * /root/check-health.sh >> /var/log/health-check.log 2>&1
```

---

## 📝 Checklist Deploy

- [ ] Docker installed (version >= 20.10)
- [ ] Docker Compose installed (version >= 1.29)
- [ ] User added to docker group
- [ ] Source code uploaded/cloned
- [ ] .env file configured
- [ ] Secure passwords set
- [ ] Docker images built
- [ ] Containers running (app, db, adminer)
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] Nginx installed & configured
- [ ] Firewall configured (UFW)
- [ ] SSL certificate (nếu có domain)
- [ ] Website accessible
- [ ] Admin login working
- [ ] Upload files working
- [ ] Database backup script setup
- [ ] Uploads backup script setup
- [ ] Health check script setup
- [ ] Log rotation configured

---

## 🎯 Default Credentials

**Admin Login:**
- URL: `http://113.160.153.13/admin/login`
- Username: `admin`
- Password: `admin123`

**Adminer (Database UI):**
- URL: `http://your-server-ip:8080`
- System: `MySQL`
- Server: `db`
- Username: `demo123_user`
- Password: `demo123_password_strong_123`
- Database: `demo123_db`

**⚠️ ĐỔI TẤT CẢ PASSWORDS SAU KHI DEPLOY!**

---

## 🔐 Security Checklist

Sau khi deploy, làm các bước này:

1. **Đổi password admin:**
   - Login admin
   - Vào User Management
   - Đổi password

2. **Đổi database passwords:**
   ```bash
   nano .env
   # Đổi MYSQL_ROOT_PASSWORD, MYSQL_PASSWORD
   docker-compose down
   docker-compose up -d
   ```

3. **Generate NEXTAUTH_SECRET mới:**
   ```bash
   openssl rand -base64 32
   nano .env
   # Update NEXTAUTH_SECRET
   docker-compose restart app
   ```

4. **Disable Adminer trên production** (hoặc protect bằng password):
   ```bash
   nano docker-compose.yml
   # Comment out service adminer
   docker-compose down
   docker-compose up -d
   ```

5. **Setup fail2ban** (protect SSH):
   ```bash
   sudo apt-get install -y fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

6. **Update system regularly:**
   ```bash
   sudo apt-get update
   sudo apt-get upgrade -y
   ```

---

## 📞 Support & Debug

### Check System Status
```bash
# Docker service
sudo systemctl status docker

# Nginx service
sudo systemctl status nginx

# Containers
docker-compose ps

# Disk space
df -h

# Memory
free -h

# Docker disk usage
docker system df
```

### Common Issues

1. **Website slow?**
   - Check: `docker stats`
   - Increase RAM/Swap
   - Optimize images size

2. **Database slow?**
   - Check: `docker-compose logs db`
   - Add indexes to Prisma schema
   - Increase MySQL memory

3. **Upload fails?**
   - Check: `docker-compose logs app`
   - Verify uploads folder permissions
   - Check `client_max_body_size` in Nginx

4. **Container crashes?**
   - Check: `docker-compose logs app`
   - Verify .env variables
   - Check memory usage

---

## 📚 Tài liệu tham khảo

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**🎉 Chúc mừng! Website CMS của bạn đã chạy trên Docker!**

**Ưu điểm của setup này:**
- ✅ Dễ scale: Chỉ cần `docker-compose scale app=3`
- ✅ Dễ backup: Database + uploads có script tự động
- ✅ Dễ rollback: `git checkout <commit>` + rebuild
- ✅ Isolated: Không ảnh hưởng hệ thống
- ✅ Portable: Copy sang server khác chỉ cần Docker
