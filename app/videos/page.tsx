import { db } from '@/lib/db'
import { getYouTubeId } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Pagination } from '@/components/posts/Pagination'

export const revalidate = 0 // Dynamic rendering for fresh data

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function VideosPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 12
  const offset = (page - 1) * limit

  const [videos, total] = await Promise.all([
    db.video.findMany({
      where: { status: 'active' },
      orderBy: { display_order: 'asc' },
      skip: offset,
      take: limit
    }),
    db.video.count({
      where: { status: 'active' }
    })
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <main className="bg-slate-50 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Video</h1>

        {videos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Chưa có video nào</p>
        ) : (
          <>
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
                      {video.duration && (
                        <p className="text-xs text-gray-500 mt-2">
                          Thời lượng: {video.duration}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {totalPages > 1 && (
              <Pagination currentPage={page} totalPages={totalPages} basePath="/videos" />
            )}
          </>
        )}
      </div>
    </main>
  )
}
