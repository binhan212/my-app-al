# 03. LUỒNG DỮ LIỆU - Data Flow Trong Dự Án

> ⏱️ **Thời gian đọc**: 45-60 phút  
> 🎯 **Mục tiêu**: Hiểu cách data chảy từ Database → UI → Database

---

## 📊 TỔNG QUAN LUỒNG DỮ LIỆU

### Sơ Đồ Tổng Quan

```
┌─────────────┐
│   Browser   │
│  (Client)   │
└──────┬──────┘
       │
       ↓ Request (HTTP)
┌─────────────────────────────┐
│     Next.js Server          │
│                             │
│  ┌──────────────────────┐   │
│  │  1. Middleware       │   │  ← Auth check
│  └──────────────────────┘   │
│           ↓                 │
│  ┌──────────────────────┐   │
│  │  2. Route Handler    │   │  ← page.tsx or route.ts
│  │     (Server Comp)    │   │
│  └──────────────────────┘   │
│           ↓                 │
│  ┌──────────────────────┐   │
│  │  3. Prisma ORM       │   │  ← db.post.findMany()
│  └──────────────────────┘   │
│           ↓                 │
└─────────┬───────────────────┘
          │
          ↓ SQL Query
┌─────────────┐
│   MySQL     │
│  Database   │
└─────────────┘
```

---

## 1️⃣ READ FLOW - Hiển Thị Dữ Liệu

### 1.1. Server Component Flow (Recommended)

**Ví Dụ: Trang Danh Sách Tin Tức**

```
User truy cập /tin-tuc
         ↓
Next.js route to app/tin-tuc/page.tsx
         ↓
Server Component executes
         ↓
Prisma query: db.post.findMany()
         ↓
MySQL trả về data
         ↓
Server render HTML
         ↓
Browser nhận HTML (đã có data)
```

**Code Chi Tiết:**

```tsx
// app/tin-tuc/page.tsx (Server Component)

import { db } from '@/lib/db'
import { PostCard } from '@/components/posts/PostCard'

// ⭐ Hàm này chạy TRÊN SERVER
export default async function TinTucPage({
  searchParams
}: {
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const limit = 10
  
  // STEP 1: Query database (chạy trên server)
  const [posts, total] = await Promise.all([
    db.post.findMany({
      where: {
        status: 'published',
        published_at: { lte: new Date() }
      },
      include: {
        author: { select: { full_name: true } },
        category: { select: { name: true } }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { published_at: 'desc' }
    }),
    db.post.count({
      where: {
        status: 'published',
        published_at: { lte: new Date() }
      }
    })
  ])
  
  // STEP 2: Render JSX (chạy trên server)
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tin Tức</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      
      <Pagination 
        currentPage={page} 
        totalPages={Math.ceil(total / limit)} 
      />
    </div>
  )
}

// ⭐ Metadata cho SEO (chỉ Server Component mới làm được)
export async function generateMetadata() {
  return {
    title: 'Tin Tức - Quy Hoạch Quốc Gia',
    description: 'Danh sách tin tức mới nhất về quy hoạch'
  }
}
```

**Ưu Điểm:**
- ✅ SEO tốt (data có sẵn trong HTML)
- ✅ Fast First Paint (không cần load JS)
- ✅ Bảo mật (API keys, secrets không lộ ra browser)
- ✅ Giảm JavaScript bundle size

---

### 1.2. Client Component + API Flow

**Ví Dụ: Search Form (cần state)**

```
User type vào search box
         ↓
onChange event → setState (Client Component)
         ↓
User click "Search"
         ↓
Gọi API: fetch('/api/posts?search=keyword')
         ↓
API Route executes (Server)
         ↓
Prisma query database
         ↓
API trả về JSON
         ↓
Client Component update state
         ↓
Re-render UI với data mới
```

**Code Chi Tiết:**

```tsx
// components/posts/SearchForm.tsx (Client Component)
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchForm() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // STEP 1: Gọi API
      const res = await fetch(`/api/posts?search=${encodeURIComponent(query)}`)
      const data = await res.json()
      
      // STEP 2: Update state
      if (data.success) {
        setResults(data.data.posts)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm kiếm tin tức..."
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Đang tìm...' : 'Tìm kiếm'}
      </Button>
      
      <div className="mt-4">
        {results.map(post => (
          <div key={post.id}>{post.title}</div>
        ))}
      </div>
    </form>
  )
}
```

