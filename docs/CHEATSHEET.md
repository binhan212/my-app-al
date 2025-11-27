# ⚡ CHEATSHEET - Tra Cứu Siêu Nhanh

> **Bookmark trang này!** Tra cứu nhanh nhất khi đang code.

---

## 📁 FILE PATHS - Biết cần tìm file gì

| Làm gì? | File nào? |
|---------|-----------|
| Tạo trang mới (public) | `app/(public)/ten-trang/page.tsx` |
| Tạo trang admin | `app/admin/ten-trang/page.tsx` |
| Tạo API endpoint | `app/api/ten-endpoint/route.ts` |
| Tạo UI component | `components/ui/ten-component.tsx` |
| Tạo form component | `components/ten-module/TenForm.tsx` |
| Thêm validation | `lib/validations.ts` |
| Thêm helper function | `lib/utils.ts` |
| Sửa database schema | `prisma/schema.prisma` |
| Config authentication | `lib/auth.ts` |
| Sửa global styles | `app/globals.css` |

---

## 🗄️ PRISMA - Database Operations

### 🔍 Find (Tìm)

```typescript
// Lấy 1 record theo ID
await db.post.findUnique({ where: { id: 1 } })

// Lấy 1 record theo điều kiện
await db.post.findFirst({ where: { slug: 'bai-viet' } })

// Lấy nhiều records
await db.post.findMany({
  where: { status: 'published' },
  take: 10,              // Limit
  skip: 0,               // Offset
  orderBy: { created_at: 'desc' }
})

// Đếm
await db.post.count({ where: { status: 'published' } })
```

### 📝 Where Conditions

```typescript
// Bằng
{ id: 1 }

// Không bằng
{ status: { not: 'draft' } }

// Trong danh sách
{ id: { in: [1, 2, 3] } }

// Chứa text (tìm kiếm)
{ title: { contains: 'keyword' } }

// Bắt đầu bằng
{ slug: { startsWith: 'du-an-' } }

// Lớn hơn / Nhỏ hơn
{ price: { gte: 100, lte: 1000 } }

// AND nhiều điều kiện
{
  AND: [
    { status: 'published' },
    { category_id: 1 }
  ]
}

// OR
{
  OR: [
    { title: { contains: 'abc' } },
    { content: { contains: 'abc' } }
  ]
}
```

### 🔗 Relationships (Join)

```typescript
// Include toàn bộ relation
await db.post.findUnique({
  where: { id: 1 },
  include: {
    author: true,
    category: true
  }
})

// Select chỉ vài fields
await db.post.findUnique({
  where: { id: 1 },
  include: {
    author: {
      select: { full_name: true, email: true }
    }
  }
})
```

### ➕ Create (Tạo)

```typescript
// Tạo 1 record
await db.post.create({
  data: {
    title: 'New Post',
    content: 'Content...',
    author_id: 1
  }
})

// Tạo nhiều
await db.post.createMany({
  data: [
    { title: 'Post 1', content: '...' },
    { title: 'Post 2', content: '...' }
  ]
})
```

### ✏️ Update (Sửa)

```typescript
// Update 1 record
await db.post.update({
  where: { id: 1 },
  data: { title: 'New Title' }
})

// Update nhiều
await db.post.updateMany({
  where: { status: 'draft' },
  data: { status: 'published' }
})
```

### ❌ Delete (Xóa)

```typescript
// Xóa 1 record
await db.post.delete({ where: { id: 1 } })

// Xóa nhiều
await db.post.deleteMany({ where: { status: 'archived' } })
```

---

## 🎨 TAILWIND - Styling Nhanh

### 📐 Layout

```
flex                    → Flexbox
flex-col                → Flex direction column
items-center            → Align items center
justify-between         → Space between
gap-4                   → Gap 1rem

grid                    → Grid
grid-cols-3             → 3 columns
grid-cols-1 md:grid-cols-3  → Responsive grid
```

### 📏 Spacing

