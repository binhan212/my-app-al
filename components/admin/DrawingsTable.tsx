'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Drawing } from '@prisma/client'
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
import { useToast } from '@/hooks/use-toast'
import { DrawingFormDialog } from './DrawingFormDialog'
import { PlusIcon } from 'lucide-react'
import { MoreHorizontal, Pencil, Trash2, Download } from 'lucide-react'
import Image from 'next/image'

interface DrawingsTableProps {
  drawings: Drawing[]
}

export function DrawingsTable({ drawings: initialDrawings }: DrawingsTableProps) {
  const [drawings, setDrawings] = useState(initialDrawings)
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleCreate = () => {
    setSelectedDrawing(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (drawing: Drawing) => {
    setSelectedDrawing(drawing)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bản vẽ này?')) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/drawings/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete')

      toast({
        title: 'Thành công',
        description: 'Đã xóa bản vẽ',
        variant: 'default',
      })

      // Remove from state
      setDrawings(drawings.filter(d => d.id !== id))
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa bản vẽ',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSuccess = async () => {
    try {
      // Fetch updated drawings list
      const res = await fetch('/api/drawings')
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data.drawings) {
          setDrawings(data.data.drawings)
        }
      }
    } catch (error) {
      console.error('Failed to refresh drawings:', error)
    }
    setIsDialogOpen(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Tổng số: <span className="font-semibold">{drawings.length}</span> bản vẽ
        </div>
        <Button onClick={handleCreate}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Thêm Bản vẽ
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">STT</TableHead>
              <TableHead className="w-20">Icon</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>File DWG</TableHead>
              <TableHead className="w-32">Trạng thái</TableHead>
              <TableHead className="w-32 text-center">Thứ tự</TableHead>
              <TableHead className="w-32 text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drawings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Chưa có bản vẽ nào
                </TableCell>
              </TableRow>
            ) : (
              drawings.map((drawing, index) => (
                <TableRow key={drawing.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {drawing.icon ? (
                      drawing.icon.trim().startsWith('<svg') ? (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border p-2">
                          <div 
                            className="w-full h-full text-blue-600"
                            dangerouslySetInnerHTML={{ __html: drawing.icon }} 
                          />
                        </div>
                      ) : drawing.icon.startsWith('/') || drawing.icon.startsWith('http') ? (
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden border">
                          <Image
                            src={drawing.icon}
                            alt={drawing.title}
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        // Display as text/emoji
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border">
                          <span className="text-2xl">{drawing.icon}</span>
                        </div>
                      )
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{drawing.title}</div>
                  </TableCell>
                  <TableCell>
                    <a 
                      href={drawing.dwg_file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Tải xuống
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant={drawing.status === 'active' ? 'default' : 'secondary'}>
                      {drawing.status === 'active' ? 'Hiển thị' : 'Ẩn'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                      {drawing.display_order}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isDeleting}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(drawing)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(drawing.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
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

      <DrawingFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        drawing={selectedDrawing}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
