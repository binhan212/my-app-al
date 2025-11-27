'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Slide } from '@prisma/client'

interface HeroSectionProps {
  slides: Slide[]
  siteName: string
  siteDescription: string
}

export function HeroSection({ slides, siteName, siteDescription }: HeroSectionProps) {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchType, setSearchType] = useState<'posts' | 'projects'>('posts')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (slides.length <= 1) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    if (searchType === 'posts') {
      router.push(`/tin-tuc?search=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push(`/du-an?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  if (slides.length === 0) {
    return (
      <div className="hero-wrapper bg-gray-100 relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#061539]/55 to-[#061539]/30 z-10" />
        <div className="relative z-20 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {siteName}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {siteDescription}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hero-wrapper bg-gray-100 relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Carousel */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div 
          className="flex h-full transition-transform duration-700 ease-in-out will-change-transform"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex-shrink-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image_url})` }}
            />
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#061539]/55 to-[#061539]/30 z-10" />

      {/* Hero Content */}
      <main className="relative z-20">
        <section className="pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4">
            {/* Title */}
            <div className="text-center text-white my-8">
              <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-lg my-4">
                CỔNG THÔNG TIN VÀ CƠ SỞ DỮ LIỆU TÍCH HỢP
              </h1>
              <p className="mt-2 text-lg md:text-xl font-semibold drop-shadow">
                QUỐC GIA VỀ QUY HOẠCH
              </p>
            </div>

            {/* Search Bar */}
            <div className="mt-20">
              <form onSubmit={handleSearch} className="bg-white/95 rounded shadow-lg p-2 md:p-3 flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x-2 divide-slate-200 max-w-screen mx-auto">
                {/* Radio buttons */}
                <div className="flex items-center gap-4 pr-4 py-2 md:py-0">
                  <label className="inline-flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type" 
                      checked={searchType === 'posts'}
                      onChange={() => setSearchType('posts')}
                      className="accent-blue-600" 
                    />
                    Tin tức
                  </label>
                  <label className="inline-flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type"
                      checked={searchType === 'projects'}
                      onChange={() => setSearchType('projects')}
                      className="accent-blue-600" 
                    />
                    Dự án
                  </label>
                </div>

                {/* Search Input */}
                <div className="flex-1 px-4 w-full py-2 md:py-0">
                  <input 
                    type="text" 
                    placeholder="Nhập tên Quy hoạch - Dự án" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full outline-none text-slate-700 bg-transparent placeholder:text-slate-400" 
                  />
                </div>

                {/* Search Button */}
                <div className="pl-0 md:pl-4 py-2 md:py-0 w-full md:w-auto">
                  <button 
                    type="submit"
                    className="w-full md:w-auto bg-[#163a85] text-white px-6 py-3 rounded shadow-md hover:opacity-95 transition"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </form>
            </div>

            {/* Planning Types Cards */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-stretch">
              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition cursor-pointer">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500 flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">VN</span>
                </div>
                <h3 className="text-sky-700 font-semibold">
                  Quy Hoạch<br />Cấp Quốc Gia
                </h3>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition cursor-pointer">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500 flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">RG</span>
                </div>
                <h3 className="text-sky-700 font-semibold">
                  Quy Hoạch<br />Vùng
                </h3>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition cursor-pointer">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500 flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">TN</span>
                </div>
                <h3 className="text-sky-700 font-semibold">
                  Quy Hoạch<br />Tỉnh
                </h3>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition cursor-pointer">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500 flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">ĐT</span>
                </div>
                <h3 className="text-sky-700 font-semibold">
                  Quy Hoạch<br />Đô Thị - Nông Thôn
                </h3>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition cursor-pointer">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500 flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">KT</span>
                </div>
                <h3 className="text-sky-700 font-semibold">
                  QH Có Tính Chất<br />KT, Chuyên Ngành
                </h3>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
