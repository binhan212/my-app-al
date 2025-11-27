'use client'

import { useState } from 'react'
import { UserFormDialog } from './UserFormDialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'

interface User {
  id: number
  username: string
  email: string
  full_name: string | null
  avatar: string | null
  role: 'admin' | 'editor' | 'user'
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date
}

interface UsersTableProps {
  initialUsers: User[]
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      setUsers(data.data || [])
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách người dùng',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/users/${deletingId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast({
        title: 'Thành công',
        description: 'Đã xóa người dùng',
        variant: 'success'
      })

      await fetchUsers()
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa người dùng',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
      setDeletingId(null)
    }
  }

  const getRoleBadge = (role: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive', label: string }> = {
      admin: { variant: 'destructive', label: 'Admin' },
      editor: { variant: 'default', label: 'Biên tập' },
      user: { variant: 'secondary', label: 'Người dùng' }
    }
    const config = variants[role] || variants.user
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="default">Hoạt động</Badge>
    ) : (
      <Badge variant="secondary">Ngừng</Badge>
    )
  }

  return (
    <>
      <div className="mb-4">
        <Button onClick={() => setIsCreateOpen(true)}>
          Thêm Người dùng
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Không có người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || undefined} alt={user.username} />
                        <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        {user.full_name && (
                          <div className="text-sm text-muted-foreground">{user.full_name}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{formatDate(new Date(user.created_at))}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingUser(user)}
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(user.id)}
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

      <UserFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={fetchUsers}
      />

      <UserFormDialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onSuccess={fetchUsers}
        user={editingUser || undefined}
      />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
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
