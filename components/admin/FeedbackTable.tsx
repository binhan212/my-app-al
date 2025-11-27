'use client'

import { useState } from 'react'
import { FeedbackFormDialog } from './FeedbackFormDialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EyeIcon, TrashIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'

interface Feedback {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  admin_reply: string | null
  status: 'pending' | 'answered' | 'archived'
  replied_at: Date | null
  replied_by: number | null
  created_at: Date
  updated_at: Date
}

interface FeedbackTableProps {
  initialFeedback: Feedback[]
}

export function FeedbackTable({ initialFeedback }: FeedbackTableProps) {
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [viewingFeedback, setViewingFeedback] = useState<Feedback | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const fetchFeedback = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      
      const response = await fetch(`/api/feedback?${params}`)
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      setFeedback(data.data || [])
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách phản hồi',
        variant: 'destructive'
      })
    }
  }

  const handleView = (item: Feedback) => {
    setViewingFeedback(item)
    setIsViewOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/feedback/${deletingId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast({
        title: 'Thành công',
        description: 'Đã xóa phản hồi',
        variant: 'success'
      })

      await fetchFeedback()
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa phản hồi',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
      setDeletingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      pending: { variant: 'secondary', label: 'Chờ xử lý' },
      answered: { variant: 'default', label: 'Đã trả lời' },
      archived: { variant: 'outline', label: 'Lưu trữ' }
    }
    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredFeedback = statusFilter === 'all' 
    ? feedback 
    : feedback.filter(item => item.status === statusFilter)

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="answered">Đã trả lời</SelectItem>
            <SelectItem value="archived">Lưu trữ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày gửi</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeedback.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Không có phản hồi nào
                </TableCell>
              </TableRow>
            ) : (
              filteredFeedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={item.subject}>
                      {item.subject}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{formatDate(new Date(item.created_at))}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(item)}
                        title="Xem & Trả lời"
                      >
                        {item.admin_reply ? <EyeIcon className="h-4 w-4" /> : <ChatBubbleLeftRightIcon className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(item.id)}
                        title="Xóa"
                      >
                        <TrashIcon className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <FeedbackFormDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        onSuccess={fetchFeedback}
        feedback={viewingFeedback || undefined}
      />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phản hồi này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
