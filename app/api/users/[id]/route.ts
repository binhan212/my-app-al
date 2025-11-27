import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { userSchema } from '@/lib/validations'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// GET /api/users/[id] - Lấy chi tiết người dùng
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - Cập nhật người dùng
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = userSchema.parse(body)

    // Chuẩn bị data update
    const updateData: {
      email: string
      full_name: string | null
      avatar: string | null
      role: 'admin' | 'editor' | 'user'
      status: 'active' | 'inactive'
      password_hash?: string
    } = {
      email: validatedData.email,
      full_name: validatedData.full_name || null,
      avatar: validatedData.avatar || null,
      role: validatedData.role as 'admin' | 'editor' | 'user',
      status: validatedData.status as 'active' | 'inactive'
    }

    // Nếu có password mới, hash và update
    if (validatedData.password) {
      updateData.password_hash = await bcrypt.hash(validatedData.password, 10)
    }

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
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
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.issues },
        { status: 400 }
      )
    }

    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Xóa người dùng
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      )
    }

    // Không cho phép xóa chính mình
    if (userId === parseInt(session.user.id)) {
      return NextResponse.json(
        { success: false, message: 'Không thể xóa tài khoản của chính mình' },
        { status: 400 }
      )
    }

    await db.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
