import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  DocumentTextIcon,
  FolderIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  RectangleStackIcon,
  EyeIcon,
  TagIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { StatsCard } from '@/components/admin/StatsCard'
import { formatDate } from '@/lib/utils'

export default async function AdminDashboard() {
  // Get comprehensive statistics
  const [
    postsCount,
    publishedPostsCount,
    draftPostsCount,
    projectsCount,
    publishedProjectsCount,
    videosCount,
    activeVideosCount,
    feedbackCount,
    pendingFeedbackCount,
    usersCount,
    categoriesCount,
    slidesCount,
    activeSlidesCount,
    totalPostViews,
    totalProjectViews,
  ] = await Promise.all([
    db.post.count(),
    db.post.count({ where: { status: 'published' } }),
    db.post.count({ where: { status: 'draft' } }),
    db.project.count(),
    db.project.count({ where: { status: 'published' } }),
    db.video.count(),
    db.video.count({ where: { status: 'active' } }),
    db.feedback.count(),
    db.feedback.count({ where: { status: 'pending' } }),
    db.user.count(),
    db.category.count(),
    db.slide.count(),
    db.slide.count({ where: { is_active: true } }),
    db.post.aggregate({ _sum: { views: true } }),
    db.project.aggregate({ _sum: { views: true } }),
  ])

  const stats = [
    {
      title: 'Bài viết',
      value: postsCount,
      subtitle: `${publishedPostsCount} đã xuất bản • ${draftPostsCount} nháp`,
      iconName: 'DocumentTextIcon' as const,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/admin/posts'
    },
    {
      title: 'Dự án',
      value: projectsCount,
      subtitle: `${publishedProjectsCount} đã xuất bản`,
      iconName: 'FolderIcon' as const,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/admin/projects'
    },
    {
      title: 'Videos',
      value: videosCount,
      subtitle: `${activeVideosCount} đang hoạt động`,
      iconName: 'VideoCameraIcon' as const,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/admin/videos'
    },
    {
      title: 'Ý kiến - Kiến nghị',
      value: feedbackCount,
      subtitle: `${pendingFeedbackCount} chờ xử lý`,
      iconName: 'ChatBubbleLeftRightIcon' as const,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/admin/feedback'
    },
    {
      title: 'Người dùng',
      value: usersCount,
      subtitle: 'Tổng số người dùng',
      iconName: 'UsersIcon' as const,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      href: '/admin/users'
    },
    {
      title: 'Danh mục',
      value: categoriesCount,
      subtitle: 'Danh mục bài viết & dự án',
      iconName: 'TagIcon' as const,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      href: '/admin/categories'
    },
    {
      title: 'Slides',
      value: slidesCount,
      subtitle: `${activeSlidesCount} đang hiển thị`,
      iconName: 'RectangleStackIcon' as const,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      href: '/admin/slides'
    },
    {
      title: 'Tổng lượt xem',
      value: (totalPostViews._sum.views || 0) + (totalProjectViews._sum.views || 0),
      subtitle: 'Bài viết & Dự án',
      iconName: 'EyeIcon' as const,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      href: '/admin/posts'
    },
  ]

  // Get recent activities
  const [recentPosts, recentProjects, recentFeedback] = await Promise.all([
    db.post.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        author: { select: { full_name: true, username: true } },
        category: { select: { name: true } }
      }
    }),
    db.project.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        category: { select: { name: true } }
      }
    }),
    db.feedback.findMany({
      take: 5,
      orderBy: { created_at: 'desc' }
    })
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tổng quan hệ thống</h1>
        <p className="text-gray-500 mt-1">
          Dashboard quản trị - Xem tổng quan toàn bộ hệ thống CMS
        </p>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-blue-600" />
              Bài viết mới nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPosts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Chưa có bài viết nào</p>
              ) : (
                recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{post.author.full_name || post.author.username}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <EyeIcon className="w-4 h-4" />
                        {post.views}
                      </span>
                      {post.status === 'published' && (
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderIcon className="w-5 h-5 text-green-600" />
              Dự án mới nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProjects.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Chưa có dự án nào</p>
              ) : (
                recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate mb-1">
                        {project.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{project.category?.name || 'Chưa phân loại'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {formatDate(project.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <EyeIcon className="w-4 h-4" />
                        {project.views}
                      </span>
                      {project.status === 'published' && (
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-orange-600" />
              Ý kiến - Kiến nghị mới nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentFeedback.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Chưa có ý kiến nào</p>
              ) : (
                recentFeedback.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate mb-1">
                        {feedback.subject}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{feedback.name}</span>
                        <span>•</span>
                        <span>{feedback.email}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {formatDate(feedback.created_at)}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                      feedback.status === 'answered'
                        ? 'bg-green-100 text-green-800'
                        : feedback.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {feedback.status === 'answered' ? 'Đã trả lời' : feedback.status === 'pending' ? 'Chờ xử lý' : 'Lưu trữ'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
