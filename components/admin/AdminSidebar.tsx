'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ChartBarIcon,
  DocumentTextIcon,
  FolderIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  Cog6ToothIcon,
  RectangleStackIcon,
  TagIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'

interface AdminSidebarProps {
  userRole: string
}

const menuItems = [
  {
    title: 'Tổng quan',
    href: '/admin/dashboard',
    icon: ChartBarIcon,
    roles: ['admin', 'editor']
  },
  {
    title: 'Bài viết',
    href: '/admin/posts',
    icon: DocumentTextIcon,
    roles: ['admin', 'editor']
  },
  {
    title: 'Dự án',
    href: '/admin/projects',
    icon: FolderIcon,
    roles: ['admin', 'editor']
  },
  {
    title: 'Giới thiệu',
    href: '/admin/about',
    icon: InformationCircleIcon,
    roles: ['admin']
  },
  {
    title: 'Danh mục',
    href: '/admin/categories',
    icon: TagIcon,
    roles: ['admin']
  },
  {
    title: 'Slides',
    href: '/admin/slides',
    icon: RectangleStackIcon,
    roles: ['admin']
  },
  {
    title: 'Videos',
    href: '/admin/videos',
    icon: VideoCameraIcon,
    roles: ['admin', 'editor']
  },
  {
    title: 'Ý kiến',
    href: '/admin/feedback',
    icon: ChatBubbleLeftRightIcon,
    roles: ['admin']
  },
  {
    title: 'Người dùng',
    href: '/admin/users',
    icon: UsersIcon,
    roles: ['admin']
  },
  {
    title: 'Cài đặt',
    href: '/admin/settings',
    icon: Cog6ToothIcon,
    roles: ['admin']
  },
]

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname()

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  )

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-1">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
