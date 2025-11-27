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

## BƯỚC 2: Tạo MySQL Database

1. Trong Render Dashboard, click **New +** → **MySQL**
2. Điền thông tin:
   - **Name**: `my-app-db`
   - **Database**: `my_app_db`
   - **User**: `my_app_user`
   - **Region**: Chọn gần nhất (Singapore)
   - **Plan**: **Free**
3. Click **Create Database**
4. Đợi ~2 phút để database khởi tạo
5. **Quan trọng**: Vào tab **Connect** → Copy **Internal Database URL**
   - Format: `mysql://my_app_user:password@dpg-xxx-a.singapore-postgres.render.com/my_app_db`

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
   | `DATABASE_URL` | Paste **Internal Database URL** từ Bước 2 | MySQL connection string |
   | `NEXTAUTH_SECRET` | Generate bằng lệnh bên dưới | Random secret key |
   | `NEXTAUTH_URL` | `https://my-app.onrender.com` | Thay `my-app` bằng tên service của em |
   | `NODE_ENV` | `production` | Production mode |

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
- Kiểm tra `DATABASE_URL` đã đúng chưa
- Đảm bảo sử dụng **Internal URL**, không phải External URL

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

| Resource | Limit |
|----------|-------|
| **Web Service** | 750 hours/month (luôn on = ~31 days) |
| **MySQL Database** | 1 GB storage |
| **Bandwidth** | 100 GB/month |
| **Build time** | 500 minutes/month |
| **Sleep after inactivity** | 15 phút không request → sleep |

**Lưu ý**: Service sẽ sleep sau 15 phút không hoạt động, request đầu tiên sau khi sleep sẽ mất ~30s để wake up.

---

## 🎉 HOÀN TẤT!

Dự án của em đã LIVE tại: **https://my-app.onrender.com**

Chúc mừng! 🎊
