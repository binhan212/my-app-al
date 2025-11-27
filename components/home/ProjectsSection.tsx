import Link from 'next/link'
import Image from 'next/image'
import type { Project, Category } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

type ProjectWithCategory = Project & {
  category: Pick<Category, 'id' | 'name'> | null
}

interface ProjectsSectionProps {
  projects: ProjectWithCategory[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (projects.length === 0) {
    return null // Không hiển thị section nếu không có dự án
  }

  return (
    <section className="bg-white py-12 border-t">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Dự án nổi bật</h2>
          <Link href="/du-an" className="text-blue-600 hover:underline text-sm">
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/du-an/${project.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                {project.cover_image && (
                  <div className="aspect-video relative bg-gray-100">
                    <Image
                      src={project.cover_image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                
                <CardContent className="p-4">
                  {project.category && (
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {project.category.name}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  
                  {project.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(new Date(project.created_at))}</span>
                    {project.pdf_file && (
                      <span className="flex items-center gap-1">
                        <DocumentTextIcon className="h-3 w-3" />
                        PDF
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
