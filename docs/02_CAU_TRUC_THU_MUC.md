# 02. CẤU TRÚC THƯ MỤC - Hiểu Rõ File Nào Làm Gì

> ⏱️ **Thời gian đọc**: 30-45 phút  
> 🎯 **Mục tiêu**: Biết file nào nằm ở đâu, làm gì, khi nào cần sửa

---

## 📁 SƠ ĐỒ CÂY THƯ MỤC

```
my-app/
├── app/                          # ⭐ ROUTES & PAGES (Next.js App Router)
│   ├── page.tsx                  # Trang chủ "/"
│   ├── layout.tsx                # Layout chung toàn site
│   ├── globals.css               # CSS toàn cục
│   │
│   ├── (public)/                 # ⭐ Group routes công khai
│   │   ├── tin-tuc/              # Route "/tin-tuc"
│   │   │   ├── page.tsx          # Listing posts
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Chi tiết post "/tin-tuc/bai-viet-1"
│   │   ├── du-an/                # Route "/du-an"
│   │   ├── videos/               # Route "/videos"
│   │   ├── y-kien/               # Route "/y-kien" (feedback)
│   │   └── gioi-thieu/           # Route "/gioi-thieu" (about)
│   │
│   ├── admin/                    # ⭐ Admin routes "/admin/*"
│   │   ├── layout.tsx            # Layout riêng cho admin
│   │   ├── page.tsx              # Redirect to dashboard
│   │   ├── login/                # Login page
│   │   ├── dashboard/            # Dashboard
│   │   ├── posts/                # Quản lý posts
│   │   │   ├── page.tsx          # List posts
│   │   │   ├── create/           # Tạo post mới
│   │   │   └── [id]/
│   │   │       └── edit/         # Sửa post
│   │   ├── projects/             # Quản lý projects
│   │   ├── categories/           # Quản lý categories
│   │   ├── slides/               # Quản lý slides
│   │   ├── videos/               # Quản lý videos
│   │   ├── feedback/             # Quản lý feedback
│   │   ├── users/                # Quản lý users
│   │   └── settings/             # Cài đặt hệ thống
│   │
│   └── api/                      # ⭐ API ROUTES
│       ├── auth/                 # NextAuth.js endpoints
│       │   └── [...nextauth]/
│       │       └── route.ts
│       ├── posts/                # Posts API
│       │   ├── route.ts          # GET all, POST create
│       │   └── [id]/
│       │       └── route.ts      # GET, PUT, DELETE by ID
│       ├── projects/             # Projects API
│       ├── categories/           # Categories API
│       ├── slides/               # Slides API
│       ├── videos/               # Videos API
│       ├── feedback/             # Feedback API
│       ├── users/                # Users API
│       ├── settings/             # Settings API
│       └── media/                # Upload API
│           └── upload/
│               └── route.ts
│
├── components/                   # ⭐ REACT COMPONENTS
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── home/                     # Homepage components
│   │   ├── HeroSection.tsx
│   │   ├── NewsSection.tsx
│   │   └── ProjectsSection.tsx
│   ├── posts/                    # Post components
│   │   ├── PostCard.tsx
│   │   ├── PostForm.tsx
│   │   └── PostList.tsx
│   ├── admin/                    # Admin-specific components
│   └── providers/                # Context providers
│       └── SessionProvider.tsx
│
├── lib/                          # ⭐ UTILITIES & CONFIGS
│   ├── db.ts                     # Prisma client instance
│   ├── auth.ts                   # NextAuth config
│   ├── utils.ts                  # Helper functions
│   └── validations.ts            # Zod schemas
│
├── prisma/                       # ⭐ DATABASE
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Migration history
│       ├── 20241101_init/
│       └── 20241115_add_settings/
│
├── public/                       # ⭐ STATIC FILES
│   ├── uploads/                  # User uploads
│   │   ├── logo/
│   │   ├── posts/
│   │   ├── projects/
│   │   └── slides/
│   └── favicon.ico
│
├── hooks/                        # Custom React hooks
│   └── use-toast.ts
│
├── docs/                         # ⭐ DOCUMENTATION (đây!)
│   ├── 00_BAT_DAU_O_DAY.md
│   ├── 01_KIEN_THUC_CO_BAN.md
│   ├── 02_CAU_TRUC_THU_MUC.md
│   └── ...
│
├── .env                          # Environment variables
├── .env.example                  # Template for .env
├── .gitignore                    # Git ignore rules
├── docker-compose.yml            # Docker orchestration
├── Dockerfile                    # Docker image build
├── middleware.ts                 # Next.js middleware (auth)
├── next.config.ts                # Next.js config
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── tailwind.config.ts            # Tailwind CSS config
```

