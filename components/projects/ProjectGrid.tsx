import Link from 'next/link'
import Image from 'next/image'
import type { Project, Category } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type ProjectWithRelations = Project & {
  category: Pick<Category, 'id' | 'name'> | null
}

interface ProjectGridProps {
  projects: ProjectWithRelations[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Chưa có dự án nào
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link key={project.id} href={`/du-an/${project.slug}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
            {project.cover_image ? (
              <div className="relative h-48">
                <Image
                  src={project.cover_image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-5xl">📂</span>
              </div>
            )}
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {project.title}
              </h3>
              {project.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {project.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>{formatDate(project.published_at!)}</span>
                <span>👁️ {project.views} lượt xem</span>
              </div>
              {project.pdf_file && (
                <Badge variant="secondary" className="text-xs">
                  📄 Có tài liệu PDF
                </Badge>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