```typescript
// app/api/posts/route.ts (API Route)
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  
  // STEP 1: Query database
  const posts = await db.post.findMany({
    where: {
      status: 'published',
      OR: [
        { title: { contains: search } },
        { content: { contains: search } }
      ]
    },
    take: 20,
    orderBy: { published_at: 'desc' }
  })
  
  // STEP 2: Trả về JSON
  return NextResponse.json({
    success: true,
    data: { posts }
  })
}
```

---

## 2️⃣ CREATE FLOW - Tạo Dữ Liệu Mới

### 2.1. Form Submit Flow

```
User điền form → Click "Submit"
         ↓
Client Component validate (Zod)
         ↓
POST request to /api/posts
         ↓
API Route: Auth check (middleware)
         ↓
API Route: Validate again (server-side)
         ↓
Prisma: db.post.create()
         ↓
MySQL: INSERT INTO posts
         ↓
API trả về: { success: true, data: newPost }
         ↓
Client: Show success message
         ↓
Client: router.push('/admin/posts')
```

**Code Chi Tiết:**

```tsx
// app/admin/posts/create/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postSchema, type PostFormData } from '@/lib/validations'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function CreatePostPage() {
  const router = useRouter()
  
  // STEP 1: Setup form với validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema)
  })
  
  // STEP 2: Submit handler
  const onSubmit = async (data: PostFormData) => {
    try {
      // STEP 3: Gọi API
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.message || 'Failed to create post')
      }
      
      // STEP 4: Success
      toast({
        title: "Thành công",
        description: "Đã tạo bài viết mới"
      })
      
      router.push('/admin/posts')
      router.refresh() // Revalidate data
      
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive"
      })
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Tiêu đề</label>
        <Input {...register('title')} />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>
      
      <div>
        <label>Nội dung</label>
        <Textarea {...register('content')} rows={10} />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang lưu...' : 'Tạo Bài Viết'}
      </Button>
    </form>
  )
}
```

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { postSchema } from '@/lib/validations'
import { createSlug } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    // STEP 1: Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // STEP 2: Parse body
    const body = await request.json()
    
    // STEP 3: Validate với Zod
    const validatedData = postSchema.parse(body)
    
    // STEP 4: Create post in database
    const post = await db.post.create({
      data: {
        ...validatedData,
        slug: createSlug(validatedData.title),
        author_id: parseInt(session.user.id),
        created_at: new Date(),
        updated_at: new Date()
      }
    })
    
    // STEP 5: Return success
    return NextResponse.json({
      success: true,
      data: post
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, { status: 400 })
    }
    
    console.error('Create post error:', error)
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 })
  }
}
```

---

## 3️⃣ UPDATE FLOW - Cập Nhật Dữ Liệu

### 3.1. Edit Form Flow

```
User truy cập /admin/posts/123/edit
         ↓
Server Component: Fetch post by ID
         ↓
Render edit form với pre-filled data
         ↓
User sửa → Click "Update"
         ↓
PUT request to /api/posts/123
         ↓
API Route: Validate + Update
         ↓
Prisma: db.post.update()
         ↓
MySQL: UPDATE posts SET ...
         ↓
Success → Redirect về list
```

**Code Chi Tiết:**

```tsx
// app/admin/posts/[id]/edit/page.tsx
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { EditPostForm } from '@/components/posts/EditPostForm'

export default async function EditPostPage({
  params
}: {
  params: { id: string }
}) {
  // STEP 1: Fetch post data (Server Component)
  const post = await db.post.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      category: true
    }
  })
  
  if (!post) notFound()
  
  // STEP 2: Render form với data
  return (
    <div>
      <h1>Chỉnh Sửa Bài Viết</h1>
      <EditPostForm post={post} />
    </div>
  )
}
```

```tsx
// components/posts/EditPostForm.tsx (Client Component)
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postSchema } from '@/lib/validations'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

export function EditPostForm({ post }) {
  const router = useRouter()
  
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status
    }
  })
  
  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!res.ok) throw new Error('Failed to update')
      
      toast({ title: "Đã cập nhật thành công" })
      router.push('/admin/posts')
      router.refresh()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive"
      })
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields... */}
    </form>
  )
}
```

```typescript
// app/api/posts/[id]/route.ts
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Update in database
    const updatedPost = await db.post.update({
      where: { id: parseInt(params.id) },
      data: {
        ...validatedData,
        updated_at: new Date()
      }
    })
    
    return NextResponse.json({
      success: true,
      data: updatedPost
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Update failed'
    }, { status: 500 })
  }
}
```

---

## 4️⃣ DELETE FLOW - Xóa Dữ Liệu

```
User click nút "Xóa"
         ↓
