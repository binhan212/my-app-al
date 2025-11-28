'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AdminHeaderProps {
  user: {
    full_name: string | null
    username: string
    role: string
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: '/admin/login',
      redirect: true 
    })
    // Force full page reload after logout
    window.location.href = '/admin/login'
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            BP
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Quản trị hệ thống
            </h1>
            <p className="text-sm text-gray-500">
              Phường Âu Lâu
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-semibold">
                    {user.full_name?.charAt(0) || user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium">
                    {user.full_name || user.username}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role === 'admin' ? 'Quản trị viên' : 'Biên tập viên'}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
