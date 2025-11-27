import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate, calculateReadTime } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await db.post.findMany({
    where: { status: 'published' },
    select: { slug: true }
  })

  return posts.map((post) => ({
    slug: post.slug
  }))
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params

  // Increment view count and get post
  const post = await db.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: { id: true, full_name: true, avatar: true }
      },
      category: {
        select: { id: true, name: true }
      }
    }
  })

  if (!post || post.status !== 'published') {
    notFound()
  }

  // Increment view count
  await db.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  })

  // Get related posts
  const relatedPosts = await db.post.findMany({
    where: {
      status: 'published',
      category_id: post.category_id,
      id: { not: post.id }
    },
    include: {
      category: {
        select: { id: true, name: true }
      }
    },
    orderBy: { published_at: 'desc' },
    take: 2
  })

  const readTime = calculateReadTime(post.content)

  return (
    <main className="bg-slate-50 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        <Link 
          href="/tin-tuc"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Quay lại Tin tức
        </Link>

        {/* Article */}
        <Card className="overflow-hidden">
          {/* Cover Image */}
          {post.cover_image && (
            <div className="relative h-64 lg:h-96">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <CardContent className="p-6 lg:p-8">
            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
              <span>📅 {formatDate(post.published_at!)}</span>
              <span className="text-slate-300">•</span>
              <span>⏱️ {readTime} phút đọc</span>
              {post.category && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>📁 {post.category.name}</span>
                </>
              )}
              <span className="text-slate-300">•</span>
              <span>👁️ {post.views} lượt xem</span>
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-gray-700 italic">{post.excerpt}</p>
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Actions */}
            <div className="mt-8 flex items-center gap-3 pt-6 border-t">
              <Button variant="default">Chia sẻ</Button>
              <Button variant="outline">In bài</Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Bài liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/tin-tuc/${relatedPost.slug}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                    {relatedPost.cover_image && (
                      <div className="relative h-40">
                        <Image
                          src={relatedPost.cover_image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(relatedPost.published_at!)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
