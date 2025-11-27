# 07. UI COMPONENTS - shadcn/ui Chi Tiết

> ⏱️ **Thời gian đọc**: 90-120 phút  
> 🎯 **Mục tiêu**: Hiểu 100% shadcn/ui components, styling với Tailwind, form handling

---

## 📘 MỤC LỤC

1. [shadcn/ui Overview](#1-shadcnui-overview)
2. [Components Library](#2-components-library)
3. [Form Components](#3-form-components)
4. [Layout Components](#4-layout-components)
5. [Feedback Components](#5-feedback-components)
6. [Tailwind CSS Styling](#6-tailwind-css-styling)
7. [Custom Components](#7-custom-components)
8. [Best Practices](#8-best-practices)

---

## 1. shadcn/ui Overview

### 1.1. shadcn/ui là gì?

**shadcn/ui** ≠ Component library thông thường

```
Traditional Libraries (MUI, Ant Design):
  - npm install → tải cả library
  - Components nằm trong node_modules
  - Khó customize
  - Bundle size lớn

shadcn/ui:
  - CLI copy component vào project
  - Components nằm trong components/ui/
  - ✅ Dễ customize (edit code trực tiếp)
  - ✅ Bundle chỉ bao gồm components dùng
  - ✅ Full TypeScript support
```

### 1.2. Cách Hoạt Động

```bash
# Install component
npx shadcn-ui@latest add button

# File được tạo:
components/ui/button.tsx  ← Component code (có thể edit)
```

**Sau khi add**:

```tsx
// components/ui/button.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground...",
        destructive: "bg-destructive text-white...",
        outline: "border bg-background...",
        // ...
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-10 px-6",
        // ...
      }
    }
  }
)

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

**Sử dụng**:

```tsx
import { Button } from "@/components/ui/button"

<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="sm">Small</Button>
```

### 1.3. Project Components List

```
components/ui/
  ├── alert-dialog.tsx    → Confirmation dialogs
  ├── avatar.tsx          → User avatars
  ├── badge.tsx           → Status badges
  ├── button.tsx          → Buttons (all variants)
  ├── card.tsx            → Card container
  ├── dialog.tsx          → Modal dialogs
  ├── dropdown-menu.tsx   → Dropdown menus
  ├── input.tsx           → Text inputs
  ├── label.tsx           → Form labels
  ├── select.tsx          → Select dropdowns
  ├── table.tsx           → Data tables
  ├── textarea.tsx        → Multi-line text input
  ├── toast.tsx           → Notification toasts
  └── toaster.tsx         → Toast container
```

---

## 2. Components Library

### 2.1. Button

#### Variants

```tsx
import { Button } from "@/components/ui/button"

// Default (primary blue)
<Button>Default</Button>

// Destructive (red - for delete)
<Button variant="destructive">Delete</Button>

// Outline (white with border)
<Button variant="outline">Cancel</Button>

// Secondary (gray)
<Button variant="secondary">Secondary</Button>

// Ghost (transparent, hover effect)
<Button variant="ghost">Ghost</Button>

// Link (text with underline)
<Button variant="link">Link</Button>
```

#### Sizes

```tsx
// Small
<Button size="sm">Small</Button>

// Default
<Button>Default</Button>

// Large
<Button size="lg">Large</Button>

// Icon only
<Button size="icon">
  <TrashIcon />
</Button>
```

#### With Icons

```tsx
import { PlusIcon, TrashIcon } from 'lucide-react'

// Icon + Text
<Button>
  <PlusIcon className="mr-2 h-4 w-4" />
  Add New
</Button>

// Icon only
<Button size="icon" variant="ghost">
  <TrashIcon className="h-4 w-4" />
</Button>
```

#### States

```tsx
// Disabled
<Button disabled>Disabled</Button>

// Loading
<Button disabled>
  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>

// As Link
<Button asChild>
  <Link href="/admin/posts">Go to Posts</Link>
</Button>
```

---

### 2.2. Input

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Basic input
<Input type="text" placeholder="Enter text..." />

// With label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="your@email.com"
  />
</div>

// Disabled
<Input disabled placeholder="Disabled" />

// Error state (with custom styling)
<Input
  className="border-red-500 focus-visible:ring-red-500"
  placeholder="Error input"
/>

// With icon
<div className="relative">
  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  <Input className="pl-10" placeholder="Search..." />
</div>
```

---

### 2.3. Textarea

```tsx
import { Textarea } from "@/components/ui/textarea"

// Basic
<Textarea placeholder="Enter content..." />

// With rows
<Textarea rows={5} placeholder="Long content..." />

// Disabled
<Textarea disabled value="Cannot edit" />

// With label
<div className="space-y-2">
  <Label htmlFor="description">Description</Label>
  <Textarea
    id="description"
    placeholder="Enter description..."
    rows={4}
  />
</div>
```

---

### 2.4. Select

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

// Basic select
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Chọn danh mục" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Tin tức</SelectItem>
    <SelectItem value="2">Dự án</SelectItem>
    <SelectItem value="3">Sự kiện</SelectItem>
  </SelectContent>
</Select>

// With label
<div className="space-y-2">
  <Label>Danh mục</Label>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Chọn..." />
    </SelectTrigger>
    <SelectContent>
      {categories.map(cat => (
        <SelectItem key={cat.id} value={cat.id.toString()}>
          {cat.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

// Controlled
const [value, setValue] = useState('')

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="draft">Draft</SelectItem>
    <SelectItem value="published">Published</SelectItem>
  </SelectContent>
</Select>
```

---

### 2.5. Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card"

// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Simple card
<Card className="p-6">
  <h3 className="font-bold mb-2">Simple Card</h3>
  <p>Just content without structure</p>
</Card>

// Example: Post card
<Card>
  <CardHeader>
    <CardTitle>{post.title}</CardTitle>
    <CardDescription>
      {formatDate(post.created_at)}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p className="line-clamp-3">{post.excerpt}</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Badge>{post.status}</Badge>
    <Button size="sm">Read More</Button>
  </CardFooter>
</Card>
```

---

### 2.6. Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

// Basic dialog
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description here
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      Dialog content
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Controlled dialog
const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### 2.7. Alert Dialog (Confirmation)

```tsx
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
} from "@/components/ui/alert-dialog"

// Delete confirmation
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
      <AlertDialogDescription>
        Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Hủy</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Xóa
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// Example: Delete button component
function DeleteButton({ onDelete, title }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa "{title}"?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn sẽ không thể khôi phục sau khi xóa.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-white"
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

---

### 2.8. Table

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

// Basic table
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Tiêu đề</TableHead>
      <TableHead>Danh mục</TableHead>
      <TableHead>Trạng thái</TableHead>
      <TableHead className="text-right">Hành động</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {posts.map(post => (
      <TableRow key={post.id}>
        <TableCell className="font-medium">{post.title}</TableCell>
        <TableCell>{post.category?.name}</TableCell>
        <TableCell>
          <Badge>{post.status}</Badge>
        </TableCell>
        <TableCell className="text-right">
          <Button size="sm" variant="ghost">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// Empty state
<Table>
  <TableHeader>...</TableHeader>
  <TableBody>
    {posts.length === 0 ? (
      <TableRow>
        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
          Không có dữ liệu
        </TableCell>
      </TableRow>
    ) : (
      posts.map(post => ...)
    )}
  </TableBody>
</Table>
```

---

### 2.9. Badge

```tsx
import { Badge } from "@/components/ui/badge"

// Default (primary)
<Badge>Default</Badge>

// Secondary
<Badge variant="secondary">Secondary</Badge>

// Destructive (red)
<Badge variant="destructive">Error</Badge>

// Outline
<Badge variant="outline">Outline</Badge>

// Custom colors
<Badge className="bg-green-600 hover:bg-green-700">
  Success
</Badge>

// Status badges example
function StatusBadge({ status }) {
  const variants = {
    draft: { variant: 'secondary', label: 'Nháp' },
    published: { variant: 'default', label: 'Đã xuất bản' },
    archived: { variant: 'destructive', label: 'Lưu trữ' }
  }
  
  const { variant, label } = variants[status]
  
  return <Badge variant={variant}>{label}</Badge>
}
```

---

### 2.10. Dropdown Menu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'

// Basic dropdown
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleEdit}>
      <Pencil className="mr-2 h-4 w-4" />
      Chỉnh sửa
    </DropdownMenuItem>
    <DropdownMenuItem
      onClick={handleDelete}
      className="text-red-600"
    >
      <Trash className="mr-2 h-4 w-4" />
      Xóa
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// Example: Table actions menu
function TableActions({ post }) {
  const router = useRouter()
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/admin/posts/${post.id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDuplicate(post.id)}>
          <Copy className="mr-2 h-4 w-4" />
          Nhân bản
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
}
```

---

### 2.11. Toast (Notifications)

```tsx
import { toast } from "@/components/ui/use-toast"

// Success toast
toast({
  title: "Thành công",
  description: "Đã lưu thay đổi"
})

// Error toast
toast({
  title: "Lỗi",
  description: "Không thể lưu. Vui lòng thử lại.",
  variant: "destructive"
})

// With action
toast({
  title: "Đã xóa bài viết",
  description: "Bài viết đã được xóa",
  action: (
    <Button variant="outline" size="sm" onClick={handleUndo}>
      Hoàn tác
    </Button>
  )
})

// Custom duration
toast({
  title: "Notification",
  description: "This will disappear in 3 seconds",
  duration: 3000  // ms
})

// Example: Form submit
async function handleSubmit(data) {
  try {
    await savePost(data)
    
    toast({
      title: "Thành công",
      description: "Đã tạo bài viết mới"
    })
    
    router.push('/admin/posts')
  } catch (error) {
    toast({
      title: "Lỗi",
      description: error.message,
      variant: "destructive"
    })
  }
}
```

**Setup Toaster** (trong layout):

```tsx
// app/layout.tsx
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

---

## 3. Form Components

### 3.1. React Hook Form Integration

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'

// Schema
const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề bắt buộc").max(255),
  content: z.string().min(1, "Nội dung bắt buộc"),
  excerpt: z.string().max(500).optional()
})

type FormData = z.infer<typeof formSchema>

export function PostForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })
  
  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!res.ok) throw new Error('Failed')
      
      toast({ title: "Thành công", description: "Đã tạo bài viết" })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo bài viết",
        variant: "destructive"
      })
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Nhập tiêu đề..."
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Nội dung *</Label>
        <Textarea
          id="content"
          {...register('content')}
          placeholder="Nhập nội dung..."
          rows={10}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="excerpt">Tóm tắt</Label>
        <Textarea
          id="excerpt"
          {...register('excerpt')}
          placeholder="Tóm tắt ngắn..."
          rows={3}
        />
        {errors.excerpt && (
          <p className="text-sm text-red-500">{errors.excerpt.message}</p>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
        <Button type="button" variant="outline">
          Hủy
        </Button>
      </div>
    </form>
  )
}
```

### 3.2. File Upload Component

```tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

export function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Lỗi",
        description: "Chỉ chấp nhận file ảnh",
        variant: "destructive"
      })
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "File quá lớn (tối đa 5MB)",
        variant: "destructive"
      })
      return
    }
    
    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      })
      
      const data = await res.json()
      
      if (data.success) {
        setPreview(data.data.url)
        onChange(data.data.url)
        toast({ title: "Thành công", description: "Đã upload ảnh" })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Upload thất bại",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }
  
  const handleRemove = () => {
    setPreview('')
    onChange('')
  }
  
  return (
    <div className="space-y-4">
      <Label>Ảnh bìa</Label>
      
      {preview ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Kéo thả ảnh hoặc click để chọn
          </p>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="mt-4"
          />
        </div>
      )}
      
      {uploading && <p className="text-sm text-gray-500">Đang upload...</p>}
    </div>
  )
}
```

---

## 4. Layout Components

### 4.1. Page Container

```tsx
export function PageContainer({ children, title, description, action }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  )
}

