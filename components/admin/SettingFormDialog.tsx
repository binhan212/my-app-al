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
import Image from 'next/image'

type SettingFormData = {
  setting_key: string
  setting_value?: string
  setting_type: 'text' | 'number' | 'boolean' | 'json' | 'image'
}

interface Setting {
  id: number
  setting_key: string
  setting_value: string | null
  setting_type: 'text' | 'number' | 'boolean' | 'json' | 'image'
  updated_at: Date
}

interface SettingFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  setting?: Setting
}

export function SettingFormDialog({ open, onOpenChange, onSuccess, setting }: SettingFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SettingFormData>({
    defaultValues: {
      setting_key: '',
      setting_value: '',
      setting_type: 'text'
    }
  })

  const currentType = watch('setting_type')
  const currentValue = watch('setting_value')

  useEffect(() => {
    if (setting) {
      setValue('setting_key', setting.setting_key)
      setValue('setting_value', setting.setting_value || '')
      setValue('setting_type', setting.setting_type)
      if (setting.setting_type === 'image' && setting.setting_value) {
        setPreviewImage(setting.setting_value)
      }
    } else {
      reset()
      setPreviewImage(null)
    }
  }, [setting, setValue, reset])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'logo')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload thất bại')
      }

      const result = await response.json()
      setValue('setting_value', result.data.url)
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

  const onSubmit = async (data: SettingFormData) => {
    setIsSubmitting(true)
    
    try {
      const url = setting ? `/api/settings/${setting.id}` : '/api/settings'
      const method = setting ? 'PUT' : 'POST'
      
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
        description: setting ? 'Đã cập nhật cài đặt' : 'Đã tạo cài đặt mới',
        variant: 'success'
      })

      onSuccess()
      onOpenChange(false)
      reset()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể lưu cài đặt',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{setting ? 'Chỉnh sửa Cài đặt' : 'Thêm Cài đặt Mới'}</DialogTitle>
          <DialogDescription>
            {setting ? 'Cập nhật giá trị cài đặt hệ thống' : 'Thêm cấu hình mới cho hệ thống'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="setting_key">Key *</Label>
            <Input
              id="setting_key"
              {...register('setting_key', { required: 'Key không được để trống' })}
              placeholder="site_name, contact_email..."
              disabled={!!setting}
            />
            {errors.setting_key && (
              <p className="text-sm text-red-500">{errors.setting_key.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="setting_type">Loại</Label>
            <Select
              value={currentType}
              onValueChange={(value) => {
                setValue('setting_type', value as 'text' | 'number' | 'boolean' | 'json' | 'image')
                if (value !== 'image') {
                  setPreviewImage(null)
                }
              }}
              disabled={!!setting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="setting_value">Giá trị</Label>
            
            {currentType === 'image' ? (
              <div className="space-y-3">
                {/* Image Preview */}
                {(previewImage || currentValue) && (
                  <div className="relative w-40 h-40 border rounded-lg overflow-hidden">
                    <Image
                      src={previewImage || currentValue || ''}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                {/* File Upload */}
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <p className="text-sm text-blue-600 mt-2">Đang upload...</p>
                  )}
                </div>
                
                {/* Manual URL Input (optional) */}
                <Input
                  id="setting_value"
                  {...register('setting_value')}
                  placeholder="Hoặc nhập URL ảnh..."
                  disabled={isUploading}
                  onChange={(e) => {
                    setValue('setting_value', e.target.value)
                    if (e.target.value) {
                      setPreviewImage(e.target.value)
                    }
                  }}
                />
              </div>
            ) : currentType === 'json' ? (
              <Textarea
                id="setting_value"
                {...register('setting_value')}
                placeholder='{"key": "value"}'
                rows={5}
              />
            ) : (
              <Input
                id="setting_value"
                {...register('setting_value')}
                placeholder={
                  currentType === 'boolean' ? 'true hoặc false' :
                  currentType === 'number' ? '123' :
                  'Nhập giá trị...'
                }
              />
            )}
            {errors.setting_value && (
              <p className="text-sm text-red-500">{errors.setting_value.message}</p>
            )}
          </div>

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
              {isSubmitting ? 'Đang lưu...' : (setting ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
