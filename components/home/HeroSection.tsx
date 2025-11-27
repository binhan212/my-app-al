'use client'

import { useState, useEffect } from 'react'
import type { Slide } from '@prisma/client'

interface HeroSectionProps {
  slides: Slide[]
  siteName: string
  siteDescription: string
}

export function HeroSection({ slides, siteName, siteDescription }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return // Don't auto-play if only 1 slide

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [slides.length])

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
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {siteName}
              </h1>
              <p className="text-xl text-white/90 mb-8">
                {siteDescription}
              </p>
            </div>

            {/* Current Slide Info */}
            {slides[currentSlide]?.title && (
              <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">
                  {slides[currentSlide].title}
                </h2>
                {slides[currentSlide].description && (
                  <p className="text-white/90">
                    {slides[currentSlide].description}
                  </p>
                )}
              </div>
            )}

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition ${
                    index === currentSlide ? 'bg-white' : 'bg-white/40'
                  }`}
                  aria-label={`Chuyển đến slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
