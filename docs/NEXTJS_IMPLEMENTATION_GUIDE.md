# Chi Tiết Triển Khai: Demo123 → Next.js CMS

## 📦 Cấu Trúc Package.json Đầy Đủ

```json
{
  "name": "demo123-nextjs",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@prisma/client": "^5.8.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-toast": "^1.1.5",
    "@tanstack/react-query": "^5.17.15",
    "@tiptap/extension-image": "^2.1.13",
    "@tiptap/react": "^2.1.13",
    "@tiptap/starter-kit": "^2.1.13",
    "@uploadthing/react": "^6.2.2",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "date-fns": "^3.1.0",
    "lucide-react": "^0.309.0",
    "next": "15.0.3",
    "next-auth": "^5.0.0-beta.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.3",
    "tailwind-merge": "^2.2.0",
    "uploadthing": "^6.3.3",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "15.0.3",
    "postcss": "^8",
    "prisma": "^5.8.0",
    "tailwindcss": "^3.3.0",
    "tsx": "^4.7.0",
    "typescript": "^5"
  }
}
```

---

## 🗄️ Tất Cả Models Prisma (Chi Tiết)

### File: `prisma/schema.prisma` (Full Version)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ==================== USER MODEL ====================
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

  // Relations
  posts            Post[]
  media            Media[]
  feedbackReplies  Feedback[] @relation("RepliedBy")

  @@map("users")
}

// ==================== CATEGORY MODEL ====================
model Category {
  id            Int       @id @default(autoincrement())
  name          String    @db.VarChar(100)
  slug          String    @unique @db.VarChar(100)
  description   String?   @db.Text
  parent_id     Int?
  display_order Int       @default(0)
  created_at    DateTime  @default(now())

  // Relations
  parent    Category?  @relation("CategoryParent", fields: [parent_id], references: [id], onDelete: SetNull)
  children  Category[] @relation("CategoryParent")
  posts     Post[]
  projects  Project[]

  @@map("categories")
}

// ==================== POST MODEL ====================
model Post {
  id           Int         @id @default(autoincrement())
  title        String      @db.VarChar(255)
  slug         String      @unique @db.VarChar(255)
  content      String      @db.LongText
  excerpt      String?     @db.Text
  cover_image  String?     @db.VarChar(255)
  author_id    Int
  category_id  Int?
  status       PostStatus  @default(draft)
  views        Int         @default(0)
  published_at DateTime?
  created_at   DateTime    @default(now())
  updated_at   DateTime    @updatedAt

  // Relations
  author   User      @relation(fields: [author_id], references: [id], onDelete: Cascade)
  category Category? @relation(fields: [category_id], references: [id], onDelete: SetNull)
  tags     PostTag[]

  @@index([slug])
  @@index([status])
  @@index([published_at])
  @@index([category_id])
  @@index([author_id])
  @@map("posts")
}

// ==================== TAG MODEL ====================
model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique @db.VarChar(50)
  slug  String @unique @db.VarChar(50)

  // Relations
  posts PostTag[]

  @@map("tags")
}

// ==================== POST TAG PIVOT ====================
model PostTag {
  post_id Int
  tag_id  Int

  // Relations
  post Post @relation(fields: [post_id], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tag_id], references: [id], onDelete: Cascade)

  @@id([post_id, tag_id])
  @@map("post_tags")
}

// ==================== SLIDE MODEL ====================
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

  @@index([display_order])
  @@index([is_active])
  @@map("slides")
}

// ==================== VIDEO MODEL ====================
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