// Usage
<PageContainer
  title="Quản Lý Bài Viết"
  description="Tạo và quản lý bài viết"
  action={
    <Button>
      <PlusIcon className="mr-2 h-4 w-4" />
      Tạo Mới
    </Button>
  }
>
  <PostsTable posts={posts} />
</PageContainer>
```

### 4.2. Data Table with Actions

```tsx
export function DataTable({ data, columns, onEdit, onDelete }) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              {columns.map(col => (
                <TableCell key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </TableCell>
              ))}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(row)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(row)}
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
    </Card>
  )
}

// Usage
<DataTable
  data={posts}
  columns={[
    { key: 'title', label: 'Tiêu đề' },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'created_at',
      label: 'Ngày tạo',
      render: (row) => formatDate(row.created_at)
    }
  ]}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

## 5. Feedback Components

### 5.1. Loading States

```tsx
// Skeleton loader
export function PostSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

// Usage
{loading ? (
  <PostSkeleton />
) : (
  <PostCard post={post} />
)}
```

### 5.2. Empty States

```tsx
export function EmptyState({ title, description, action }) {
  return (
    <Card className="p-12 text-center">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FileIcon className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action}
    </Card>
  )
}

// Usage
{posts.length === 0 ? (
  <EmptyState
    title="Chưa có bài viết"
    description="Tạo bài viết đầu tiên của bạn"
    action={
      <Button>
        <PlusIcon className="mr-2 h-4 w-4" />
        Tạo Bài Viết
      </Button>
    }
  />
) : (
  <PostsGrid posts={posts} />
)}
```

