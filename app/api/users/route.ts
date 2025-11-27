import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { userSchema } from '@/lib/validations'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// GET /api/users - Lấy danh sách người dùng
export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        avatar: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// POST /api/users - Tạo người dùng mới
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = userSchema.parse(body)

    // Kiểm tra username đã tồn tại
    const existingUser = await db.user.findUnique({
      where: { username: validatedData.username }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Tên đăng nhập đã tồn tại' },
        { status: 400 }
      )
    }

    // Kiểm tra email đã tồn tại
    const existingEmail = await db.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'Email đã tồn tại' },
        { status: 400 }
      )
    }

    // Hash password
    if (!validatedData.password) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu không được để trống' },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(validatedData.password, 10)

    // Tạo user mới
    const user = await db.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password_hash: passwordHash,
        full_name: validatedData.full_name || null,
        avatar: validatedData.avatar || null,
        role: validatedData.role,
        status: validatedData.status
      },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        avatar: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true
      }
    })

    return NextResponse.json({
      success: true,
      data: user
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.issues },
        { status: 400 }
      )
    }

    console.error('Create user error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
