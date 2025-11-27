# 06. API ROUTES - Chi Tiết Đầy Đủ

> ⏱️ **Thời gian đọc**: 90-120 phút  
> 🎯 **Mục tiêu**: Hiểu 100% cách tạo API endpoints, validation, error handling

---

## 📘 MỤC LỤC

1. [API Routes Overview](#1-api-routes-overview)
2. [Request & Response](#2-request--response)
3. [HTTP Methods (GET, POST, PUT, DELETE)](#3-http-methods)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [Validation với Zod](#5-validation-với-zod)
6. [Error Handling](#6-error-handling)
7. [Pagination & Filtering](#7-pagination--filtering)
8. [File Upload](#8-file-upload)
9. [Best Practices](#9-best-practices)

---

## 1. API Routes Overview

### 1.1. API Routes trong Next.js

```
File structure → Tự động tạo API endpoint

app/api/
  ├── posts/
  │   ├── route.ts           → /api/posts (GET, POST)
  │   └── [id]/
  │       └── route.ts       → /api/posts/123 (GET, PUT, DELETE)
  ├── categories/
  │   └── route.ts           → /api/categories
  └── media/
      └── upload/
          └── route.ts       → /api/media/upload
```

### 1.2. Route File Structure

```typescript
// app/api/posts/route.ts

import { NextRequest, NextResponse } from 'next/server'

// GET /api/posts
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'GET posts' })
}

// POST /api/posts
export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ message: 'POST posts', data: body })
}

// PUT, DELETE, PATCH cũng tương tự
```

### 1.3. Dynamic Routes

```typescript
// app/api/posts/[id]/route.ts

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/posts/123
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  return NextResponse.json({ id })
}

// PUT /api/posts/123
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  const body = await request.json()
  return NextResponse.json({ id, data: body })
}

// DELETE /api/posts/123
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  return NextResponse.json({ message: `Deleted ${id}` })
}
```

---

## 2. Request & Response

### 2.1. NextRequest

```typescript
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // 1. URL & Search Params
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const page = searchParams.get('page')       // ?page=1
  const limit = searchParams.get('limit')     // &limit=10
  
  // 2. Headers
  const authHeader = request.headers.get('Authorization')
  const contentType = request.headers.get('Content-Type')
  
  // 3. Cookies
  const sessionCookie = request.cookies.get('session')
  
  // 4. Method
  const method = request.method  // GET, POST, PUT, DELETE
  
  // 5. Body (POST, PUT only)
  const body = await request.json()
  
  // 6. FormData (file upload)
  const formData = await request.formData()
  const file = formData.get('file')
  
  return NextResponse.json({ page, limit })
}
```

### 2.2. NextResponse

```typescript
import { NextResponse } from 'next/server'

// 1. JSON Response
export async function GET() {
  return NextResponse.json({
    success: true,
    data: { id: 1, name: 'Post' }
  })
}

// 2. Custom Status Code
export async function POST() {
  return NextResponse.json(
    { success: true, message: 'Created' },
    { status: 201 }
  )
}

// 3. Error Response
export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Not found' },
    { status: 404 }
  )
}

// 4. Custom Headers
export async function GET() {
  return NextResponse.json(
    { data: [] },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'X-Custom-Header': 'value'
      }
    }
  )
}

// 5. Redirect
export async function GET() {
  return NextResponse.redirect(new URL('/new-path', request.url))
}

// 6. Cookies
export async function POST() {
  const response = NextResponse.json({ success: true })
  
  response.cookies.set('token', 'abc123', {
    httpOnly: true,
    secure: true,
    maxAge: 3600
  })
  
  return response
}
```

### 2.3. Response Structure Convention

```typescript
// ✅ SUCCESS Response
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Post Title"
  },
  "message": "Operation successful"  // Optional
}

// ❌ ERROR Response
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly message"
}

// 📄 PAGINATED Response
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

## 3. HTTP Methods

### 3.1. GET - Lấy Dữ Liệu

#### GET List (với pagination)

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // 1. Parse query params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')  // Optional filter
    const categoryId = searchParams.get('category_id')
    
    // 2. Build where clause
    const where: any = {}
    if (status) where.status = status
    if (categoryId) where.category_id = parseInt(categoryId)
    
    // 3. Calculate pagination
    const skip = (page - 1) * limit
    
    // 4. Parallel queries
    const [posts, total] = await Promise.all([
      db.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, full_name: true, username: true }
          },
          category: {
            select: { id: true, name: true }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      db.post.count({ where })
    ])
    
    // 5. Return response
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
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
```

**Usage từ client**:

```typescript
// Fetch posts page 1
const res = await fetch('/api/posts?page=1&limit=10')
const data = await res.json()

// Fetch with filters
const res = await fetch('/api/posts?status=published&category_id=2')
```

#### GET Detail (single item)

```typescript
// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const postId = parseInt(id)
    
    // Validate ID
    if (isNaN(postId)) {
      return NextResponse.json(
        { success: false, message: 'ID không hợp lệ' },
        { status: 400 }
      )
    }
    
    // Find post
    const post = await db.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { id: true, full_name: true, username: true, avatar: true }
        },
        category: {
          select: { id: true, name: true, slug: true }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    })
    
    // Check if exists
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy bài viết' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: post
    })
  } catch (error) {
    console.error('Get post error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
```

**Usage**:

```typescript
const res = await fetch('/api/posts/123')
const data = await res.json()

if (data.success) {
  console.log(data.data)  // Post object
} else {
  console.error(data.message)
}
```

### 3.2. POST - Tạo Mới

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createSlug } from '@/lib/utils'
import { postSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // 2. Check authorization (role)
    if (session.user.role !== 'admin' && session.user.role !== 'editor') {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      )
    }
    
    // 3. Parse body
    const body = await request.json()
    
    // 4. Validate with Zod
    const validatedData = postSchema.parse(body)
    
    // 5. Check slug uniqueness
    const slug = createSlug(validatedData.title)
    const existingPost = await db.post.findUnique({
      where: { slug }
    })
    
    if (existingPost) {
      return NextResponse.json(
        { success: false, message: 'Slug đã tồn tại' },
        { status: 409 }
      )
    }
    
    // 6. Create post
    const post = await db.post.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        excerpt: validatedData.excerpt || null,
        cover_image: validatedData.cover_image || null,
        category_id: validatedData.category_id || null,
        status: validatedData.status,
        published_at: validatedData.status === 'published' ? new Date() : null,
        slug,
        author_id: parseInt(session.user.id)
      },
      include: {
        author: {
          select: { id: true, full_name: true }
        },
        category: {
          select: { id: true, name: true }
        }
      }
    })
    
    // 7. Return created resource
    return NextResponse.json({
      success: true,
      data: post,
      message: 'Đã tạo bài viết mới'
    }, { status: 201 })  // 201 Created
    
  } catch (error) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors
        },
        { status: 400 }
      )
    }
    
    console.error('Create post error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
```

**Usage**:

```typescript
const res = await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'New Post',
    content: '<p>Content...</p>',
    excerpt: 'Summary',
    status: 'draft',
    category_id: 1
  })
})