---

## 🔍 CHI TIẾT TỪNG THƯ MỤC

### 1. `app/` - Routes & Pages

#### 1.1. Root Files

| File | Mục Đích | Khi Nào Sửa |
|------|----------|-------------|
| `page.tsx` | Trang chủ `/` | Thay đổi homepage |
| `layout.tsx` | Layout toàn site (Header, Footer) | Thêm meta tags, fonts |
| `globals.css` | CSS toàn cục | Thay đổi theme colors |

#### 1.2. Public Routes (`app/(public)/`)

**Tại sao có `(public)`?**

- `(folder)` = Route group (không tạo URL segment)
- URL vẫn là `/tin-tuc`, không phải `/(public)/tin-tuc`
- Dùng để nhóm routes cùng layout

**Structure:**

```
app/
  ├── (public)/
  │   ├── tin-tuc/
  │   │   ├── page.tsx              → /tin-tuc
  │   │   └── [slug]/
  │   │       └── page.tsx          → /tin-tuc/bai-viet-1
  │   ├── du-an/                    → /du-an
  │   ├── videos/                   → /videos
  │   ├── y-kien/                   → /y-kien
  │   └── gioi-thieu/               → /gioi-thieu
```

**Ví dụ: `app/tin-tuc/page.tsx`**

```tsx
// Listing posts page
import { db } from '@/lib/db'

export default async function TinTucPage({ searchParams }: {
  searchParams: { page?: string; search?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const search = searchParams.search || ''
  
  const posts = await db.post.findMany({
    where: {
      status: 'published',
      ...(search && {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } }
        ]
      })
    },
    skip: (page - 1) * 10,
    take: 10,
    orderBy: { published_at: 'desc' }
  })
  
  return (
    <div>
      <h1>Tin Tức</h1>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

**Ví dụ: `app/tin-tuc/[slug]/page.tsx`**

```tsx
// Post detail page
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

export default async function PostDetailPage({ params }: {
  params: { slug: string }
}) {
  const post = await db.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: true,
      category: true
    }
  })
  
  if (!post) notFound()
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
```

#### 1.3. Admin Routes (`app/admin/`)

**Structure:**

```
app/admin/
  ├── layout.tsx              # Admin layout (sidebar, auth check)
  ├── page.tsx                # Redirect to dashboard
  ├── login/                  # Login page (public)
  │   └── page.tsx
  ├── dashboard/              # Dashboard
  │   └── page.tsx
  ├── posts/                  # Posts management
  │   ├── page.tsx            # List posts
  │   ├── create/
  │   │   └── page.tsx        # Create form
  │   └── [id]/
  │       └── edit/
  │           └── page.tsx    # Edit form
  └── ...
```

**Ví dụ: `app/admin/layout.tsx`**

```tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/admin/Sidebar'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  // Kiểm tra auth
  if (!session) {
    redirect('/admin/login')
  }
  
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
```

#### 1.4. API Routes (`app/api/`)

**Convention:**

- `route.ts` = API endpoint
- HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`

