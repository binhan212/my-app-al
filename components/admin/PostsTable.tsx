'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Post, User, Category } from '@prisma/client'
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
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/outline'
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
import { PostFormDialog } from './PostFormDialog'

type PostWithRelations = Post & {
  author: Pick<User, 'id' | 'full_name' | 'username'>
  category: Pick<Category, 'id' | 'name'> | null
}

interface PostsTableProps {
  posts: PostWithRelations[]
  categories: Category[]
  currentPage: number
  totalPages: number
}

export function PostsTable({ posts, categories, currentPage, totalPages }: PostsTableProps) {
  const { toast } = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [deletingPost, setDeletingPost] = useState<Post | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deletingPost) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/posts/${deletingPost.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Thành công',
          description: 'Đã xóa bài viết',
          variant: 'success',
        })
        window.location.reload()
      } else {
        toast({
          title: 'Lỗi',
          description: 'Xóa bài viết thất bại',
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
      setDeletingPost(null)
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
          Tạo bài viết mới
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Tác giả</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Lượt xem</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium max-w-md">
                  <Link 
                    href={`/tin-tuc/${post.slug}`}
                    target="_blank"
                    className="hover:text-blue-600"
                  >
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {post.category?.name || '—'}
                </TableCell>
                <TableCell>
                  {post.author.full_name || post.author.username}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      post.status === 'published' 
                        ? 'default' 
                        : post.status === 'draft'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {post.status === 'published' ? 'Đã xuất bản' : post.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4 text-gray-400" />
                    {post.views}
                  </div>
                </TableCell>
                <TableCell>
                  {formatDate(post.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingPost(post)}>
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeletingPost(post)}
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
            <Link key={page} href={`/admin/posts?page=${page}`}>
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
      <PostFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {/* Edit Dialog */}
      <PostFormDialog
        open={!!editingPost}
        onOpenChange={(open) => !open && setEditingPost(null)}
        post={editingPost}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingPost} onOpenChange={(open) => !open && setDeletingPost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài viết {' '}
              <span className="font-semibold">&ldquo;{deletingPost?.title}&rdquo;</span>?
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
