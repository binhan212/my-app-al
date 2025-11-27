'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Video } from '@prisma/client'
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
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon, PlusIcon, EyeIcon, EyeSlashIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
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
import { VideoFormDialog } from './VideoFormDialog'

interface VideosTableProps {
  videos: Video[]
  currentPage: number
  totalPages: number
}

export function VideosTable({ videos, currentPage, totalPages }: VideosTableProps) {
  const { toast } = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [deletingVideo, setDeletingVideo] = useState<Video | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deletingVideo) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/videos/${deletingVideo.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Thành công',
          description: 'Đã xóa video',
          variant: 'success',
        })
        window.location.reload()
      } else {
        toast({
          title: 'Lỗi',
          description: 'Xóa video thất bại',
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
      setDeletingVideo(null)
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
            Tạo Video mới
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Thumbnail</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Thời lượng</TableHead>
                <TableHead>Thứ tự</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right w-20">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Chưa có video nào
                  </TableCell>
                </TableRow>
              ) : (
                videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      {video.thumbnail_url ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={video.thumbnail_url}
                            alt={video.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <EyeSlashIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{video.title}</p>
                        <a
                          href={video.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          Xem video
                          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      {video.duration || <span className="text-gray-400">--</span>}
                    </TableCell>
                    <TableCell>{video.display_order}</TableCell>
                    <TableCell>
                      <Badge variant={video.status === 'active' ? 'default' : 'secondary'}>
                        {video.status === 'active' ? (
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
                          <DropdownMenuItem onClick={() => setEditingVideo(video)}>
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingVideo(video)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => window.location.href = `/admin/videos?page=${currentPage - 1}`}
            >
              Trang trước
            </Button>
            <span className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => window.location.href = `/admin/videos?page=${currentPage + 1}`}
            >
              Trang sau
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <VideoFormDialog
        open={isCreateOpen || !!editingVideo}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setEditingVideo(null)
          }
        }}
        video={editingVideo}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingVideo} onOpenChange={() => setDeletingVideo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa video &quot;{deletingVideo?.title}&quot; không? 
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
