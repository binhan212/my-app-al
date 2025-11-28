'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function FeedbackForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Gửi ý kiến thành công! Chúng tôi sẽ xem xét và trả lời sớm nhất.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
        router.refresh()
      } else {
        alert('Gửi ý kiến thất bại. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Submit feedback error:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gửi ý kiến của bạn</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Họ tên */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Họ tên *
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ tên..."
              className="h-11"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email..."
              className="h-11"
            />
          </div>

          {/* Số điện thoại */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Số điện thoại
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại..."
              className="h-11"
            />
          </div>

          {/* Tiêu đề */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              Tiêu đề *
            </Label>
            <Input
              id="subject"
              type="text"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="Nhập tiêu đề..."
              className="h-11"
            />
          </div>

          {/* Nội dung */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Nội dung *
            </Label>
            <Textarea
              id="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              placeholder="Nhập nội dung ý kiến..."
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-11 text-base font-medium"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi ý kiến'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
