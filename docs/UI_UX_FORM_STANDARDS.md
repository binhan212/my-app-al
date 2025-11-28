# 🎨 UI/UX Form Standards - Chuẩn Thiết Kế Forms

> **Mục tiêu**: Đảm bảo tất cả forms trong dự án có UX tốt, spacing đồng nhất, dễ sử dụng

---

## 📐 SPACING STANDARDS (Chuẩn Khoảng Cách)

### ✅ Quy tắc vàng:

```tsx
// ❌ SAI - Không có spacing
<div>
  <Label>Tên</Label>
  <Input />
</div>
<div>
  <Label>Email</Label>
  <Input />
</div>

// ✅ ĐÚNG - Có spacing đầy đủ
<form className="space-y-6">  {/* Form spacing: 6 (24px) */}
  <div className="space-y-2">  {/* Field spacing: 2 (8px) */}
    <Label className="text-sm font-medium">Tên</Label>
    <Input className="h-11" />
  </div>
  
  <div className="space-y-2">
    <Label className="text-sm font-medium">Email</Label>
    <Input className="h-11" />
  </div>
</form>
```

### 📏 Spacing Values:

| Element | Class | Pixels | Mục đích |
|---------|-------|--------|----------|
| Form container | `space-y-6` | 24px | Khoảng cách giữa các field groups |
| Field group | `space-y-2` | 8px | Khoảng cách Label → Input |
| Button group | `gap-3` | 12px | Khoảng cách giữa các buttons |
| Section | `space-y-8` | 32px | Khoảng cách giữa các sections lớn |

---

## 📏 SIZE STANDARDS (Chuẩn Kích Thước)

### Input Heights:

```tsx
// ❌ SAI - Default height quá nhỏ (36px)
<Input type="text" />

// ✅ ĐÚNG - Height 44px (h-11) - dễ tap trên mobile
<Input type="text" className="h-11" />
```

### Button Heights:

```tsx
// Standard button
<Button className="h-11 px-6">Lưu</Button>

// Small button (trong table)
<Button size="sm" className="h-9">Edit</Button>

// Large button (CTA chính)
<Button className="h-12 px-8 text-lg">Gửi đăng ký</Button>
```

### Textarea Rows:

```tsx
// Short content (excerpt, description)
<Textarea rows={3} />  // 3 lines

// Medium content (message, comment)
<Textarea rows={6} />  // 6 lines

// Long content (article body)
<Textarea rows={10} /> // 10 lines
```

---

## 🏷️ LABEL STANDARDS (Chuẩn Nhãn)

### Typography:

```tsx
// ✅ ĐÚNG - Font medium, size sm
<Label htmlFor="name" className="text-sm font-medium">
  Họ tên *
</Label>

// ❌ SAI - Không có styling
<Label htmlFor="name">Họ tên *</Label>
```

### Required Indicator:

```tsx
// Dùng asterisk (*) cho required fields
<Label className="text-sm font-medium">
  Email *
</Label>

// Optional - có thể thêm text
<Label className="text-sm font-medium">
  Số điện thoại <span className="text-gray-400">(tùy chọn)</span>
</Label>
```

---

## 📱 COMPLETE FORM TEMPLATE

### Template 1: Basic Form (Login, Contact, Feedback)

```tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function BasicForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // API call here
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      alert('Thành công!')
    } catch (error) {
      alert('Lỗi: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Form Title</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Họ tên *
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ tên..."
              className="h-11"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="h-11"
            />
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Nội dung *
            </Label>
            <Textarea
              id="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              placeholder="Nhập nội dung..."
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-11 text-base font-medium"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

### Template 2: Advanced Form (React Hook Form + Zod)

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'

// Validation Schema
const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề bắt buộc").max(255),
  content: z.string().min(10, "Nội dung tối thiểu 10 ký tự"),
  excerpt: z.string().max(500).optional()
})

type FormData = z.infer<typeof formSchema>

export function AdvancedForm() {
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

      toast({
        title: "Thành công",
        description: "Đã lưu thành công"
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Tiêu đề *
        </Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Nhập tiêu đề..."
          className="h-11"
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Content Field */}
      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-medium">
          Nội dung *
        </Label>
        <Textarea
          id="content"
          {...register('content')}
          placeholder="Nhập nội dung..."
          rows={10}
          className="resize-none"
        />
        {errors.content && (
          <p className="text-sm text-red-500 mt-1">
            {errors.content.message}
          </p>
        )}
      </div>

      {/* Excerpt Field */}
      <div className="space-y-2">
        <Label htmlFor="excerpt" className="text-sm font-medium">
          Tóm tắt <span className="text-gray-400">(tùy chọn)</span>
        </Label>
        <Textarea
          id="excerpt"
          {...register('excerpt')}
          placeholder="Tóm tắt ngắn..."
          rows={3}
          className="resize-none"
        />
        {errors.excerpt && (
          <p className="text-sm text-red-500 mt-1">
            {errors.excerpt.message}
          </p>
        )}
      </div>

      {/* Button Group */}
      <div className="flex gap-3 pt-2">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="h-11 px-6"
        >
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          className="h-11 px-6"
        >
          Hủy
        </Button>
      </div>
    </form>
  )
}
```

