import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check authentication for all /admin routes except login
  if (pathname.startsWith('/admin')) {
    const session = await auth()

    // Redirect to login if not authenticated
    if (!session?.user) {
      const url = new URL('/admin/login', request.url)
      return NextResponse.redirect(url)
    }

    // Check if user has admin or editor role
    if (session.user.role !== 'admin' && session.user.role !== 'editor') {
      const url = new URL('/', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
