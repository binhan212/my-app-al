# GitHub Copilot Instructions - Next.js + shadcn/ui Project

## 🎯 Project Context

This is a **Next.js 15** CMS project migrated from Express.js, using:
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: MySQL + Prisma ORM
- **Authentication**: NextAuth.js v5
- **Forms**: React Hook Form + Zod
- **State Management**: TanStack Query (React Query)

## 📐 Architecture Principles

### File Structure Convention
```
app/
  (public)/          # Public routes (no auth required)
    page.tsx         # Home page
    tin-tuc/         # News section
    du-an/           # Projects section
  admin/             # Protected admin routes
    dashboard/
    posts/
  api/               # API routes
    posts/
      route.ts       # GET, POST handlers
      [id]/
        route.ts     # GET, PUT, DELETE handlers
components/
  ui/                # shadcn/ui components
  layout/            # Layout components (Header, Footer, Sidebar)
  forms/             # Form components
  posts/             # Domain-specific components
lib/
  db.ts              # Prisma client
  auth.ts            # NextAuth config
  utils.ts           # Utility functions
  validations.ts     # Zod schemas
```

## 🎨 UI Component Guidelines (shadcn/ui)

### Always Use shadcn/ui Components
When creating UI elements, ALWAYS use shadcn/ui components instead of raw HTML:

❌ **DON'T:**
```typescript
<button className="px-4 py-2 bg-blue-600 text-white rounded">
  Click me
</button>
```

✅ **DO:**
```typescript
import { Button } from "@/components/ui/button"

<Button variant="default" size="default">
  Click me
</Button>
```

### Component Import Pattern
```typescript
// Forms
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Layout
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Data Display
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Feedback
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
```

### shadcn/ui Component Patterns

#### Form with shadcn/ui + React Hook Form
```typescript
'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  content: z.string().min(10, "Nội dung tối thiểu 10 ký tự")
})

type FormData = z.infer<typeof formSchema>

export function MyForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) throw new Error('Failed to submit')

      toast({
        title: "Thành công",
        description: "Đã tạo bài viết mới"
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo bài viết",
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo Bài Viết Mới</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Nhập tiêu đề..."
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Nhập nội dung..."
              rows={5}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

#### Data Table with shadcn/ui
```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function PostsTable({ posts }: { posts: Post[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tiêu đề</TableHead>
          <TableHead>Danh mục</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell>{post.category?.name}</TableCell>
            <TableCell>
              <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                {post.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(post.created_at)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(post.id)}>
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

#### Modal Dialog with shadcn/ui
```typescript
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tạo Danh Mục</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo Danh Mục Mới</DialogTitle>
          <DialogDescription>
            Thêm danh mục mới cho bài viết
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên danh mục</Label>
              <Input id="name" placeholder="Nhập tên danh mục..." />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

## 💾 Database & API Patterns

### Prisma Query Patterns

**DO:**
```typescript
// Type-safe query with relations
const post = await db.post.findUnique({
  where: { slug: params.slug },
  include: {
    author: {
      select: { id: true, full_name: true }
    },
    category: {
      select: { id: true, name: true }
    }
  }
})
```

**DON'T:**
```typescript
// Raw SQL queries
const [posts] = await db.execute('SELECT * FROM posts')
```

### API Route Patterns

**GET Handler:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const [posts, total] = await Promise.all([
      db.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      db.post.count()
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
```

**POST Handler with Validation:**
```typescript
import { postSchema } from '@/lib/validations'

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
        author_id: parseInt(session.user.id),
        slug: createSlug(validatedData.title)
      }
    })

    return NextResponse.json({
      success: true,
      data: post
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
```

## 🔐 Authentication Patterns

### Server Component Auth Check
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/admin/login')
  }

  if (session.user.role !== 'admin') {
    redirect('/unauthorized')
  }

  return <div>Admin Content</div>
}
```

### Client Component Auth Check
```typescript
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function ClientProtectedPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/admin/login')
    }
  })

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return <div>Protected Content</div>
}
```

## 📝 Form Validation with Zod

Always create Zod schemas in `lib/validations.ts`:

```typescript
import { z } from "zod"

export const postSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(255),
  content: z.string().min(1, "Nội dung không được để trống"),
  excerpt: z.string().max(500).optional(),
  cover_image: z.string().url().optional().or(z.literal("")),
  category_id: z.number().int().positive().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
})

export type PostFormData = z.infer<typeof postSchema>
```

## 🎨 Styling Guidelines

### Tailwind CSS Best Practices

**DO:**
```typescript
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <Button variant="default">Action</Button>
</div>
```

**DON'T:**
```typescript
// Don't use inline styles
<div style={{ display: 'flex', padding: '16px' }}>
  <h2 style={{ fontSize: '24px' }}>Title</h2>
</div>
```

### Use cn() Helper for Conditional Classes
```typescript
import { cn } from "@/lib/utils"

<div className={cn(
  "p-4 rounded-lg",
  isActive && "bg-blue-100",
  isError && "bg-red-100"
)}>
  Content
