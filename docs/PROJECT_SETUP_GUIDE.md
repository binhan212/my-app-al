# 🚀 QUY TRÌNH KHỞI TẠO DỰ ÁN MỚI - TỪ ZERO ĐẾN PRODUCTION

> **Mục tiêu**: Hướng dẫn tạo dự án Next.js + Prisma + NextAuth giống project này từ đầu, nhanh nhất và hiệu quả nhất

---

## 📋 MỤC LỤC

1. [Setup Môi Trường](#1-setup-môi-trường)
2. [Khởi Tạo Next.js Project](#2-khởi-tạo-nextjs-project)
3. [Cài Đặt Dependencies](#3-cài-đặt-dependencies)
4. [Setup Prisma + Database](#4-setup-prisma--database)
5. [Setup NextAuth](#5-setup-nextauth)
6. [Setup shadcn/ui](#6-setup-shadcnui)
7. [Cấu Trúc Thư Mục](#7-cấu-trúc-thư-mục)
8. [File Configurations](#8-file-configurations)
9. [Seed Data](#9-seed-data)
10. [Git & GitHub](#10-git--github)

---

## 1. Setup Môi Trường

### ✅ Checklist Cài Đặt

```bash
# 1. Node.js (v18+)
node --version
# v18.17.0 hoặc cao hơn

# 2. npm
npm --version
# 9.x.x hoặc cao hơn

# 3. Git
git --version
# 2.x.x

# 4. MySQL (chọn 1 trong 3)
# Option A: Docker (khuyến nghị)
docker --version

# Option B: Local MySQL
mysql --version

# Option C: Cloud (PlanetScale, Railway, Aiven)
# → Không cần cài gì
```

### 🐳 Docker MySQL (Recommended)

```bash
# Tạo MySQL container
docker run -d \
  --name mysql-dev \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=myapp_db \
  -e MYSQL_USER=myapp_user \
  -e MYSQL_PASSWORD=myapp_pass \
  -p 3306:3306 \
  mysql:8.0

# Đợi 15s để MySQL khởi động
sleep 15

# Test connection
docker exec -it mysql-dev mysql -u myapp_user -pmyapp_pass myapp_db
# Thấy "mysql>" là thành công
```

---

## 2. Khởi Tạo Next.js Project

### 📦 Create Next.js App

```bash
# Tạo project với App Router
npx create-next-app@latest my-app

# Chọn options:
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … No
✔ Would you like to use App Router? … Yes
✔ Would you like to use Turbopack for `next dev`? … No
✔ Would you like to customize the import alias (`@/*` by default)? … No

# Di chuyển vào project
cd my-app
```

**Kết quả:**
```
my-app/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 3. Cài Đặt Dependencies

### 📚 Core Dependencies

```bash
# Prisma (Database ORM)
npm install @prisma/client@5.22.0
npm install -D prisma@5.22.0

# NextAuth v5 (Authentication)
npm install next-auth@5.0.0-beta.30

# Password hashing
npm install bcryptjs
npm install -D @types/bcryptjs

# Form & Validation
npm install react-hook-form@7.66.1
npm install @hookform/resolvers@5.2.2
npm install zod@4.1.13

# Date formatting
npm install date-fns@4.1.0

# React Query (optional nhưng nên có)
npm install @tanstack/react-query@5.90.11

# Image optimization
npm install sharp@0.34.5
```

### 🎨 UI Dependencies (shadcn/ui)

```bash
# Radix UI primitives
npm install @radix-ui/react-dialog@1.1.15
npm install @radix-ui/react-dropdown-menu@2.1.16
npm install @radix-ui/react-select@2.2.6
npm install @radix-ui/react-label@2.1.8
npm install @radix-ui/react-slot@1.2.4
npm install @radix-ui/react-toast@1.2.15
npm install @radix-ui/react-alert-dialog@1.1.15

# Utility libraries
npm install class-variance-authority@0.7.1
npm install clsx@2.1.1
npm install tailwind-merge@3.4.0

# Icons
npm install @heroicons/react@2.2.0
npm install lucide-react@0.555.0
```

### 📝 Optional Dependencies

```bash
# Rich Text Editor (nếu cần)
npm install @ckeditor/ckeditor5-react@11.0.0
npm install ckeditor5@47.2.0

# Animations
npm install tw-animate-css@1.4.0
```

**Kết quả `package.json`:**
```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "next": "16.0.4",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "next-auth": "^5.0.0-beta.30",
    "bcryptjs": "^3.0.3",
    "react-hook-form": "^7.66.1",
    "@hookform/resolvers": "^5.2.2",
    "zod": "^4.1.13",
    "date-fns": "^4.1.0",
    "@tanstack/react-query": "^5.90.11",
    "sharp": "^0.34.5",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-toast": "^1.2.15",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.4.0",
    "@heroicons/react": "^2.2.0",
    "lucide-react": "^0.555.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/bcryptjs": "^2.4.6",
    "prisma": "^5.22.0",
    "typescript": "^5",
    "eslint": "^9",
    "eslint-config-next": "16.0.4",
    "tailwindcss": "^4"
  }
}
```

---

## 4. Setup Prisma + Database

### 🗄️ Khởi Tạo Prisma

```bash
# Initialize Prisma
npx prisma init

# Kết quả tạo:
# ├── prisma/
# │   └── schema.prisma
# └── .env
```

### 📝 File `.env`

```env
# Database
DATABASE_URL="mysql://myapp_user:myapp_pass@localhost:3306/myapp_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-characters-here"

# Environment
NODE_ENV="development"
```

**Generate NEXTAUTH_SECRET:**
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Copy output vào .env
```

### 📊 File `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER & AUTH
// ============================================
model User {
  id            Int       @id @default(autoincrement())
  username      String    @unique @db.VarChar(50)
  email         String    @unique @db.VarChar(100)
  password_hash String    @db.VarChar(255)
  full_name     String?   @db.VarChar(100)
  avatar        String?   @db.VarChar(255)
  role          UserRole  @default(user)
  status        UserStatus @default(active)
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt

  posts         Post[]
  media         Media[]
  feedback_replies Feedback[] @relation("FeedbackReplies")

  @@map("users")
}

enum UserRole {
  admin
  editor
  user
}

enum UserStatus {
  active
  inactive
}

// ============================================
// CATEGORIES
// ============================================
model Category {
  id            Int       @id @default(autoincrement())
  name          String    @db.VarChar(100)
  slug          String    @unique @db.VarChar(100)
  description   String?   @db.Text
  parent_id     Int?
  display_order Int       @default(0)
  created_at    DateTime  @default(now())

  parent        Category?  @relation("CategoryHierarchy", fields: [parent_id], references: [id], onDelete: SetNull)
  children      Category[] @relation("CategoryHierarchy")
  posts         Post[]
  projects      Project[]

  @@map("categories")
}

// ============================================
// POSTS
// ============================================
model Post {
  id           Int        @id @default(autoincrement())
  title        String     @db.VarChar(255)
  slug         String     @unique @db.VarChar(255)
  content      String     @db.LongText
  excerpt      String?    @db.Text
  cover_image  String?    @db.VarChar(255)
  author_id    Int
  category_id  Int?
  status       PostStatus @default(draft)
  views        Int        @default(0)
  published_at DateTime?
  created_at   DateTime   @default(now())
  updated_at   DateTime   @updatedAt

  author       User       @relation(fields: [author_id], references: [id], onDelete: Cascade)
  category     Category?  @relation(fields: [category_id], references: [id], onDelete: SetNull)
  tags         PostTag[]

  @@index([slug])
  @@index([status])
  @@index([published_at])
  @@map("posts")
}

enum PostStatus {
  draft
  published
  archived
}

// ============================================
// TAGS
// ============================================
model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique @db.VarChar(50)
  slug  String @unique @db.VarChar(50)

  posts PostTag[]

  @@map("tags")
}

model PostTag {
  post_id Int
  tag_id  Int

  post Post @relation(fields: [post_id], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tag_id], references: [id], onDelete: Cascade)

  @@id([post_id, tag_id])
  @@map("post_tags")
}

// ============================================
// PROJECTS
// ============================================
model Project {
  id           Int           @id @default(autoincrement())
  title        String        @db.VarChar(255)
  slug         String        @unique @db.VarChar(255)
  description  String?       @db.Text
  content      String?       @db.LongText
  cover_image  String?       @db.VarChar(500)
  pdf_file     String?       @db.VarChar(500)
  category_id  Int?
  status       ProjectStatus @default(draft)
  published_at DateTime?
  views        Int           @default(0)
  created_at   DateTime      @default(now())
  updated_at   DateTime      @updatedAt

  category Category? @relation(fields: [category_id], references: [id], onDelete: SetNull)

  @@index([slug])
  @@index([status])
  @@index([published_at])
  @@map("projects")
}

enum ProjectStatus {
  draft
  published
}

// ============================================
// MEDIA
// ============================================
model Slide {
  id            Int      @id @default(autoincrement())
  title         String?  @db.VarChar(255)
  description   String?  @db.Text
  image_url     String   @db.VarChar(255)
  link_url      String?  @db.VarChar(255)
  display_order Int      @default(0)
  is_active     Boolean  @default(true)
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  @@map("slides")
}

model Video {
  id            Int         @id @default(autoincrement())
  title         String      @db.VarChar(255)
  description   String?     @db.Text
  video_url     String      @db.VarChar(500)
  thumbnail_url String?     @db.VarChar(500)
  duration      String?     @db.VarChar(20)
  display_order Int         @default(0)
  status        VideoStatus @default(active)
  created_at    DateTime    @default(now())
  updated_at    DateTime    @updatedAt

  @@index([status])
  @@index([display_order])
  @@map("videos")
}

enum VideoStatus {
  active
  inactive
}

model Media {
  id            Int      @id @default(autoincrement())
  filename      String   @db.VarChar(255)
  original_name String   @db.VarChar(255)
  file_path     String   @db.VarChar(255)
  file_type     String?  @db.VarChar(50)
  file_size     Int?
  uploaded_by   Int?
  created_at    DateTime @default(now())

  uploader User? @relation(fields: [uploaded_by], references: [id], onDelete: SetNull)

  @@map("media")
}

// ============================================
// SETTINGS
// ============================================
model Setting {
  id               Int      @id @default(autoincrement())
  site_name        String   @default("My Website") @db.VarChar(255)
  site_logo        String?  @db.VarChar(500)
  site_favicon     String?  @db.VarChar(500)
  footer_about     String?  @db.Text
  contact_email    String?  @db.VarChar(100)
  contact_phone    String?  @db.VarChar(50)
  contact_address  String?  @db.VarChar(255)
  facebook_url     String?  @db.VarChar(255)
  youtube_url      String?  @db.VarChar(255)
  footer_copyright String?  @db.VarChar(255)
  updated_at       DateTime @updatedAt

  @@map("settings")
}

// ============================================
// FEEDBACK
// ============================================
model Feedback {
  id          Int            @id @default(autoincrement())
  name        String         @db.VarChar(100)
  email       String         @db.VarChar(100)
  phone       String?        @db.VarChar(20)
  subject     String         @db.VarChar(255)
  message     String         @db.Text
  admin_reply String?        @db.Text
  status      FeedbackStatus @default(pending)
  replied_at  DateTime?
  replied_by  Int?
  created_at  DateTime       @default(now())
  updated_at  DateTime       @updatedAt

  replier User? @relation("FeedbackReplies", fields: [replied_by], references: [id], onDelete: SetNull)

  @@index([status])
  @@index([created_at])
  @@map("feedback")
}

enum FeedbackStatus {
  pending
  answered
  archived
}

// ============================================
// ABOUT
// ============================================
model About {
  id         Int      @id @default(autoincrement())
  content    String   @db.LongText
  image_url  String?  @db.VarChar(500)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("about")
}
```

### 🚀 Push Schema to Database

```bash
# Push schema (development)
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Kiểm tra bằng Prisma Studio
npx prisma studio
# Mở http://localhost:5555
```

---

## 5. Setup NextAuth

### 📁 Tạo File `lib/auth.ts`

```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from './db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { username: credentials.username }
        })

        if (!user || user.status !== 'active') {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.full_name,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
```

### 📁 Tạo File `lib/db.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

### 📁 Tạo File `app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

### 📁 Tạo File `middleware.ts` (root folder)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname.startsWith('/admin/login')
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin') && !isAuthPage

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  if (isAdminPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
```

---

## 6. Setup shadcn/ui

### 🎨 Initialize shadcn/ui

```bash
# Initialize
npx shadcn@latest init

# Chọn options:
✔ Preflight exists. Proceed? … yes
✔ Which style would you like to use? › New York
✔ Which color would you like to use as base color? › Zinc
✔ Would you like to use CSS variables for colors? … yes
```

### 📁 File `components.json` (tự động tạo)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### 🧩 Cài Components Cơ Bản

```bash
# Button
npx shadcn@latest add button

# Input & Form
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add select

# Layout
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add table

# Feedback
npx shadcn@latest add toast
npx shadcn@latest add alert-dialog
npx shadcn@latest add badge
npx shadcn@latest add avatar
```

### 📁 File `lib/utils.ts` (tự động tạo)

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Thêm helper functions
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
```

---

## 7. Cấu Trúc Thư Mục

### 📂 Tạo Folder Structure

```bash
# Tạo folders
mkdir -p app/{admin,api,tin-tuc,du-an,videos,y-kien,gioi-thieu}
mkdir -p app/admin/{dashboard,posts,projects,categories,videos,slides,feedback,users,settings,login}
mkdir -p app/api/{auth,posts,projects,categories,videos,slides,feedback,settings,upload}
mkdir -p components/{ui,admin,posts,projects,layout,providers}
mkdir -p lib
mkdir -p hooks
mkdir -p public/uploads/{posts,projects,pdfs,slides,media}
mkdir -p prisma

# Hoặc Windows PowerShell:
New-Item -ItemType Directory -Path app/admin,app/api,app/tin-tuc,app/du-an,app/videos,app/y-kien,app/gioi-thieu -Force
New-Item -ItemType Directory -Path components/ui,components/admin,components/posts,components/layout -Force
New-Item -ItemType Directory -Path public/uploads/posts,public/uploads/projects,public/uploads/pdfs -Force
```

### 📁 Cấu Trúc Hoàn Chỉnh

```
my-app/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── posts/
│   │   │   ├── page.tsx
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   └── ... (other admin pages)
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── posts/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── ... (other API routes)
│   ├── tin-tuc/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   └── ... (other public pages)
├── components/
│   ├── ui/ (shadcn components)
│   ├── admin/
│   ├── posts/
│   ├── layout/
│   └── providers/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── utils.ts
│   └── validations.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── uploads/
├── .env
├── .gitignore
├── middleware.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 8. File Configurations

### 📁 File `lib/validations.ts`

```typescript
import { z } from "zod"

// Post validation
export const postSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(255),
  content: z.string().min(1, "Nội dung không được để trống"),
  excerpt: z.string().max(500).optional(),
  cover_image: z.string().url().optional().or(z.literal("")),
  category_id: z.number().int().positive().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
})

// Project validation
export const projectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  content: z.string().optional(),
  cover_image: z.string().optional(),
  pdf_file: z.string().optional(),
  category_id: z.number().int().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
})

// Video validation
export const videoSchema = z.object({
  title: z.string().min(1).max(255),
  video_url: z.string().url().max(500),
  thumbnail_url: z.string().optional(),
  duration: z.string().max(20).optional(),
  display_order: z.number().int().default(0),
  status: z.enum(["active", "inactive"]).default("active"),
})

// User login validation
export const loginSchema = z.object({
  username: z.string().min(1, "Username không được để trống"),
  password: z.string().min(1, "Password không được để trống"),
})
```

### 📁 File `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
```

### 📁 File `.gitignore`

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# uploads
/public/uploads/*
!/public/uploads/.gitkeep
```

### 📁 File `public/uploads/.gitkeep`

```
# Create empty file to keep folder in git
touch public/uploads/.gitkeep
```

---

## 9. Seed Data

### 📁 File `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await db.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password_hash: hashedPassword,
      full_name: 'Administrator',
      role: 'admin',
      status: 'active',
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // 2. Create categories
  const categories = await Promise.all([
    db.category.upsert({
      where: { slug: 'tin-tuc' },
      update: {},
      create: { name: 'Tin tức', slug: 'tin-tuc', display_order: 1 }
    }),
    db.category.upsert({
      where: { slug: 'su-kien' },
      update: {},
      create: { name: 'Sự kiện', slug: 'su-kien', display_order: 2 }
    }),
    db.category.upsert({
      where: { slug: 'thong-bao' },
      update: {},
      create: { name: 'Thông báo', slug: 'thong-bao', display_order: 3 }
    }),
  ])
  console.log('✅ Created', categories.length, 'categories')

  // 3. Create sample post
  const post = await db.post.upsert({
    where: { slug: 'bai-viet-mau-dau-tien' },
    update: {},
    create: {
      title: 'Bài viết mẫu đầu tiên',
      slug: 'bai-viet-mau-dau-tien',
      content: '<p>Đây là nội dung bài viết mẫu đầu tiên của hệ thống.</p>',
      excerpt: 'Bài viết mẫu để test hệ thống',
      author_id: admin.id,
      category_id: categories[0].id,
      status: 'published',
      published_at: new Date(),
    },
  })
  console.log('✅ Created sample post:', post.title)

  // 4. Create settings
  const settings = await db.setting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      site_name: 'My Website',
      contact_email: 'contact@example.com',
      contact_phone: '0123456789',
      footer_copyright: '© 2025 My Website. All rights reserved.',
    },
  })
  console.log('✅ Created settings')

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
```

### 📝 Update `package.json`

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### 🚀 Run Seed

```bash
# Install ts-node (if not installed)
npm install -D ts-node

# Run seed
npx prisma db seed

# Output:
# 🌱 Starting seed...
# ✅ Created admin user: admin@example.com
# ✅ Created 3 categories
# ✅ Created sample post: Bài viết mẫu đầu tiên
# ✅ Created settings
# 🎉 Seed completed!
```

---

## 10. Git & GitHub

### 📦 Initialize Git

```bash
# Initialize git (nếu chưa)
git init

# Add all files
git add .

# First commit
git commit -m "feat: Initial project setup

- Next.js 16 with App Router
- Prisma ORM with MySQL
- NextAuth v5 authentication
- shadcn/ui components
- Complete database schema
- Seed data"
```

### 🌐 Push to GitHub

```bash
# Create repo trên GitHub: https://github.com/new
# Tên repo: my-app

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/my-app.git

# Push
git branch -M master
git push -u origin master
```

---

## 🚀 CHECKLIST HOÀN THÀNH

Sau khi làm xong tất cả steps trên, check list:

### ✅ Environment
- [ ] Node.js 18+ installed
- [ ] MySQL running (Docker/Local/Cloud)
- [ ] Git installed

### ✅ Project Setup
- [ ] Next.js project created
- [ ] All dependencies installed
- [ ] `.env` file configured
- [ ] `NEXTAUTH_SECRET` generated

### ✅ Database
- [ ] Prisma schema created
- [ ] Database pushed (`npx prisma db push`)
- [ ] Prisma Client generated
- [ ] Seed data created

### ✅ Authentication
- [ ] NextAuth configured
- [ ] Middleware setup
- [ ] Admin login page works

### ✅ UI Components
- [ ] shadcn/ui initialized
- [ ] Basic components installed
- [ ] Tailwind configured

### ✅ File Structure
- [ ] Folders created
- [ ] Helper functions added
- [ ] Validation schemas created

### ✅ Git
- [ ] Repository initialized
- [ ] First commit done
- [ ] Pushed to GitHub

---

## 🎯 NEXT STEPS

Sau khi hoàn thành setup cơ bản, tiếp tục:

1. **Tạo API Routes** cho từng resource (posts, projects, videos...)
2. **Tạo Admin Pages** với CRUD operations
3. **Tạo Public Pages** để hiển thị nội dung
4. **Upload System** cho images và PDFs
5. **Testing** toàn bộ tính năng
6. **Deploy** lên production

---

## 📚 Commands Tham Khảo Nhanh

```bash
# Development
npm run dev                  # Start dev server
npm run build                # Build production
npm start                    # Start production server

# Database
npx prisma db push           # Push schema to DB
npx prisma generate          # Generate Prisma Client
npx prisma studio            # Open Prisma Studio
npx prisma db seed           # Run seed
npx prisma migrate dev       # Create migration

# shadcn/ui
npx shadcn@latest add button # Add component

# Git
git add .
git commit -m "message"
git push origin master
```

---

## 🆘 Troubleshooting

### Lỗi thường gặp:

**1. Cannot connect to database**
```bash
# Check MySQL running
docker ps | grep mysql
# Restart if needed
docker start mysql-dev
```

**2. Prisma Client not found**
```bash
npx prisma generate
```

**3. NextAuth session undefined**
```bash
# Check .env has NEXTAUTH_SECRET
# Restart dev server
```

**4. Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**🎉 Chúc mừng! Bạn đã có project Next.js hoàn chỉnh!**

*Last updated: November 28, 2025*
