import { db } from '@/lib/db'
import { UsersTable } from '@/components/admin/UsersTable'

export default async function UsersPage() {
  const users = await db.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      full_name: true,
      avatar: true,
      role: true,
      status: true,
      created_at: true,
      updated_at: true
    },
    orderBy: { created_at: 'desc' }
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Người dùng</h1>
        <p className="text-muted-foreground">
          Quản lý tài khoản và phân quyền người dùng
        </p>
      </div>

      <UsersTable initialUsers={users} />
    </div>
  )
}