**Ví dụ: `app/api/posts/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { postSchema } from '@/lib/validations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const posts = await db.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' }
    })
    
    return NextResponse.json({
      success: true,
      data: { posts }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// POST /api/posts
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const validatedData = postSchema.parse(body)
    
    const post = await db.post.create({
      data: {
        ...validatedData,
        author_id: parseInt(session.user.id)
      }
    })
    
    return NextResponse.json({
      success: true,
      data: post
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Validation error' },
      { status: 400 }
    )
  }
}
```

**Ví dụ: `app/api/posts/[id]/route.ts`**

```typescript
// GET /api/posts/123
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await db.post.findUnique({
    where: { id: parseInt(params.id) }
  })
  
  if (!post) {
    return NextResponse.json(
      { success: false, message: 'Not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json({
    success: true,
    data: post
  })
}

// PUT /api/posts/123
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  
  const updatedPost = await db.post.update({
    where: { id: parseInt(params.id) },
    data: body
  })
  
  return NextResponse.json({
    success: true,
    data: updatedPost
  })
}

// DELETE /api/posts/123
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await db.post.delete({
    where: { id: parseInt(params.id) }
  })
  
  return NextResponse.json({
    success: true,
    message: 'Deleted successfully'
  })
}
```

---

### 2. `components/` - React Components

#### 2.1. shadcn/ui (`components/ui/`)

**Auto-generated components** từ shadcn/ui CLI.

```bash
# Thêm component mới
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
```

**Cách dùng:**

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export function MyForm() {
  return (
    <Card>
      <CardHeader>
        <h2>Form Title</h2>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter name..." />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  )
}
```

#### 2.2. Layout Components (`components/layout/`)

```
components/layout/
  ├── Header.tsx        # Top navbar
  ├── Footer.tsx        # Footer
  └── Sidebar.tsx       # Admin sidebar
```

**Ví dụ: `components/layout/Header.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function Header() {
  const { data: session } = useSession()
  
  return (
    <header className="bg-blue-600 text-white">
      <nav className="container mx-auto flex items-center justify-between h-14">
        <Link href="/" className="font-bold">
          Logo
        </Link>
        
        <div className="flex gap-4">
          <Link href="/tin-tuc">Tin Tức</Link>
          <Link href="/du-an">Dự Án</Link>
          <Link href="/videos">Videos</Link>
          
          {session ? (
            <Link href="/admin">Admin</Link>
          ) : (
            <Link href="/admin/login">Đăng Nhập</Link>
          )}
        </div>
      </nav>
    </header>
  )
}
```

#### 2.3. Feature Components

**Quy tắc đặt tên:**

```
components/
  ├── posts/              # Post-related components
  │   ├── PostCard.tsx    # Display 1 post
  │   ├── PostList.tsx    # Display list posts
  │   └── PostForm.tsx    # Create/Edit form
  ├── projects/           # Project-related
  └── home/               # Homepage-specific
```

**Ví dụ: `components/posts/PostCard.tsx`**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@prisma/client'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/tin-tuc/${post.slug}`} className="block">
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
        {post.cover_image && (
          <Image
            src={post.cover_image}
            alt={post.title}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h3 className="font-bold text-lg">{post.title}</h3>
          <p className="text-gray-600 text-sm mt-2">{post.excerpt}</p>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(post.published_at).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
    </Link>
  )
}
```

---

### 3. `lib/` - Utilities & Configs

#### 3.1. `lib/db.ts` - Prisma Client

**Singleton pattern** để tránh tạo nhiều connections.

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error']
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
```

**Sử dụng:**

```typescript
import { db } from '@/lib/db'

const users = await db.user.findMany()
```

#### 3.2. `lib/auth.ts` - NextAuth Config

Xem chi tiết tại [05_AUTHENTICATION.md](./05_AUTHENTICATION.md)

#### 3.3. `lib/utils.ts` - Helper Functions

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate slug
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Format date
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

