# Hướng Dẫn Chuyển Đổi Project Demo123 sang Next.js

## 📋 Tổng Quan Dự Án Hiện Tại

### Kiến Trúc Hiện Tại (Traditional Stack)
- **Frontend**: Static HTML/CSS/JavaScript (Vanilla JS + Tailwind CDN)
- **Backend**: Express.js + Node.js
- **Database**: MySQL (mysql2 driver)
- **Authentication**: JWT
- **File Upload**: Multer + Sharp
- **Deployment**: Traditional VPS (Nginx + PM2)

### Cấu Trúc Thư Mục Hiện Tại
```
demo123/
├── public/                    # Frontend files (HTML)
│   ├── index.html            # Trang chủ
│   ├── tin-tuc.html          # Danh sách tin tức
│   ├── bai-viet-detail.html  # Chi tiết bài viết
│   ├── du-an.html            # Danh sách dự án
│   ├── du-an-detail.html     # Chi tiết dự án
│   ├── y-kien.html           # Form góp ý
│   ├── videos.html           # Danh sách video
│   └── uploads/              # Uploaded files
├── admin/                     # Admin panel (HTML)
│   ├── index.html            # Login
│   ├── dashboard.html        # Dashboard
│   ├── posts/                # Quản lý bài viết
│   ├── categories/           # Quản lý danh mục
│   ├── slides/               # Quản lý slides
│   ├── users/                # Quản lý users
│   ├── videos/               # Quản lý videos
│   ├── projects/             # Quản lý dự án
│   ├── feedback/             # Quản lý feedback
│   └── settings/             # Cài đặt
└── server/                    # Backend API
    ├── index.js              # Main server file
    ├── config/
    │   ├── database.js       # MySQL connection
    │   └── upload.js         # Multer config
    ├── models/               # Database models
    │   ├── Post.js
    │   ├── Category.js
    │   ├── User.js
    │   ├── Slide.js
    │   ├── Video.js
    │   ├── Project.js
    │   ├── Feedback.js
    │   └── Setting.js
    ├── routes/               # API routes
    │   ├── auth.js
    │   ├── posts.js
    │   ├── categories.js
    │   ├── slides.js
    │   ├── users.js
    │   ├── videos.js
    │   ├── projects.js
    │   ├── feedback.js
    │   ├── media.js
    │   └── settings.js
    ├── middleware/
    │   └── auth.js           # JWT middleware
    ├── utils/
    │   └── slugify.js        # Slug generation
    └── scripts/              # Database scripts
        ├── migrate.js
        ├── migrate-new.js
        ├── seed.js
        └── seed-new.js
```

---

## 🎯 Kiến Trúc Mới (Next.js)

### Tech Stack Next.js
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: MySQL (với Prisma ORM)
- **Authentication**: NextAuth.js (v5)
- **File Upload**: Next.js API Routes + uploadthing/next-cloudinary
- **Forms**: React Hook Form + Zod
- **State Management**: React Query (TanStack Query)
- **Deployment**: Vercel / VPS với Docker

