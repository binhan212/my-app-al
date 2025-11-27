'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Slide } from '@prisma/client'
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
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon, PlusIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
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
import { SlideFormDialog } from './SlideFormDialog'

interface SlidesTableProps {
  slides: Slide[]
}

export function SlidesTable({ slides }: SlidesTableProps) {
  const { toast } = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)
  const [deletingSlide, setDeletingSlide] = useState<Slide | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deletingSlide) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/slides/${deletingSlide.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Thành công',
          description: 'Đã xóa slide',
          variant: 'success',
        })
        window.location.reload()
      } else {
        toast({
          title: 'Lỗi',
          description: 'Xóa slide thất bại',
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
      setDeletingSlide(null)
    }
  }

  const handleSuccess = () => {
    window.location.reload()
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Tạo Slide mới
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Ảnh</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="w-32">Thứ tự</TableHead>
                <TableHead className="w-32">Trạng thái</TableHead>
                <TableHead className="text-right w-20">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slides.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Chưa có slide nào
                  </TableCell>
                </TableRow>
              ) : (
                slides.map((slide) => (
                  <TableRow key={slide.id}>
                    <TableCell>
                      <div className="relative w-16 h-16">
                        <Image
                          src={slide.image_url}
                          alt={slide.title || 'Slide'}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {slide.title || <span className="text-gray-400">Không có tiêu đề</span>}
                    </TableCell>
                    <TableCell>
                      {slide.link_url ? (
                        <a
                          href={slide.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm truncate block max-w-xs"
                        >
                          {slide.link_url}
                        </a>
                      ) : (
                        <span className="text-gray-400">Không có</span>
                      )}
                    </TableCell>
                    <TableCell>{slide.display_order}</TableCell>
                    <TableCell>
                      <Badge variant={slide.is_active ? 'default' : 'secondary'}>
                        {slide.is_active ? (
                          <>
                            <EyeIcon className="w-3 h-3 mr-1" />
                            Hiển thị
                          </>
                        ) : (
                          <>
                            <EyeSlashIcon className="w-3 h-3 mr-1" />
                            Ẩn
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <EllipsisHorizontalIcon className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingSlide(slide)}>
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingSlide(slide)}
                            className="text-red-600"
                          >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <SlideFormDialog
        open={isCreateOpen || !!editingSlide}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setEditingSlide(null)
          }
        }}
        slide={editingSlide}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingSlide} onOpenChange={() => setDeletingSlide(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa slide &quot;{deletingSlide?.title || 'này'}&quot; không? 
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
    </>
  )
}
