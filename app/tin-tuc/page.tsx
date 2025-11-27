import { db } from '@/lib/db'
import { PostGrid } from '@/components/posts/PostGrid'
import { Pagination } from '@/components/posts/Pagination'

export const revalidate = 0 // Dynamic rendering for fresh data

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function NewsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 9
  const offset = (page - 1) * limit

  const [posts, total] = await Promise.all([
    db.post.findMany({
      where: {
        status: 'published',
        published_at: { lte: new Date() }
      },
      include: {
        author: {
          select: { id: true, full_name: true }
        },
        category: {
          select: { id: true, name: true }
        }
      },
      orderBy: { published_at: 'desc' },
      skip: offset,
      take: limit
    }),
    db.post.count({
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
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Tin tức</h1>

        <PostGrid posts={posts} />

        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} basePath="/tin-tuc" />
        )}
      </div>
    </main>
  )
}
