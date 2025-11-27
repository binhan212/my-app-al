import { db } from '@/lib/db'
import { ProjectsTable } from '@/components/admin/ProjectsTable'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 20
  const offset = (page - 1) * limit

  const [projects, total, categories] = await Promise.all([
    db.project.findMany({
      include: {
        category: {
          select: { id: true, name: true }
        }
      },
      orderBy: { created_at: 'desc' },
      skip: offset,
      take: limit
    }),
    db.project.count(),
    db.category.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý dự án</h1>
          <p className="text-gray-500 mt-1">
            Quản lý tất cả dự án quy hoạch
          </p>
        </div>
      </div>

      <ProjectsTable 
        projects={projects} 
        categories={categories}
        currentPage={page} 
        totalPages={totalPages} 
      />
    </div>
  )
}
