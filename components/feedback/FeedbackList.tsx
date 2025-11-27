import type { Feedback } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FeedbackListProps {
  feedbackList: Feedback[]
}

export function FeedbackList({ feedbackList }: FeedbackListProps) {
  if (feedbackList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ý kiến đã được trả lời</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">
            Chưa có ý kiến nào được trả lời
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ý kiến đã được trả lời</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {feedbackList.map((feedback) => (
          <div key={feedback.id} className="border-b pb-6 last:border-0">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">👤</span>
              </div>
              
              <div className="flex-1 min-w-0">
                {/* User Question */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{feedback.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(feedback.created_at)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">
                    {feedback.subject}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {feedback.message}
                  </p>
                </div>

                {/* Admin Reply */}
                {feedback.admin_reply && (
                  <div className="bg-blue-50 rounded-lg p-4 ml-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                        A
                      </span>
                      <div>
                        <span className="font-semibold text-sm">Quản trị viên</span>
                        {feedback.replied_at && (
                          <span className="text-xs text-gray-500 ml-2">
                            {formatDate(feedback.replied_at)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      {feedback.admin_reply}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