const data = await res.json()

if (data.success) {
  console.log('Created:', data.data)
} else {
  console.error('Error:', data.message)
}
```

### 3.3. PUT - Cập Nhật

```typescript
// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createSlug } from '@/lib/utils'
import { postSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // 1. Check authentication
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // 2. Get ID
    const { id } = await params
    const postId = parseInt(id)
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { success: false, message: 'ID không hợp lệ' },
        { status: 400 }
      )
    }
    
    // 3. Check if post exists
    const existingPost = await db.post.findUnique({
      where: { id: postId },
      select: { id: true, author_id: true, published_at: true }
    })
    
    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy bài viết' },
        { status: 404 }
      )
    }
    
    // 4. Check ownership (optional - chỉ author hoặc admin mới edit được)
    if (
      session.user.role !== 'admin' &&
      existingPost.author_id !== parseInt(session.user.id)
    ) {
      return NextResponse.json(
        { success: false, message: 'Bạn không có quyền chỉnh sửa' },
        { status: 403 }
      )
    }
    
    // 5. Parse & validate body
    const body = await request.json()
    const validatedData = postSchema.parse(body)
    
    // 6. Check slug uniqueness (if title changed)
    const newSlug = createSlug(validatedData.title)
    const slugExists = await db.post.findFirst({
      where: {
        slug: newSlug,
        id: { not: postId }  // Exclude current post
      }
    })
    
    if (slugExists) {
      return NextResponse.json(
        { success: false, message: 'Slug đã tồn tại' },
        { status: 409 }
      )
    }
    
    // 7. Update post
    const post = await db.post.update({
      where: { id: postId },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        excerpt: validatedData.excerpt || null,
        cover_image: validatedData.cover_image || null,
        category_id: validatedData.category_id || null,
        status: validatedData.status,
        // Set published_at nếu chưa có và status = published
        published_at: validatedData.status === 'published' && !existingPost.published_at
          ? new Date()
          : existingPost.published_at,
        slug: newSlug,
        updated_at: new Date()
      },
      include: {
        author: {
          select: { id: true, full_name: true }
        },
        category: {
          select: { id: true, name: true }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: post,
      message: 'Đã cập nhật bài viết'
    })
    
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors
        },
        { status: 400 }
      )
    }
    
    console.error('Update post error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
```

**Usage**:

```typescript
const res = await fetch('/api/posts/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Updated Title',
    content: '<p>New content...</p>',
    status: 'published'
  })
})

