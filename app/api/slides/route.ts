import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { slideSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = slideSchema.parse(body)

    const slide = await db.slide.create({
      data: {
        title: validatedData.title || null,
        description: validatedData.description || null,
        image_url: validatedData.image_url,
        link_url: validatedData.link_url || null,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
      }
    })

    return NextResponse.json({
      success: true,
      data: slide,
      message: 'Đã tạo slide mới'
    }, { status: 201 })
  } catch (error) {
    console.error('Create slide error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const slides = await db.slide.findMany({
      orderBy: [
        { display_order: 'asc' },
        { created_at: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: slides
    })
  } catch (error) {
    console.error('Get slides error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