---

## 6. Tailwind CSS Styling

### 6.1. Common Patterns

```tsx
// Container
<div className="container mx-auto px-4">

// Card grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flexbox
<div className="flex items-center justify-between">
<div className="flex flex-col gap-4">

// Spacing
<div className="space-y-4">  {/* Vertical spacing */}
<div className="space-x-2">  {/* Horizontal spacing */}

// Text truncate
<p className="truncate">Long text...</p>
<p className="line-clamp-3">Long text...</p>

// Responsive
<div className="text-sm md:text-base lg:text-lg">

// Hover effects
<div className="hover:bg-gray-100 transition-colors">
```

### 6.2. Custom Utilities

```tsx
// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage: Merge Tailwind classes
<Button className={cn(
  "default-classes",
  isActive && "bg-blue-600",
  isDisabled && "opacity-50"
)} />
```

---

## 7. Custom Components

### 7.1. Status Badge Component

```tsx
// components/StatusBadge.tsx
import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  status: 'draft' | 'published' | 'archived'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    draft: {
      variant: 'secondary' as const,
      label: 'Nháp',
      className: 'bg-gray-500'
    },
    published: {
      variant: 'default' as const,
      label: 'Đã xuất bản',
      className: 'bg-green-600'
    },
    archived: {
      variant: 'destructive' as const,
      label: 'Lưu trữ',
      className: ''
    }
  }
  
  const config = variants[status]
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
```

