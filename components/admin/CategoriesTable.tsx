'use client'

import { useState } from 'react'
import type { Category } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
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
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
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
import { CategoryFormDialog } from './CategoryFormDialog'

type CategoryWithParent = Category & {
  parent: Pick<Category, 'id' | 'name'> | null
  _count?: {
    posts: number
    projects: number
  }
}

interface CategoriesTableProps {
  categories: CategoryWithParent[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const { toast } = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deletingCategory) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/categories/${deletingCategory.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Thành công',
          description: 'Đã xóa danh mục',
          variant: 'success',
        })
        window.location.reload()
      } else {
        toast({
          title: 'Lỗi',
          description: 'Xóa danh mục thất bại',
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
      setDeletingCategory(null)
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
          Tạo danh mục mới
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên danh mục</TableHead>
              <TableHead>Danh mục cha</TableHead>
              <TableHead>Thứ tự</TableHead>
              <TableHead>Số bài viết</TableHead>
              <TableHead>Số dự án</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">
                  {category.name}
                </TableCell>
                <TableCell>
                  {category.parent?.name || '—'}
                </TableCell>
                <TableCell>
                  {category.display_order}
                </TableCell>
                <TableCell>
                  {category._count?.posts || 0}
                </TableCell>
                <TableCell>
                  {category._count?.projects || 0}
                </TableCell>
                <TableCell>
                  {formatDate(category.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeletingCategory(category)}
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

      {/* Create Dialog */}
      <CategoryFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {/* Edit Dialog */}
      <CategoryFormDialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        category={editingCategory}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục {' '}
              <span className="font-semibold">&ldquo;{deletingCategory?.name}&rdquo;</span>?
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
