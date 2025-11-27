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
import type { Project, Category } from '@prisma/client'

const projectFormSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').max(255),
  description: z.string().max(500).optional(),
  content: z.string().optional(),
  cover_image: z.string().optional(),
  pdf_file: z.string().optional(),
  category_id: z.string().nullable().optional(),
  status: z.enum(['draft', 'published']),
})

type ProjectFormData = z.infer<typeof projectFormSchema>

interface ProjectFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project | null
  categories: Category[]
  onSuccess: () => void
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  categories,
  onSuccess,
}: ProjectFormDialogProps) {
  const isEdit = !!project
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      cover_image: '',
      pdf_file: '',
      category_id: null,
      status: 'draft',
    },
  })

  useEffect(() => {
    if (open && project) {
      reset({
        title: project.title,
        description: project.description || '',
        content: project.content || '',
        cover_image: project.cover_image || '',
        pdf_file: project.pdf_file || '',
        category_id: project.category_id?.toString() || null,
        status: project.status as 'draft' | 'published',
      })
      setPreviewImage(project.cover_image || null)
    } else if (open && !project) {
      reset({
        title: '',
        description: '',
        content: '',
        cover_image: '',
        pdf_file: '',
        category_id: null,
        status: 'draft',
      })
      setPreviewImage(null)
    }
  }, [open, project, reset])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'projects')

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
        description: 'Upload ảnh bìa thành công',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Lỗi upload',
        description: error instanceof Error ? error.message : 'Upload thất bại',
        variant: 'destructive',
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingPdf(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'pdfs')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload thất bại')
      }

      const result = await response.json()
      setValue('pdf_file', result.data.url)
      toast({
        title: 'Đã upload PDF',
        description: 'Upload file PDF thành công',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Lỗi upload',
        description: error instanceof Error ? error.message : 'Upload thất bại',
        variant: 'destructive',
      })
    } finally {
      setIsUploadingPdf(false)
    }
  }

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...data,
        category_id: data.category_id ? parseInt(data.category_id) : null,
      }

      const url = isEdit ? `/api/projects/${project.id}` : '/api/projects'
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
        description: isEdit ? 'Đã cập nhật dự án' : 'Đã tạo dự án mới',
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
            {isEdit ? 'Chỉnh sửa dự án' : 'Tạo dự án mới'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Cập nhật thông tin dự án'
              : 'Điền thông tin để tạo dự án mới'}
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
              placeholder="Nhập tiêu đề dự án..."
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả ngắn</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Nhập mô tả ngắn..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Nội dung chi tiết</Label>
            <Textarea
              id="content"
              {...register('content')}
              placeholder="Nhập nội dung chi tiết..."
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image">Ảnh bìa</Label>
            
            <div className="space-y-2">
              <Input
                id="cover_image_file"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
              />
              {isUploadingImage && (
                <p className="text-sm text-blue-600">Đang upload...</p>
              )}
            </div>

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
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf_file">File PDF</Label>
            
            <div className="space-y-2">
              <Input
                id="pdf_file_upload"
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                disabled={isUploadingPdf}
              />
              {isUploadingPdf && (
                <p className="text-sm text-blue-600">Đang upload PDF...</p>
              )}
              {watch('pdf_file') && (
                <p className="text-sm text-green-600">✓ Đã có file PDF</p>
              )}
            </div>

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
              id="pdf_file"
              {...register('pdf_file')}
              placeholder="https://example.com/file.pdf"
            />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Trạng thái <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch('status')}
                onValueChange={(value) =>
                  setValue('status', value as 'draft' | 'published')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="published">Đã xuất bản</SelectItem>
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