### 7.2. Pagination Component

```tsx
// components/Pagination.tsx
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            size="icon"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

---

## 8. Best Practices

### 8.1. Component Organization

```
components/
  ├── ui/              ← shadcn components (don't edit unless needed)
  ├── layout/          ← Layout components (Header, Footer, Sidebar)
  ├── forms/           ← Form components (PostForm, CategoryForm)
  └── [feature]/       ← Feature-specific (posts/, projects/)
```

### 8.2. Naming Conventions

```tsx
// ✅ GOOD
<Button />
<PostForm />
<UserAvatar />

// ❌ BAD
<button />
<postform />
<user_avatar />
```

### 8.3. Props Typing

```tsx
// ✅ GOOD
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline'
  size?: 'sm' | 'default' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ variant, size, children, onClick }: ButtonProps) {
  // ...
}
```

### 8.4. Conditional Styling

```tsx
// ✅ GOOD: Use cn() helper
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  isError && "error-classes"
)} />

// ❌ BAD: String concatenation
<div className={`base-classes ${isActive ? 'active-classes' : ''}`} />
```

---

## 🎯 Tóm Tắt

### shadcn/ui Components
- **Form**: Button, Input, Textarea, Select, Label
- **Layout**: Card, Table, Dialog, Alert Dialog
- **Feedback**: Toast, Badge, Dropdown Menu
- **Data**: Table with pagination, Empty states, Skeletons

### Key Concepts
- Components copy vào project (có thể customize)
- Dùng Tailwind CSS cho styling
- Type-safe với TypeScript
- Accessible by default

### Integration
- ✅ React Hook Form + Zod validation
- ✅ Next.js Image optimization
- ✅ Client & Server components
- ✅ Responsive design

**Next**: Đọc [08_FEATURES.md](./08_FEATURES.md) để hiểu chi tiết từng feature module.
