import { auth } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Always render just children for unauthenticated users
  // The login page will handle its own layout
  if (!session?.user) {
    return <>{children}</>
  }

  // Render full admin layout with sidebar and header for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={session.user} />
      <div className="flex">
        <AdminSidebar userRole={session.user.role} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