const data = await res.json()
```

### 3.4. DELETE - Xóa

```typescript
// app/api/posts/[id]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // 1. Check authentication
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // 2. Only admin can delete
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Chỉ admin mới có quyền xóa' },
        { status: 403 }
      )
    }
    
    // 3. Get ID
    const { id } = await params
    const postId = parseInt(id)
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { success: false, message: 'ID không hợp lệ' },
        { status: 400 }
      )
    }
    
    // 4. Check if exists
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { id: true, title: true }
    })
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy bài viết' },
        { status: 404 }
      )
    }
    
    // 5. Delete (cascade will delete post_tags automatically)
    await db.post.delete({
      where: { id: postId }
    })
    
    return NextResponse.json({
      success: true,
      message: `Đã xóa bài viết "${post.title}"`
    })
    
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
```

**Usage**:

```typescript
const res = await fetch('/api/posts/123', {
  method: 'DELETE'
})

const data = await res.json()

if (data.success) {
  console.log('Deleted successfully')
}
```

---

## 4. Authentication & Authorization

### 4.1. Check Login (Authentication)

```typescript
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await auth()
  
  // Check if logged in
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: 'Vui lòng đăng nhập' },
      { status: 401 }  // 401 Unauthorized
    )
  }
  
  // User is logged in, proceed...
}
```

### 4.2. Check Role (Authorization)

```typescript
export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // Check role
  if (session.user.role !== 'admin' && session.user.role !== 'editor') {
    return NextResponse.json(
      { success: false, message: 'Bạn không có quyền thực hiện thao tác này' },
      { status: 403 }  // 403 Forbidden
    )
  }
  
  // User has permission, proceed...
}
```

### 4.3. Check Ownership

```typescript
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  
  const { id } = await params
  const postId = parseInt(id)
  
  // Get post
  const post = await db.post.findUnique({
    where: { id: postId },
    select: { author_id: true }
  })
  
  // Check ownership (admin bypasses this check)
  if (
    session.user.role !== 'admin' &&
    post.author_id !== parseInt(session.user.id)
  ) {
    return NextResponse.json(
      { success: false, message: 'Bạn chỉ có thể chỉnh sửa bài viết của mình' },
      { status: 403 }
    )
  }
  
  // Can edit, proceed...
}
```

### 4.4. Reusable Auth Middleware

```typescript
// lib/api-middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      ),
      session: null
    }
  }
  
  return { error: null, session }
}

export async function requireAdmin() {
  const { error, session } = await requireAuth()
  
  if (error) return { error, session: null }
  
  if (session.user.role !== 'admin') {
    return {
      error: NextResponse.json(
        { success: false, message: 'Admin only' },
        { status: 403 }
      ),
      session: null
    }
  }
  
  return { error: null, session }
}
```

**Usage**:

```typescript
import { requireAuth, requireAdmin } from '@/lib/api-middleware'

