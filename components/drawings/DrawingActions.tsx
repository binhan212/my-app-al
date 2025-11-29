'use client'

import { Button } from '@/components/ui/button'

interface DrawingActionsProps {
  dwgFileUrl: string
}

export function DrawingActions({ dwgFileUrl }: DrawingActionsProps) {
  return (
    <div className="flex items-center gap-3 pt-6 border-t">
      <a 
        href={dwgFileUrl} 
        download
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="default" size="lg">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Tải xuống DWG
        </Button>
      </a>
      <Button 
        variant="outline" 
        size="lg"
        onClick={() => {
          if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({
              title: 'Chia sẻ bản vẽ',
              url: window.location.href
            })
          }
        }}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Chia sẻ
      </Button>
    </div>
  )
}