### Cấu Trúc Thư Mục Next.js Đề Xuất
```
my-nextjs-cms/
├── app/                       # App Router (Next.js 15)
│   ├── (public)/             # Public routes (no auth)
│   │   ├── page.tsx          # Trang chủ
│   │   ├── tin-tuc/
│   │   │   ├── page.tsx      # Danh sách tin tức
│   │   │   └── [slug]/
│   │   │       └── page.tsx  # Chi tiết bài viết
│   │   ├── du-an/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── videos/
│   │   │   └── page.tsx
│   │   └── y-kien/
│   │       └── page.tsx
│   ├── admin/                # Admin routes (with auth)
│   │   ├── layout.tsx        # Admin layout
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── posts/
│   │   │   ├── page.tsx      # List
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── categories/
│   │   ├── slides/
│   │   ├── videos/
│   │   ├── projects/
│   │   ├── feedback/
│   │   ├── users/
│   │   └── settings/
│   ├── api/                  # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── posts/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── categories/
│   │   ├── slides/
│   │   ├── videos/
│   │   ├── projects/
│   │   ├── feedback/
│   │   ├── users/
│   │   ├── settings/
│   │   └── upload/
│   │       └── route.ts
│   ├── layout.tsx            # Root layout
│   └── globals.css
├── components/               # Reusable components
│   ├── ui/                   # shadcn/ui components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   ├── posts/
│   │   ├── PostCard.tsx
│   │   ├── PostList.tsx
│   │   └── PostEditor.tsx
│   ├── carousel/
│   │   └── HeroCarousel.tsx
│   └── forms/
│       └── FeedbackForm.tsx
├── lib/                      # Utilities & configs
│   ├── db.ts                 # Database client (Prisma)
│   ├── auth.ts               # NextAuth config
│   ├── utils.ts              # Helper functions
│   ├── validations.ts        # Zod schemas
│   └── constants.ts
├── prisma/                   # Prisma ORM
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/                   # Static assets
│   └── uploads/
├── types/                    # TypeScript types
│   └── index.ts
├── .env                      # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔄 Bảng So Sánh Chi Tiết

| Tính Năng | Hiện Tại (Express) | Next.js | Ghi Chú |
|-----------|-------------------|---------|---------|
| **Routing** | Express Router | App Router | File-based routing |
| **Rendering** | Client-side | SSR/SSG/ISR | SEO tốt hơn |
| **API** | Separate Express routes | API Routes trong /app/api | Cùng codebase |
| **Database** | mysql2 raw queries | Prisma ORM | Type-safe, auto-migration |
| **Auth** | Custom JWT | NextAuth.js | Built-in, secure |
| **Upload** | Multer | Next.js API + uploadthing | Modernized |
| **Forms** | Vanilla JS | React Hook Form + Zod | Validation tốt hơn |
| **State** | Fetch API | React Query | Caching, optimistic updates |
| **Styling** | Tailwind CDN | Tailwind CSS (compiled) | Production-ready |
| **TypeScript** | None | Full TypeScript | Type safety |
| **Deployment** | VPS + Nginx + PM2 | Vercel / Docker | Easier deployment |

---

## 📊 Database Schema (Prisma)

### Tạo file `prisma/schema.prisma`

```prisma
// This is your Prisma schema file
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id            Int       @id @default(autoincrement())
  username      String    @unique @db.VarChar(50)
  email         String    @unique @db.VarChar(100)
  password_hash String    @db.VarChar(255)
  full_name     String?   @db.VarChar(100)
  avatar        String?   @db.VarChar(255)
  role          Role      @default(user)
  status        Status    @default(active)
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt

  posts         Post[]
  media         Media[]
  feedbackReplies Feedback[] @relation("RepliedBy")

  @@map("users")
}

model Category {
  id            Int       @id @default(autoincrement())
  name          String    @db.VarChar(100)
  slug          String    @unique @db.VarChar(100)
  description   String?   @db.Text
  parent_id     Int?
  display_order Int       @default(0)
  created_at    DateTime  @default(now())

  parent        Category?  @relation("CategoryParent", fields: [parent_id], references: [id], onDelete: SetNull)
  children      Category[] @relation("CategoryParent")
  posts         Post[]
  projects      Project[]

  @@map("categories")
}

