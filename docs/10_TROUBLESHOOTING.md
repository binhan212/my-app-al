# 🔧 TROUBLESHOOTING - GIẢI QUYẾT LỖI & TỐI ƯU HÓA

> **Mục tiêu**: Hướng dẫn debug, fix lỗi thường gặp, tối ưu hiệu suất cho dự án Next.js

---

## 📋 Mục Lục

1. [Database & Prisma Errors](#1-database--prisma-errors)
2. [Authentication Errors](#2-authentication-errors)
3. [API Route Errors](#3-api-route-errors)
4. [Build & TypeScript Errors](#4-build--typescript-errors)
5. [UI & Component Errors](#5-ui--component-errors)
6. [Performance Optimization](#6-performance-optimization)
7. [Debugging Tools](#7-debugging-tools)
8. [FAQ - Câu Hỏi Thường Gặp](#8-faq---câu-hỏi-thường-gặp)

---

## 1. Database & Prisma Errors

### ❌ Error: P1001 - Can't reach database server

**Mô tả:**
```
PrismaClientInitializationError: Can't reach database server at `localhost:3306`
```

**Nguyên nhân:**
- MySQL chưa chạy
- Port 3306 bị block
- `DATABASE_URL` sai

**Giải pháp:**

```bash
# 1. Kiểm tra MySQL có chạy không
# Windows
Get-Service MySQL80

# macOS
brew services list | grep mysql

# Linux
sudo systemctl status mysql

# Docker
docker ps | grep mysql

# 2. Start MySQL nếu chưa chạy
# Windows
Start-Service MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql

# Docker
docker start mysql-dev

# 3. Test connection
mysql -h localhost -u demo123_user -pdemo123_pass demo123_db

# 4. Kiểm tra .env
cat .env | grep DATABASE_URL
# DATABASE_URL="mysql://demo123_user:demo123_pass@localhost:3306/demo123_db"
```

### ❌ Error: P1003 - Database does not exist

**Mô tả:**
```
Error: P1003: Database `demo123_db` does not exist on the database server at `localhost:3306`
```

**Nguyên nhân:** Chưa tạo database

**Giải pháp:**

```sql
-- Vào MySQL
mysql -u root -p

-- Tạo database
CREATE DATABASE demo123_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user (nếu chưa có)
CREATE USER 'demo123_user'@'localhost' IDENTIFIED BY 'demo123_pass';
GRANT ALL PRIVILEGES ON demo123_db.* TO 'demo123_user'@'localhost';
FLUSH PRIVILEGES;

-- Kiểm tra
SHOW DATABASES;
```

### ❌ Error: P1000 - Authentication failed

**Mô tả:**
```
Error: P1000: Authentication failed against database server at `localhost`
```

**Nguyên nhân:** Username/password sai trong `DATABASE_URL`

**Giải pháp:**

```bash
# 1. Kiểm tra .env
cat .env
# DATABASE_URL="mysql://demo123_user:demo123_pass@localhost:3306/demo123_db"

# 2. Test login MySQL
mysql -u demo123_user -pdemo123_pass

# 3. Nếu login failed, reset password
mysql -u root -p

# Trong MySQL:
ALTER USER 'demo123_user'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;

# 4. Update .env với password mới
```

### ❌ Error: Prisma Client is not generated

**Mô tả:**
```
Error: @prisma/client did not initialize yet. Please run "prisma generate"
```

**Nguyên nhân:** Chưa generate Prisma Client

**Giải pháp:**

```bash
# Generate Prisma Client
npx prisma generate

# Restart dev server
npm run dev
```

### ❌ Error: Migration failed

**Mô tả:**
```
Error: Migration failed to apply cleanly to the shadow database
```

**Nguyên nhân:** 
- Schema có conflict
- Database đang có data không tương thích

**Giải pháp:**

```bash
# Option 1: Reset database (development only!)
npx prisma migrate reset

# Option 2: Push schema (bỏ qua migrations)
npx prisma db push

# Option 3: Xem chi tiết migration status
npx prisma migrate status

# Option 4: Resolve conflicts thủ công
npx prisma migrate resolve --applied "migration-name"
```

### ❌ Error: Unique constraint violation

**Mô tả:**
```
Error: P2002: Unique constraint failed on the fields: (`slug`)
```

**Nguyên nhân:** Cố gắng insert record với giá trị trùng unique field (ví dụ: slug)

**Giải pháp:**

```typescript
// ❌ BAD: Không check trùng
const post = await db.post.create({
  data: {
    title: "Bài viết mới",
    slug: "bai-viet-moi", // Có thể đã tồn tại!
    // ...
  }
})

// ✅ GOOD: Check trước khi tạo
const existingPost = await db.post.findUnique({
  where: { slug: "bai-viet-moi" }
})

if (existingPost) {
  return NextResponse.json(
    { success: false, message: "Slug đã tồn tại" },
    { status: 409 }
  )
}

const post = await db.post.create({
  data: {
    title: "Bài viết mới",
    slug: "bai-viet-moi",
    // ...
  }
})

// Hoặc sử dụng upsert
const post = await db.post.upsert({
  where: { slug: "bai-viet-moi" },
  update: { title: "Bài viết mới" },
  create: {
    title: "Bài viết mới",
    slug: "bai-viet-moi",
    // ...
  }
})
```

### ❌ Error: Foreign key constraint failed

**Mô tả:**
```
Error: P2003: Foreign key constraint failed on the field: `author_id`
```

**Nguyên nhân:** Tham chiếu tới record không tồn tại (ví dụ: author_id = 999 nhưng user id 999 không tồn tại)

**Giải pháp:**

```typescript
// ✅ Kiểm tra author tồn tại trước
const author = await db.user.findUnique({
  where: { id: authorId }
})

if (!author) {
  return NextResponse.json(
    { success: false, message: "User không tồn tại" },
    { status: 404 }
  )
}

// Sau đó mới tạo post
const post = await db.post.create({
  data: {
    title: "Bài viết",
    author_id: authorId,
    // ...
  }
})
```

### 🔍 Debug Prisma Queries

**Bật logging để xem SQL queries:**

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'], // ← Enable logging
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

**Output:**

```
prisma:query SELECT `posts`.`id`, `posts`.`title` FROM `posts` WHERE 1=1
prisma:query Duration: 5ms
```

---

## 2. Authentication Errors

### ❌ Error: NEXTAUTH_SECRET not set

**Mô tả:**
```
Error: Please define a `secret` in production
```

**Nguyên nhân:** Thiếu `NEXTAUTH_SECRET` trong `.env`

**Giải pháp:**

```bash
# Generate secret
openssl rand -base64 32
# Output: Kj2h3k4j5h6k7j8h9k0j1k2j3k4j5h6k7j8h9k0=

# Thêm vào .env
echo 'NEXTAUTH_SECRET="Kj2h3k4j5h6k7j8h9k0j1k2j3k4j5h6k7j8h9k0="' >> .env

# Restart server
npm run dev
```

### ❌ Error: Invalid credentials

**Mô tả:** Login failed, trả về "Email hoặc mật khẩu không đúng"

**Nguyên nhân:**
- Email/password sai
- Password hash không match
- User chưa tồn tại trong database

**Debug:**

```typescript
// lib/auth.ts - thêm logging
authorize: async (credentials) => {
  console.log('📧 Login attempt:', credentials?.email)
  
  const user = await db.user.findUnique({
    where: { email: credentials?.email }
  })
  
  console.log('👤 User found:', user ? 'Yes' : 'No')
  
  if (!user) {
    console.log('❌ User not found')
    return null
  }
  
  const passwordMatch = await bcrypt.compare(
    credentials!.password,
    user.password
  )
  
  console.log('🔑 Password match:', passwordMatch ? 'Yes' : 'No')
  
  if (!passwordMatch) {
    console.log('❌ Password incorrect')
    return null
  }
  
  console.log('✅ Login successful')
  return {
    id: user.id.toString(),
    email: user.email,
    name: user.full_name,
    role: user.role,
  }
}
```

**Tạo user test:**

```typescript
// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await db.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      full_name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    }
  })
  
  console.log('✅ Created admin:', admin.email)
  console.log('Password: admin123')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
```

```bash
# Chạy script
npx ts-node scripts/create-admin.ts

# Login với:
# Email: admin@example.com
# Password: admin123
```

### ❌ Error: Session not found

**Mô tả:** `useSession()` trả về `null` hoặc `undefined`

**Nguyên nhân:**
- Chưa wrap component với `SessionProvider`
- Server component đang dùng `useSession()` (chỉ dùng trong client component)

**Giải pháp:**

```typescript
// ❌ BAD: Server Component
export default async function Page() {
  const { data: session } = useSession() // Error!
  // ...
}

// ✅ GOOD: Server Component - dùng getServerSession
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function Page() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/admin/login')
  }
  // ...
}

// ✅ GOOD: Client Component - dùng useSession
'use client'

import { useSession } from 'next-auth/react'

export default function Page() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return <div>Not authenticated</div>
  }
  // ...
}
```

**Check SessionProvider:**

```typescript
// app/layout.tsx
import { Providers } from '@/components/providers/providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers> {/* ← SessionProvider bên trong */}
          {children}
        </Providers>
      </body>
    </html>
  )
}

// components/providers/providers.tsx
'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

### ❌ Error: Redirect loop after login

**Mô tả:** Sau khi login, bị redirect liên tục giữa login page và dashboard

**Nguyên nhân:** Middleware hoặc callback config sai

**Giải pháp:**

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname.startsWith('/admin/login')
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin') && !isAuthPage

  // Nếu đang ở login page và đã login → redirect dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // Nếu ở admin page và chưa login → redirect login
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

## 3. API Route Errors

### ❌ Error: 405 Method Not Allowed

**Mô tả:**
```
{
  "success": false,
  "message": "Method Not Allowed"
}
```

**Nguyên nhân:** API route không hỗ trợ HTTP method đang dùng

**Giải pháp:**

```typescript
// app/api/posts/route.ts

// ❌ BAD: Chỉ có GET
export async function GET(request: NextRequest) {
  // ...
}

// Gọi POST → 405 Error!

// ✅ GOOD: Hỗ trợ nhiều methods
export async function GET(request: NextRequest) {
  // Handle GET
}

export async function POST(request: NextRequest) {
  // Handle POST
}

export async function PUT(request: NextRequest) {
  // Handle PUT
}

export async function DELETE(request: NextRequest) {
  // Handle DELETE
}
```

### ❌ Error: 500 Internal Server Error

**Mô tả:**
```
{
  "success": false,
  "message": "Lỗi server"
}
```

**Debug:**

```typescript
// app/api/posts/route.ts

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // ✅ Log để debug
    console.log('📥 Request body:', body)
    
    // Validation
    const validatedData = postSchema.parse(body)
    console.log('✅ Validated data:', validatedData)
    
    // Database query
    const post = await db.post.create({
      data: validatedData
    })
    console.log('✅ Created post:', post.id)
    
    return NextResponse.json({
      success: true,
      data: post
    }, { status: 201 })
  } catch (error) {
    // ✅ Log chi tiết error
    console.error('❌ API Error:', error)
    
    // Zod validation error
    if (error instanceof z.ZodError) {
      console.error('📋 Validation errors:', error.errors)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors
        },
        { status: 400 }
      )
    }
    
    // Prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('🗄️ Prisma error code:', error.code)
      console.error('🗄️ Prisma meta:', error.meta)
      
      if (error.code === 'P2002') {
        return NextResponse.json(
          { success: false, message: 'Dữ liệu đã tồn tại' },
          { status: 409 }
        )
      }
    }
    
    // Generic error
    return NextResponse.json(
      { 
        success: false, 
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
```

### ❌ Error: CORS Error (nếu gọi từ external domain)

**Mô tả:**
```
Access to fetch at 'http://localhost:3000/api/posts' from origin 'http://other-domain.com' 
has been blocked by CORS policy
```

**Giải pháp:**

```typescript
// app/api/posts/route.ts

export async function GET(request: NextRequest) {
  const data = await db.post.findMany()
  
  const response = NextResponse.json({
    success: true,
    data
  })
  
  // ✅ Thêm CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}

// Handle preflight request
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

### ❌ Error: Request body too large

**Mô tả:**
```
PayloadTooLargeError: request entity too large
```

**Nguyên nhân:** Upload file quá lớn

**Giải pháp:**

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Default: 1mb
    },
  },
}

export default nextConfig
```

---

## 4. Build & TypeScript Errors

### ❌ Error: Type 'X' is not assignable to type 'Y'

**Mô tả:**
```typescript
Type 'string | null' is not assignable to type 'string'.
  Type 'null' is not assignable to type 'string'.
```

**Giải pháp:**

```typescript
// ❌ BAD
interface PostCardProps {
  title: string
  coverImage: string  // Không cho phép null
}

const post = await db.post.findUnique({
  where: { id: 1 }
})

<PostCard title={post.title} coverImage={post.cover_image} />
// Error: post.cover_image có thể null!

// ✅ GOOD: Option 1 - Cho phép null
interface PostCardProps {
  title: string
  coverImage: string | null
}

// ✅ GOOD: Option 2 - Fallback value
<PostCard 
  title={post.title} 
  coverImage={post.cover_image || '/placeholder.jpg'} 
/>

// ✅ GOOD: Option 3 - Non-null assertion (chỉ khi chắc chắn)
<PostCard 
  title={post.title} 
  coverImage={post.cover_image!} 
/>

// ✅ GOOD: Option 4 - Conditional rendering
{post.cover_image && (
  <PostCard title={post.title} coverImage={post.cover_image} />
)}
```

### ❌ Error: Cannot find module '@/...'

**Mô tả:**
```
Error: Cannot find module '@/lib/db'
```

**Nguyên nhân:** TypeScript path alias không hoạt động

**Giải pháp:**

```json
// tsconfig.json - Kiểm tra có cấu hình này
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

```bash
# Restart TypeScript server (VS Code)
Ctrl+Shift+P → TypeScript: Restart TS Server

# Restart dev server
npm run dev
```

### ❌ Error: Module not found during build

**Mô tả:**
```
Module not found: Can't resolve 'some-package'
```

**Giải pháp:**

```bash
# 1. Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Clear Next.js cache
rm -rf .next

# 3. Build lại
npm run build
```

### ❌ Error: ESLint errors prevent build

**Mô tả:**
```
Error: ESLint: 'React' is defined but never used. (no-unused-vars)
```

**Giải pháp:**

```typescript
// ❌ BAD: Import React không cần thiết (Next.js 13+)
import React from 'react'

export default function Page() {
  return <div>Hello</div>
}

// ✅ GOOD: Không cần import React
export default function Page() {
  return <div>Hello</div>
}

// Hoặc tạm thời disable ESLint (không khuyến khích)
// next.config.ts
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
}
```

### ❌ Error: Hydration mismatch

**Mô tả:**
```
Warning: Text content did not match. Server: "..." Client: "..."
```

**Nguyên nhân:** HTML render trên server khác với client (thường do dùng `Date.now()`, `Math.random()`)

**Giải pháp:**

```typescript
// ❌ BAD: Server và client khác nhau
export default function Page() {
  const now = new Date().toISOString() // Mỗi lần render khác nhau!
  return <div>{now}</div>
}

// ✅ GOOD: Dùng useEffect cho client-only code
'use client'

import { useState, useEffect } from 'react'

export default function Page() {
  const [now, setNow] = useState<string | null>(null)
  
  useEffect(() => {
    setNow(new Date().toISOString())
  }, [])
  
  if (!now) return <div>Loading...</div>
  
  return <div>{now}</div>
}

// ✅ GOOD: Suppress warning nếu chấp nhận được
<div suppressHydrationWarning>
  {new Date().toISOString()}
</div>
```

---

## 5. UI & Component Errors

### ❌ Error: Image optimization failed

**Mô tả:**
```
Error: Failed to optimize image
```

**Nguyên nhân:** 
- Image URL không hợp lệ
- External domain chưa được config

**Giải pháp:**

```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Cho phép tất cả domains (cẩn thận!)
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    // Hoặc dùng domains (deprecated)
    domains: ['img.youtube.com', 'i.ytimg.com'],
  },
}

export default nextConfig
```

```typescript
// ✅ Thêm error handling cho Image
import Image from 'next/image'
import { useState } from 'react'

export function PostImage({ src, alt }: { src: string | null, alt: string }) {
  const [error, setError] = useState(false)
  
  if (!src || error) {
    return (
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">Không có ảnh</span>
      </div>
    )
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={400}
      onError={() => setError(true)}
    />
  )
}
```

### ❌ Error: 'X' is not a valid React component

**Mô tả:**
```
Error: Objects are not valid as a React child
```

**Nguyên nhân:** Cố gắng render object thay vì JSX

**Giải pháp:**

```typescript
// ❌ BAD
const user = { name: 'John', email: 'john@example.com' }
return <div>{user}</div> // Error!

// ✅ GOOD
return <div>{user.name}</div>

// ✅ GOOD: JSON.stringify để debug
return <div>{JSON.stringify(user)}</div>
```

### ❌ Error: Too many re-renders

**Mô tả:**
```
Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.
```

**Nguyên nhân:** `setState` trong render phase

**Giải pháp:**

```typescript
// ❌ BAD: setState trong render
export default function Page() {
  const [count, setCount] = useState(0)
  setCount(count + 1) // Infinite loop!
  return <div>{count}</div>
}

// ✅ GOOD: setState trong useEffect
export default function Page() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    setCount(count + 1)
  }, []) // Chỉ chạy 1 lần
  
  return <div>{count}</div>
}

// ✅ GOOD: setState trong event handler
export default function Page() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

### ❌ Error: Cannot update component while rendering

**Mô tả:**
```
Warning: Cannot update a component while rendering a different component
```

**Nguyên nhân:** setState của parent component trong child component render

**Giải pháp:**

```typescript
// ❌ BAD
function Child({ onMount }: { onMount: () => void }) {
  onMount() // Gọi ngay trong render
  return <div>Child</div>
}

function Parent() {
  const [mounted, setMounted] = useState(false)
  return <Child onMount={() => setMounted(true)} />
}

// ✅ GOOD: Dùng useEffect
function Child({ onMount }: { onMount: () => void }) {
  useEffect(() => {
    onMount()
  }, [onMount])
  return <div>Child</div>
}
```

---

## 6. Performance Optimization

### 🚀 Optimize Database Queries

**Problem:** Slow API responses

**Solution:**

```typescript
// ❌ BAD: N+1 query problem
const posts = await db.post.findMany()
for (const post of posts) {
  const author = await db.user.findUnique({
    where: { id: post.author_id }
  })
  // ...
}

// ✅ GOOD: Include relations
const posts = await db.post.findMany({
  include: {
    author: {
      select: { id: true, full_name: true }
    },
    category: {
      select: { id: true, name: true }
    }
  }
})

// ✅ GOOD: Select only needed fields
const posts = await db.post.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    cover_image: true,
    author: {
      select: { full_name: true }
    }
  }
})

// ✅ GOOD: Add index (schema.prisma)
model Post {
  id    Int    @id @default(autoincrement())
  slug  String @unique
  title String
  
  @@index([created_at]) // ← Tăng tốc ORDER BY created_at
  @@index([status, created_at]) // ← Composite index
}
```

### 🚀 Optimize Images

```typescript
// ✅ Sử dụng Next.js Image component
import Image from 'next/image'

<Image
  src={post.cover_image}
  alt={post.title}
  width={800}
  height={400}
  quality={75}  // Default: 75
  priority={index < 2}  // Chỉ priority cho ảnh above-the-fold
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Low-quality placeholder
/>

// ✅ Responsive images
<Image
  src={post.cover_image}
  alt={post.title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
/>
```

### 🚀 Code Splitting & Dynamic Imports

```typescript
// ✅ Dynamic import cho heavy components
import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  loading: () => <div>Đang tải...</div>,
  ssr: false // Chỉ load trên client
})

export default function Page() {
  return <VideoPlayer videoId="abc123" />
}

// ✅ Lazy load components when needed
const [showModal, setShowModal] = useState(false)

{showModal && (
  <Suspense fallback={<div>Loading...</div>}>
    <HeavyModal />
  </Suspense>
)}
```

### 🚀 Caching with React Query

```typescript
// ✅ Cache API responses
'use client'

import { useQuery } from '@tanstack/react-query'

export function PostsList() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts')
      return res.json()
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    gcTime: 10 * 60 * 1000, // Garbage collect sau 10 phút
  })

  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {data.data.posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

### 🚀 Memoization

```typescript
import { useMemo, useCallback } from 'react'

export function ExpensiveComponent({ items }: { items: Item[] }) {
  // ✅ Memoize expensive calculations
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name))
  }, [items])
  
  // ✅ Memoize callbacks
  const handleClick = useCallback((id: number) => {
    console.log('Clicked:', id)
  }, [])
  
  return (
    <div>
      {sortedItems.map(item => (
        <ItemCard 
          key={item.id} 
          item={item} 
          onClick={handleClick}
        />
      ))}
    </div>
  )
}

// ✅ Memo component
import { memo } from 'react'

const ItemCard = memo(function ItemCard({ item, onClick }) {
  return (
    <div onClick={() => onClick(item.id)}>
      {item.name}
    </div>
  )
})
```

---

## 7. Debugging Tools

### 🔍 Browser DevTools

**Console Logging:**

```typescript
// ✅ Structured logging
console.log('📥 API Request:', { method: 'POST', url: '/api/posts', body })
console.error('❌ Error:', error)
console.warn('⚠️ Warning:', message)
console.table([{ id: 1, name: 'Post 1' }, { id: 2, name: 'Post 2' }])

// ✅ Group logs
console.group('🔧 User Login')
console.log('Email:', email)
console.log('Timestamp:', new Date())
console.groupEnd()
```

**Network Tab:**
- Xem tất cả API requests
- Check response status codes
- Inspect headers, body, timing

**React DevTools:**
- Install: [React Developer Tools extension](https://react.dev/learn/react-developer-tools)
- Inspect component tree
- View props, state, hooks

### 🔍 Prisma Studio

```bash
# Mở Prisma Studio
npx prisma studio

# Truy cập: http://localhost:5555
```

**Tính năng:**
- ✅ Xem tất cả tables và data
- ✅ Edit records trực tiếp
- ✅ Filter, search, sort
- ✅ Create, delete records

### 🔍 Database Logs

```bash
# MySQL query log
# Thêm vào my.cnf (hoặc my.ini trên Windows)
[mysqld]
general_log = 1
general_log_file = /var/log/mysql/query.log

# Restart MySQL
sudo systemctl restart mysql

# Xem logs
tail -f /var/log/mysql/query.log
```

### 🔍 VS Code Debugger

**File `.vscode/launch.json`:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "serverReadyAction": {
        "pattern": "started server on .+, url: (https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

**Sử dụng:**
1. Đặt breakpoint (click vào số dòng)
2. Press `F5` hoặc Run → Start Debugging
3. Code sẽ dừng tại breakpoint

---

## 8. FAQ - Câu Hỏi Thường Gặp

### ❓ Làm sao để reset password admin?

```bash
# Tạo script scripts/reset-password.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const email = 'admin@example.com'
  const newPassword = 'newpassword123'
  
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  await db.user.update({
    where: { email },
    data: { password: hashedPassword }
  })
  
  console.log('✅ Password reset for:', email)
  console.log('New password:', newPassword)
}

main().finally(() => db.$disconnect())

# Chạy
npx ts-node scripts/reset-password.ts
```

### ❓ Làm sao để backup database?

```bash
# MySQL dump
mysqldump -u demo123_user -pdemo123_pass demo123_db > backup-$(date +%Y%m%d).sql

# Restore
mysql -u demo123_user -pdemo123_pass demo123_db < backup-20250128.sql

# Docker MySQL
docker exec mysql-dev mysqldump -u root -proot123 demo123_db > backup.sql

# Restore (Docker)
docker exec -i mysql-dev mysql -u root -proot123 demo123_db < backup.sql
```

### ❓ Làm sao để xóa tất cả posts?

```bash
# Via Prisma Studio
npx prisma studio
# Vào table posts → Select All → Delete

# Via MySQL
mysql -u demo123_user -pdemo123_pass demo123_db
DELETE FROM posts;

# Via Prisma script
npx ts-node -e "
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
db.post.deleteMany().then(() => console.log('✅ Deleted all posts'));
"
```

### ❓ Port 3000 bị chiếm, dùng port khác?

```bash
# Chạy trên port 3001
PORT=3001 npm run dev

# Windows PowerShell
$env:PORT=3001; npm run dev

# Permanent (package.json)
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```

### ❓ Làm sao để clear cache Next.js?

```bash
# Xóa .next folder
rm -rf .next

# Windows
Remove-Item -Recurse -Force .next

# Clear node_modules (nếu cần)
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### ❓ Upload file bị lỗi, file đi đâu?

```typescript
// Kiểm tra middleware upload
// app/api/upload/route.ts

// Files được lưu tại:
public/uploads/posts/     ← Ảnh posts
public/uploads/projects/  ← Ảnh projects
public/uploads/pdfs/      ← PDF files
public/uploads/slides/    ← Ảnh slides
public/uploads/media/     ← Media khác

// Check quyền folder (Linux/Mac)
ls -la public/uploads/

// Tạo folder nếu chưa có
mkdir -p public/uploads/{posts,projects,pdfs,slides,media}
chmod 755 public/uploads/*
```

### ❓ Database migration bị conflict?

```bash
# Xem status
npx prisma migrate status

# Resolve specific migration
npx prisma migrate resolve --applied "20250128_migration_name"

# Rollback (manual)
# 1. Restore backup
# 2. Xóa folder migrations/20250128_migration_name
# 3. Run migrate dev again

# Reset toàn bộ (development only!)
npx prisma migrate reset
```

### ❓ Làm sao biết query nào chậm?

```typescript
// Enable Prisma query logging
// lib/db.ts
export const db = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
  ],
})

db.$on('query', (e) => {
  if (e.duration > 1000) { // > 1 second
    console.warn('⚠️ Slow query:', e.query)
    console.warn('Duration:', e.duration + 'ms')
  }
})

// Hoặc dùng MySQL slow query log
# my.cnf
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow-query.log
long_query_time = 1
```

### ❓ Production build lỗi nhưng dev không lỗi?

```bash
# Test production build locally
npm run build
npm start

# Check differences
# 1. Environment variables (.env vs .env.production)
# 2. TypeScript strict mode
# 3. ESLint rules
# 4. Code splitting issues

# Debug build
npm run build 2>&1 | tee build.log
```

---

## 📚 Tài Liệu Tham Khảo

- **Next.js Debugging**: [https://nextjs.org/docs/advanced-features/debugging](https://nextjs.org/docs/advanced-features/debugging)
- **Prisma Troubleshooting**: [https://www.prisma.io/docs/guides/database/troubleshooting](https://www.prisma.io/docs/guides/database/troubleshooting)
- **React DevTools**: [https://react.dev/learn/react-developer-tools](https://react.dev/learn/react-developer-tools)
- **MySQL Error Codes**: [https://dev.mysql.com/doc/mysql-errors/8.0/en/](https://dev.mysql.com/doc/mysql-errors/8.0/en/)

---

## 💡 Tips Cuối Cùng

1. **Đọc error message kỹ** - 90% lỗi đã có hint trong message
2. **Check logs** - `console.log()` là bạn tốt nhất
3. **Google error code** - Stackoverflow thường có câu trả lời
4. **Test từng bước** - Chia nhỏ vấn đề để tìm root cause
5. **Backup trước khi thử nghiệm** - Git commit hoặc database dump
6. **Đọc documentation** - Next.js, Prisma docs rất chi tiết
7. **Ask for help** - GitHub Issues, Discord communities

---

**Happy debugging! 🐛→✨**

*Last updated: November 28, 2025*
