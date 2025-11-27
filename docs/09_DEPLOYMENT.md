# 🚀 DEPLOYMENT - TRIỂN KHAI DỰ ÁN

> **Mục tiêu**: Hướng dẫn setup môi trường development và deploy production cho dự án Next.js + MySQL + Prisma

---

## 📋 Mục Lục

1. [Local Development Setup](#1-local-development-setup)
2. [Database Setup](#2-database-setup)
3. [Environment Variables](#3-environment-variables)
4. [Prisma Migrations](#4-prisma-migrations)
5. [Production Deployment](#5-production-deployment)
6. [Common Issues](#6-common-issues)

---

## 1. Local Development Setup

### 📦 Yêu Cầu Hệ Thống

Trước khi bắt đầu, đảm bảo máy tính đã cài đặt:

```bash
# Node.js (phiên bản 18.x trở lên)
node --version
# v18.17.0 hoặc cao hơn

# npm (đi kèm với Node.js)
npm --version
# 9.x.x hoặc cao hơn

# Git
git --version
# git version 2.x.x
```

**Cài đặt Node.js:**
- **Windows/Mac**: Download từ [https://nodejs.org](https://nodejs.org) (chọn bản LTS)
- **Linux**: 
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

### 📥 Clone Project

```bash
# Clone repository
git clone https://github.com/binhan212/my-app-al.git
cd my-app-al

# Hoặc nếu đã có project
cd my-app-al
git pull origin master
```

### 📦 Install Dependencies

```bash
# Install tất cả packages
npm install

# Kiểm tra kết quả
ls node_modules/
# Sẽ thấy hàng trăm folders (react, next, prisma, etc.)
```

**Packages chính được cài:**
- `next@16.0.4` - Framework Next.js
- `react@19.0.0`, `react-dom@19.0.0` - React library
- `@prisma/client@5.22.0` - Prisma ORM client
- `next-auth@5.0.0-beta.30` - Authentication
- `zod@3.24.1` - Validation
- `tailwindcss@3.4.17` - CSS framework

### 🔧 Development Server

Sau khi cài dependencies và setup database (bước 2), chạy:

```bash
# Chạy development server
npm run dev

# Output:
# ▲ Next.js 16.0.4
# - Local:        http://localhost:3000
# - Environments: .env
# ✓ Ready in 2.3s
```

Mở trình duyệt: **http://localhost:3000**

**Commands khác:**

```bash
# Build production
npm run build

# Start production server (sau khi build)
npm start

# Lint code
npm run lint

# Format code (nếu có prettier)
npm run format
```

---

## 2. Database Setup

### 🎯 Tổng Quan

Dự án sử dụng **MySQL 8.0** làm database. Có 3 cách setup:

1. **Local MySQL** (Cài trực tiếp trên máy)
2. **Docker MySQL** (Nhanh, không ảnh hưởng máy)
3. **Cloud Database** (PlanetScale, Railway, Aiven)

### Option 1: Local MySQL Installation

#### Windows

**Bước 1: Download MySQL**
- Tải từ: [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
- Chọn: **MySQL Installer for Windows** (khoảng 300MB)

**Bước 2: Cài đặt**
```
1. Chạy installer
2. Chọn "Developer Default" hoặc "Server only"
3. Next → Execute → Next
4. Configuration:
   - Port: 3306 (default)
   - Root password: root123 (hoặc password tùy chọn)
5. Execute → Finish
```

**Bước 3: Tạo Database**
```bash
# Mở MySQL Command Line Client (hoặc MySQL Workbench)
# Nhập password root

CREATE DATABASE demo123_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'demo123_user'@'localhost' IDENTIFIED BY 'demo123_pass';

GRANT ALL PRIVILEGES ON demo123_db.* TO 'demo123_user'@'localhost';

FLUSH PRIVILEGES;

# Kiểm tra
SHOW DATABASES;
# +--------------------+
# | Database           |
# +--------------------+
# | demo123_db         |
# +--------------------+

USE demo123_db;
SHOW TABLES;
# Empty set (chưa có tables)
```

#### macOS

```bash
# Cài MySQL qua Homebrew
brew install mysql@8.0

# Start MySQL service
brew services start mysql@8.0

# Secure installation (set root password)
mysql_secure_installation
# Root password: root123

# Login và tạo database
mysql -u root -p

# Chạy các lệnh CREATE DATABASE, CREATE USER như trên
```

#### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install MySQL Server
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation
# Root password: root123

# Login và tạo database
sudo mysql -u root -p

# Chạy các lệnh CREATE DATABASE, CREATE USER như trên
```

### Option 2: Docker MySQL (Recommended)

**Ưu điểm:**
- ✅ Không cần cài MySQL lên máy
- ✅ Dễ dàng xóa/tạo lại
- ✅ Isolate môi trường dev

**Yêu cầu:**
- Docker Desktop đã cài đặt ([https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop))

**Cách sử dụng:**

```bash
# Chạy MySQL container
docker run -d \
  --name mysql-dev \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=demo123_db \
  -e MYSQL_USER=demo123_user \
  -e MYSQL_PASSWORD=demo123_pass \
  -p 3306:3306 \
  mysql:8.0

# Giải thích:
# -d: Chạy background
# --name mysql-dev: Tên container
# -e: Set environment variables
# -p 3306:3306: Map port 3306 (container) → 3306 (host)

# Đợi 15-20 giây để MySQL khởi động
sleep 15

# Kiểm tra container
docker ps
# CONTAINER ID   IMAGE       STATUS         PORTS                    NAMES
# abc123def456   mysql:8.0   Up 2 minutes   0.0.0.0:3306->3306/tcp   mysql-dev

# Test connection
docker exec -it mysql-dev mysql -u demo123_user -pdemo123_pass demo123_db
# mysql> (nếu thấy prompt này là thành công)
# mysql> exit
```

**Commands quản lý Docker MySQL:**

```bash
# Stop container
docker stop mysql-dev

# Start lại container
docker start mysql-dev

# Xem logs
docker logs mysql-dev

# Xóa container (mất data!)
docker rm -f mysql-dev

# Vào MySQL shell
docker exec -it mysql-dev mysql -u root -proot123
```

### Option 3: Cloud Database

#### PlanetScale (Free Tier)

**Ưu điểm:**
- ✅ Free 5GB storage
- ✅ Không cần cài gì
- ✅ Tự động backup

**Cách setup:**

1. Đăng ký tại [https://planetscale.com](https://planetscale.com)
2. Tạo database mới: `demo123-db`
3. Lấy connection string:
   ```
   mysql://username:password@aws.connect.psdb.cloud/demo123-db?sslaccept=strict
   ```
4. Copy vào `.env` (bước 3)

#### Railway (Free Tier)

1. Đăng ký tại [https://railway.app](https://railway.app)
2. New Project → Add MySQL
3. Copy `DATABASE_URL` từ Variables tab
4. Paste vào `.env`

#### Aiven (Free Tier)

1. Đăng ký tại [https://aiven.io](https://aiven.io)
2. Create Service → MySQL
3. Copy Service URI
4. Paste vào `.env`

---

## 3. Environment Variables

### 📄 Tạo File `.env`

Tạo file `.env` ở **root folder** (cùng cấp `package.json`):

```bash
# Tạo file
touch .env   # macOS/Linux
# hoặc
New-Item .env   # Windows PowerShell
```

### 🔑 Nội Dung `.env`

```env
# ============================================
# DATABASE
# ============================================
# Local MySQL
DATABASE_URL="mysql://demo123_user:demo123_pass@localhost:3306/demo123_db"

# Hoặc Docker MySQL (giống local)
# DATABASE_URL="mysql://demo123_user:demo123_pass@localhost:3306/demo123_db"

# Hoặc Cloud Database (PlanetScale/Railway/Aiven)
# DATABASE_URL="mysql://username:password@host:3306/database"

# ============================================
# NEXTAUTH
# ============================================
NEXTAUTH_URL="http://localhost:3000"

# Generate secret: openssl rand -base64 32
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production-min-32-chars"

# ============================================
# ENVIRONMENT
# ============================================
NODE_ENV="development"

# ============================================
# OPTIONAL: File Upload Limits
# ============================================
MAX_FILE_SIZE=10485760
# 10MB = 10 * 1024 * 1024 bytes
```

### 🔐 Generate NEXTAUTH_SECRET

**Option 1: OpenSSL (Linux/Mac)**
```bash
openssl rand -base64 32
# Output: Kj2h3k4j5h6k7j8h9k0j1k2j3k4j5h6k7j8h9k0=
```

**Option 2: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online Generator**
- [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

### ⚠️ Lưu Ý Quan Trọng

```bash
# .env KHÔNG được commit lên Git
# Kiểm tra .gitignore có dòng này:
cat .gitignore | grep .env
# .env
# .env.local
# .env*.local
```

### 📋 `.env` vs `.env.example`

**`.env`**: Chứa thông tin thật (passwords, secrets) → **KHÔNG commit**

**`.env.example`**: Template mẫu (không có giá trị thật) → **Commit được**

```env
# .env.example
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
NODE_ENV="development"
```

---

## 4. Prisma Migrations

### 🎯 Prisma Workflow

```
schema.prisma (định nghĩa models)
      ↓
   Migration (tạo SQL scripts)
      ↓
   Database (apply vào MySQL)
```

### 📊 Database Schema Overview

File `prisma/schema.prisma` định nghĩa cấu trúc database:

```prisma
// Ví dụ 1 model
model Post {
  id           Int       @id @default(autoincrement())
  title        String    @db.VarChar(255)
  content      String    @db.LongText
  slug         String    @unique @db.VarChar(255)
  author_id    Int
  category_id  Int?
  status       PostStatus @default(draft)
  created_at   DateTime  @default(now())
  updated_at   DateTime  @updatedAt
  
  author       User      @relation(fields: [author_id], references: [id])
  category     Category? @relation(fields: [category_id], references: [id])
}
```

**Tổng cộng có 9 models:**
- `User` - Người dùng/admin
- `Post` - Bài viết tin tức
- `Category` - Danh mục
- `Project` - Dự án
- `Video` - Video YouTube
- `Slide` - Ảnh carousel
- `Feedback` - Phản hồi liên hệ
- `Settings` - Cấu hình hệ thống
- `Media` - File upload

### 🚀 Push Schema (Development)

**Cách nhanh nhất** để sync schema vào database trong development:

```bash
# Push schema vào database
npx prisma db push

# Output:
# Environment variables loaded from .env
# Prisma schema loaded from prisma/schema.prisma
# Datasource "db": MySQL database "demo123_db" at "localhost:3306"
# 
# 🚀 Your database is now in sync with your Prisma schema. Done in 1.2s
```

**Khi nào dùng `db push`:**
- ✅ Đang develop, thử nghiệm schema
- ✅ Chưa deploy production
- ✅ Muốn sync nhanh không cần migration files

**Kiểm tra tables đã tạo:**

```bash
# Vào MySQL
mysql -u demo123_user -pdemo123_pass demo123_db

# Hoặc qua Docker
docker exec -it mysql-dev mysql -u demo123_user -pdemo123_pass demo123_db

# Xem tables
SHOW TABLES;
# +----------------------+
# | Tables_in_demo123_db |
# +----------------------+
# | categories           |
# | feedback             |
# | media                |
# | posts                |
# | projects             |
# | settings             |
# | slides               |
# | users                |
# | videos               |
# +----------------------+

# Xem cấu trúc 1 table
DESCRIBE posts;
```

### 📁 Migration Files (Production)

**Khi nào dùng migrations:**
- ✅ Sắp deploy production
- ✅ Cần version control schema changes
- ✅ Team nhiều người (track changes)

**Tạo migration:**

```bash
# Tạo migration từ schema
npx prisma migrate dev --name init

# Output:
# Environment variables loaded from .env
# Prisma schema loaded from prisma/schema.prisma
# Datasource "db": MySQL database "demo123_db" at "localhost:3306"
# 
# Applying migration `20250128120000_init`
# 
# The following migration(s) have been created and applied from new schema changes:
# 
# migrations/
#   └─ 20250128120000_init/
#       └─ migration.sql
# 
# Your database is now in sync with your schema.
```

**File migration được tạo:**

```
prisma/
  migrations/
    20250128120000_init/
      migration.sql    ← SQL script
    migration_lock.toml
```

**Nội dung `migration.sql`:**

```sql
-- CreateTable
CREATE TABLE `posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `author_id` INTEGER NOT NULL,
    ...
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `posts_slug_key` ON `posts`(`slug`);
...
```

**Apply migrations trên server khác:**

```bash
# Deploy migrations (không recreate database)
npx prisma migrate deploy

# Dùng trên production server sau khi pull code mới
```

### 🌱 Seed Database (Data Mẫu)

Tạo data mẫu để test:

**File `prisma/seed.ts`** (nếu chưa có):

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Tạo admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      full_name: 'Administrator',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('✅ Created admin:', admin.email)

  // Tạo categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Tin tức', slug: 'tin-tuc' } }),
    prisma.category.create({ data: { name: 'Sự kiện', slug: 'su-kien' } }),
    prisma.category.create({ data: { name: 'Thông báo', slug: 'thong-bao' } }),
  ])

  console.log('✅ Created', categories.length, 'categories')

  // Tạo sample posts
  const post = await prisma.post.create({
    data: {
      title: 'Bài viết mẫu đầu tiên',
      content: 'Nội dung bài viết mẫu...',
      excerpt: 'Mô tả ngắn',
      slug: 'bai-viet-mau-dau-tien',
      author_id: admin.id,
      category_id: categories[0].id,
      status: 'published',
    },
  })

  console.log('✅ Created sample post:', post.title)

  // Tạo settings
  await prisma.settings.createMany({
    data: [
      { key: 'site_name', value: 'Trang Quản Lý', type: 'text' },
      { key: 'site_description', value: 'Hệ thống quản lý nội dung', type: 'text' },
      { key: 'contact_email', value: 'contact@example.com', type: 'text' },
    ],
  })

  console.log('✅ Created settings')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

**Chạy seed:**

```bash
# Chạy seed script
npx prisma db seed

# Hoặc (nếu config trong package.json)
npm run seed
```

**Config trong `package.json`:**

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### 🔄 Reset Database

**Xóa toàn bộ data và recreate:**

```bash
# ⚠️ CẢNH BÁO: Mất hết data!
npx prisma migrate reset

# Output:
# Are you sure you want to reset your database? › (y/N)
# y
# 
# Database reset successful
# Applying migrations...
# Running seed...
# ✅ Created admin: admin@example.com
```

**Khi nào dùng:**
- ✅ Development, muốn reset về trạng thái ban đầu
- ❌ KHÔNG BAO GIỜ dùng trên production!

### 🔍 Prisma Studio

GUI để xem và edit data:

```bash
# Mở Prisma Studio
npx prisma studio

# Output:
# Environment variables loaded from .env
# Prisma schema loaded from prisma/schema.prisma
# Prisma Studio is up on http://localhost:5555
```

Mở trình duyệt: **http://localhost:5555**

**Tính năng:**
- ✅ Xem tất cả tables
- ✅ Edit, Add, Delete records
- ✅ Filter, Search data
- ✅ View relationships

---

## 5. Production Deployment

### 🎯 Pre-Deployment Checklist

Trước khi deploy, đảm bảo:

```bash
# 1. Build thành công
npm run build

# 2. Không có TypeScript errors
npm run lint

# 3. Environment variables đã setup
cat .env   # Kiểm tra các giá trị

# 4. Database migrations đã apply
npx prisma migrate deploy

# 5. Test production build locally
npm start
# Mở http://localhost:3000
```

### 🚀 Deployment Options

#### Option 1: Vercel (Recommended cho Next.js)

**Ưu điểm:**
- ✅ Tối ưu cho Next.js (do Vercel tạo ra Next.js)
- ✅ Auto deploy khi push lên Git
- ✅ Free SSL, CDN
- ✅ Serverless functions

**Cách deploy:**

1. **Tạo tài khoản**: [https://vercel.com](https://vercel.com)

2. **Import Git Repository**:
   ```
   Dashboard → Add New → Project
   → Import Git Repository
   → Chọn repo: binhan212/my-app-al
   ```

3. **Configure Project**:
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Environment Variables**:
   ```
   DATABASE_URL = mysql://user:pass@host:3306/db
   NEXTAUTH_URL = https://your-app.vercel.app
   NEXTAUTH_SECRET = (generate mới cho production)
   NODE_ENV = production
   ```

5. **Deploy**: Click "Deploy"

6. **Run Prisma Migrations** (sau lần deploy đầu):
   ```bash
   # Từ local machine
   DATABASE_URL="your-production-db-url" npx prisma migrate deploy
   ```

**Auto Deploy:**
- Mỗi lần push lên branch `master` → Vercel tự động deploy

**Vercel CLI** (deploy từ terminal):

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy production
vercel --prod
```

#### Option 2: Railway

**Ưu điểm:**
- ✅ Cung cấp cả web server + database
- ✅ Free $5/month credit
- ✅ Dễ setup

**Cách deploy:**

1. Đăng ký: [https://railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Chọn repo `binhan212/my-app-al`
4. Add MySQL service (cùng project)
5. Set environment variables
6. Deploy

#### Option 3: VPS (DigitalOcean, AWS EC2, Vultr)

**Ưu điểm:**
- ✅ Full control
- ✅ Giá rẻ nếu dùng lâu dài

**Cách deploy trên Ubuntu VPS:**

```bash
# 1. SSH vào VPS
ssh root@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install MySQL
sudo apt install mysql-server
sudo mysql_secure_installation

# 4. Clone project
git clone https://github.com/binhan212/my-app-al.git
cd my-app-al

# 5. Install dependencies
npm install

# 6. Setup .env
nano .env
# Paste nội dung .env production

# 7. Build
npm run build

# 8. Run migrations
npx prisma migrate deploy

# 9. Start với PM2
npm install -g pm2
pm2 start npm --name "my-app" -- start
pm2 save
pm2 startup

# 10. Setup Nginx reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/my-app

# Nội dung Nginx config:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/my-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 11. Setup SSL với Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 🔐 Production Environment Variables

**File `.env.production`** (example):

```env
# DATABASE (Production)
DATABASE_URL="mysql://prod_user:strong_password@db-host:3306/prod_db?sslaccept=strict"

# NEXTAUTH
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="very-long-random-string-min-32-characters-for-production"

# ENVIRONMENT
NODE_ENV="production"

# OPTIONAL: Upload limits
MAX_FILE_SIZE=10485760
```

**⚠️ Security Checklist:**

- ✅ Thay đổi tất cả passwords/secrets so với development
- ✅ NEXTAUTH_SECRET phải khác local
- ✅ Database user có password mạnh
- ✅ Không dùng root user cho database
- ✅ Enable SSL cho database connection
- ✅ `.env` không được commit lên Git

### 📊 Health Checks

**Tạo API route `/api/health`:**

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    await db.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
```

**Test health check:**

```bash
curl https://your-domain.com/api/health

# Response:
# {
#   "status": "ok",
#   "database": "connected",
#   "timestamp": "2025-11-28T10:30:00.000Z"
# }
```

---

## 6. Common Issues

### ❌ Error: Cannot find module 'prisma'

**Nguyên nhân:** Chưa install dependencies

**Giải pháp:**
```bash
npm install
npx prisma generate
```

### ❌ Error: P1001: Can't reach database server

**Nguyên nhân:** Database chưa chạy hoặc `DATABASE_URL` sai

**Giải pháp:**

```bash
# 1. Kiểm tra MySQL có chạy không
# Windows
Get-Service MySQL80   # PowerShell

# macOS
brew services list | grep mysql

# Linux
sudo systemctl status mysql

# Docker
docker ps | grep mysql

# 2. Kiểm tra .env
cat .env | grep DATABASE_URL

# 3. Test connection
mysql -h localhost -u demo123_user -pdemo123_pass demo123_db
```

### ❌ Error: P1003: Database does not exist

**Nguyên nhân:** Database chưa được tạo

**Giải pháp:**

```sql
-- Vào MySQL
mysql -u root -p

-- Tạo database
CREATE DATABASE demo123_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### ❌ Error: NEXTAUTH_SECRET environment variable not set

**Nguyên nhân:** Thiếu `NEXTAUTH_SECRET` trong `.env`

**Giải pháp:**

```bash
# Generate secret
openssl rand -base64 32

# Thêm vào .env
NEXTAUTH_SECRET="generated-secret-here"
```

### ❌ Error: Module not found: Can't resolve '@/...'

**Nguyên nhân:** TypeScript path alias không hoạt động

**Giải pháp:**

```bash
# 1. Kiểm tra tsconfig.json
cat tsconfig.json | grep paths

# Phải có:
# "paths": {
#   "@/*": ["./*"]
# }

# 2. Restart dev server
npm run dev
```

### ❌ Error: Image optimization error

**Nguyên nhân:** Next.js Image component gặp lỗi với external images

**Giải pháp:**

```typescript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['localhost', 'your-domain.com'],
    // Hoặc cho phép tất cả (không khuyến khích)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}
```

### ❌ Build Error: Type errors

**Nguyên nhân:** TypeScript errors trong code

**Giải pháp:**

```bash
# Kiểm tra tất cả errors
npm run lint

# Xem chi tiết
npx tsc --noEmit

# Tạm thời ignore (không khuyến khích)
# next.config.ts
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
}
```

### ❌ Error: Port 3000 already in use

**Nguyên nhân:** Port 3000 đang được dùng bởi process khác

**Giải pháp:**

```bash
# Windows
netstat -ano | findstr :3000
# TCP    0.0.0.0:3000    LISTENING    12345
taskkill /PID 12345 /F

# macOS/Linux
lsof -i :3000
# node    12345 user   ...
kill -9 12345

# Hoặc dùng port khác
PORT=3001 npm run dev
```

### ❌ Prisma Client Errors

**Error: Prisma Client needs to be regenerated**

```bash
npx prisma generate
```

**Error: Migration failed**

```bash
# Xem chi tiết error
npx prisma migrate status

# Reset và thử lại (development only!)
npx prisma migrate reset
npx prisma migrate dev
```

---

## 📚 Tài Liệu Liên Quan

- **Next.js Deployment**: [https://nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Prisma Deployment**: [https://www.prisma.io/docs/guides/deployment](https://www.prisma.io/docs/guides/deployment)
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [https://docs.railway.app](https://docs.railway.app)

---

## ✅ Checklist Deploy Thành Công

Sau khi deploy, kiểm tra:

- [ ] Website accessible qua domain/IP
- [ ] Database connection hoạt động (`/api/health`)
- [ ] Login/logout hoạt động
- [ ] Tạo/edit/delete posts hoạt động
- [ ] Upload files hoạt động
- [ ] Images hiển thị đúng
- [ ] SSL certificate active (https://)
- [ ] Environment variables đã set đúng
- [ ] Prisma migrations đã apply
- [ ] Seed data (nếu cần)

---

**Good luck! 🚀**

*Last updated: November 28, 2025*
