'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Drawing } from '@prisma/client'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const drawingFormSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  dwg_file: z.string().min(1, 'File DWG là bắt buộc'),
  icon: z.string().max(5000).optional(), // Increased for SVG code
  status: z.enum(['active', 'inactive']),
  display_order: z.number().int().min(0),
})

type DrawingFormData = z.infer<typeof drawingFormSchema>

interface DrawingFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  drawing?: Drawing | null
  onSuccess: () => void
}

export function DrawingFormDialog({
  open,
  onOpenChange,
  drawing,
  onSuccess,
}: DrawingFormDialogProps) {
  const isEdit = !!drawing
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingDwg, setIsUploadingDwg] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DrawingFormData>({
    resolver: zodResolver(drawingFormSchema),
    defaultValues: {
      title: '',
      dwg_file: '',
      icon: '',
      status: 'active',
      display_order: 0,
    },
  })

  const status = watch('status')
  const dwgFile = watch('dwg_file')

  useEffect(() => {
    if (open && drawing) {
      reset({
        title: drawing.title,
        dwg_file: drawing.dwg_file,
        icon: drawing.icon || '',
        status: drawing.status,
        display_order: drawing.display_order,
      })
    } else if (open && !drawing) {
      reset({
        title: '',
        dwg_file: '',
        icon: '',
        status: 'active',
        display_order: 0,
      })
    }
  }, [open, drawing, reset])

  const handleDwgFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file extension
    if (!file.name.toLowerCase().endsWith('.dwg')) {
      toast({
        title: 'Lỗi',
        description: 'Chỉ chấp nhận file .dwg',
        variant: 'destructive',
      })
      return
    }

    setIsUploadingDwg(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'dwg')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload thất bại')
      }

      const result = await response.json()
      setValue('dwg_file', result.data.url)
      toast({
        title: 'Thành công',
        description: 'Đã upload file DWG',
      })
    } catch (error) {
      toast({
        title: 'Lỗi upload',
        description: error instanceof Error ? error.message : 'Upload thất bại',
        variant: 'destructive',
      })
    } finally {
      setIsUploadingDwg(false)
    }
  }



  const onSubmit = async (data: DrawingFormData) => {
    setIsSubmitting(true)
    try {
      const url = isEdit ? `/api/drawings/${drawing.id}` : '/api/drawings'
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
        description: isEdit ? 'Đã cập nhật bản vẽ' : 'Đã tạo bản vẽ mới',
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
            {isEdit ? 'Chỉnh sửa Bản vẽ' : 'Thêm Bản vẽ mới'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin bản vẽ' : 'Thêm bản vẽ DWG mới'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Nhập tiêu đề bản vẽ..."
              className="h-11"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* DWG File Upload */}
          <div className="space-y-2">
            <Label htmlFor="dwg_file" className="text-sm font-medium">
              File DWG <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                id="dwg_file_upload"
                type="file"
                accept=".dwg"
                onChange={handleDwgFileUpload}
                disabled={isUploadingDwg}
                className="h-11"
              />
              {isUploadingDwg && (
                <p className="text-sm text-blue-600">Đang upload...</p>
              )}
              {dwgFile && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Đã upload file
                </div>
              )}
            </div>

            {/* URL Input (hidden but stored) */}
            <input type="hidden" {...register('dwg_file')} />
            {errors.dwg_file && (
              <p className="text-sm text-red-500">{errors.dwg_file.message}</p>
            )}
          </div>

          {/* Icon URL */}
          <div className="space-y-2">
            <Label htmlFor="icon" className="text-sm font-medium">
              Icon (SVG hoặc Emoji)
            </Label>
            <textarea
              id="icon"
              {...register('icon')}
              placeholder="Paste SVG code từ heroicons.com/solid hoặc nhập emoji..."
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
            />
            <p className="text-xs text-gray-500">VD: Paste SVG từ heroicons.com hoặc emoji 📊</p>
            {errors.icon && (
              <p className="text-sm text-red-500">{errors.icon.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Trạng thái
            </Label>
            <Select
              value={status}
              onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hiển thị</SelectItem>
                <SelectItem value="inactive">Ẩn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Display Order */}
          <div className="space-y-2">
            <Label htmlFor="display_order" className="text-sm font-medium">
              Thứ tự hiển thị
            </Label>
            <Input
              id="display_order"
              type="number"
              {...register('display_order', { valueAsNumber: true })}
              min={0}
              className="h-11"
            />
            {errors.display_order && (
              <p className="text-sm text-red-500">{errors.display_order.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-11"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-11">
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
