import { db } from '@/lib/db'
import { FeedbackTable } from '@/components/admin/FeedbackTable'

export default async function FeedbackPage() {
  const feedback = await db.feedback.findMany({
    orderBy: [
      { status: 'asc' }, // pending trước
      { created_at: 'desc' }
    ],
    include: {
      replier: {
        select: {
          id: true,
          full_name: true,
          email: true
        }
      }
    }
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Phản hồi</h1>
        <p className="text-muted-foreground">
          Xem và trả lời phản hồi từ khách hàng
        </p>
      </div>

      <FeedbackTable initialFeedback={feedback} />
    </div>
  )
}