```
p-4       → padding: 1rem
px-4      → padding left + right
py-2      → padding top + bottom
m-4       → margin: 1rem
mx-auto   → margin left + right auto (center)
space-y-4 → gap giữa các children theo chiều dọc
```

### 🔤 Text

```
text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl
font-bold, font-semibold, font-medium, font-normal
text-gray-600, text-blue-600, text-red-500
text-center, text-left, text-right
```

### 🎨 Colors

```
bg-white, bg-gray-100, bg-blue-600
text-gray-600, text-white
border-gray-300

hover:bg-blue-700
hover:text-white
```

### 🔲 Borders & Rounded

```
border          → border 1px
border-2        → border 2px
rounded         → border-radius: 0.25rem
rounded-lg      → border-radius: 0.5rem
rounded-full    → border-radius: 9999px (tròn)
```

### 📱 Responsive

```
Mặc định: Mobile
sm:   640px   → Tablet nhỏ
md:   768px   → Tablet
lg:   1024px  → Desktop
xl:   1280px  → Desktop lớn

Ví dụ:
<div class="text-sm md:text-base lg:text-lg">
```

---

## 🎯 NEXT.JS - Routing & Pages

### 📄 Tạo Trang

```typescript
// app/(public)/tin-tuc/page.tsx
export default async function NewsPage() {
  const posts = await db.post.findMany()
  return <div>...</div>
}

// Metadata
export const metadata = {
  title: 'Tin tức',
  description: 'Danh sách tin tức'
}
```

### 🔗 Dynamic Route

```typescript
// app/(public)/tin-tuc/[slug]/page.tsx
export default async function PostDetailPage({
  params
}: {
  params: { slug: string }
}) {
  const post = await db.post.findUnique({
    where: { slug: params.slug }
  })
  return <div>{post.title}</div>
}
```

### 🔄 Client Component

```tsx
'use client'  // Dòng này BẮT BUỘC ở đầu file

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### 🌐 API Route

```typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET
export async function GET() {
  const posts = await db.post.findMany()
  return NextResponse.json({ posts })
}

// POST
export async function POST(request: Request) {
  const body = await request.json()
  const post = await db.post.create({ data: body })
  return NextResponse.json({ post }, { status: 201 })
}
```

### 🔗 Navigation

```tsx
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Link component
<Link href="/tin-tuc">Tin tức</Link>

// Programmatic navigation
const router = useRouter()
router.push('/tin-tuc')
router.back()
router.refresh()  // Refresh data
```

---

## 🔐 AUTHENTICATION

### Server Component

```tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) redirect('/admin/login')
  
  return <div>Admin: {session.user.name}</div>
}
```

### Client Component

```tsx
'use client'

import { useSession, signOut } from 'next-auth/react'

export function UserMenu() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <div>Loading...</div>
  if (!session) return <div>Not logged in</div>
  
  return (
    <div>
      <p>{session.user.name}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  )
}
```

### API Route

```typescript
import { getServerSession } from 'next-auth'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Continue...
}
```

---

## 📝 FORM VALIDATION (ZOD)

### Define Schema

```typescript
// lib/validations.ts
import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(1, "Tiêu đề bắt buộc").max(255),
  content: z.string().min(1, "Nội dung bắt buộc"),
  status: z.enum(['draft', 'published', 'archived']),
  category_id: z.number().positive().optional().nullable()
})

export type PostFormData = z.infer<typeof postSchema>
```

### Use in Form

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function PostForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(postSchema)
  })
  
  const onSubmit = async (data) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Validate in API

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = postSchema.parse(body)  // Throw error nếu invalid
    
    const post = await db.post.create({ data })
    return NextResponse.json({ post })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }
  }
}
```

---

## 🎨 SHADCN/UI - Components

### Button

```tsx
import { Button } from '@/components/ui/button'

<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Input

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="Email..." />
```

### Textarea

```tsx
import { Textarea } from '@/components/ui/textarea'

<Textarea placeholder="Nhập nội dung..." rows={5} />
```

