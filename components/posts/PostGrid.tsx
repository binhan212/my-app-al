import Link from 'next/link'
import Image from 'next/image'
import type { Post, User, Category } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

type PostWithRelations = Post & {
  author: Pick<User, 'id' | 'full_name'>
  category: Pick<Category, 'id' | 'name'> | null
}

interface PostGridProps {
  posts: PostWithRelations[]
}

export function PostGrid({ posts }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Chưa có bài viết nào
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link key={post.id} href={`/tin-tuc/${post.slug}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
            <div className="relative h-48">
              <Image
                src={post.cover_image || '/placeholder-news.jpg'}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatDate(post.published_at!)}</span>
                {post.category && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {post.category.name}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
