import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { DWGViewer } from '@/components/drawings/DWGViewer'
import { DrawingActions } from '@/components/drawings/DrawingActions'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const drawings = await db.drawing.findMany({
    where: { status: 'active' },
    select: { id: true }
  })

  return drawings.map((drawing) => ({
    id: drawing.id.toString()
  }))
}

export default async function DrawingDetailPage({ params }: PageProps) {
  const { id } = await params

  const drawing = await db.drawing.findUnique({
    where: { id: parseInt(id) }
  })

  if (!drawing || drawing.status !== 'active') {
    notFound()
  }

  // Get related drawings
  const relatedDrawings = await db.drawing.findMany({
    where: {
      status: 'active',
      id: { not: drawing.id }
    },
    orderBy: [
      { display_order: 'asc' },
      { created_at: 'desc' }
    ],
    take: 3
  })

  return (
    <main className="bg-slate-50 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Link */}
        <Link 
          href="/ban-ve"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Quay lại Bản vẽ
        </Link>

        {/* Drawing Details */}
        <Card className="overflow-hidden">
          <CardContent className="p-6 lg:p-8">
            {/* Title */}
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                {drawing.icon && (
                  <div className="flex-shrink-0">
                    {drawing.icon.trim().startsWith('<svg') ? (
                      <div className="w-16 h-16 rounded-lg bg-emerald-500 flex items-center justify-center p-3">
                        <div 
                          className="w-full h-full text-white"
                          dangerouslySetInnerHTML={{ __html: drawing.icon }} 
                        />
                      </div>
                    ) : drawing.icon.startsWith('/') || drawing.icon.startsWith('http') ? (
                      <div className="w-16 h-16 rounded-lg bg-emerald-500 flex items-center justify-center overflow-hidden relative">
                        <Image src={drawing.icon} alt={drawing.title} fill className="object-contain p-2" sizes="64px" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <span className="text-3xl">{drawing.icon}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                    {drawing.title}
                  </h1>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-6 border-b">
                <span>📅 {formatDate(drawing.created_at)}</span>
                <span className="text-slate-300">•</span>
                <span>📐 File DWG</span>
                <span className="text-slate-300">•</span>
                <span>🆔 #{drawing.id}</span>
              </div>
            </div>

            {/* DWG Viewer */}
            <div className="mb-6">
              <DWGViewer fileUrl={drawing.dwg_file} title={drawing.title} />
            </div>

            {/* Actions */}
            <DrawingActions dwgFileUrl={drawing.dwg_file} />
          </CardContent>
        </Card>

        {/* Related Drawings */}
        {relatedDrawings.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Bản vẽ liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedDrawings.map((relatedDrawing) => (
                <Link
                  key={relatedDrawing.id}
                  href={`/ban-ve/${relatedDrawing.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                >
                  <div className="flex items-center gap-4 mb-3">
                    {relatedDrawing.icon && (
                      <div className="flex-shrink-0">
                        {relatedDrawing.icon.startsWith('/') || relatedDrawing.icon.startsWith('http') ? (
                          <div className="w-12 h-12 rounded-lg bg-emerald-500 flex items-center justify-center overflow-hidden relative">
                            <Image src={relatedDrawing.icon} alt={relatedDrawing.title} fill className="object-contain p-1" sizes="48px" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-emerald-500 flex items-center justify-center">
                            <span className="text-2xl">{relatedDrawing.icon}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-slate-900 flex-1 line-clamp-2">
                      {relatedDrawing.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(relatedDrawing.created_at)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
