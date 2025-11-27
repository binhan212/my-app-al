'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

type FeedbackFormData = {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  admin_reply?: string
  status: 'pending' | 'answered' | 'archived'
}

interface Feedback {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  admin_reply: string | null
  status: 'pending' | 'answered' | 'archived'
  created_at: Date
  updated_at: Date
  replied_at: Date | null
  replied_by: number | null
}

interface FeedbackFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  feedback?: Feedback
}

export function FeedbackFormDialog({ open, onOpenChange, onSuccess, feedback }: FeedbackFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FeedbackFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      admin_reply: '',
      status: 'pending'
    }
  })

  const currentStatus = watch('status')

  useEffect(() => {
    if (feedback) {
      setValue('name', feedback.name)
      setValue('email', feedback.email)
      setValue('phone', feedback.phone || '')
      setValue('subject', feedback.subject)
      setValue('message', feedback.message)
      setValue('admin_reply', feedback.admin_reply || '')
      setValue('status', feedback.status)
    } else {
      reset()
    }
  }, [feedback, setValue, reset])

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true)
    
    try {
      const url = feedback ? `/api/feedback/${feedback.id}` : '/api/feedback'
      const method = feedback ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra')
      }

      toast({
        title: 'Thành công',
        description: feedback ? 'Đã cập nhật phản hồi' : 'Đã tạo phản hồi mới',
        variant: 'success'
      })

      onSuccess()
      onOpenChange(false)
      reset()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể lưu phản hồi',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{feedback ? 'Xem & Trả lời Phản hồi' : 'Phản hồi mới'}</DialogTitle>
          <DialogDescription>
            {feedback ? 'Xem chi tiết và trả lời phản hồi từ khách hàng' : 'Thêm phản hồi mới vào hệ thống'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ tên *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Nguyễn Văn A"
                disabled={!!feedback}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="email@example.com"
                disabled={!!feedback}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="0123456789"
              disabled={!!feedback}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Tiêu đề *</Label>
            <Input
              id="subject"
              {...register('subject')}
              placeholder="Nhập tiêu đề phản hồi..."
              disabled={!!feedback}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Nội dung *</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Nhập nội dung phản hồi..."
              rows={5}
              disabled={!!feedback}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          {feedback && (
            <>
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Trả lời từ Admin</h3>
                
                <div className="space-y-2 mb-4">
                  <Label htmlFor="admin_reply">Nội dung trả lời</Label>
                  <Textarea
                    id="admin_reply"
                    {...register('admin_reply')}
                    placeholder="Nhập nội dung trả lời..."
                    rows={5}
                  />
                  {errors.admin_reply && (
                    <p className="text-sm text-red-500">{errors.admin_reply.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={currentStatus}
                    onValueChange={(value) => setValue('status', value as 'pending' | 'answered' | 'archived')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="answered">Đã trả lời</SelectItem>
                      <SelectItem value="archived">Lưu trữ</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-500">{errors.status.message}</p>
                  )}
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                reset()
              }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : (feedback ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
