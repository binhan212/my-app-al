import { db } from '@/lib/db'
import { SlidesTable } from '@/components/admin/SlidesTable'

export default async function AdminSlidesPage() {
  const slides = await db.slide.findMany({
    orderBy: [
      { display_order: 'asc' },
      { created_at: 'desc' }
    ]
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Slides</h1>
          <p className="text-gray-500 mt-1">
            Quản lý slides hiển thị trên trang chủ
          </p>
        </div>
      </div>

      <SlidesTable slides={slides} />
    </div>
  )
}
