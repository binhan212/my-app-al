'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import type { Category } from '@prisma/client'

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống').max(100),
  description: z.string().optional(),
  parent_id: z.string().nullable().optional(),
  display_order: z.number().int(),
})

type CategoryFormData = {
  name: string
  description?: string
  parent_id?: string | null
  display_order: number
}

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  categories: Category[]
  onSuccess: () => void
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  categories,
  onSuccess,
}: CategoryFormDialogProps) {
  const isEdit = !!category
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter out current category and its children to prevent circular reference
  const availableParents = categories.filter(c => c.id !== category?.id)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      parent_id: null,
      display_order: 0,
    },
  })

  useEffect(() => {
    if (open && category) {
      reset({
        name: category.name,
        description: category.description || '',
        parent_id: category.parent_id?.toString() || null,
        display_order: category.display_order,
      })
    } else if (open && !category) {
      reset({
        name: '',
        description: '',
        parent_id: null,
        display_order: 0,
      })
    }
  }, [open, category, reset])

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)
    try {
      const payload = {
        name: data.name,
        description: data.description,
        parent_id: data.parent_id ? parseInt(data.parent_id) : null,
        display_order: data.display_order,
      }

      const url = isEdit ? `/api/categories/${category.id}` : '/api/categories'
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
        description: isEdit ? 'Đã cập nhật danh mục' : 'Đã tạo danh mục mới',
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Cập nhật thông tin danh mục'
              : 'Điền thông tin để tạo danh mục mới'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên danh mục <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Nhập tên danh mục..."
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent_id">Danh mục cha</Label>
              <Select
                value={watch('parent_id') || 'none'}
                onValueChange={(value) => setValue('parent_id', value === 'none' ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục cha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có (Danh mục gốc)</SelectItem>
                  {availableParents.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Thứ tự hiển thị</Label>
              <Input
                id="display_order"
                type="number"
                {...register('display_order', { valueAsNumber: true })}
                placeholder="0"
              />
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
