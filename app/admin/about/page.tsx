import { db } from '@/lib/db'
import { AboutTable } from '@/components/admin/AboutTable'

export default async function AdminAboutPage() {
  const about = await db.about.findFirst({
    orderBy: { created_at: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Giới thiệu</h1>
          <p className="text-gray-500 mt-1">
            Quản lý nội dung giới thiệu hiển thị trên trang Giới thiệu
          </p>
        </div>
      </div>

      <AboutTable about={about} />
    </div>
  )
}