// ==================== PROJECT MODEL ====================
model Project {
  id           Int            @id @default(autoincrement())
  title        String         @db.VarChar(255)
  slug         String         @unique @db.VarChar(255)
  description  String?        @db.Text
  content      String?        @db.LongText
  cover_image  String?        @db.VarChar(500)
  pdf_file     String?        @db.VarChar(500)
  category_id  Int?
  status       ProjectStatus  @default(draft)
  published_at DateTime?
  views        Int            @default(0)
  created_at   DateTime       @default(now())
  updated_at   DateTime       @updatedAt

  // Relations
  category Category? @relation(fields: [category_id], references: [id], onDelete: SetNull)

  @@index([slug])
  @@index([status])
  @@index([published_at])
  @@index([category_id])
  @@map("projects")
}

// ==================== FEEDBACK MODEL ====================
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

  // Relations
  replier User? @relation("RepliedBy", fields: [replied_by], references: [id], onDelete: SetNull)

  @@index([status])
  @@index([created_at])
  @@map("feedback")
}

// ==================== MEDIA MODEL ====================
model Media {
  id            Int      @id @default(autoincrement())
  filename      String   @db.VarChar(255)
  original_name String   @db.VarChar(255)
  file_path     String   @db.VarChar(255)
  file_type     String?  @db.VarChar(50)
  file_size     Int?
  uploaded_by   Int?
  created_at    DateTime @default(now())

  // Relations
  uploader User? @relation(fields: [uploaded_by], references: [id], onDelete: SetNull)

  @@map("media")
}

// ==================== SETTING MODEL ====================
model Setting {
  id            Int      @id @default(autoincrement())
  setting_key   String   @unique @db.VarChar(100)
  setting_value String?  @db.Text
  setting_type  String   @default("text") @db.VarChar(50)
  updated_at    DateTime @updatedAt

  @@map("settings")
}

// ==================== ENUMS ====================
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

## 🔐 NextAuth Configuration (Chi Tiết)

### File: `lib/auth.ts`

```typescript
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@demo123.vn" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email và mật khẩu không được để trống")
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error("Email hoặc mật khẩu không đúng")
        }

        if (user.status !== 'active') {
          throw new Error("Tài khoản đã bị vô hiệu hóa")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        )

        if (!isPasswordValid) {
          throw new Error("Email hoặc mật khẩu không đúng")
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.full_name || user.username,
          role: user.role,
          image: user.avatar
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      
      // Handle session update
      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
```

### File: `types/next-auth.d.ts`

```typescript
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: string
  }
}
```

---

## 🛠️ Utility Functions

### File: `lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Create Vietnamese slug
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Format date
export function formatDate(date: Date | string | null): string {
  if (!date) return ''
  const d = new Date(date)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d)
}

// Format number
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num)
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Extract text from HTML
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

// File size formatter
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
```

### File: `lib/validations.ts`

```typescript
import { z } from "zod"

// Post validation
export const postSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(255),
  slug: z.string().optional(),
  content: z.string().min(1, "Nội dung không được để trống"),
  excerpt: z.string().max(500).optional(),
  cover_image: z.string().url().optional().or(z.literal("")),
  category_id: z.number().int().positive().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
})

export type PostFormData = z.infer<typeof postSchema>

// Category validation
export const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống").max(100),
  slug: z.string().optional(),
  description: z.string().max(500).optional(),
  parent_id: z.number().int().positive().optional().nullable(),
  display_order: z.number().int().default(0),
})

export type CategoryFormData = z.infer<typeof categorySchema>

// User validation
export const userSchema = z.object({
  username: z.string().min(3, "Username tối thiểu 3 ký tự").max(50),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").optional(),
  full_name: z.string().max(100).optional(),
  role: z.enum(["admin", "editor", "user"]).default("user"),
  status: z.enum(["active", "inactive"]).default("active"),
})

export type UserFormData = z.infer<typeof userSchema>

// Feedback validation
export const feedbackSchema = z.object({
  name: z.string().min(1, "Tên không được để trống").max(100),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().max(20).optional(),
  subject: z.string().min(1, "Tiêu đề không được để trống").max(255),
  message: z.string().min(10, "Nội dung tối thiểu 10 ký tự"),
})

export type FeedbackFormData = z.infer<typeof feedbackSchema>

