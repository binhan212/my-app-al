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
import type { Video } from '@prisma/client'

const videoFormSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').max(255),
  description: z.string().optional(),
  video_url: z.string().min(1, 'URL video không được để trống'),
  thumbnail_url: z.string().optional(),
  duration: z.string().optional(),
  display_order: z.number().int(),
  status: z.enum(['active', 'inactive']),
})

type VideoFormData = {
  title: string
  description?: string
  video_url: string
  thumbnail_url?: string
  duration?: string
  display_order: number
  status: 'active' | 'inactive'
}

interface VideoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  video?: Video | null
  onSuccess: () => void
}

export function VideoFormDialog({
  open,
  onOpenChange,
  video,
  onSuccess,
}: VideoFormDialogProps) {
  const isEdit = !!video
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: '',
      description: '',
      video_url: '',
      thumbnail_url: '',
      duration: '',
      display_order: 0,
      status: 'active',
    },
  })

  useEffect(() => {
    if (open && video) {
      reset({
        title: video.title,
        description: video.description || '',
        video_url: video.video_url,
        thumbnail_url: video.thumbnail_url || '',
        duration: video.duration || '',
        display_order: video.display_order,
        status: video.status as 'active' | 'inactive',
      })
      setPreviewThumbnail(video.thumbnail_url || null)
    } else if (open && !video) {
      reset({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        duration: '',
        display_order: 0,
        status: 'active',
      })
      setPreviewThumbnail(null)
    }
  }, [open, video, reset])

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'videos')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload thất bại')
      }

      const result = await response.json()
      setValue('thumbnail_url', result.data.url)
      setPreviewThumbnail(result.data.url)
      toast({
        title: 'Đã upload thumbnail',
        description: 'Upload ảnh thumbnail thành công',
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

  const onSubmit = async (data: VideoFormData) => {
    setIsSubmitting(true)
    try {
      const url = isEdit ? `/api/videos/${video.id}` : '/api/videos'
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
        description: isEdit ? 'Đã cập nhật video' : 'Đã tạo video mới',
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
            {isEdit ? 'Chỉnh sửa Video' : 'Tạo Video mới'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin video' : 'Thêm video mới vào hệ thống'}
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
              placeholder="Nhập tiêu đề video..."
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Nhập mô tả video..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video_url">
              URL Video <span className="text-red-500">*</span>
            </Label>
            <Input
              id="video_url"
              {...register('video_url')}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {errors.video_url && (
              <p className="text-sm text-red-500">{errors.video_url.message}</p>
            )}
            <p className="text-sm text-gray-500">
              Hỗ trợ YouTube, Vimeo, hoặc link video trực tiếp
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Ảnh thumbnail (tùy chọn)</Label>
            
            <div className="space-y-2">
              <Input
                id="thumbnail_file"
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                disabled={isUploading}
              />
              {isUploading && (
                <p className="text-sm text-blue-600">Đang upload...</p>
              )}
            </div>

            {previewThumbnail && (
              <div className="mt-2 relative w-full h-48">
                <Image
                  src={previewThumbnail}
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
              id="thumbnail_url"
              {...register('thumbnail_url')}
              placeholder="https://example.com/thumbnail.jpg"
              onChange={(e) => {
                setValue('thumbnail_url', e.target.value)
                setPreviewThumbnail(e.target.value)
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Thời lượng</Label>
              <Input
                id="duration"
                {...register('duration')}
                placeholder="5:30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Thứ tự</Label>
              <Input
                id="display_order"
                type="number"
                {...register('display_order', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hiển thị</SelectItem>
                  <SelectItem value="inactive">Ẩn</SelectItem>
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
