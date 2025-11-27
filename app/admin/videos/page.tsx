import { db } from '@/lib/db'
import { VideosTable } from '@/components/admin/VideosTable'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminVideosPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 20
  const offset = (page - 1) * limit

  const [videos, total] = await Promise.all([
    db.video.findMany({
      orderBy: [
        { display_order: 'asc' },
        { created_at: 'desc' }
      ],
      skip: offset,
      take: limit
    }),
    db.video.count()
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Videos</h1>
          <p className="text-gray-500 mt-1">
            Quản lý video hiển thị trên website
          </p>
        </div>
      </div>

      <VideosTable 
        videos={videos} 
        currentPage={page} 
        totalPages={totalPages} 
      />
    </div>
  )
}
