'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

type UserFormData = {
  username: string
  email: string
  password?: string
  full_name?: string
  avatar?: string
  role: 'admin' | 'editor' | 'user'
  status: 'active' | 'inactive'
}

interface User {
  id: number
  username: string
  email: string
  full_name: string | null
  avatar: string | null
  role: 'admin' | 'editor' | 'user'
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date
}

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  user?: User
}

export function UserFormDialog({ open, onOpenChange, onSuccess, user }: UserFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<UserFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      full_name: '',
      avatar: '',
      role: 'user',
      status: 'active'
    }
  })

  const currentRole = watch('role')
  const currentStatus = watch('status')
  const avatarUrl = watch('avatar')

  useEffect(() => {
    if (user) {
      setValue('username', user.username)
      setValue('email', user.email)
      setValue('full_name', user.full_name || '')
      setValue('avatar', user.avatar || '')
      setValue('role', user.role)
      setValue('status', user.status)
      setAvatarPreview(user.avatar || '')
    } else {
      reset()
      setAvatarPreview('')
    }
  }, [user, setValue, reset])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn file ảnh',
        variant: 'destructive'
      })
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'users')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setValue('avatar', data.url)
      setAvatarPreview(data.url)
      
      toast({
        title: 'Thành công',
        description: 'Đã upload ảnh đại diện',
        variant: 'success'
      })
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể upload ảnh',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = () => {
    setValue('avatar', '')
    setAvatarPreview('')
  }

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true)
    
    try {
      // Nếu edit user và không nhập password mới, bỏ trường password
      const submitData = user && !data.password
        ? { ...data, password: undefined }
        : data

      const url = user ? `/api/users/${user.id}` : '/api/users'
      const method = user ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra')
      }

      toast({
        title: 'Thành công',
        description: user ? 'Đã cập nhật người dùng' : 'Đã tạo người dùng mới',
        variant: 'success'
      })

      onSuccess()
      onOpenChange(false)
      reset()
      setAvatarPreview('')
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể lưu người dùng',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? 'Chỉnh sửa Người dùng' : 'Thêm Người dùng Mới'}</DialogTitle>
          <DialogDescription>
            {user ? 'Cập nhật thông tin người dùng' : 'Tạo tài khoản người dùng mới'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập *</Label>
              <Input
                id="username"
                {...register('username', { required: 'Tên đăng nhập không được để trống' })}
                placeholder="username"
                disabled={!!user}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email không được để trống' })}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu {!user && '*'}</Label>
              <Input
                id="password"
                type="password"
                {...register('password', user ? {} : { required: 'Mật khẩu không được để trống' })}
                placeholder={user ? 'Để trống nếu không đổi' : 'Nhập mật khẩu...'}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Họ tên</Label>
              <Input
                id="full_name"
                {...register('full_name')}
                placeholder="Nguyễn Văn A"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ảnh đại diện</Label>
            <div className="flex items-start gap-4">
              {avatarPreview || avatarUrl ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  <Image
                    src={avatarPreview || avatarUrl || ''}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <ArrowUpTrayIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Hoặc nhập URL ảnh bên dưới
                </p>
                <Input
                  {...register('avatar')}
                  placeholder="https://example.com/avatar.jpg"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select
                value={currentRole}
                onValueChange={(value) => setValue('role', value as 'admin' | 'editor' | 'user')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                  <SelectItem value="editor">Biên tập viên</SelectItem>
                  <SelectItem value="user">Người dùng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={currentStatus}
                onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                reset()
                setAvatarPreview('')
              }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting ? 'Đang lưu...' : (user ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
