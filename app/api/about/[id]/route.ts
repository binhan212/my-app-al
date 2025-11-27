import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { aboutSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const aboutId = parseInt(id)

    const about = await db.about.findUnique({
      where: { id: aboutId }
    })

    if (!about) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy nội dung' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: about
    })
  } catch (error) {
    console.error('Get about error:', error)
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
    const aboutId = parseInt(id)
    const body = await request.json()
    
    const validatedData = aboutSchema.parse(body)

    const about = await db.about.update({
      where: { id: aboutId },
      data: {
        content: validatedData.content,
        image_url: validatedData.image_url || null,
      }
    })

    return NextResponse.json({
      success: true,
      data: about,
      message: 'Đã cập nhật nội dung giới thiệu'
    })
  } catch (error) {
    console.error('Update about error:', error)
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
    const aboutId = parseInt(id)

    await db.about.delete({
      where: { id: aboutId }
    })

    return NextResponse.json({
      success: true,
      message: 'Đã xóa nội dung giới thiệu'
    })
  } catch (error) {
    console.error('Delete about error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