// Format number
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num)
}
```

#### 3.4. `lib/validations.ts` - Zod Schemas

```typescript
import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(255),
  content: z.string().min(1, "Nội dung không được để trống"),
  excerpt: z.string().max(500).optional(),
  cover_image: z.string().url().optional().or(z.literal("")),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  category_id: z.number().int().positive().optional().nullable()
})

export type PostFormData = z.infer<typeof postSchema>

export const userSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  full_name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  role: z.enum(['admin', 'editor']).default('editor')
})

export type UserFormData = z.infer<typeof userSchema>
```

---

### 4. `prisma/` - Database

#### 4.1. `schema.prisma`

Xem chi tiết tại [04_DATABASE_PRISMA.md](./04_DATABASE_PRISMA.md)

#### 4.2. `migrations/`

**Auto-generated** khi chạy:

```bash
npx prisma migrate dev --name migration_name
```

**Cấu trúc:**

```
migrations/
  ├── migration_lock.toml
  ├── 20241101120000_init/
  │   └── migration.sql
  └── 20241115083000_add_settings/
      └── migration.sql
```

---

### 5. Root Files

| File | Mục Đích |
|------|----------|
| `.env` | Environment variables (secret!) |
| `.env.example` | Template for .env |
| `.gitignore` | Files to ignore in Git |
| `docker-compose.yml` | Multi-container Docker setup |
| `Dockerfile` | Docker image build instructions |
| `middleware.ts` | Next.js middleware (auth, redirects) |
| `next.config.ts` | Next.js configuration |
| `package.json` | Dependencies & scripts |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `postcss.config.mjs` | PostCSS configuration |
| `components.json` | shadcn/ui configuration |

---

## 🎯 Convention & Best Practices

### Naming Convention

```
Files:
  ✅ kebab-case.tsx        → post-card.tsx
  ✅ PascalCase.tsx        → PostCard.tsx
  ❌ snake_case.tsx
  ❌ camelCase.tsx

Components:
  ✅ PascalCase            → PostCard, HeroSection
  
Functions:
  ✅ camelCase             → formatDate, createSlug
  
Constants:
  ✅ UPPER_SNAKE_CASE      → API_URL, MAX_FILE_SIZE
  
CSS Classes:
  ✅ kebab-case            → bg-blue-600, hover:shadow-lg
```

### Folder Organization

```
✅ GOOD:
components/
  ├── ui/           # shadcn components
  ├── layout/       # Layout components
  ├── posts/        # Post components
  └── projects/     # Project components

❌ BAD:
components/
  ├── Button.tsx
  ├── PostCard.tsx
  ├── Header.tsx
  └── ProjectList.tsx   # Tất cả lộn xộn
```

---

## 🔍 Quick Reference

### Tìm File Nhanh

**Cần làm gì?** → **Sửa file nào?**

| Task | File Path |
|------|-----------|
| Thay đổi trang chủ | `app/page.tsx` |
| Thêm route mới | `app/route-name/page.tsx` |
| Tạo API endpoint | `app/api/endpoint/route.ts` |
| Sửa header/footer | `components/layout/Header.tsx` |
| Thêm validation | `lib/validations.ts` |
| Sửa database schema | `prisma/schema.prisma` |
| Thêm helper function | `lib/utils.ts` |
| Config auth | `lib/auth.ts` |
| Thêm UI component | `npx shadcn-ui add component-name` |

---

## ✅ Checklist

Sau khi đọc, bạn có thể:

- [ ] Giải thích được App Router structure
- [ ] Biết file nào làm gì
- [ ] Tìm được file cần sửa khi có yêu cầu
- [ ] Hiểu convention đặt tên
- [ ] Tạo được route mới
- [ ] Tạo được API endpoint mới
- [ ] Tạo được component mới

---

### Tiếp Theo

→ Đọc **[03_LUONG_DU_LIEU.md](./03_LUONG_DU_LIEU.md)** để hiểu data flow!
