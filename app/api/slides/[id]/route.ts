import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { slideSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const slideId = parseInt(id)

    const slide = await db.slide.findUnique({
      where: { id: slideId }
    })

    if (!slide) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy slide' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: slide
    })
  } catch (error) {
    console.error('Get slide error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const slideId = parseInt(id)
    const body = await request.json()
    
    const validatedData = slideSchema.parse(body)

    const slide = await db.slide.update({
      where: { id: slideId },
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
      message: 'Đã cập nhật slide'
    })
  } catch (error) {
    console.error('Update slide error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const slideId = parseInt(id)

    await db.slide.delete({
      where: { id: slideId }
    })

    return NextResponse.json({
      success: true,
      message: 'Đã xóa slide'
    })
  } catch (error) {
    console.error('Delete slide error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
