import { db } from '@/lib/db'
import { FeedbackForm } from '@/components/feedback/FeedbackForm'
import { FeedbackList } from '@/components/feedback/FeedbackList'

export const revalidate = 60

export default async function FeedbackPage() {
  // Get answered feedback
  const feedbackList = await db.feedback.findMany({
    where: {
      status: 'answered',
      admin_reply: { not: null }
    },
    orderBy: { replied_at: 'desc' },
    take: 10
  })

  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Ý kiến - Kiến nghị
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submit Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <FeedbackForm />
            </div>
          </div>

          {/* Feedback List */}
          <div className="lg:col-span-2">
            <FeedbackList feedbackList={feedbackList} />
          </div>
        </div>
      </div>
    </main>
  )
}