export async function POST(request: NextRequest) {
  // Check login
  const { error, session } = await requireAuth()
  if (error) return error
  
  // Proceed with session
  const userId = session.user.id
}

export async function DELETE(request: NextRequest) {
  // Check admin
  const { error } = await requireAdmin()
  if (error) return error
  
  // Proceed (user is admin)
}
```

---

## 5. Validation với Zod

### 5.1. Define Schemas

```typescript
// lib/validations.ts
import { z } from 'zod'

// Post schema
export const postSchema = z.object({
  title: z.string()
    .min(1, "Tiêu đề không được để trống")
    .max(255, "Tiêu đề tối đa 255 ký tự"),
  
  content: z.string()
    .min(1, "Nội dung không được để trống"),
  
  excerpt: z.string()
    .max(500, "Tóm tắt tối đa 500 ký tự")
    .optional()
    .nullable(),
  
  cover_image: z.string()
    .url("URL ảnh không hợp lệ")
    .optional()
    .or(z.literal("")),
  
  category_id: z.number()
    .int()
    .positive()
    .optional()
    .nullable(),
  
  status: z.enum(['draft', 'published', 'archived'])
    .default('draft')
})

export type PostFormData = z.infer<typeof postSchema>

// Category schema
export const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().optional().nullable(),
  parent_id: z.number().int().positive().optional().nullable(),
  display_order: z.number().int().default(0)
})

// Video schema
export const videoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  video_url: z.string().url(),
  thumbnail_url: z.string().url().optional().nullable(),
  duration: z.string().max(20).optional().nullable(),
  display_order: z.number().int().default(0),
  status: z.enum(['active', 'inactive']).default('active')
})
```

### 5.2. Use in API Routes

```typescript
import { postSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate
    const validatedData = postSchema.parse(body)
    
    // validatedData is now type-safe
    const post = await db.post.create({
      data: validatedData
    })
    
    return NextResponse.json({ success: true, data: post })
    
  } catch (error) {
    // Catch Zod errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    throw error
  }
}
```

### 5.3. Custom Error Messages

```typescript
const postSchema = z.object({
  title: z.string({
    required_error: "Tiêu đề là bắt buộc",
    invalid_type_error: "Tiêu đề phải là chuỗi"
  })
    .min(1, "Tiêu đề không được để trống")
    .max(255, "Tiêu đề tối đa 255 ký tự"),
  
  status: z.enum(['draft', 'published', 'archived'], {
    errorMap: () => ({ message: "Trạng thái phải là draft, published hoặc archived" })
  })
})
```

---

## 6. Error Handling

### 6.1. Error Response Structure

```typescript
// 400 Bad Request - Client error
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    { "field": "title", "message": "Tiêu đề không được để trống" },
    { "field": "content", "message": "Nội dung tối thiểu 10 ký tự" }
  ]
}

// 401 Unauthorized - Not logged in
{
  "success": false,
  "message": "Vui lòng đăng nhập"
}

// 403 Forbidden - No permission
{
  "success": false,
  "message": "Bạn không có quyền thực hiện thao tác này"
}

// 404 Not Found
{
  "success": false,
  "message": "Không tìm thấy bài viết"
}

// 409 Conflict - Duplicate
{
  "success": false,
  "message": "Slug đã tồn tại"
}

// 500 Server Error
{
  "success": false,
  "message": "Lỗi server"
}
```

### 6.2. Try-Catch Pattern

```typescript
export async function POST(request: NextRequest) {
  try {
    // Main logic here
    const result = await someOperation()
    return NextResponse.json({ success: true, data: result })
    
  } catch (error) {
    // 1. Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors
        },
        { status: 400 }
      )
    }
    
    // 2. Prisma errors
    if (error.code === 'P2002') {  // Unique constraint violation
      return NextResponse.json(
        { success: false, message: 'Dữ liệu đã tồn tại' },
        { status: 409 }
      )
    }
    
    if (error.code === 'P2025') {  // Record not found
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy' },
        { status: 404 }
      )
    }
    
    // 3. Log unexpected errors
    console.error('API Error:', error)
    
    // 4. Return generic error
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
```

### 6.3. Prisma Error Codes

```typescript
// Prisma error codes
const PRISMA_ERRORS = {
  'P2002': 'Unique constraint violation',    // Trùng unique field
  'P2025': 'Record not found',               // Không tìm thấy
  'P2003': 'Foreign key constraint failed',  // Foreign key invalid
  'P2014': 'Required relation violation',    // Thiếu relation
  'P2016': 'Query interpretation error'      // Query sai
}

