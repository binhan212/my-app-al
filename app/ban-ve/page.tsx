import { db } from '@/lib/db'
import { DrawingGrid } from '@/components/drawings/DrawingGrid'
import { Pagination } from '@/components/posts/Pagination'

export const revalidate = 0 // Dynamic rendering for fresh data

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

export default async function DrawingsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const searchQuery = params.search || ''
  const limit = 12
  const offset = (page - 1) * limit

  // Build where condition
  const whereCondition: { status: 'active' | 'inactive'; title?: { contains: string } } = {
    status: 'active'
  }

  // Add search condition if query exists
  if (searchQuery) {
    whereCondition.title = { contains: searchQuery }
  }

  const [drawings, total] = await Promise.all([
    db.drawing.findMany({
      where: whereCondition,
      orderBy: [
        { display_order: 'asc' },
        { created_at: 'desc' }
      ],
      skip: offset,
      take: limit
    }),
    db.drawing.count({
      where: whereCondition
    })
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <main className="bg-slate-50 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Bản vẽ</h1>
          <p className="text-slate-600 mt-2">
            Tổng số: <span className="font-semibold">{total}</span> bản vẽ
          </p>
          {searchQuery && (
            <p className="text-slate-600 mt-2">
              Kết quả tìm kiếm cho: <span className="font-semibold">&quot;{searchQuery}&quot;</span> 
              {` (${total} kết quả)`}
            </p>
          )}
        </div>

        {drawings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">
              {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có bản vẽ nào'}
            </p>
          </div>
        ) : (
          <DrawingGrid drawings={drawings} />
        )}

        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} basePath="/ban-ve" />
        )}
      </div>
    </main>
  )
}
