import { db } from '@/lib/db'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { Pagination } from '@/components/posts/Pagination'

export const revalidate = 0 // Dynamic rendering for fresh data

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const searchQuery = params.search || ''
  const limit = 9
  const offset = (page - 1) * limit

  // Build where condition
  const whereCondition: any = {
    status: 'published',
    published_at: { lte: new Date() }
  }

  // Add search condition if query exists
  if (searchQuery) {
    whereCondition.OR = [
      { title: { contains: searchQuery } },
      { content: { contains: searchQuery } },
      { description: { contains: searchQuery } }
    ]
  }

  const [projects, total] = await Promise.all([
    db.project.findMany({
      where: whereCondition,
      include: {
        category: {
          select: { id: true, name: true }
        }
      },
      orderBy: { published_at: 'desc' },
      skip: offset,
      take: limit
    }),
    db.project.count({
      where: whereCondition
    })
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <main className="bg-slate-50 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dự án Quy hoạch</h1>
          {searchQuery && (
            <p className="text-slate-600 mt-2">
              Kết quả tìm kiếm cho: <span className="font-semibold">&quot;{searchQuery}&quot;</span>
              {` (${total} kết quả)`}
            </p>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">
              {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có dự án nào'}
            </p>
          </div>
        ) : (
          <ProjectGrid projects={projects} />
        )}

        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} basePath="/du-an" />
        )}
      </div>
    </main>
  )
}
