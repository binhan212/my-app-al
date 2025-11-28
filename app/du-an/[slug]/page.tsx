import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await db.project.findMany({
    where: { status: 'published' },
    select: { slug: true }
  })

  return projects.map((project) => ({
    slug: project.slug
  }))
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params

  const project = await db.project.findUnique({
    where: { slug },
    include: {
      category: {
        select: { id: true, name: true }
      }
    }
  })

  if (!project || project.status !== 'published') {
    notFound()
  }

  // Increment view count
  await db.project.update({
    where: { id: project.id },
    data: { views: { increment: 1 } }
  })

  return (
    <main className="bg-slate-50 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        <Link 
          href="/du-an"
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
          Quay lại danh sách dự án
        </Link>

        {/* Project Detail */}
        <Card className="overflow-hidden">
          {/* Cover Image */}
          {project.cover_image && (
            <div className="relative h-64 lg:h-96">
              <Image
                src={project.cover_image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <CardContent className="p-6 lg:p-8">
            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {project.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
              <span> {formatDate(project.published_at!)}</span>
              <span className="text-slate-300">•</span>
              <span> {project.views} lượt xem</span>
              {project.category && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>📁 {project.category.name}</span>
                </>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-gray-700 italic">{project.description}</p>
              </div>
            )}

            {/* PDF File */}
            {project.pdf_file && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span>📄</span> Tài liệu dự án
                </h3>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href={project.pdf_file} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="default">
                      <span className="mr-2"></span>Xem PDF
                    </Button>
                  </a>
                  <a 
                    href={project.pdf_file} 
                    download
                  >
                    <Button variant="secondary">
                      <span className="mr-2"></span> Tải xuống
                    </Button>
                  </a>
                </div>

                {/* PDF Preview */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Xem trước tài liệu</h4>
                  <iframe 
                    src={project.pdf_file} 
                    className="w-full h-[600px] border rounded-lg"
                    title="PDF Preview"
                  />
                </div>
              </div>
            )}

            {/* Content */}
            {project.content ? (
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            ) : (
              <p className="text-gray-500">Chưa có nội dung chi tiết.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