// Handler
function handlePrismaError(error: any) {
  if (error.code in PRISMA_ERRORS) {
    return NextResponse.json(
      { success: false, message: PRISMA_ERRORS[error.code] },
      { status: 400 }
    )
  }
  throw error
}
```

---

## 7. Pagination & Filtering

### 7.1. Basic Pagination

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Parse params
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  
  // Calculate skip
  const skip = (page - 1) * limit
  
  // Query
  const [items, total] = await Promise.all([
    db.post.findMany({
      skip,
      take: limit,
      orderBy: { created_at: 'desc' }
    }),
    db.post.count()
  ])
  
  return NextResponse.json({
    success: true,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    }
  })
}
```

### 7.2. Advanced Filtering

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Build where clause
  const where: any = {}
  
  // Status filter
  const status = searchParams.get('status')
  if (status) where.status = status
  
  // Category filter
  const categoryId = searchParams.get('category_id')
  if (categoryId) where.category_id = parseInt(categoryId)
  
  // Search filter
  const search = searchParams.get('search')
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
      { excerpt: { contains: search } }
    ]
  }
  
  // Date range filter
  const dateFrom = searchParams.get('date_from')
  const dateTo = searchParams.get('date_to')
  if (dateFrom || dateTo) {
    where.published_at = {}
    if (dateFrom) where.published_at.gte = new Date(dateFrom)
    if (dateTo) where.published_at.lte = new Date(dateTo)
  }
  
  // Query
  const posts = await db.post.findMany({
    where,
    orderBy: { published_at: 'desc' }
  })
  
  return NextResponse.json({ success: true, data: posts })
}
```

**Usage**:

```
GET /api/posts?status=published
GET /api/posts?category_id=2
GET /api/posts?search=quy hoạch
GET /api/posts?date_from=2024-01-01&date_to=2024-12-31
GET /api/posts?status=published&category_id=2&search=keyword
```

### 7.3. Sorting

```typescript
const { searchParams } = new URL(request.url)

// Get sort params
const sortBy = searchParams.get('sort_by') || 'created_at'
const sortOrder = searchParams.get('sort_order') || 'desc'

// Validate sort field
const allowedSortFields = ['created_at', 'updated_at', 'title', 'views']
if (!allowedSortFields.includes(sortBy)) {
  return NextResponse.json(
    { success: false, message: 'Invalid sort field' },
    { status: 400 }
  )
}

// Query with sorting
const posts = await db.post.findMany({
  orderBy: { [sortBy]: sortOrder as 'asc' | 'desc' }
})
```

**Usage**:

```
GET /api/posts?sort_by=views&sort_order=desc
GET /api/posts?sort_by=title&sort_order=asc
```

---

## 8. File Upload

### 8.1. Upload API Route

```typescript
// app/api/media/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // 1. Check auth
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // 2. Get FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      )
    }
    
    // 3. Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'File type not allowed' },
        { status: 400 }
      )
    }
    
    // 4. Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024  // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File too large (max 10MB)' },
        { status: 400 }
      )
    }
    
    // 5. Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${random}.${extension}`
    
    // 6. Determine upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'media')
    
    // 7. Create directory if not exists
    await mkdir(uploadDir, { recursive: true })
    
    // 8. Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(uploadDir, filename)
    await writeFile(filePath, buffer)
    
    // 9. Save to database
    const media = await db.media.create({
      data: {
        filename,
        original_name: file.name,
        file_path: `/uploads/media/${filename}`,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: parseInt(session.user.id)
      }
    })
    
    // 10. Return URL
    return NextResponse.json({
      success: true,
      data: {
        id: media.id,
        url: `/uploads/media/${filename}`,
        filename: file.name,
        size: file.size,
        type: file.type
      },
      message: 'File uploaded successfully'
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, message: 'Upload failed' },
      { status: 500 }
    )
  }
}
```

### 8.2. Client Upload

```tsx
'use client'

