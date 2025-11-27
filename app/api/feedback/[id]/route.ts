import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { feedbackSchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/feedback/[id] - Lấy chi tiết phản hồi
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const feedbackId = parseInt(id)

    if (isNaN(feedbackId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      )
    }

    const feedback = await db.feedback.findUnique({
      where: { id: feedbackId },
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

    if (!feedback) {
      return NextResponse.json(
        { success: false, message: 'Feedback not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: feedback
    })
  } catch (error) {
    console.error('Get feedback error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// PUT /api/feedback/[id] - Cập nhật phản hồi (admin reply)
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
    const feedbackId = parseInt(id)

    if (isNaN(feedbackId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = feedbackSchema.parse(body)

    // Cập nhật feedback với admin reply
    const updateData: {
      admin_reply?: string | null
      status: 'pending' | 'answered' | 'archived'
      replied_at?: Date | null
      replied_by?: number | null
    } = {
      admin_reply: validatedData.admin_reply || null,
      status: validatedData.status as 'pending' | 'answered' | 'archived'
    }

    // Nếu có admin_reply và chưa replied, set replied_at và replied_by
    if (validatedData.admin_reply && validatedData.status === 'answered') {
      updateData.replied_at = new Date()
      updateData.replied_by = parseInt(session.user.id)
    }

    const feedback = await db.feedback.update({
      where: { id: feedbackId },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      data: feedback
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.issues },
        { status: 400 }
      )
    }

    console.error('Update feedback error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/feedback/[id] - Xóa phản hồi
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
    const feedbackId = parseInt(id)

    if (isNaN(feedbackId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      )
    }

    await db.feedback.delete({
      where: { id: feedbackId }
    })

    return NextResponse.json({
      success: true,
      message: 'Feedback deleted'
    })
  } catch (error) {
    console.error('Delete feedback error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