### Select

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Chọn danh mục" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Tin tức</SelectItem>
    <SelectItem value="2">Dự án</SelectItem>
  </SelectContent>
</Select>
```

### Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Xác nhận xóa?</DialogTitle>
    </DialogHeader>
    <p>Bạn có chắc muốn xóa?</p>
  </DialogContent>
</Dialog>
```

### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Table

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Tiêu đề</TableHead>
      <TableHead>Danh mục</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {posts.map(post => (
      <TableRow key={post.id}>
        <TableCell>{post.title}</TableCell>
        <TableCell>{post.category?.name}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Toast (Notification)

```tsx
import { toast } from '@/components/ui/use-toast'

// Success
toast({
  title: "Thành công",
  description: "Đã lưu thay đổi"
})

// Error
toast({
  title: "Lỗi",
  description: "Không thể lưu",
  variant: "destructive"
})
```

---

## 🛠️ HELPER FUNCTIONS (lib/utils.ts)

```typescript
import { cn, createSlug, formatDate, formatNumber } from '@/lib/utils'

// Merge Tailwind classes
<div className={cn('p-4 rounded', isActive && 'bg-blue-600')} />

// Create slug
createSlug("Bài viết mới")  // → "bai-viet-moi"

// Format date
formatDate(new Date())  // → "27/11/2025"

// Format number
formatNumber(1234567)  // → "1.234.567"
```

---

## 🖼️ IMAGE OPTIMIZATION

```tsx
import Image from 'next/image'

// Fixed size
<Image
  src="/uploads/image.jpg"
  alt="Description"
  width={800}
  height={400}
  className="rounded-lg"
/>

// Fill container (parent phải có position: relative)
<div className="relative w-full h-64">
  <Image
    src="/uploads/image.jpg"
    alt="Description"
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    className="object-cover"
  />
</div>
```

---

## ⌨️ TERMINAL COMMANDS

### Development

```bash
npm run dev          # Start dev server
npm run build        # Build production
npm start            # Start production server
```

### Prisma

```bash
npx prisma studio           # Open database GUI
npx prisma db push          # Push schema changes
npx prisma migrate dev      # Create migration
npx prisma generate         # Generate Prisma Client
```

### Git

```bash
git status                  # Check changes
git add .                   # Add all changes
git commit -m "message"     # Commit
git push origin master      # Push to GitHub
git pull origin master      # Pull from GitHub
```

### shadcn/ui

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
```

---

## 🐛 DEBUGGING

### Console Logs

```typescript
// Server Component/API Route → Terminal
console.log('Server:', data)

// Client Component → Browser Console
console.log('Client:', data)
```

### Prisma Logs

```typescript
// lib/db.ts
const db = new PrismaClient({
  log: ['query', 'error', 'warn']  // See SQL queries
})
```

### Check Session

```tsx
// Client component
const { data: session } = useSession()
console.log('Session:', session)

// Server component
const session = await getServerSession(authOptions)
console.log('Session:', session)
```

---

## 🚀 QUICK PATTERNS

### Fetch + Display (Server)

```tsx
// app/posts/page.tsx
export default async function PostsPage() {
  const posts = await db.post.findMany()
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

### Fetch + Display (Client)

```tsx
'use client'

import { useEffect, useState } from 'react'

export function PostsList() {
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data.posts))
  }, [])
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

### Create Form → API → Database

```tsx
// Component
const handleSubmit = async (data) => {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  
  if (res.ok) {
    router.push('/admin/posts')
  }
}

// API
export async function POST(request: Request) {
  const data = await request.json()
  const post = await db.post.create({ data })
  return NextResponse.json({ post })
}
```

---

**🔖 BOOKMARK PAGE NÀY ĐỂ TRA NHANH!**

**Quick Links:**
- [Full Documentation](./README.md)
- [Folder Structure](./02_CAU_TRUC_THU_MUC.md)
- [Data Flow](./03_LUONG_DU_LIEU.md)
