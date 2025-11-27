import { db } from '@/lib/db'
import { PostsTable } from '@/components/admin/PostsTable'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminPostsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 20
  const offset = (page - 1) * limit

  const [posts, total, categories] = await Promise.all([
    db.post.findMany({
      include: {
        author: {
          select: { id: true, full_name: true, username: true }
        },
        category: {
          select: { id: true, name: true }
        }
      },
      orderBy: { created_at: 'desc' },
      skip: offset,
      take: limit
    }),
    db.post.count(),
    db.category.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý bài viết</h1>
          <p className="text-gray-500 mt-1">
            Quản lý tất cả bài viết trong hệ thống
          </p>
        </div>
      </div>

      <PostsTable 
        posts={posts} 
        categories={categories}
        currentPage={page} 
        totalPages={totalPages} 
      />
    </div>
  )
}