### Template 3: Dialog Form

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function FormDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Tạo mới</DialogTitle>
        </DialogHeader>

        <form className="space-y-6">
          {/* Fields */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Tiêu đề *
            </Label>
            <Input
              id="title"
              placeholder="Nhập tiêu đề..."
              className="h-11"
            />
          </div>

          {/* More fields... */}

        </form>

        <DialogFooter className="mt-6 gap-3">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10"
          >
            Hủy
          </Button>
          <Button 
            type="submit"
            className="h-10"
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 🎨 COLOR & STATE STANDARDS

### Error States:

```tsx
// Input with error
<Input 
  className="h-11 border-red-500 focus-visible:ring-red-500" 
  aria-invalid="true"
/>

// Error message
<p className="text-sm text-red-500 mt-1">
  Trường này bắt buộc
</p>
```

### Disabled States:

```tsx
// Disabled input
<Input 
  disabled 
  className="h-11 bg-gray-50 cursor-not-allowed"
/>

// Disabled button
<Button disabled className="h-11">
  Đang xử lý...
</Button>
```

### Success States:

```tsx
// Success message
<div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
  ✓ Lưu thành công!
</div>
```

---

## 📱 RESPONSIVE DESIGN

### Mobile-first Approach:

```tsx
<form className="space-y-6">
  {/* Full width on mobile, 2 columns on desktop */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <Label>Họ *</Label>
      <Input className="h-11" />
    </div>
    <div className="space-y-2">
      <Label>Tên *</Label>
      <Input className="h-11" />
    </div>
  </div>

  {/* Full width button on mobile, auto width on desktop */}
  <Button className="w-full md:w-auto h-11 px-6">
    Gửi
  </Button>
</form>
```

---

## ♿ ACCESSIBILITY (A11y)

### Required Elements:

```tsx
// 1. Label with htmlFor
<Label htmlFor="email">Email *</Label>
<Input id="email" />

// 2. Aria attributes
<Input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>

// 3. Error message với ID
{errors.email && (
  <p id="email-error" className="text-sm text-red-500">
    {errors.email.message}
  </p>
)}

// 4. Button với proper type
<Button type="submit">Gửi</Button>
<Button type="button">Hủy</Button>
```

---

## ✅ CHECKLIST - Apply Cho Mọi Form

Khi tạo/sửa form, check list này:

### Spacing:
- [ ] Form có `className="space-y-6"`
- [ ] Mỗi field group có `className="space-y-2"`
- [ ] Button group có `gap-3`

### Sizing:
- [ ] Input có `className="h-11"`
- [ ] Button có `className="h-11"` (hoặc h-10, h-12)
- [ ] Textarea có `rows` hợp lý (3, 6, 10)
- [ ] Textarea có `className="resize-none"` (nếu cần)

### Typography:
- [ ] Label có `className="text-sm font-medium"`
- [ ] Required fields có dấu `*`
- [ ] Placeholder text rõ ràng

### States:
- [ ] Loading state: `disabled={isSubmitting}`
- [ ] Error state: hiển thị message màu đỏ
- [ ] Success: dùng toast hoặc alert

### Accessibility:
- [ ] Label có `htmlFor` trỏ đến Input `id`
- [ ] Button có `type="submit"` hoặc `type="button"`
- [ ] Error message có ID và aria-describedby

### UX:
- [ ] Placeholder hữu ích
- [ ] Button text rõ ràng ("Lưu", "Gửi", không dùng "OK")
- [ ] Loading text: "Đang lưu...", "Đang gửi..."
- [ ] Mobile responsive

---

## 🚨 COMMON MISTAKES (Lỗi Thường Gặp)

### ❌ Bad:

```tsx
// 1. Không có spacing
<div>
  <Label>Name</Label>
  <Input />
</div>

// 2. Input quá nhỏ
<Input type="text" />

// 3. Label không có styling
<Label>Email</Label>

// 4. Textarea không fix được height
<Textarea />

// 5. Button không có height
<Button>Submit</Button>
```

### ✅ Good:

```tsx
// 1. Có spacing đầy đủ
<div className="space-y-2">
  <Label className="text-sm font-medium">Name *</Label>
  <Input className="h-11" />
</div>

// 2. Input đủ cao
<Input type="text" className="h-11" />

// 3. Label có styling
<Label className="text-sm font-medium">Email *</Label>

// 4. Textarea có rows và resize-none
<Textarea rows={6} className="resize-none" />

// 5. Button có height rõ ràng
<Button className="h-11 px-6">Gửi</Button>
```

---

## 📊 SUMMARY TABLE

| Element | Class | Giá trị | Ghi chú |
|---------|-------|---------|---------|
| **Form** | `space-y-6` | 24px | Spacing giữa field groups |
| **Field Group** | `space-y-2` | 8px | Label → Input |
| **Input** | `h-11` | 44px | Height chuẩn |
| **Button** | `h-11` | 44px | Height chuẩn |
| **Label** | `text-sm font-medium` | 14px, 500 | Typography |
| **Textarea** | `rows={6} resize-none` | 6 lines | Fixed height |
| **Button Group** | `gap-3` | 12px | Spacing giữa buttons |
| **Error Text** | `text-sm text-red-500` | 14px, red | Validation errors |

---

## 🎯 KẾT LUẬN

**3 Nguyên tắc vàng:**

1. **Spacing nhất quán**: `space-y-6` (form), `space-y-2` (field)
2. **Size chuẩn**: `h-11` (44px) cho input/button
3. **Typography rõ ràng**: `text-sm font-medium` cho label

**Apply cho tất cả forms:**
- Feedback form ✅
- Login form ✅
- Admin CRUD dialogs ✅
- Settings forms ✅

---

*Last updated: November 28, 2025*