</div>
```

## 🌐 Internationalization (Vietnamese)

### UI Text Standards
- Use Vietnamese for all user-facing text
- Use consistent terminology:
  - "Tạo mới" (Create)
  - "Chỉnh sửa" (Edit)
  - "Xóa" (Delete)
  - "Lưu" (Save)
  - "Hủy" (Cancel)
  - "Đăng nhập" (Login)
  - "Đăng xuất" (Logout)

### Date Formatting
```typescript
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// Always use Vietnamese locale
const formattedDate = format(new Date(), 'dd/MM/yyyy', { locale: vi })
```

## 🚀 Performance Optimization

### Image Optimization
```typescript
import Image from 'next/image'

// Always use Next.js Image component
<Image
  src={post.cover_image}
  alt={post.title}
  width={800}
  height={400}
  className="rounded-lg object-cover"
  priority={index < 2} // Priority for above-the-fold images
/>
```

### Server vs Client Components

**Server Component (Default):**
```typescript
// app/posts/page.tsx
import { db } from '@/lib/db'

export default async function PostsPage() {
  const posts = await db.post.findMany()
  
  return <PostsList posts={posts} />
}
```

**Client Component (When Needed):**
```typescript
'use client'

// Use only when you need:
// - useState, useEffect, event handlers
// - Browser APIs
// - Third-party libraries requiring client-side
```

## 📊 Data Fetching Patterns

### Server-side Fetching (Preferred)
```typescript
// app/posts/[slug]/page.tsx
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({
    where: { slug: params.slug }
  })

  if (!post) notFound()

  return <PostDetail post={post} />
}
```

### Client-side with React Query
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'

export function PostsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    }
  })

  if (isLoading) return <div>Đang tải...</div>
  if (error) return <div>Lỗi: {error.message}</div>

  return <PostsTable posts={data.posts} />
}
```

## 🔧 Utility Functions

Always use helper functions from `lib/utils.ts`:

```typescript
import { createSlug, formatDate, formatNumber, cn } from '@/lib/utils'

// Slug generation
const slug = createSlug("Bài viết mới nhất") // "bai-viet-moi-nhat"

// Date formatting
const date = formatDate(new Date()) // "26/11/2025"

// Number formatting
const views = formatNumber(1234567) // "1.234.567"

// Conditional classes
const className = cn("base-class", condition && "conditional-class")
```

## 🎯 Code Quality Standards

### TypeScript
- Always use TypeScript
- Define proper types/interfaces
- Avoid `any` type
- Use Zod for runtime validation

### Error Handling
```typescript
try {
  const result = await someAsyncOperation()
  toast({
    title: "Thành công",
    description: "Thao tác hoàn tất"
  })
} catch (error) {
  console.error('Operation error:', error)
  toast({
    title: "Lỗi",
    description: error instanceof Error ? error.message : "Đã xảy ra lỗi",
    variant: "destructive"
  })
}
```

### Naming Conventions
- Components: PascalCase (`PostCard`, `UserProfile`)
- Files: kebab-case (`post-card.tsx`, `user-profile.tsx`)
- Functions: camelCase (`fetchPosts`, `createUser`)
- Constants: UPPER_SNAKE_CASE (`API_URL`, `MAX_FILE_SIZE`)

## 📚 Import Order

```typescript
// 1. React/Next.js
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// 2. External libraries
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

// 3. Internal - lib
import { db } from '@/lib/db'
import { cn, formatDate } from '@/lib/utils'

// 4. Internal - components
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/posts/post-card'

// 5. Types
import type { Post } from '@prisma/client'
```

## 🎨 Component Structure Template

```typescript
'use client' // Only if needed

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'

// Types
interface MyComponentProps {
  title: string
  items: Item[]
  onAction?: () => void
}

// Component
export function MyComponent({ title, items, onAction }: MyComponentProps) {
  // State
  const [isLoading, setIsLoading] = useState(false)

  // Handlers
  const handleClick = async () => {
    setIsLoading(true)
    try {
      // Logic here
      toast({ title: "Thành công" })
      onAction?.()
    } catch (error) {
      toast({ title: "Lỗi", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  // Render
  return (
    <Card>
      <h2 className="text-2xl font-bold">{title}</h2>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Đang xử lý..." : "Xác nhận"}
      </Button>
    </Card>
  )
}
```

## ⚠️ Common Mistakes to Avoid

1. **Don't use 'use client' unnecessarily** - Default to Server Components
2. **Don't fetch data in Client Components** - Use Server Components or React Query
3. **Don't forget error boundaries** - Wrap error-prone code
4. **Don't skip loading states** - Always show loading UI
5. **Don't expose secrets** - Use environment variables properly
6. **Don't skip validation** - Validate on both client and server
7. **Don't use raw HTML forms** - Use shadcn/ui + React Hook Form
8. **Don't forget accessibility** - Use semantic HTML and ARIA labels
9. **Don't hardcode text** - Use constants for reusable strings
10. **Don't skip type safety** - Use TypeScript properly

## 🎯 When Generating Code

When I ask you to create code, follow these rules:

1. **Use shadcn/ui components** instead of raw HTML
2. **Use TypeScript** with proper types
3. **Follow the file structure** convention
4. **Include error handling** with try-catch
5. **Add loading states** for async operations
6. **Use Vietnamese** for UI text
7. **Import from @/ alias** for internal imports
8. **Add comments** for complex logic only
9. **Use Prisma** for database queries
10. **Validate with Zod** for forms

---

**Remember**: This project prioritizes **type safety**, **user experience**, and **maintainability**. Always choose the pattern that best serves these goals.
