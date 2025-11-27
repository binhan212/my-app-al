'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Project, Category } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon, EyeIcon, PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ProjectFormDialog } from './ProjectFormDialog'

type ProjectWithRelations = Project & {
  category: Pick<Category, 'id' | 'name'> | null
}

interface ProjectsTableProps {
  projects: ProjectWithRelations[]
  categories: Category[]
  currentPage: number
  totalPages: number
}

export function ProjectsTable({ projects, categories, currentPage, totalPages }: ProjectsTableProps) {
  const { toast } = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deletingProject) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/projects/${deletingProject.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Thành công',
          description: 'Đã xóa dự án',
          variant: 'success',
        })
        window.location.reload()
      } else {
        toast({
          title: 'Lỗi',
          description: 'Xóa dự án thất bại',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
      setDeletingProject(null)
    }
  }

  const handleSuccess = () => {
    window.location.reload()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Tạo dự án mới
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>PDF</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Lượt xem</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium max-w-md">
                  <Link 
                    href={`/du-an/${project.slug}`}
                    target="_blank"
                    className="hover:text-blue-600"
                  >
                    {project.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {project.category?.name || '—'}
                </TableCell>
                <TableCell>
                  {project.pdf_file ? (
                    <a 
                      href={project.pdf_file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <DocumentTextIcon className="w-4 h-4" />
                      PDF
                    </a>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      project.status === 'published' 
                        ? 'default' 
                        : 'secondary'
                    }
                  >
                    {project.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4 text-gray-400" />
                    {project.views}
                  </div>
                </TableCell>
                <TableCell>
                  {formatDate(project.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingProject(project)}>
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeletingProject(project)}
                        className="text-red-600"
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link key={page} href={`/admin/projects?page=${page}`}>
              <Button
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
              >
                {page}
              </Button>
            </Link>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <ProjectFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {/* Edit Dialog */}
      <ProjectFormDialog
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
        project={editingProject}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingProject} onOpenChange={(open) => !open && setDeletingProject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa dự án {' '}
              <span className="font-semibold">&ldquo;{deletingProject?.title}&rdquo;</span>?
              <br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
