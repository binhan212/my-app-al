# 🚀 Hướng dẫn Deploy Next.js CMS lên Ubuntu 16.04

## 📋 Tổng quan dự án

**Công nghệ:**
- Next.js 16.0.4 (App Router)
- Node.js 20+ 
- MySQL 5.7+
- Prisma ORM
- NextAuth.js v5
- CKEditor 5

**Yêu cầu server:**
- Ubuntu 16.04.7 LTS
- RAM: Tối thiểu 2GB (khuyến nghị 4GB+)
- Disk: Tối thiểu 10GB
- CPU: 2 cores+

---

## 📦 BƯỚC 1: Cài đặt Node.js 20

Ubuntu 16.04 mặc định có Node.js cũ, cần cài NodeSource repository:

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Cài curl nếu chưa có
sudo apt-get install -y curl

# Thêm NodeSource repository cho Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Cài Node.js
sudo apt-get install -y nodejs

# Verify
node -v  # Should show v20.x.x
npm -v   # Should show 10.x.x
```

---

## 🗄️ BƯỚC 2: Cài đặt MySQL 5.7

```bash
# Cài MySQL Server
sudo apt-get install -y mysql-server mysql-client

# Secure MySQL installation
sudo mysql_secure_installation
# - Set root password
# - Remove anonymous users: Y
# - Disallow root login remotely: Y
# - Remove test database: Y
# - Reload privilege tables: Y

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Verify
sudo systemctl status mysql
```

### Tạo database và user:

```bash
# Login vào MySQL
sudo mysql -u root -p

# Trong MySQL prompt:
CREATE DATABASE demo123_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'demo123_user'@'localhost' IDENTIFIED BY 'demo123_password_strong_123';
GRANT ALL PRIVILEGES ON demo123_db.* TO 'demo123_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Test connection
mysql -u demo123_user -p demo123_db
# Nhập password: demo123_password_strong_123
# Nếu login thành công, gõ EXIT; để thoát
```

---

## 📂 BƯỚC 3: Tải source code lên server

### Cách 1: Dùng Git (khuyến nghị)

```bash
# Cài Git
sudo apt-get install -y git

# Clone repository
cd /var/www
sudo mkdir -p quyhoach-cms
sudo chown -R $USER:$USER quyhoach-cms
cd quyhoach-cms

# Clone từ repository của bạn
git clone https://github.com/binhan212/demo123.git .
# Hoặc nếu dùng private repo:
# git clone https://<token>@github.com/binhan212/demo123.git .

# Chuyển vào thư mục my-app
cd my-app
```

### Cách 2: Upload qua SCP/FTP

Từ máy local (Windows):

```powershell
# Nén project (bỏ node_modules, .next)
# Rồi dùng WinSCP hoặc FileZilla upload lên server vào thư mục:
# /var/www/quyhoach-cms/my-app
```

---

## ⚙️ BƯỚC 4: Cấu hình môi trường

```bash
cd /var/www/quyhoach-cms/my-app

# Tạo file .env
nano .env
```

Nội dung file `.env`:

```env
# Database
DATABASE_URL="mysql://demo123_user:demo123_password_strong_123@localhost:3306/demo123_db"

# NextAuth.js
NEXTAUTH_URL="http://your-domain.com"
NEXTAUTH_SECRET="production_secret_key_change_this_to_random_string_min_32_chars"

# Application
NODE_ENV="production"
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE="5242880"
```

**Lưu ý quan trọng:**
- Thay `your-domain.com` bằng domain/IP thực tế
- Generate NEXTAUTH_SECRET mới:
  ```bash
  openssl rand -base64 32
  ```

**Lưu file:** Ctrl+O, Enter, Ctrl+X

---

## 📥 BƯỚC 5: Cài đặt dependencies

```bash
cd /var/www/quyhoach-cms/my-app

# Cài packages
npm install

# Nếu gặp lỗi về sharp (image processing):
npm rebuild sharp
```

---

## 🗃️ BƯỚC 6: Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Kiểm tra database
mysql -u demo123_user -p demo123_db -e "SHOW TABLES;"
# Phải thấy các bảng: users, posts, categories, projects, slides, videos, feedback, settings, about...
```

### Tạo user admin đầu tiên:

```bash
# Chạy script seed hoặc tạo thủ công
mysql -u demo123_user -p demo123_db

# Trong MySQL:
INSERT INTO users (username, email, password_hash, full_name, role, status, created_at, updated_at)
VALUES (
  'admin',
  'admin@domain.com',
  '$2a$10$xQWKjZKf9Y7Z4ZqY4ZqY4.Z4ZqY4ZqY4ZqY4ZqY4ZqY4ZqY4ZqY4Z',
  'Administrator',
  'admin',
  'active',
  NOW(),
  NOW()
);
EXIT;
```

**Password mặc định:** `admin123` (hash trên là bcrypt của `admin123`)

---

## 🏗️ BƯỚC 7: Build production

```bash
cd /var/www/quyhoach-cms/my-app

# Build Next.js app
npm run build

# Kiểm tra build thành công
ls -la .next/
# Phải thấy thư mục .next/server, .next/static
```

---

## 🔧 BƯỚC 8: Setup PM2 (Process Manager)

PM2 giúp ứng dụng chạy liên tục, tự restart khi crash:

```bash
# Cài PM2 global
sudo npm install -g pm2

# Start ứng dụng
cd /var/www/quyhoach-cms/my-app
pm2 start npm --name "quyhoach-cms" -- start

# Kiểm tra status
pm2 status

# Xem logs
pm2 logs quyhoach-cms

# Setup PM2 tự khởi động khi server restart
pm2 startup
# Chạy lệnh nó suggest (bắt đầu bằng sudo)

# Save PM2 process list
pm2 save
```