// Login validation
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Video validation
export const videoSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(255),
  description: z.string().max(500).optional(),
  video_url: z.string().url("URL video không hợp lệ"),
  thumbnail_url: z.string().url().optional().or(z.literal("")),
  duration: z.string().max(20).optional(),
  display_order: z.number().int().default(0),
  status: z.enum(["active", "inactive"]).default("active"),
})

export type VideoFormData = z.infer<typeof videoSchema>

// Project validation
export const projectSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(255),
  slug: z.string().optional(),
  description: z.string().max(500).optional(),
  content: z.string().optional(),
  cover_image: z.string().url().optional().or(z.literal("")),
  pdf_file: z.string().url().optional().or(z.literal("")),
  category_id: z.number().int().positive().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
})

export type ProjectFormData = z.infer<typeof projectSchema>

// Slide validation
export const slideSchema = z.object({
  title: z.string().max(255).optional(),
  description: z.string().max(500).optional(),
  image_url: z.string().url("URL hình ảnh không hợp lệ"),
  link_url: z.string().url().optional().or(z.literal("")),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
})

export type SlideFormData = z.infer<typeof slideSchema>

// Settings validation
export const settingsSchema = z.object({
  site_name: z.string().max(100).optional(),
  site_tagline: z.string().max(255).optional(),
  site_logo: z.string().url().optional().or(z.literal("")),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().max(20).optional(),
  footer_text: z.string().max(500).optional(),
  meta_description: z.string().max(500).optional(),
  meta_keywords: z.string().max(255).optional(),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
```

---

## 🎨 Toàn Bộ API Routes

### File: `app/api/categories/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createSlug } from '@/lib/utils'

// GET /api/categories
export async function GET(request: NextRequest) {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { display_order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// POST /api/categories
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
    const { name, description, parent_id, display_order } = body

    const category = await db.category.create({
      data: {
        name,
        slug: createSlug(name),
        description,
        parent_id: parent_id || null,
        display_order: display_order || 0
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: category
    }, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
```

### File: `app/api/slides/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/slides
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const showAll = searchParams.get('all') === 'true'

    const where = showAll ? {} : { is_active: true }

    const slides = await db.slide.findMany({
      where,
      orderBy: { display_order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: slides
    })
  } catch (error) {
    console.error('Get slides error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// POST /api/slides
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
    const { title, description, image_url, link_url, display_order, is_active } = body

    const slide = await db.slide.create({
      data: {
        title,
        description,
        image_url,
        link_url,
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Slide created successfully',
      data: slide
    }, { status: 201 })
  } catch (error) {
    console.error('Create slide error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
```

### File: `app/api/settings/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/settings
export async function GET() {
  try {
    const settings = await db.setting.findMany()
    
    // Convert to object
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.setting_key] = setting.setting_value
      return acc
    }, {} as Record<string, string | null>)

    return NextResponse.json({
      success: true,
      data: settingsObj
    })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// PUT /api/settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Update each setting
    for (const [key, value] of Object.entries(body)) {
      await db.setting.upsert({
        where: { setting_key: key },
        create: {
          setting_key: key,
          setting_value: value as string
        },
        update: {
          setting_value: value as string
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
```

---

## 🎨 UI Components (shadcn/ui Examples)

### File: `components/ui/data-table.tsx` (Reusable Table)

```typescript
'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Button } from './button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Sau
        </Button>
      </div>
    </div>
  )
}
```

---

## 📝 Admin Example: Posts Management

### File: `app/admin/posts/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

type Post = {
  id: number
  title: string
  slug: string
  status: string
  category: { name: string } | null
  author: { full_name: string }
  published_at: Date | null
  views: number
}

export default function PostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts?status=all&limit=100')
      const data = await res.json()
      if (data.success) {
        setPosts(data.data.posts)
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách bài viết',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast({ title: 'Thành công', description: 'Đã xóa bài viết' })
        fetchPosts()
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa bài viết',
        variant: 'destructive'
      })
    }
  }

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: 'title',
      header: 'Tiêu đề',
    },
    {
      accessorKey: 'category.name',
      header: 'Danh mục',
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <span className={`px-2 py-1 rounded text-xs ${
            status === 'published' ? 'bg-green-100 text-green-800' :
            status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {status === 'published' ? 'Đã xuất bản' : 
             status === 'draft' ? 'Nháp' : 'Lưu trữ'}
          </span>
        )
      }
    },
    {
      accessorKey: 'views',
      header: 'Lượt xem',
    },
    {
      accessorKey: 'published_at',
      header: 'Ngày xuất bản',
      cell: ({ row }) => formatDate(row.getValue('published_at'))
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const post = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/admin/posts/${post.id}/edit`)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(post.id)}
                className="text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (loading) {
    return <div className="p-8">Đang tải...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý bài viết</h1>
        <Button onClick={() => router.push('/admin/posts/create')}>
          Tạo bài viết mới
        </Button>
      </div>

      <DataTable columns={columns} data={posts} />
    </div>
  )
}
```

---

## 🗂️ Database Seed File

### File: `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo123.vn' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@demo123.vn',
      password_hash: passwordHash,
      full_name: 'Administrator',
      role: 'admin',
      status: 'active'
    }
  })
  console.log('✅ Admin user created')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'tin-tuc' },
      update: {},
      create: {
        name: 'Tin tức',
        slug: 'tin-tuc',
        description: 'Tin tức mới nhất',
        display_order: 1
      }
    }),
    prisma.category.upsert({
      where: { slug: 'quy-hoach' },
      update: {},
      create: {
        name: 'Quy hoạch',
        slug: 'quy-hoach',
        description: 'Thông tin về quy hoạch',
        display_order: 2
      }
    }),
    prisma.category.upsert({
      where: { slug: 'du-an' },
      update: {},
      create: {
        name: 'Dự án',
        slug: 'du-an',
        description: 'Các dự án đầu tư',
        display_order: 3
      }
    })
  ])
  console.log('✅ Categories created')

  // Create slides
  await Promise.all([
    prisma.slide.create({
      data: {
        title: 'Cổng thông tin Quy hoạch quốc gia',
        description: 'Hệ thống thông tin và cơ sở dữ liệu tích hợp',
        image_url: 'https://statictuoitre.mediacdn.vn/thumb_w/730/2017/1-1512755474911.jpg',
        display_order: 1,
        is_active: true
      }
    }),
    prisma.slide.create({
      data: {
        title: 'Quy hoạch phát triển bền vững',
        description: 'Định hướng phát triển kinh tế - xã hội',
        image_url: 'https://statictuoitre.mediacdn.vn/thumb_w/730/2017/7-1512755474943.jpg',
        display_order: 2,
        is_active: true
      }
    })
  ])
  console.log('✅ Slides created')

  // Create settings
  const settings = [
    { key: 'site_name', value: 'BỘ KẾ HOẠCH VÀ ĐẦU TƯ' },
    { key: 'site_tagline', value: 'Cổng thông tin và cơ sở dữ liệu tích hợp quốc gia về quy hoạch' },
    { key: 'contact_email', value: 'info@demo123.vn' },
    { key: 'contact_phone', value: '(84) 24 1234 5678' }
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { setting_key: setting.key },
      update: { setting_value: setting.value },
      create: {
        setting_key: setting.key,
        setting_value: setting.value
      }
    })
  }
  console.log('✅ Settings created')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## 🚀 Scripts Hữu Ích

### File: `package.json` (scripts section)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset && npm run db:seed",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  }
}
```

---

Tài liệu này cung cấp đầy đủ code examples cho việc migration project demo123 sang Next.js. Bạn có thể copy/paste các đoạn code này vào project mới của mình!
