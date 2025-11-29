import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { DrawingsTable } from '@/components/admin/DrawingsTable'

export default async function AdminDrawingsPage() {
  const session = await auth()

  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login')
  }

  const drawings = await db.drawing.findMany({
    orderBy: [
      { display_order: 'asc' },
      { created_at: 'desc' }
    ]
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Bản vẽ</h1>
          <p className="text-gray-600 mt-2">Quản lý các bản vẽ DWG</p>
        </div>
      </div>

      <DrawingsTable drawings={drawings} />
    </div>
  )
}
