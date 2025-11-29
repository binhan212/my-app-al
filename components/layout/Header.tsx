'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

interface Settings {
  site_name: string
  site_logo: string | null
}

export function Header() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [])
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])
  
  const menuItems = [
    { href: '/', label: 'TRANG CHỦ' },
    { href: '/gioi-thieu', label: 'GIỚI THIỆU' },
    { href: '/tin-tuc', label: 'TIN TỨC' },
    { href: '/du-an', label: 'DỰ ÁN' },
    { href: '/ban-ve', label: 'BẢN VẼ' },
    { href: '/videos', label: 'VIDEO' },
    { href: '/y-kien', label: 'Ý KIẾN - KIẾN NGHỊ' },
  ]

  return (
    <>
      <header className="h-14 sticky top-0 z-50 bg-[#1f4aa6]">
        <nav className="text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              {/* Logo & Site Name */}
              <Link href="/" className="flex items-center gap-3">
                {settings?.site_logo ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white flex-shrink-0">
                    <Image
                      src={settings.site_logo}
                      alt="Logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1f4aa6] font-bold flex-shrink-0">
                    BP
                  </div>
                )}
                <span className="hidden sm:inline-block font-semibold text-sm lg:text-base">
                  {settings?.site_name || 'BỘ KẾ HOẠCH VÀ ĐẦU TƯ'}
                </span>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-3 text-sm font-semibold">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2 rounded-md hover:bg-white/10 transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-white/10 transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`
          fixed top-14 right-0 bottom-0 w-64 bg-[#1f4aa6] z-40 
          transform transition-transform duration-300 ease-in-out
          md:hidden
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-white font-semibold px-4 py-3 rounded-md hover:bg-white/10 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
