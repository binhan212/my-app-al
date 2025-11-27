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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Họ tên *</Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ tên..."
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email..."
            />
          </div>

          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại..."
            />
          </div>

          <div>
            <Label htmlFor="subject">Tiêu đề *</Label>
            <Input
              id="subject"
              type="text"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="Nhập tiêu đề..."
            />
          </div>

          <div>
            <Label htmlFor="message">Nội dung *</Label>
            <Textarea
              id="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Nhập nội dung ý kiến..."
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Đang gửi...' : 'Gửi ý kiến'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
