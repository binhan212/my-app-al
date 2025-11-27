'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Settings {
  footer_about: string | null
  contact_email: string | null
  contact_phone: string | null
  contact_address: string | null
  footer_copyright: string | null
}

export function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.data)
        }
      })
      .catch(err => console.error('Failed to load settings:', err))
  }, [])

  return (
    <footer className="relative z-10 bg-[#0f2b5a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-bold mb-3">Về chúng tôi</h4>
          <p className="text-sm text-slate-200">
            {settings?.footer_about || 'Cổng thông tin Quy hoạch quốc gia - Bộ Kế hoạch và Đầu tư.'}
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-3">Liên kết</h4>
          <ul className="text-sm text-slate-200 space-y-2">
            <li>
              <Link href="/" className="hover:text-white transition">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/tin-tuc" className="hover:text-white transition">
                Tin tức
              </Link>
            </li>
            <li>
              <Link href="/du-an" className="hover:text-white transition">
                Dự án
              </Link>
            </li>
            <li>
              <Link href="/gioi-thieu" className="hover:text-white transition">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link href="/y-kien" className="hover:text-white transition">
                Ý kiến - Kiến nghị
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Liên hệ</h4>
          <p className="text-sm text-slate-200">
            {settings?.contact_email && (
              <>Email: {settings.contact_email}<br /></>
            )}
            {settings?.contact_phone && (
              <>ĐT: {settings.contact_phone}<br /></>
            )}
            {settings?.contact_address && (
              <>Địa chỉ: {settings.contact_address}</>
            )}
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-sm text-white/70">
        © {new Date().getFullYear()} {settings?.footer_copyright || 'Bộ Kế hoạch và Đầu tư'}
      </div>
    </footer>
  )
}