**PM2 Commands hữu ích:**
```bash
pm2 restart quyhoach-cms  # Restart app
pm2 stop quyhoach-cms      # Stop app
pm2 delete quyhoach-cms    # Remove app
pm2 logs quyhoach-cms      # Xem logs real-time
pm2 monit                  # Monitor CPU/RAM
```

---

## 🌐 BƯỚC 9: Setup Nginx (Reverse Proxy)

```bash
# Cài Nginx
sudo apt-get install -y nginx

# Tạo config file
sudo nano /etc/nginx/sites-available/quyhoach-cms
```

Nội dung file config:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Logs
    access_log /var/log/nginx/quyhoach-cms-access.log;
    error_log /var/log/nginx/quyhoach-cms-error.log;

    # Max upload size (cho upload ảnh)
    client_max_body_size 10M;

    # Proxy to Next.js
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

    # Static files (uploads)
    location /uploads/ {
        alias /var/www/quyhoach-cms/my-app/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

**Thay `your-domain.com` bằng domain thực tế**

Enable site và restart Nginx:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/quyhoach-cms /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

## 🔒 BƯỚC 10: Setup SSL (Let's Encrypt) - Tùy chọn

**Chỉ làm nếu có domain:**

```bash
# Cài Certbot
sudo apt-get install -y software-properties-common
sudo add-apt-repository ppa:certbot/certbot -y
sudo apt-get update
sudo apt-get install -y python-certbot-nginx

# Tạo SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

Certbot sẽ tự động sửa file Nginx config để redirect HTTP → HTTPS.

---

## 🔥 BƯỚC 11: Setup Firewall (UFW)

```bash
# Enable firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

---

## ✅ BƯỚC 12: Kiểm tra deployment

### 1. Truy cập website:
```
http://your-domain.com
```

### 2. Test admin login:
```
http://your-domain.com/admin/login
Username: admin
Password: admin123
```

### 3. Kiểm tra logs:
```bash
# PM2 logs
pm2 logs quyhoach-cms

# Nginx logs
sudo tail -f /var/log/nginx/quyhoach-cms-error.log
sudo tail -f /var/log/nginx/quyhoach-cms-access.log
```

---

## 🔄 BƯỚC 13: Update code sau này

Khi có code mới:

```bash
cd /var/www/quyhoach-cms/my-app

# Pull code mới
git pull origin main

# Cài dependencies mới (nếu có)
npm install

# Rebuild
npm run build

# Restart PM2
pm2 restart quyhoach-cms

# Check logs
pm2 logs quyhoach-cms
```

---

## 🛠️ Troubleshooting

### Lỗi: "Cannot connect to database"
```bash
# Check MySQL running
sudo systemctl status mysql

# Check database exists
mysql -u demo123_user -p -e "SHOW DATABASES;"

# Check .env file
cat /var/www/quyhoach-cms/my-app/.env
```

### Lỗi: "Port 3000 already in use"
```bash
# Tìm process đang dùng port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Restart PM2
pm2 restart quyhoach-cms
```

### Lỗi: "Permission denied" khi upload file
```bash
# Fix permissions cho thư mục uploads
cd /var/www/quyhoach-cms/my-app
sudo chown -R $USER:www-data public/uploads
sudo chmod -R 775 public/uploads
```

### Lỗi: "502 Bad Gateway" từ Nginx
```bash
# Check PM2 app running
pm2 status

# Check logs
pm2 logs quyhoach-cms

# Restart app
pm2 restart quyhoach-cms

# Restart Nginx
sudo systemctl restart nginx
```

### Lỗi: Out of memory
```bash
# Check memory
free -h

# Tăng swap nếu cần
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 📊 Monitoring & Maintenance

### Kiểm tra disk space:
```bash
df -h
```

### Kiểm tra RAM usage:
```bash
free -h
pm2 monit
```

### Backup database định kỳ:
```bash
# Tạo script backup
sudo nano /root/backup-db.sh
```

Nội dung:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u demo123_user -pdemo123_password_strong_123 demo123_db > /root/backups/db_backup_$DATE.sql
# Giữ 7 ngày backup
find /root/backups -name "db_backup_*.sql" -mtime +7 -delete
```

Setup cron:
```bash
sudo mkdir -p /root/backups
sudo chmod +x /root/backup-db.sh
sudo crontab -e

# Thêm dòng: Backup mỗi ngày lúc 2h sáng
0 2 * * * /root/backup-db.sh
```

---

## 📝 Checklist Deploy

- [ ] Node.js 20 installed
- [ ] MySQL 5.7 installed & configured
- [ ] Database created
- [ ] User admin created
- [ ] Source code uploaded
- [ ] .env configured correctly
- [ ] npm install successful
- [ ] npm run build successful
- [ ] PM2 running app
- [ ] Nginx configured
- [ ] Firewall configured
- [ ] SSL certificate (nếu có domain)
- [ ] Website accessible
- [ ] Admin login working
- [ ] Upload files working
- [ ] Database backup setup

---

## 🎯 Default Credentials

**Admin Login:**
- URL: `http://your-domain.com/admin/login`
- Username: `admin`
- Password: `admin123`

**⚠️ ĐỔI PASSWORD NGAY SAU KHI LOGIN LẦN ĐẦU!**

---

## 📞 Support

Nếu gặp vấn đề, check:
1. PM2 logs: `pm2 logs quyhoach-cms`
2. Nginx error log: `sudo tail -f /var/log/nginx/quyhoach-cms-error.log`
3. MySQL log: `sudo tail -f /var/log/mysql/error.log`
4. Node.js version: `node -v` (phải >= 20)
5. Disk space: `df -h`
6. Memory: `free -h`

---

**🎉 Chúc mừng! Website CMS của bạn đã sẵn sàng!**
