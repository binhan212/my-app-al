# 05. AUTHENTICATION - NextAuth.js Chi Tiết

> ⏱️ **Thời gian đọc**: 60-90 phút  
> 🎯 **Mục tiêu**: Hiểu 100% authentication flow, session management, và protected routes

---

## 📘 MỤC LỤC

1. [NextAuth.js Overview](#1-nextauthjs-overview)
2. [Authentication Flow](#2-authentication-flow)
3. [Configuration (lib/auth.ts)](#3-configuration-libauthts)
4. [Login Process](#4-login-process)
5. [Session Management](#5-session-management)
6. [Protected Routes](#6-protected-routes)
7. [Middleware](#7-middleware)
8. [Best Practices](#8-best-practices)

---

## 1. NextAuth.js Overview

### 1.1. NextAuth.js là gì?

**NextAuth.js** = Complete authentication solution cho Next.js

```
Không dùng NextAuth:
  - Tự code login/logout
  - Tự quản lý JWT tokens
  - Tự code session management
  - Tự code OAuth providers
  → 1000+ dòng code

Dùng NextAuth:
  - ✅ Có sẵn tất cả
  - ✅ Chỉ cần config
  - ✅ ~100 dòng code
```

### 1.2. Tại Sao Dùng NextAuth?

| Feature | Custom Auth | NextAuth.js |
|---------|-------------|-------------|
| **Login/Logout** | 200+ dòng code | ✅ Có sẵn |
| **Session** | Tự code JWT | ✅ Built-in |
| **Refresh Token** | Phức tạp | ✅ Auto |
| **OAuth (Google/Facebook)** | Rất khó | ✅ 5 dòng config |
| **CSRF Protection** | Tự code | ✅ Built-in |
| **Database Session** | Phải tự làm | ✅ Hỗ trợ |
| **TypeScript** | Tự define types | ✅ Có sẵn |

### 1.3. NextAuth v5 (Auth.js)

Project này dùng **NextAuth v5** (còn gọi là Auth.js)

**Khác biệt với v4**:

```typescript
// v4 (cũ)
import { getServerSession } from "next-auth/next"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
}

// v5 (mới - dùng trong project)
import { auth } from "@/lib/auth"

export default async function handler() {
  const session = await auth()
}
```

**Ưu điểm v5**:
- ✅ Đơn giản hơn
- ✅ Edge runtime support
- ✅ Better TypeScript

---

## 2. Authentication Flow

### 2.1. Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
└─────────────────────────────────────────────────────────────┘

1. USER ENTERS CREDENTIALS
   ├─ Username: "admin"
   └─ Password: "admin123"
        │
        ▼
2. SUBMIT TO /api/auth/signin
   ├─ POST /api/auth/signin
   └─ NextAuth receives credentials
        │
        ▼
3. AUTHORIZE FUNCTION (lib/auth.ts)
   ├─ Find user in database (Prisma)
   ├─ Check status === 'active'
   ├─ Compare password (bcrypt)
   ├─ Check role (admin/editor only)
   └─ Return user object or null
        │
        ▼
4. JWT CALLBACK
   ├─ Add custom fields to token
   │  ├─ token.id = user.id
   │  ├─ token.username = user.username
   │  └─ token.role = user.role
   └─ Return token
        │
        ▼
5. SESSION CALLBACK
   ├─ Add fields to session
   │  ├─ session.user.id = token.id
   │  ├─ session.user.username = token.username
   │  └─ session.user.role = token.role
   └─ Return session
        │
        ▼
6. CREATE SESSION COOKIE
   ├─ Cookie name: next-auth.session-token
   ├─ HttpOnly: true (không access từ JS)
   ├─ Secure: true (chỉ HTTPS)
   ├─ SameSite: lax
   └─ Max-Age: 30 days
        │
        ▼
7. REDIRECT TO DASHBOARD
   └─ User đã login ✅
```

### 2.2. Flow Chi Tiết Từng Bước

#### Bước 1: User Submit Form

```tsx
// app/admin/login/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const result = await signIn('credentials', {
      username: e.target.username.value,
      password: e.target.password.value,
      redirect: false  // Không auto redirect
    })
    
    if (result?.ok) {
      router.push('/admin/dashboard')  // Manual redirect
    } else {
      alert('Đăng nhập thất bại')
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="username" />
      <input name="password" type="password" />
      <button type="submit">Đăng nhập</button>
    </form>
  )
}
```

#### Bước 2: NextAuth API Route

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
```

**Tự động tạo các endpoints**:
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session
- `GET /api/auth/providers` - List providers
- `GET /api/auth/csrf` - CSRF token

#### Bước 3: Authorize Function

```typescript
// lib/auth.ts
async authorize(credentials) {
  // 1. Validate input
  if (!credentials?.username || !credentials?.password) {
    return null  // ❌ Thiếu thông tin
  }

  // 2. Find user
  const user = await db.user.findUnique({
    where: { username: credentials.username as string }
  })

  if (!user) {
    return null  // ❌ User không tồn tại
  }

  // 3. Check status
  if (user.status !== 'active') {
    return null  // ❌ Account bị khóa
  }

  // 4. Verify password
  const isPasswordValid = await bcrypt.compare(
    credentials.password as string,
    user.password_hash
  )

  if (!isPasswordValid) {
    return null  // ❌ Sai password
  }

  // 5. Check role
  if (user.role !== 'admin' && user.role !== 'editor') {
    return null  // ❌ Không có quyền admin
  }

  // 6. Success ✅
  return {
    id: user.id.toString(),
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    avatar: user.avatar
  }
}
```

#### Bước 4: JWT Callback

```typescript
// lib/auth.ts
callbacks: {
  async jwt({ token, user }) {
    // Chỉ chạy lần đầu login (user có giá trị)
    if (user) {
      token.id = user.id
      token.username = user.username
      token.role = user.role
    }
    return token
  }
}

// Token structure:
// {
//   id: "1",
//   username: "admin",
//   role: "admin",
//   email: "admin@example.com",
//   iat: 1701234567,  // Issued at
//   exp: 1703826567   // Expires at
// }
```

#### Bước 5: Session Callback

```typescript
// lib/auth.ts
callbacks: {
  async session({ session, token }) {
    // Chạy mỗi lần fetch session
    if (session.user) {
      session.user.id = token.id as string
      session.user.username = token.username as string
      session.user.role = token.role as string
    }
    return session
  }
}

// Session structure:
// {
//   user: {
//     id: "1",
//     username: "admin",
//     email: "admin@example.com",
//     role: "admin",
//     full_name: "Administrator",
//     avatar: null
//   },
//   expires: "2024-12-25T00:00:00.000Z"
// }
```

#### Bước 6: Session Cookie

```
Cookie được tạo tự động:

Name: next-auth.session-token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (JWT)
Domain: localhost (hoặc domain của bạn)
Path: /
HttpOnly: true        ← Không access từ JavaScript
Secure: true          ← Chỉ gửi qua HTTPS
SameSite: Lax         ← CSRF protection
Max-Age: 2592000      ← 30 days
```

---

## 3. Configuration (lib/auth.ts)

### 3.1. File Đầy Đủ

```typescript
// lib/auth.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

// TypeScript type extensions
declare module "next-auth" {
  interface User {
    id: string
    username: string
    email: string
    full_name: string | null
    role: string
    avatar: string | null
  }

  interface Session {
    user: {
      id: string
      username: string
      email: string
      full_name: string | null
      role: string
      avatar: string | null
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 1. PROVIDERS
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { username: credentials.username as string }
        })

        if (!user || user.status !== 'active') {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        )

        if (!isPasswordValid) {
          return null
        }

        if (user.role !== 'admin' && user.role !== 'editor') {
          return null
        }

        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          avatar: user.avatar
        }
      }
    })
  ],
  
  // 2. PAGES
  pages: {
    signIn: '/admin/login',  // Custom login page
  },
  
  // 3. CALLBACKS
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  
  // 4. SESSION CONFIG
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // 5. JWT SECRET (từ .env)
  secret: process.env.NEXTAUTH_SECRET,
})
```

### 3.2. Giải Thích Chi Tiết

#### 3.2.1. Providers

```typescript
providers: [
  CredentialsProvider({
    // Tên hiển thị
    name: "credentials",
    
    // Form fields
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" }
    },
    
    // Logic verify
    async authorize(credentials) {
      // Return user object nếu valid
      // Return null nếu invalid
    }
  })
]
```

**Các providers khác** (không dùng trong project này):

```typescript
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }),
  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
  })
]
```

#### 3.2.2. Pages

```typescript
pages: {
  signIn: '/admin/login',      // Custom login page
  signOut: '/auth/signout',    // Custom logout page
  error: '/auth/error',        // Custom error page
  verifyRequest: '/auth/verify', // Email verification
  newUser: '/auth/new-user'    // New user redirect
}
```

Project chỉ customize `signIn`:

```typescript
pages: {
  signIn: '/admin/login'
}
```

#### 3.2.3. Callbacks

**jwt callback**:

```typescript
async jwt({ token, user, account, profile, trigger }) {
  // trigger === 'signIn' → Lần đầu login
  // trigger === 'update' → Update session
  
  if (user) {
    // Chỉ chạy lần đầu login
    token.id = user.id
    token.username = user.username
    token.role = user.role
  }
  
  return token
}
```

**session callback**:

```typescript
async session({ session, token, user }) {
  // Chạy mỗi khi fetch session
  // Thêm custom fields vào session
  
  session.user.id = token.id as string
  session.user.username = token.username as string
  session.user.role = token.role as string
  
  return session
}
```

**redirect callback** (optional):

```typescript
async redirect({ url, baseUrl }) {
  // Custom redirect sau khi login
  if (url.startsWith("/")) return `${baseUrl}${url}`
  else if (new URL(url).origin === baseUrl) return url
  return baseUrl
}
```

#### 3.2.4. Session Config

```typescript
session: {
  strategy: "jwt",              // Hoặc "database"
  maxAge: 30 * 24 * 60 * 60,   // 30 days (seconds)
  updateAge: 24 * 60 * 60,     // Update mỗi 24h
}
```

**JWT vs Database strategy**:

| Feature | JWT | Database |
|---------|-----|----------|
| **Storage** | Cookie | Database table |
| **Performance** | ✅ Fast | Slower (query DB) |
| **Stateless** | ✅ Yes | No (có state) |
| **Revoke** | ❌ Khó | ✅ Dễ (xóa DB) |
| **Scalability** | ✅ Tốt | Phụ thuộc DB |

Project dùng **JWT** vì:
- Fast
- Stateless
- Không cần session table

---

## 4. Login Process

### 4.1. Login Page (Client Component)

```tsx
// app/admin/login/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false
      })

      if (result?.ok) {
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn quay trở lại!"
        })
        router.push('/admin/dashboard')
        router.refresh()  // Refresh server components
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: "Sai tên đăng nhập hoặc mật khẩu",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể đăng nhập. Vui lòng thử lại.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Đăng Nhập Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                disabled={isLoading}
                placeholder="Nhập tên đăng nhập..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                placeholder="Nhập mật khẩu..."
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 4.2. signIn() Function

```typescript
import { signIn } from 'next-auth/react'

// Basic usage
await signIn('credentials', {
  username: 'admin',
  password: 'password123'
})

// With redirect control
const result = await signIn('credentials', {
  username: 'admin',
  password: 'password123',
  redirect: false  // Không auto redirect
})

if (result?.ok) {
  // Login success
  router.push('/admin/dashboard')
} else {
  // Login failed
  console.error(result?.error)
}

// With callbackUrl
await signIn('credentials', {
  username: 'admin',
  password: 'password123',
  callbackUrl: '/admin/posts'  // Redirect đến đây sau login
})
```

### 4.3. Login Flow Errors

```typescript
const result = await signIn('credentials', { ... })

// result.error có thể là:
// - "CredentialsSignin"    → Sai username/password
// - "AccessDenied"         → Bị chặn (role không hợp lệ)
// - "Configuration"        → Config sai
// - "SessionRequired"      → Session hết hạn
```

---

## 5. Session Management

### 5.1. Get Session (Server Component)

```tsx
// app/admin/dashboard/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }
  
  return (
    <div>
      <h1>Xin chào, {session.user.full_name || session.user.username}!</h1>
      <p>Role: {session.user.role}</p>
      <p>Email: {session.user.email}</p>
    </div>
  )
}
```

### 5.2. Get Session (Client Component)

```tsx
'use client'

import { useSession } from 'next-auth/react'

export function UserProfile() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return <div>Đang tải...</div>
  }
  
  if (status === 'unauthenticated') {
    return <div>Bạn chưa đăng nhập</div>
  }
  
  return (
    <div>
      <p>Xin chào, {session.user.username}!</p>
      <p>Role: {session.user.role}</p>
    </div>
  )
}
```

### 5.3. useSession() Hook

```typescript
const { data: session, status, update } = useSession()

// status có 3 giá trị:
// - "loading"          → Đang fetch session
// - "authenticated"    → Đã login
// - "unauthenticated"  → Chưa login

// Update session (sau khi edit profile)
await update({
  full_name: 'New Name',
  avatar: '/new-avatar.jpg'
})
```

### 5.4. Session Provider (Root Layout)

```tsx
// app/layout.tsx
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

**Lưu ý**: Chỉ cần wrap 1 lần ở root layout.

---

## 6. Protected Routes

### 6.1. Server Component Protection

```tsx
// app/admin/posts/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminPostsPage() {
  const session = await auth()
  
  // Check login
  if (!session) {
    redirect('/admin/login')
  }
  
  // Check role
  if (session.user.role !== 'admin' && session.user.role !== 'editor') {
    redirect('/unauthorized')
  }
  
  return <div>Admin Posts</div>
}
```

### 6.2. Client Component Protection

```tsx
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function ClientProtectedPage() {
  const { data: session, status } = useSession({
    required: true,  // Bắt buộc phải login
    onUnauthenticated() {
      redirect('/admin/login')
    }
  })
  
  if (status === 'loading') {
    return <div>Đang tải...</div>
  }
  
  return <div>Protected Content</div>
}
```

### 6.3. API Route Protection

```typescript
// app/api/posts/route.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await auth()
  
  // Check login
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // Check role
  if (session.user.role !== 'admin' && session.user.role !== 'editor') {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }
  
  // Proceed with logic
  const body = await request.json()
  // ...
}
```

### 6.4. Layout Protection

```tsx
// app/admin/layout.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }) {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }
  
  return (
    <div>
      <AdminSidebar user={session.user} />
      <main>{children}</main>
    </div>
  )
}
```

**Lợi ích**: Tất cả pages trong `/admin/*` tự động protected.

---

## 7. Middleware

### 7.1. Middleware File

```typescript
// middleware.ts (root level)
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  
  // Public routes
  const publicRoutes = [
    '/',
    '/tin-tuc',
    '/du-an',
    '/videos',
    '/y-kien',
    '/gioi-thieu'
  ]
  
  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // Admin login page
  if (pathname === '/admin/login') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
    return NextResponse.next()
  }
  
  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    
    // Check role
    if (req.auth.user.role !== 'admin' && req.auth.user.role !== 'editor') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ]
}
```

### 7.2. Middleware Flow

```
Request: /admin/posts
    │
    ▼
Middleware runs
    │
    ├─ Check isLoggedIn
    │  ├─ false → Redirect to /admin/login
    │  └─ true → Continue
    │
    ├─ Check role
    │  ├─ admin/editor → Continue
    │  └─ user → Redirect to /unauthorized
    │
    ▼
Page component renders
```

### 7.3. Matcher Config

```typescript
export const config = {
  matcher: [
    // Match all paths EXCEPT:
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ]
}

// Hoặc specific paths:
export const config = {
  matcher: [
    '/admin/:path*',      // Tất cả /admin/*
    '/api/posts/:path*',  // Tất cả /api/posts/*
  ]
}
```

---

## 8. Best Practices

### 8.1. Never Trust Client-Side Auth

```typescript
// ❌ BAD: Chỉ check client-side
'use client'

export default function AdminPage() {
  const { data: session } = useSession()
  
  if (!session) return <div>Not logged in</div>
  
  return <div>Admin Content</div>  // ← Attacker có thể bypass
}

// ✅ GOOD: Check cả server-side
// app/admin/page.tsx
import { auth } from '@/lib/auth'

export default async function AdminPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }
  
  return <div>Admin Content</div>
}
```

### 8.2. Protect API Routes

```typescript
// ❌ BAD: Không check session
export async function POST(request: Request) {
  const body = await request.json()
  await db.post.create({ data: body })  // ← Anyone có thể POST
}

// ✅ GOOD: Check session
export async function POST(request: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  await db.post.create({
    data: {
      ...body,
      author_id: parseInt(session.user.id)  // ← Use session user
    }
  })
}
```

### 8.3. Use Middleware for Global Protection

```typescript
// ✅ GOOD: Middleware bảo vệ toàn bộ /admin/*
export default auth((req) => {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }
})
```

### 8.4. Hash Passwords Properly

```typescript
import bcrypt from 'bcryptjs'

// ❌ BAD: Lưu plaintext
await db.user.create({
  data: {
    username: 'admin',
    password_hash: 'admin123'  // ← NEVER DO THIS
  }
})

// ✅ GOOD: Hash password
await db.user.create({
  data: {
    username: 'admin',
    password_hash: await bcrypt.hash('admin123', 10)  // ← Salt rounds = 10
  }
})

// Verify password
const isValid = await bcrypt.compare(
  inputPassword,      // From form
  user.password_hash  // From database
)
```

### 8.5. Session Expiry

```typescript
// lib/auth.ts
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60,    // 30 days
  updateAge: 24 * 60 * 60,      // Update token every 24h
}

// User sẽ bị logout sau 30 ngày không activity
// Token sẽ refresh mỗi 24h khi user còn active
```

### 8.6. Logout Properly

```tsx
'use client'

import { signOut } from 'next-auth/react'

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/admin/login'  // Redirect sau logout
    })
  }
  
  return (
    <button onClick={handleLogout}>
      Đăng xuất
    </button>
  )
}
```

---

## 🎯 Tóm Tắt

### Authentication Flow
1. User nhập credentials → 2. Submit to `/api/auth/signin` → 3. `authorize()` verify → 4. Create JWT token → 5. Create session → 6. Set cookie → 7. Redirect to dashboard

### Key Functions
- `signIn()` - Login
- `signOut()` - Logout
- `auth()` - Get session (server)
- `useSession()` - Get session (client)

### Protection Methods
- **Server Components**: `await auth()` + `redirect()`
- **Client Components**: `useSession({ required: true })`
- **API Routes**: `await auth()` + return 401
- **Middleware**: Global protection cho routes

### Security
- ✅ Passwords hashed với bcrypt
- ✅ JWT tokens signed
- ✅ HttpOnly cookies
- ✅ CSRF protection built-in
- ✅ Role-based access control

**Next**: Đọc [06_API_ROUTES.md](./06_API_ROUTES.md) để hiểu cách tạo API endpoints.
