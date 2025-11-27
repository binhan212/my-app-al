import { db } from '@/lib/db'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { Pagination } from '@/components/posts/Pagination'

export const revalidate = 0 // Dynamic rendering for fresh data

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 9
  const offset = (page - 1) * limit

  const [projects, total] = await Promise.all([
    db.project.findMany({
      where: {
        status: 'published',
        published_at: { lte: new Date() }
      },
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
      where: {
        status: 'published',
        published_at: { lte: new Date() }
      }
    })
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <main className="bg-slate-50 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Dự án Quy hoạch</h1>

        <ProjectGrid projects={projects} />

        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} basePath="/du-an" />
        )}
      </div>
    </main>
  )
}
