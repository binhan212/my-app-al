'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Settings {
  site_name: string
  site_logo: string | null
}

export function Header() {
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
    <header className="h-14 sticky top-0 z-40 bg-[#1f4aa6]">
      <nav className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-4">
              {settings?.site_logo ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white">
                  <Image
                    src={settings.site_logo}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1f4aa6] font-bold">
                  BP
                </div>
              )}
              <span className="hidden md:inline-block font-semibold">
                {settings?.site_name || 'BỘ KẾ HOẠCH VÀ ĐẦU TƯ'}
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-3 text-sm font-semibold">
              <Link 
                href="/" 
                className="px-3 py-2 rounded-md hover:bg-white/10 transition"
              >
                TRANG CHỦ
              </Link>
              <Link 
                href="/gioi-thieu" 
                className="px-3 py-2 rounded-md hover:bg-white/10 transition"
              >
                GIỚI THIỆU
              </Link>
              <Link 
                href="/tin-tuc" 
                className="px-3 py-2 rounded-md hover:bg-white/10 transition"
              >
                TIN TỨC
              </Link>
              <Link 
                href="/du-an" 
                className="px-3 py-2 rounded-md hover:bg-white/10 transition"
              >
                DỰ ÁN
              </Link>
              <Link 
                href="/videos" 
                className="px-3 py-2 rounded-md hover:bg-white/10 transition"
              >
                VIDEO
              </Link>
              <Link 
                href="/y-kien" 
                className="px-3 py-2 rounded-md hover:bg-white/10 transition"
              >
                Ý KIẾN - KIẾN NGHỊ
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
