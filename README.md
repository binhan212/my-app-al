# Hệ thống Quản lý Phường Âu Lâu

Website quản lý và hiển thị thông tin quy hoạch, dự án, bản vẽ kỹ thuật.

## Công nghệ sử dụng

- **Framework**: Next.js 16.0.4 (App Router)
- **Language**: TypeScript
- **Database**: MySQL + Prisma ORM
- **Authentication**: NextAuth.js v5
- **UI Components**: shadcn/ui + Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Rich Text Editor**: CKEditor 5

## Tính năng chính

### Admin Panel
- ✅ Quản lý bài viết (Tin tức)
- ✅ Quản lý dự án
- ✅ Quản lý bản vẽ (DWG files)
- ✅ Quản lý video
- ✅ Quản lý slides
- ✅ Quản lý danh mục
- ✅ Quản lý người dùng
- ✅ Quản lý ý kiến phản hồi
- ✅ Cài đặt hệ thống
- ✅ Trang giới thiệu

### Client Website
- ✅ Trang chủ với slides động
- ✅ Tin tức với phân trang
- ✅ Dự án với PDF download
- ✅ Bản vẽ kỹ thuật (DWG viewer)
- ✅ Video gallery
- ✅ Form gửi ý kiến
- ✅ Tìm kiếm tin tức & dự án
- ✅ Responsive design

## Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd my-app
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường:

```env
DATABASE_URL="mysql://user:password@localhost:3306/database_name"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Khởi tạo database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed initial data
npx prisma db seed
```

### 5. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem website.

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Tài khoản mặc định

```
Username: admin
Password: admin123
```

## Scripts

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run start        # Chạy production server
npm run lint         # Chạy ESLint
npx prisma studio    # Mở Prisma Studio (database GUI)
```

## Cấu trúc thư mục

```
my-app/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes (no auth)
│   ├── admin/             # Admin routes (protected)
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── admin/            # Admin components
│   ├── layout/           # Layout components
│   └── ...               # Feature components
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema & migrations
└── public/               # Static files & uploads
```

## Upload Files

Các loại file được hỗ trợ:

- **Images**: JPG, PNG, GIF, WebP (max 5MB) → `/uploads/posts/`, `/uploads/media/`
- **PDFs**: PDF files (max 10MB) → `/uploads/pdfs/`
- **DWG**: AutoCAD files (max 50MB) → `/uploads/dwg/`

## Database Schema

Xem chi tiết trong `prisma/schema.prisma`:

- **User**: Người dùng hệ thống
- **Post**: Bài viết tin tức
- **Project**: Dự án
- **Drawing**: Bản vẽ kỹ thuật
- **Video**: Video
- **Slide**: Banner slides
- **Category**: Danh mục
- **Feedback**: Ý kiến phản hồi
- **Setting**: Cài đặt hệ thống
- **About**: Nội dung trang giới thiệu

## Deploy

### Build production

```bash
npm run build
npm run start
```

### Deploy to VPS

1. Upload code lên server
2. Cài đặt Node.js 18+ và MySQL
3. Configure `.env` với production values
4. Run migration: `npx prisma db push`
5. Build: `npm run build`
6. Start: `npm run start` hoặc dùng PM2

### Deploy to Vercel

1. Push code lên GitHub
2. Import project vào Vercel
3. Set environment variables
4. Deploy

**Lưu ý**: Cần external MySQL database (PlanetScale, Railway, etc.)

## Troubleshooting

### Lỗi Prisma Client

```bash
npx prisma generate
```

### Lỗi Database Connection

- Kiểm tra `DATABASE_URL` trong `.env`
- Đảm bảo MySQL đang chạy
- Test connection: `npx prisma db push`

### Lỗi NextAuth

- Kiểm tra `NEXTAUTH_SECRET` và `NEXTAUTH_URL`
- Clear cookies và login lại

## License

Private project - All rights reserved.
