'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import dynamic from 'next/dynamic'
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
import type { About } from '@prisma/client'

// Dynamic import CKEditor to avoid SSR issues
const CKEditorComponent = dynamic(() => import('@/components/admin/CKEditorComponent'), {
  ssr: false,
  loading: () => <p className="text-sm text-gray-500">Đang tải editor...</p>
})

const aboutFormSchema = z.object({
  content: z.string().min(1, 'Nội dung không được để trống'),
  image_url: z.string().optional(),
})

type AboutFormData = {
  content: string
  image_url?: string
}

interface AboutFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  about?: About | null
  onSuccess: () => void
}

export function AboutFormDialog({
  open,
  onOpenChange,
  about,
  onSuccess,
}: AboutFormDialogProps) {
  const isEdit = !!about
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [editorContent, setEditorContent] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: {
      content: '',
      image_url: '',
    },
  })

  useEffect(() => {
    if (open && about) {
      reset({
        content: about.content,
        image_url: about.image_url || '',
      })
      setEditorContent(about.content)
      setPreviewImage(about.image_url)
    } else if (open && !about) {
      reset({
        content: '',
        image_url: '',
      })
      setEditorContent('')
      setPreviewImage(null)
    }
  }, [open, about, reset])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'media')

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

  const onSubmit = async (data: AboutFormData) => {
    setIsSubmitting(true)
    try {
      const url = isEdit ? `/api/about/${about.id}` : '/api/about'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editorContent,
          image_url: data.image_url || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Có lỗi xảy ra')
      }

      toast({
        title: 'Thành công',
        description: isEdit ? 'Đã cập nhật nội dung' : 'Đã tạo nội dung mới',
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
      <DialogContent className="max-w-5xl w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa Giới thiệu' : 'Thêm Nội dung Giới thiệu'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin giới thiệu' : 'Thêm nội dung giới thiệu mới'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-1">
            <div className="space-y-6 pb-6">
              {/* Image Upload Field */}
              <div className="space-y-2">
                <Label htmlFor="image_url">Hình ảnh (tùy chọn)</Label>
                
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
              </div>

              {/* Content Editor Field */}
              <div className="space-y-2">
                <Label>
                  Nội dung <span className="text-red-500">*</span>
                </Label>
                <div className="border rounded-md overflow-hidden">
                  <div className="min-h-[400px] w-full">
                    <CKEditorComponent
                      value={editorContent}
                      onChange={(content) => {
                        setEditorContent(content)
                        setValue('content', content)
                      }}
                    />
                  </div>
                </div>
                {errors.content && (
                  <p className="text-sm text-red-500">{errors.content.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 mt-4 border-t pt-4">
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
