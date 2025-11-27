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

## BƯỚC 2: Tạo MySQL Database trên Railway.app

**Lưu ý**: Render.com FREE không hỗ trợ MySQL, chỉ có PostgreSQL. Vì project dùng MySQL nên ta sẽ dùng Railway.app cho database (vẫn free).

### 2.1. Tạo tài khoản Railway

1. Truy cập: **https://railway.app**
2. Click **Login with GitHub**
3. Authorize Railway

### 2.2. Tạo MySQL Database

1. Click **New Project** → **Provision MySQL**
2. Database sẽ tự động tạo
3. Click vào **MySQL service**
4. Tab **Connect** → Copy **MySQL Connection URL**
   - Format: `mysql://root:password@containers-us-west-xxx.railway.app:6789/railway`
5. **LƯU LẠI URL này** để dùng ở Bước 3

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
   | `DATABASE_URL` | Paste **MySQL Connection URL** từ Railway (Bước 2) | MySQL connection string |
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

### Render.com (Web Service):
| Resource | Limit |
|----------|-------|
| **Web Service** | 750 hours/month |
| **Bandwidth** | 100 GB/month |
| **Build time** | 500 minutes/month |
| **Sleep after inactivity** | 15 phút không request → sleep (~30s wake up) |

### Railway.app (MySQL Database):
| Resource | Limit |
|----------|-------|
| **MySQL Database** | $5 credit/month (~500 hours) |
| **Storage** | Không giới hạn trong credit |
| **RAM** | 8GB |

**Lưu ý**: 
- Render service sẽ sleep sau 15 phút không request
- Railway $5/month đủ dùng cho hobby project (~20-25 ngày luôn on)

---

## 🎉 HOÀN TẤT!

Dự án của em đã LIVE tại: **https://my-app.onrender.com**

Chúc mừng! 🎊