model Post {
  id           Int       @id @default(autoincrement())
  title        String    @db.VarChar(255)
  slug         String    @unique @db.VarChar(255)
  content      String    @db.LongText
  excerpt      String?   @db.Text
  cover_image  String?   @db.VarChar(255)
  author_id    Int
  category_id  Int?
  status       PostStatus @default(draft)
  views        Int       @default(0)
  published_at DateTime?
  created_at   DateTime  @default(now())
  updated_at   DateTime  @updatedAt

  author       User      @relation(fields: [author_id], references: [id], onDelete: Cascade)
  category     Category? @relation(fields: [category_id], references: [id], onDelete: SetNull)
  tags         PostTag[]

  @@index([slug])
  @@index([status])
  @@index([published_at])
  @@map("posts")
}

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

  post    Post @relation(fields: [post_id], references: [id], onDelete: Cascade)
  tag     Tag  @relation(fields: [tag_id], references: [id], onDelete: Cascade)

  @@id([post_id, tag_id])
  @@map("post_tags")
}

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

  category     Category?     @relation(fields: [category_id], references: [id], onDelete: SetNull)

  @@index([slug])
  @@index([status])
  @@index([published_at])
  @@map("projects")
}

model Feedback {
  id          Int             @id @default(autoincrement())
  name        String          @db.VarChar(100)
  email       String          @db.VarChar(100)
  phone       String?         @db.VarChar(20)
  subject     String          @db.VarChar(255)
  message     String          @db.Text
  admin_reply String?         @db.Text
  status      FeedbackStatus  @default(pending)
  replied_at  DateTime?
  replied_by  Int?
  created_at  DateTime        @default(now())
  updated_at  DateTime        @updatedAt

  replier     User?           @relation("RepliedBy", fields: [replied_by], references: [id], onDelete: SetNull)

  @@index([status])
  @@index([created_at])
  @@map("feedback")
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

  uploader      User?    @relation(fields: [uploaded_by], references: [id], onDelete: SetNull)

  @@map("media")
}

model Setting {
  id            Int      @id @default(autoincrement())
  setting_key   String   @unique @db.VarChar(100)
  setting_value String?  @db.Text
  setting_type  String   @default("text") @db.VarChar(50)
  updated_at    DateTime @updatedAt

  @@map("settings")
}

// Enums
enum Role {
  admin
  editor
  user
}

enum Status {
  active
  inactive
}

enum PostStatus {
  draft
  published
  archived
}

enum VideoStatus {
  active
  inactive
}

enum ProjectStatus {
  draft
  published
}

enum FeedbackStatus {
  pending
  answered
  archived
}
```

---

## 🚀 Các Bước Migration Chi Tiết

### **Phase 1: Khởi Tạo Project Next.js**

#### 1.1. Tạo Next.js Project

```bash
# Tạo project Next.js mới
npx create-next-app@latest my-nextjs-cms --typescript --tailwind --app --use-npm

# Options:
# ✔ Would you like to use TypeScript? Yes
# ✔ Would you like to use ESLint? Yes
# ✔ Would you like to use Tailwind CSS? Yes
# ✔ Would you like to use `src/` directory? No
# ✔ Would you like to use App Router? Yes
# ✔ Would you like to customize the default import alias? No

cd my-nextjs-cms
```

#### 1.2. Cài Đặt Dependencies

```bash
# Core dependencies
npm install prisma @prisma/client
npm install next-auth@beta bcryptjs
npm install @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers
npm install date-fns clsx tailwind-merge

# UI Components (shadcn/ui)
npx shadcn@latest init
npx shadcn@latest add button input textarea select label card dialog dropdown-menu table toast

# Upload (chọn 1 trong 2)
npm install uploadthing @uploadthing/react  # Option 1: UploadThing
# OR
npm install next-cloudinary              # Option 2: Cloudinary

# Rich text editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image

# Dev dependencies
npm install -D @types/bcryptjs
```

#### 1.3. Setup Prisma

```bash
# Initialize Prisma
npx prisma init

# Copy schema.prisma từ phần trên vào prisma/schema.prisma

# Tạo .env
cat > .env << EOF
DATABASE_URL="mysql://demo123_user:password@localhost:3306/demo123_db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
EOF

# Generate Prisma Client
npx prisma generate

# Migrate database (nếu DB mới)
npx prisma db push

