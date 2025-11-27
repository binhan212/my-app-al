# 🚀 HƯỚNG DẪN DEPLOY LÊN RENDER.COM

## 📋 Yêu cầu
- Tài khoản GitHub (đã có ✅)
- Tài khoản Render.com (free, không cần thẻ tín dụng)

---

## BƯỚC 1: Tạo tài khoản Render.com

1. Truy cập: **https://render.com**
2. Click **Get Started for Free**
3. Chọn **Sign up with GitHub**
4. Authorize Render truy cập GitHub repositories

---

## BƯỚC 2: Chuẩn bị MySQL Database

Em có 3 lựa chọn:

### **Option 1: Dùng MySQL từ Hosting cPanel có sẵn (KHUYẾN NGHỊ)** ⭐

Nếu em đã có hosting với cPanel + MySQL:

1. **Vào cPanel → MySQL Databases**
2. **Tạo Database mới**:
   - Database Name: `my_app_db` (sẽ tự động thêm prefix: `thaibin2_my_app_db`)
   - Click **Create Database**

3. **Tạo MySQL User**:
   - Username: `my_app_user` (prefix: `thaibin2_my_app_user`)
   - Password: Generate strong password
   - Click **Create User**

4. **Add User to Database**:
   - Select User: `thaibin2_my_app_user`
   - Select Database: `thaibin2_my_app_db`
   - Privileges: **ALL PRIVILEGES**
   - Click **Add**

5. **Lấy Connection String**:
   - Host: Xem trong cPanel (thường là `localhost` hoặc `yourdomain.com`)
   - Port: `3306` (mặc định)
   - **Format DATABASE_URL**:
   ```
   mysql://thaibin2_my_app_user:your_password@yourdomain.com:3306/thaibin2_my_app_db
   ```

6. **Cho phép Remote MySQL Access** (QUAN TRỌNG):
   - cPanel → **Remote MySQL**
   - Add host: `%.onrender.com` (cho phép Render.com kết nối)
   - Click **Add Host**

---

### **Option 2: Dùng Railway.app** (Nếu không có hosting)

**Lưu ý**: Railway chỉ có $5 credit/month free (~20-25 ngày)

1. Truy cập: **https://railway.app**
2. Login with GitHub
3. **New Project** → **Provision MySQL**
4. Copy **MySQL Connection URL**
5. **Lưu lại URL** để dùng ở Bước 3

---

### **Option 3: Dùng Aiven.io** (100% Free Forever)

1. Truy cập: **https://aiven.io**
2. Sign up free
3. Create **MySQL service** (Free tier: 1 node, 1GB RAM)
4. Copy connection string
5. **Lưu lại URL**

---

## BƯỚC 3: Deploy Web Service

1. Click **New +** → **Web Service**
2. Chọn **Build and deploy from a Git repository**
3. Connect repository: `binhan212/my-app-al`
4. Điền thông tin:

   **Basic Settings:**
   - **Name**: `my-app` (hoặc tên khác)
   - **Region**: Singapore
   - **Branch**: `master`
   - **Root Directory**: `.` (leave blank)
   - **Runtime**: `Node`
   - **Build Command**: `sh render-build.sh`
   - **Start Command**: `sh render-start.sh`
   - **Plan**: **Free**

5. **Environment Variables** - Click **Add Environment Variable**:

   | Key | Value | Ghi chú |
   |-----|-------|---------|
   | `DATABASE_URL` | `mysql://user:pass@host:3306/dbname` | MySQL từ hosting/Railway/Aiven |
   | `NEXTAUTH_SECRET` | Generate bằng lệnh bên dưới | Random secret key |
   | `NEXTAUTH_URL` | `https://my-app.onrender.com` | Thay `my-app` bằng tên service của em |
   | `NODE_ENV` | `production` | Production mode |

   **Ví dụ DATABASE_URL từ cPanel**:
   ```
   mysql://thaibin2_myapp:StrongPass123@yourdomain.com:3306/thaibin2_myapp_db
   ```

   **Tạo NEXTAUTH_SECRET:**
   ```bash
   # Chạy lệnh này trong PowerShell:
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```

6. Click **Create Web Service**

---

## BƯỚC 4: Đợi Deploy

1. Render sẽ tự động:
   - Clone code từ GitHub
   - Chạy `render-build.sh`: Install packages → Generate Prisma → Build Next.js
   - Chạy `render-start.sh`: Migrate database → Start server

2. Theo dõi logs trong **Logs** tab

3. Khi thấy "✅ Build completed successfully" → Deploy thành công!

---

## BƯỚC 5: Khởi tạo Database và Tạo User Admin

1. Sau khi deploy thành công, vào **Shell** tab trong Render Dashboard
2. Chạy lệnh tạo admin user:

   ```bash
   npm run db:seed
   # Hoặc tạo manual bằng Prisma Studio:
   npx prisma studio
   ```

3. **Hoặc** seed data qua API:
   - Truy cập: `https://my-app.onrender.com/api/seed`

---

## 🎯 KIỂM TRA

1. **Trang chủ**: `https://my-app.onrender.com`
2. **Admin login**: `https://my-app.onrender.com/admin/login`
   - Username: `admin`
   - Password: (từ seeder script)

---

## ⚙️ CẬP NHẬT CODE

Mỗi khi push code mới lên GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin master
```

→ Render sẽ **tự động deploy** lại trong ~2-3 phút!

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Error: P1001: Can't reach database server"
- Kiểm tra `DATABASE_URL` đã đúng format chưa
- **Nếu dùng cPanel MySQL**: Đảm bảo đã add `%.onrender.com` vào **Remote MySQL** trong cPanel
- **Nếu dùng Railway/Aiven**: Kiểm tra URL đã copy đúng chưa
- Test kết nối local trước: `mysql -h hostname -u username -p`

### Lỗi: "prisma generate failed"
- Xem logs chi tiết trong Render Dashboard
- Đảm bảo `prisma` package trong `devDependencies`

### Lỗi: "Port already in use"
- Render tự động detect port từ Next.js (3000)
- Không cần config PORT trong env vars

### Deploy quá chậm (>5 phút)
- Free tier của Render có thể chậm lần đầu
- Các lần deploy sau sẽ nhanh hơn nhờ cache

---

## 📊 GIỚI HẠN FREE TIER

### Render.com (Web Service):
| Resource | Limit |
|----------|-------|
| **Web Service** | 750 hours/month |
| **Bandwidth** | 100 GB/month |
| **Build time** | 500 minutes/month |
| **Sleep after inactivity** | 15 phút không request → sleep (~30s wake up) |

### MySQL Options:

#### 1. **Hosting cPanel** (Nếu đã mua):
- ✅ Không giới hạn (tùy gói hosting)
- ✅ Luôn online 24/7
- ✅ Tốc độ cao nếu server ở Việt Nam

#### 2. **Railway.app**:
- ⚠️ Chỉ $5 credit/month (~20-25 ngày)
- ⚠️ Hết credit → service dừng

#### 3. **Aiven.io**:
- ✅ 100% Free forever
- ✅ 1GB RAM, 5GB storage
- ⚠️ Server ở nước ngoài (có thể chậm)

**Khuyến nghị**: Dùng MySQL từ hosting cPanel nếu em đã có!

---

## 🎉 HOÀN TẤT!

Dự án của em đã LIVE tại: **https://my-app.onrender.com**

Chúc mừng! 🎊
