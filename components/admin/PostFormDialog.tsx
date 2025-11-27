'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Post, Category } from '@prisma/client'

const postFormSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').max(255),
  content: z.string().min(1, 'Nội dung không được để trống'),
  excerpt: z.string().max(500).optional(),
  cover_image: z.string().optional(),
  category_id: z.string().nullable().optional(),
  status: z.enum(['draft', 'published', 'archived']),
})

type PostFormData = z.infer<typeof postFormSchema>

interface PostFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post?: Post | null
  categories: Category[]
  onSuccess: () => void
}

export function PostFormDialog({
  open,
  onOpenChange,
  post,
  categories,
  onSuccess,
}: PostFormDialogProps) {
  const isEdit = !!post
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      cover_image: '',
      category_id: null,
      status: 'draft',
    },
  })

  // Reset form when dialog opens/closes or post changes
  useEffect(() => {
    if (open && post) {
      reset({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        cover_image: post.cover_image || '',
        category_id: post.category_id?.toString() || null,
        status: post.status as 'draft' | 'published' | 'archived',
      })
      setPreviewImage(post.cover_image || null)
    } else if (open && !post) {
      reset({
        title: '',
        content: '',
        excerpt: '',
        cover_image: '',
        category_id: null,
        status: 'draft',
      })
      setPreviewImage(null)
    }
  }, [open, post, reset])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'posts')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload thất bại')
      }

      const result = await response.json()
      setValue('cover_image', result.data.url)
      setPreviewImage(result.data.url)
      toast({
        title: 'Đã upload ảnh',
        description: 'Upload ảnh thành công',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Lỗi upload',
        description: error instanceof Error ? error.message : 'Upload thất bại',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...data,
        category_id: data.category_id ? parseInt(data.category_id) : null,
      }

      const url = isEdit ? `/api/posts/${post.id}` : '/api/posts'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Có lỗi xảy ra')
      }

      toast({
        title: 'Thành công',
        description: isEdit ? 'Đã cập nhật bài viết' : 'Đã tạo bài viết mới',
        variant: 'success',
      })

      onSuccess()
      onOpenChange(false)
      reset()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Cập nhật thông tin bài viết'
              : 'Điền thông tin để tạo bài viết mới'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Nhập tiêu đề bài viết..."
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Mô tả ngắn</Label>
            <Textarea
              id="excerpt"
              {...register('excerpt')}
              placeholder="Nhập mô tả ngắn..."
              rows={3}
            />
            {errors.excerpt && (
              <p className="text-sm text-red-500">{errors.excerpt.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              Nội dung <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              {...register('content')}
              placeholder="Nhập nội dung bài viết..."
              rows={10}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image">Ảnh bìa</Label>
            
            {/* File Upload */}
            <div className="space-y-2">
              <Input
                id="cover_image_file"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              {isUploading && (
                <p className="text-sm text-blue-600">Đang upload...</p>
              )}
            </div>

            {/* Preview Image */}
            {previewImage && (
              <div className="mt-2 relative w-full h-48">
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg border"
                />
              </div>
            )}

            {/* Or URL Input */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Hoặc nhập URL
                </span>
              </div>
            </div>

            <Input
              id="cover_image"
              {...register('cover_image')}
              placeholder="https://example.com/image.jpg"
              onChange={(e) => {
                setValue('cover_image', e.target.value)
                setPreviewImage(e.target.value)
              }}
            />
            {errors.cover_image && (
              <p className="text-sm text-red-500">
                {errors.cover_image.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category_id">Danh mục</Label>
            <Select
              value={watch('category_id') || 'none'}
              onValueChange={(value) => setValue('category_id', value === 'none' ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không có danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>            <div className="space-y-2">
              <Label htmlFor="status">
                Trạng thái <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch('status')}
                onValueChange={(value) =>
                  setValue('status', value as 'draft' | 'published' | 'archived')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="published">Đã xuất bản</SelectItem>
                  <SelectItem value="archived">Lưu trữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