# Hoặc nếu migrate từ DB cũ
npx prisma db pull
npx prisma generate
```

---

### **Phase 2: Migration Backend (API Routes)**

#### 2.1. Setup Database Client

Tạo `lib/db.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

#### 2.2. Setup NextAuth

Tạo `lib/auth.ts`:
```typescript
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "./db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || user.status !== 'active') {
          throw new Error("Invalid credentials")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password_hash)

        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.full_name,
          role: user.role
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
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
}
```

Tạo `app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

#### 2.3. Migrate API Routes

**Posts API** - `app/api/posts/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'published'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const category_id = searchParams.get('category_id')

    const where: any = { status }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ]
    }

    if (category_id) {
      where.category_id = parseInt(category_id)
    }

    const [posts, total] = await Promise.all([
      db.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, full_name: true }
          },
          category: {
            select: { id: true, name: true }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { published_at: 'desc' }
      }),
      db.post.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// POST /api/posts (Create)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, excerpt, cover_image, category_id, status } = body

    const post = await db.post.create({
      data: {
        title,
        slug: createSlug(title),
        content,
        excerpt,
        cover_image,
        category_id: category_id ? parseInt(category_id) : null,
        author_id: parseInt(session.user.id),
        status: status || 'draft',
        published_at: status === 'published' ? new Date() : null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Post created successfully',
      data: post
    }, { status: 201 })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// Helper function
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
```

**Posts by ID** - `app/api/posts/[id]/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/posts/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Check if slug or ID
    const post = isNaN(Number(id))
      ? await db.post.findUnique({ 
          where: { slug: id },
          include: {
            author: { select: { id: true, full_name: true } },
            category: { select: { id: true, name: true } }
          }
        })
      : await db.post.findUnique({ 
          where: { id: parseInt(id) },
          include: {
            author: { select: { id: true, full_name: true } },
            category: { select: { id: true, name: true } }
          }
        })

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      )
    }

    // Increment views for published posts
    if (post.status === 'published') {
      await db.post.update({
        where: { id: post.id },
        data: { views: { increment: 1 } }
      })
    }

    return NextResponse.json({
      success: true,
      data: post
    })
  } catch (error) {
    console.error('Get post error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// PUT /api/posts/[id] (Update)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { title, content, excerpt, cover_image, category_id, status } = body

    const post = await db.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        excerpt,
        cover_image,
        category_id: category_id ? parseInt(category_id) : null,
        status,
        published_at: status === 'published' ? new Date() : null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    })
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    await db.post.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
```

**Tương tự cho các API khác**: categories, slides, videos, projects, feedback, users, settings

---

### **Phase 3: Migration Frontend (Components & Pages)**

#### 3.1. Shared Components

**Header** - `components/layout/Header.tsx`:
```typescript
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function Header() {
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.data)
        }
      })
  }, [])

  return (
    <header className="h-14">
      <nav className="bg-[#1f4aa6] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              {settings?.site_logo && (
                <Image 
                  src={settings.site_logo} 
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <span className="hidden md:inline-block font-semibold">
                {settings?.site_name || 'BỘ KẾ HOẠCH VÀ ĐẦU TƯ'}
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-3 text-sm font-semibold">
              <Link href="/" className="px-3 py-2 rounded-md hover:bg-white/10">
                TRANG CHỦ
              </Link>
              <Link href="/tin-tuc" className="px-3 py-2 rounded-md hover:bg-white/10">
                TIN TỨC
              </Link>
              <Link href="/du-an" className="px-3 py-2 rounded-md hover:bg-white/10">
                DỰ ÁN
              </Link>
              <Link href="/y-kien" className="px-3 py-2 rounded-md hover:bg-white/10">
                Ý KIẾN - KIẾN NGHỊ
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
```

**Hero Carousel** - `components/carousel/HeroCarousel.tsx`:
```typescript
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Slide {
  id: number
  title: string | null
  description: string | null
  image_url: string
  link_url: string | null
}

export function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetch('/api/slides')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSlides(data.data)
        }
      })
  }, [])

  useEffect(() => {
    if (slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides])

  if (slides.length === 0) return null

  return (
    <div className="relative h-[calc(100vh-3.5rem)] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-800 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image_url}
            alt={slide.title || ''}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 to-slate-900/30" />
        </div>
      ))}
      
      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {slides[currentIndex]?.title}
          </h1>
          <p className="text-xl md:text-2xl">
            {slides[currentIndex]?.description}
          </p>
        </div>
      </div>
    </div>
  )
}
```

#### 3.2. Public Pages

**Home Page** - `app/page.tsx`:
```typescript
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroCarousel } from '@/components/carousel/HeroCarousel'
import { db } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage() {
  // Fetch latest posts
  const posts = await db.post.findMany({
    where: { status: 'published' },
    include: {
      category: { select: { name: true } },
      author: { select: { full_name: true } }
    },
    orderBy: { published_at: 'desc' },
    take: 4
  })

  // Fetch videos
  const videos = await db.video.findMany({
    where: { status: 'active' },
    orderBy: { display_order: 'asc' },
    take: 3
  })

  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <HeroCarousel />

        {/* News Section */}
        <section className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Tin tức</h2>
              <Link href="/tin-tuc" className="text-blue-600 hover:underline">
                Xem thêm
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/tin-tuc/${post.slug}`}
                  className="group"
                >
                  <article className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition">
                    {post.cover_image && (
                      <div className="relative h-48">
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Videos Section */}
        <section className="bg-slate-50 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Video</h2>
              <Link href="/videos" className="text-blue-600 hover:underline">
                Xem thêm
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="rounded-lg overflow-hidden shadow-md">
                  <div className="relative aspect-video">
                    <iframe
                      src={video.video_url}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
```

**News List Page** - `app/tin-tuc/page.tsx`:
```typescript
'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function NewsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/posts?page=${page}&limit=9&status=published`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPosts(data.data.posts)
          setPagination(data.data.pagination)
        }
        setLoading(false)
      })
  }, [page])

  return (
    <>
      <Header />
      
      <main className="bg-slate-50 py-12 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Tin tức</h1>

          {loading ? (
            <div className="text-center py-12">Đang tải...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/tin-tuc/${post.slug}`}
                    className="group"
                  >
                    <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                      {post.cover_image && (
                        <div className="relative h-48">
                          <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="mt-3 text-xs text-gray-500">
                          {new Date(post.published_at).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white rounded disabled:opacity-50"
                  >
                    Trước
                  </button>
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-4 py-2 rounded ${
                        p === page ? 'bg-blue-600 text-white' : 'bg-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 bg-white rounded disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
```

**Post Detail Page** - `app/tin-tuc/[slug]/page.tsx`:
```typescript
import { db } from '@/lib/db'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({
    where: { slug: params.slug }
  })

  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: post.cover_image ? [post.cover_image] : []
    }
  }
}

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: { select: { full_name: true } },
      category: { select: { name: true } }
    }
  })

  if (!post || post.status !== 'published') {
    notFound()
  }

  // Increment views
  await db.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  })

  return (
    <>
      <Header />
      
      <main className="bg-white py-12">
        <article className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex gap-4 text-sm text-gray-600 mb-6">
            <span>{post.category?.name}</span>
            <span>•</span>
            <span>{new Date(post.published_at!).toLocaleDateString('vi-VN')}</span>
            <span>•</span>
            <span>{post.author.full_name}</span>
            <span>•</span>
            <span>{post.views} lượt xem</span>
          </div>

          {post.cover_image && (
            <div className="relative w-full h-96 mb-8">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>

      <Footer />
    </>
  )
}
```

---

### **Phase 4: Admin Panel**

#### 4.1. Admin Layout

`app/admin/layout.tsx`:
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login')
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
```

#### 4.2. Admin Dashboard

`app/admin/dashboard/page.tsx`:
```typescript
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminDashboard() {
  const [postsCount, usersCount, projectsCount, feedbackCount] = await Promise.all([
    db.post.count(),
    db.user.count(),
    db.project.count(),
    db.feedback.count({ where: { status: 'pending' } })
  ])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bài viết</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{postsCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{usersCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dự án</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{projectsCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Góp ý chờ xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{feedbackCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

---

## 📝 Checklist Migration

### ✅ Completed Tasks
- [ ] Phase 1: Setup Next.js project
  - [ ] Create Next.js app with TypeScript
  - [ ] Install dependencies (Prisma, NextAuth, etc.)
  - [ ] Setup Prisma schema
  - [ ] Configure database connection
  
- [ ] Phase 2: Backend Migration
  - [ ] Setup Prisma ORM
  - [ ] Configure NextAuth.js
  - [ ] Migrate API routes:
    - [ ] Auth API
    - [ ] Posts API
    - [ ] Categories API
    - [ ] Slides API
    - [ ] Videos API
    - [ ] Projects API
    - [ ] Feedback API
    - [ ] Users API
    - [ ] Settings API
    - [ ] Media/Upload API

- [ ] Phase 3: Frontend Migration
  - [ ] Create shared components (Header, Footer)
  - [ ] Build public pages:
    - [ ] Home page
    - [ ] News listing
    - [ ] News detail
    - [ ] Projects listing
    - [ ] Projects detail
    - [ ] Videos page
    - [ ] Feedback page
  
- [ ] Phase 4: Admin Panel
  - [ ] Admin layout with sidebar
  - [ ] Dashboard
  - [ ] Posts management (CRUD)
  - [ ] Categories management
  - [ ] Slides management
  - [ ] Videos management
  - [ ] Projects management
  - [ ] Feedback management
  - [ ] Users management
  - [ ] Settings

- [ ] Phase 5: Testing & Deployment
  - [ ] Test all API endpoints
  - [ ] Test authentication flow
  - [ ] Test file uploads
  - [ ] SEO optimization
  - [ ] Performance optimization
  - [ ] Deploy to Vercel/VPS

---

## 🚀 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
```

### Option 2: Docker + VPS

Tạo `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Tạo `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://user:password@db:3306/demo123_db
      - NEXTAUTH_SECRET=your-secret
      - NEXTAUTH_URL=https://yourdomain.com
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: demo123_db
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

---

## 🎓 Learning Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **NextAuth.js**: https://next-auth.js.org
- **shadcn/ui**: https://ui.shadcn.com
- **TanStack Query**: https://tanstack.com/query

---

## 💡 Best Practices

1. **Use Server Components** by default, Client Components only when needed
2. **Implement proper error handling** with error.tsx and not-found.tsx
3. **Optimize images** with Next.js Image component
4. **Use React Query** for client-side data fetching and caching
5. **Implement proper TypeScript types** for all data
6. **Use Zod** for validation on both client and server
7. **Implement proper SEO** with metadata API
8. **Use Prisma migrations** for database changes
9. **Implement proper logging** and monitoring
10. **Write tests** for critical functionality

---

## ⚠️ Common Pitfalls

1. **Don't use client components unnecessarily** - Wastes resources
2. **Don't forget to handle loading and error states**
3. **Don't expose sensitive data** in client components
4. **Don't skip database indexes** - Performance issues
5. **Don't hardcode API URLs** - Use environment variables
6. **Don't forget to validate user input** on server side
7. **Don't skip authentication checks** in API routes
8. **Don't store passwords in plain text** - Always hash
9. **Don't forget to handle file upload security**
10. **Don't skip database connection pooling**

---

## 📞 Support

Nếu gặp vấn đề trong quá trình migration:

1. Check Next.js documentation
2. Review Prisma documentation  
3. Check GitHub issues
4. Ask on Stack Overflow
5. Contact development team

---

**Chúc bạn migration thành công! 🎉**