import { useState } from 'react'

export function FileUpload() {
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState('')
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData  // Không set Content-Type header!
      })
      
      const data = await res.json()
      
      if (data.success) {
        setUrl(data.data.url)
        alert('Upload thành công!')
      } else {
        alert('Upload thất bại: ' + data.message)
      }
    } catch (error) {
      alert('Lỗi upload')
    } finally {
      setUploading(false)
    }
  }
  
  return (
    <div>
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        accept="image/*,.pdf"
      />
      
      {uploading && <p>Đang upload...</p>}
      
      {url && (
        <div>
          <p>URL: {url}</p>
          <img src={url} alt="Uploaded" width={200} />
        </div>
      )}
    </div>
  )
}
```

---

## 9. Best Practices

### 9.1. Always Validate Input

```typescript
// ❌ BAD: No validation
export async function POST(request: NextRequest) {
  const body = await request.json()
  await db.post.create({ data: body })  // Dangerous!
}

// ✅ GOOD: Validate with Zod
export async function POST(request: NextRequest) {
  const body = await request.json()
  const validatedData = postSchema.parse(body)  // Throws if invalid
  await db.post.create({ data: validatedData })
}
```

### 9.2. Use Try-Catch

```typescript
// ✅ Always wrap in try-catch
export async function POST(request: NextRequest) {
  try {
    // Logic here
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
```

### 9.3. Return Consistent Responses

```typescript
// ✅ Always use same structure
{
  "success": true | false,
  "data": { ... },        // On success
  "message": "...",       // Optional message
  "error": "...",         // On error
  "errors": [...]         // Validation errors
}
```

### 9.4. Check Auth First

```typescript
export async function POST(request: NextRequest) {
  // 1. Check auth FIRST
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 2. Then validate input
  const body = await request.json()
  const data = schema.parse(body)
  
  // 3. Then business logic
  // ...
}
```

### 9.5. Use Proper HTTP Status Codes

```typescript
200 OK              // Success (GET, PUT, PATCH)
201 Created         // Success (POST create)
204 No Content      // Success (DELETE)
400 Bad Request     // Client error (validation)
401 Unauthorized    // Not logged in
403 Forbidden       // No permission
404 Not Found       // Resource not found
409 Conflict        // Duplicate/conflict
500 Server Error    // Server error
```

### 9.6. Log Errors

```typescript
try {
  // ...
} catch (error) {
  // Log full error for debugging
  console.error('Full error:', error)
  
  // Return user-friendly message
  return NextResponse.json(
    { success: false, message: 'Có lỗi xảy ra' },
    { status: 500 }
  )
}
```

### 9.7. Sanitize Outputs

```typescript
// Don't return sensitive fields
const user = await db.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    username: true,
    email: true,
    // ❌ Don't include password_hash
  }
})

return NextResponse.json({ success: true, data: user })
```

---

## 🎯 Tóm Tắt

### API Route Structure
```typescript
app/api/
  ├── posts/
  │   ├── route.ts           → GET, POST
  │   └── [id]/route.ts      → GET, PUT, DELETE
```

### Request Flow
1. Parse request → 2. Check auth → 3. Validate input → 4. Business logic → 5. Return response

### Key Patterns
- **GET**: Fetch data (with pagination/filtering)
- **POST**: Create new resource (return 201)
- **PUT**: Update existing resource
- **DELETE**: Remove resource

### Security
- ✅ Always check authentication
- ✅ Validate all input with Zod
- ✅ Check authorization (roles)
- ✅ Use try-catch for errors
- ✅ Don't expose sensitive data

**Next**: Đọc [07_UI_COMPONENTS.md](./07_UI_COMPONENTS.md) để hiểu UI components và styling.
