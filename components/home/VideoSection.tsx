import type { Video } from '@prisma/client'
import Link from 'next/link'
import { getYouTubeId } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface VideoSectionProps {
  videos: Video[]
}

export function VideoSection({ videos }: VideoSectionProps) {
  if (videos.length === 0) {
    return (
      <section className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Video</h2>
            <Link href="/videos" className="text-blue-600 hover:underline">
              Xem thêm
            </Link>
          </div>
          <p className="text-center text-gray-500 py-8">Chưa có video nào</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Video</h2>
          <Link href="/videos" className="text-blue-600 hover:underline">
            Xem thêm
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => {
            const youtubeId = getYouTubeId(video.video_url)
            
            return (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video">
                  {youtubeId ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Video không khả dụng</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
