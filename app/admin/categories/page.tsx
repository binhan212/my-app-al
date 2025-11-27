import { db } from '@/lib/db'
import { CategoriesTable } from '@/components/admin/CategoriesTable'

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    include: {
      parent: {
        select: { id: true, name: true }
      },
      _count: {
        select: {
          posts: true,
          projects: true
        }
      }
    },
    orderBy: [
      { display_order: 'asc' },
      { name: 'asc' }
    ]
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-500 mt-1">
            Quản lý danh mục cho bài viết và dự án
          </p>
        </div>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  )
}