Confirm dialog: "Bạn có chắc?"
         ↓
User confirm → DELETE request to /api/posts/123
         ↓
API Route: Auth check
         ↓
Prisma: db.post.delete()
         ↓
MySQL: DELETE FROM posts WHERE id = 123
         ↓
Success → Remove item from UI
```

**Code Chi Tiết:**

```tsx
// components/posts/DeleteButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/use-toast'
import { Trash } from 'lucide-react'

export function DeleteButton({ postId }: { postId: number }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) throw new Error('Failed to delete')
      
      toast({ title: "Đã xóa bài viết" })
      router.refresh() // Revalidate data
      
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa bài viết",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

```typescript
// app/api/posts/[id]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    await db.post.delete({
      where: { id: parseInt(params.id) }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Deleted successfully'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Delete failed'
    }, { status: 500 })
  }
}
```

---

## 5️⃣ AUTHENTICATION FLOW

### 5.1. Login Flow

```
User điền username/password → Submit
         ↓
POST /api/auth/signin
         ↓
NextAuth.js: CredentialsProvider.authorize()
         ↓
Query database: db.user.findUnique()
         ↓
Compare password: bcrypt.compare()
         ↓
If valid → Create JWT token → Set cookie
         ↓
Redirect to /admin/dashboard
```

Xem chi tiết tại [05_AUTHENTICATION.md](./05_AUTHENTICATION.md)

---

## 6️⃣ FILE UPLOAD FLOW

```
User chọn file (image) → Click upload
         ↓
FormData with file
         ↓
POST /api/media/upload
         ↓
Validate file (type, size)
         ↓
Save to /public/uploads/
         ↓
Return file URL
         ↓
Client: Update form field với URL
```

**Code Chi Tiết:**

```typescript
// app/api/media/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      )
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type' },
        { status: 400 }
      )
    }
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File too large' },
        { status: 400 }
      )
    }
    
    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    
    // Save to public/uploads/posts/
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'posts')
    await mkdir(uploadDir, { recursive: true })
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(join(uploadDir, filename), buffer)
    
    // Return URL
    const fileUrl = `/uploads/posts/${filename}`
    return NextResponse.json({
      success: true,
      data: { url: fileUrl }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      success: false,
      message: 'Upload failed'
    }, { status: 500 })
  }
}
```

---

## 7️⃣ REVALIDATION & CACHING

### 7.1. Cache Behavior

Next.js mặc định **cache** mọi thứ:

```typescript
// app/posts/page.tsx

// ❌ Cache forever (static page)
export default async function PostsPage() {
  const posts = await db.post.findMany()
  return <div>{/* ... */}</div>
}

// ✅ Revalidate every 60 seconds
export const revalidate = 60

export default async function PostsPage() {
  const posts = await db.post.findMany()
  return <div>{/* ... */}</div>
}

// ✅ No cache (dynamic page)
export const dynamic = 'force-dynamic'

export default async function PostsPage() {
  const posts = await db.post.findMany()
  return <div>{/* ... */}</div>
}
```

### 7.2. Manual Revalidation

```typescript
// Client Component
import { useRouter } from 'next/navigation'

const router = useRouter()

// Revalidate current page
router.refresh()
```

---

## 🎯 Tổng Kết

### Data Flow Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| Server Component → DB | Static/SSR pages | Listing pages |
| Client Component → API → DB | Interactive UI | Search, filters |
| Form → API → DB | CRUD operations | Create/Edit posts |
| File Upload → Filesystem | Image upload | Cover images |

### Best Practices

✅ **DOs:**
- Dùng Server Components khi có thể
- Validate ở cả client và server
- Handle errors properly
- Show loading states
- Revalidate sau khi mutate data

❌ **DON'Ts:**
- Expose secrets trong Client Components
- Skip validation
- Ignore errors
- Mutate data without revalidation

---

### Tiếp Theo

→ Đọc **[04_DATABASE_PRISMA.md](./04_DATABASE_PRISMA.md)** để hiểu database schema!
