'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import type { Setting } from '@prisma/client'

const settingsSchema = z.object({
  site_name: z.string().min(1, 'Tên site không được để trống'),
  site_logo: z.string().optional(),
  site_favicon: z.string().optional(),
  footer_about: z.string().optional(),
  contact_email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  contact_address: z.string().optional(),
  facebook_url: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  youtube_url: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  footer_copyright: z.string().optional()
})

type SettingsFormData = z.infer<typeof settingsSchema>

interface SettingsFormProps {
  settings: Setting
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false)
  const [logoPreview, setLogoPreview] = useState(settings.site_logo || '')
  const [faviconPreview, setFaviconPreview] = useState(settings.site_favicon || '')

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_name: settings.site_name,
      site_logo: settings.site_logo || '',
      site_favicon: settings.site_favicon || '',
      footer_about: settings.footer_about || '',
      contact_email: settings.contact_email || '',
      contact_phone: settings.contact_phone || '',
      contact_address: settings.contact_address || '',
      facebook_url: settings.facebook_url || '',
      youtube_url: settings.youtube_url || '',
      footer_copyright: settings.footer_copyright || ''
    }
  })

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'logo')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const result = await response.json()
      setValue('site_logo', result.data.url)
      setLogoPreview(result.data.url)
      toast({
        title: 'Thành công',
        description: 'Đã upload logo'
      })
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Upload logo thất bại',
        variant: 'destructive'
      })
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingFavicon(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'logo')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const result = await response.json()
      setValue('site_favicon', result.data.url)
      setFaviconPreview(result.data.url)
      toast({
        title: 'Thành công',
        description: 'Đã upload favicon'
      })
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Upload favicon thất bại',
        variant: 'destructive'
      })
    } finally {
      setIsUploadingFavicon(false)
    }
  }

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/settings/${settings.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Có lỗi xảy ra')
      }

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật cài đặt website'
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Thông tin chung */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
          <CardDescription>Cài đặt tên và logo website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">
              Tên Website <span className="text-red-500">*</span>
            </Label>
            <Input
              id="site_name"
              {...register('site_name')}
              placeholder="Cổng Thông Tin..."
            />
            {errors.site_name && (
              <p className="text-sm text-red-500">{errors.site_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site_logo">Logo Website</Label>
              <Input
                id="site_logo_file"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploadingLogo}
              />
              {isUploadingLogo && <p className="text-sm text-blue-600">Đang upload...</p>}
              {logoPreview && (
                <div className="mt-2 relative w-32 h-32 border rounded-lg overflow-hidden">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_favicon">Favicon (icon tab browser)</Label>
              <Input
                id="site_favicon_file"
                type="file"
                accept="image/*"
                onChange={handleFaviconUpload}
                disabled={isUploadingFavicon}
              />
              {isUploadingFavicon && <p className="text-sm text-blue-600">Đang upload...</p>}
              {faviconPreview && (
                <div className="mt-2 relative w-16 h-16 border rounded-lg overflow-hidden">
                  <Image
                    src={faviconPreview}
                    alt="Favicon preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thông tin Footer */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin Footer</CardTitle>
          <CardDescription>Nội dung hiển thị ở footer trang web</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footer_about">Về chúng tôi</Label>
            <Textarea
              id="footer_about"
              {...register('footer_about')}
              placeholder="Mô tả ngắn về tổ chức..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer_copyright">Copyright</Label>
            <Input
              id="footer_copyright"
              {...register('footer_copyright')}
              placeholder="© 2025 Tên tổ chức"
            />
          </div>
        </CardContent>
      </Card>

      {/* Thông tin liên hệ */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin liên hệ</CardTitle>
          <CardDescription>Email, số điện thoại, địa chỉ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              type="email"
              {...register('contact_email')}
              placeholder="info@domain.com"
            />
            {errors.contact_email && (
              <p className="text-sm text-red-500">{errors.contact_email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone">Số điện thoại</Label>
            <Input
              id="contact_phone"
              {...register('contact_phone')}
              placeholder="(84) 24 1234 5678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_address">Địa chỉ</Label>
            <Input
              id="contact_address"
              {...register('contact_address')}
              placeholder="Số nhà, đường, quận, thành phố..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Mạng xã hội */}
      <Card>
        <CardHeader>
          <CardTitle>Mạng xã hội</CardTitle>
          <CardDescription>Link Facebook, YouTube...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebook_url">Facebook URL</Label>
            <Input
              id="facebook_url"
              {...register('facebook_url')}
              placeholder="https://facebook.com/..."
            />
            {errors.facebook_url && (
              <p className="text-sm text-red-500">{errors.facebook_url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube_url">YouTube URL</Label>
            <Input
              id="youtube_url"
              {...register('youtube_url')}
              placeholder="https://youtube.com/..."
            />
            {errors.youtube_url && (
              <p className="text-sm text-red-500">{errors.youtube_url.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? 'Đang lưu...' : 'Lưu cài đặt'}
        </Button>
      </div>
    </form>
  )
}
