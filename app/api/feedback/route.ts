import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feedbackSchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/feedback - Lấy danh sách phản hồi (có filter theo status)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const where = status && status !== 'all' && (status === 'pending' || status === 'answered' || status === 'archived')
      ? { status: status as 'pending' | 'answered' | 'archived' }
      : {}
    
    const feedback = await db.feedback.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // pending trước
        { created_at: 'desc' }
      ],
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
    console.error('Get feedback error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = feedbackSchema.parse(body)

    // Create feedback
    const feedback = await db.feedback.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject,
        message: validatedData.message,
        status: 'pending'
      }
    })

    return NextResponse.json({
      success: true,
      data: feedback
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Dữ liệu không hợp lệ', 
          errors: error.issues 
        },
        { status: 400 }
      )
    }

    console.error('Create feedback error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
