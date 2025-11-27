import Link from 'next/link'
import Image from 'next/image'
import type { Post, User, Category } from '@prisma/client'
import { formatDate } from '@/lib/utils'

type PostWithRelations = Post & {
  author: Pick<User, 'id' | 'full_name'>
  category: Pick<Category, 'id' | 'name'> | null
}

interface NewsSectionProps {
  posts: PostWithRelations[]
}

export function NewsSection({ posts }: NewsSectionProps) {
  if (posts.length === 0) {
    return (
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Tin tức</h2>
            <Link href="/tin-tuc" className="text-blue-600 hover:underline">
              Xem thêm
            </Link>
          </div>
          <p className="text-center text-gray-500 py-8">Chưa có tin tức nào</p>
        </div>
      </section>
    )
  }

  const [featuredPost, ...otherPosts] = posts

  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Tin tức</h2>
          <Link href="/tin-tuc" className="text-blue-600 hover:underline">
            Xem thêm
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article */}
          <article className="lg:col-span-2 cursor-pointer group">
            <Link href={`/tin-tuc/${featuredPost.slug}`}>
              <div className="rounded-lg overflow-hidden shadow-md">
                <Image
                  src={featuredPost.cover_image || '/placeholder-news.jpg'}
                  alt={featuredPost.title}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                {featuredPost.title}
              </h3>
              <div className="mt-3 flex items-center text-sm text-slate-500 gap-3">
                <span>{formatDate(featuredPost.published_at!)}</span>
                {featuredPost.category && (
                  <>
                    <span>•</span>
                    <span>{featuredPost.category.name}</span>
                  </>
                )}
              </div>
              {featuredPost.excerpt && (
                <p className="mt-4 text-slate-700 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              )}
            </Link>
          </article>

          {/* Right List */}
          <aside className="space-y-4">
            {otherPosts.slice(0, 3).map((post) => (
              <div 
                key={post.id} 
                className="flex gap-4 items-start cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <Link href={`/tin-tuc/${post.slug}`} className="flex gap-4 items-start flex-1">
                  <Image
                    src={post.cover_image || '/placeholder-news.jpg'}
                    alt={post.title}
                    width={112}
                    height={80}
                    className="w-28 h-20 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-slate-800 line-clamp-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDate(post.published_at!)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  )
}
