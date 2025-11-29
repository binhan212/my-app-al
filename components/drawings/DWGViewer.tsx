'use client'

import { useState } from 'react'
import { Download, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DWGViewerProps {
  fileUrl: string
  title: string
}

export function DWGViewer({ fileUrl, title }: DWGViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Get full URL for production deployment
  const fullFileUrl = fileUrl.startsWith('http') 
    ? fileUrl 
    : `${typeof window !== 'undefined' ? window.location.origin : ''}${fileUrl}`

  // ShareCAD viewer URL
  const viewerUrl = `https://sharecad.org/cadframe/load?url=${encodeURIComponent(fullFileUrl)}`

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className="space-y-6">
      {/* DWG Viewer */}
      <div className="relative bg-gray-100 rounded-xl overflow-hidden shadow-xl">
        {/* Loading State */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 font-medium">Đang tải bản vẽ...</p>
            </div>
          </div>
        )}

        {/* Error State - Show download card */}
        {hasError ? (
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-8 text-white">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-white/80 mb-4">Không thể xem trực tuyến. Vui lòng tải về để xem.</p>
              </div>
              <a href={fileUrl} download>
                <Button size="lg" variant="secondary" className="gap-2 shadow-lg hover:scale-105 transition-transform">
                  <Download className="w-5 h-5" />
                  Tải xuống file DWG
                </Button>
              </a>
            </div>
          </div>
        ) : (
          // ShareCAD Viewer iframe
          <div className="relative" style={{ height: '600px' }}>
            <iframe
              src={viewerUrl}
              className="w-full h-full border-0"
              onLoad={handleLoad}
              onError={handleError}
              title={`DWG Viewer - ${title}`}
              allow="fullscreen"
            />
            
            {/* Fullscreen hint */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2">
              <Maximize2 className="w-4 h-4" />
              <span>Nhấn fullscreen để xem rõ hơn</span>
            </div>
          </div>
        )}
      </div>

      {/* Download alternative (always show) */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-blue-900">Tải file gốc</p>
              <p className="text-sm text-blue-700">Để xem chi tiết và chỉnh sửa bằng AutoCAD</p>
            </div>
          </div>
          <a href={fileUrl} download>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Tải xuống
            </Button>
          </a>
        </div>
      </div>

      {/* Software Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Phần mềm khuyên dùng
        </h4>
        
        <div className="space-y-3">
          {/* AutoCAD */}
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900">AutoCAD</h5>
              <p className="text-sm text-gray-600">Phần mềm chuyên nghiệp để xem và chỉnh sửa file DWG</p>
            </div>
          </div>

          {/* DWG TrueView */}
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-gray-900">DWG TrueView (Miễn phí)</h5>
              <p className="text-sm text-gray-600 mb-2">Phần mềm xem DWG miễn phí từ Autodesk</p>
              <a 
                href="https://www.autodesk.com/products/dwg/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                Tải xuống
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
