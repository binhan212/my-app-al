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
import type { Slide } from '@prisma/client'

const slideFormSchema = z.object({
  title: z.string().max(255).optional(),
  description: z.string().optional(),
  image_url: z.string().min(1, 'Hình ảnh không được để trống'),
  link_url: z.string().optional(),
  display_order: z.number().int(),
  is_active: z.boolean(),
})

type SlideFormData = {
  title?: string
  description?: string
  image_url: string
  link_url?: string
  display_order: number
  is_active: boolean
}

interface SlideFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slide?: Slide | null
  onSuccess: () => void
}

export function SlideFormDialog({
  open,
  onOpenChange,
  slide,
  onSuccess,
}: SlideFormDialogProps) {
  const isEdit = !!slide
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
  } = useForm<SlideFormData>({
    resolver: zodResolver(slideFormSchema),
    defaultValues: {
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      display_order: 0,
      is_active: true,
    },
  })

  useEffect(() => {
    if (open && slide) {
      reset({
        title: slide.title || '',
        description: slide.description || '',
        image_url: slide.image_url,
        link_url: slide.link_url || '',
        display_order: slide.display_order,
        is_active: slide.is_active,
      })
      setPreviewImage(slide.image_url)
    } else if (open && !slide) {
      reset({
        title: '',
        description: '',
        image_url: '',
        link_url: '',
        display_order: 0,
        is_active: true,
      })
      setPreviewImage(null)
    }
  }, [open, slide, reset])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'slides')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload thất bại')
      }

      const result = await response.json()
      setValue('image_url', result.data.url)
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

  const onSubmit = async (data: SlideFormData) => {
    setIsSubmitting(true)
    try {
      const url = isEdit ? `/api/slides/${slide.id}` : '/api/slides'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Có lỗi xảy ra')
      }

      toast({
        title: 'Thành công',
        description: isEdit ? 'Đã cập nhật slide' : 'Đã tạo slide mới',
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa Slide' : 'Tạo Slide mới'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin slide' : 'Thêm slide mới vào hệ thống'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Nhập tiêu đề slide..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Nhập mô tả..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">
              Hình ảnh <span className="text-red-500">*</span>
            </Label>
            
            <div className="space-y-2">
              <Input
                id="image_file"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              {isUploading && (
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
              id="image_url"
              {...register('image_url')}
              placeholder="https://example.com/image.jpg"
              onChange={(e) => {
                setValue('image_url', e.target.value)
                setPreviewImage(e.target.value)
              }}
            />
            {errors.image_url && (
              <p className="text-sm text-red-500">{errors.image_url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="link_url">Link URL (tùy chọn)</Label>
            <Input
              id="link_url"
              {...register('link_url')}
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display_order">Thứ tự hiển thị</Label>
              <Input
                id="display_order"
                type="number"
                {...register('display_order', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_active">Trạng thái</Label>
              <Select
                value={watch('is_active') ? 'true' : 'false'}
                onValueChange={(value) => setValue('is_active', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Hiển thị</SelectItem>
                  <SelectItem value="false">Ẩn</SelectItem>
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
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
