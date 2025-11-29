'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Drawing } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'

interface DrawingGridProps {
  drawings: Drawing[]
}

export function DrawingGrid({ drawings }: DrawingGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {drawings.map((drawing) => (
        <Link
          key={drawing.id}
          href={`/ban-ve/${drawing.id}`}
          className="group"
        >
          <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
            {/* Icon/Image Section */}
            <div className="relative h-48 bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              {drawing.icon ? (
                drawing.icon.trim().startsWith('<svg') ? (
                  <div className="w-32 h-32 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center p-6">
                    <div 
                      className="w-full h-full text-white"
                      dangerouslySetInnerHTML={{ __html: drawing.icon }} 
                    />
                  </div>
                ) : drawing.icon.startsWith('/') || drawing.icon.startsWith('http') ? (
                  <div className="relative w-32 h-32 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                    <Image 
                      src={drawing.icon} 
                      alt={drawing.title} 
                      fill
                      className="object-contain p-4"
                      sizes="128px"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-6xl">{drawing.icon}</span>
                  </div>
                )
              ) : (
                <svg className="w-24 h-24 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              
              {/* Download Badge */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                DWG
              </div>
            </div>

            <CardContent className="p-6">
              <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                {drawing.title}
              </h3>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  #{drawing.id}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  Xem chi tiết
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
