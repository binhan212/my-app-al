import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { videoSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const videoId = parseInt(id)

    const video = await db.video.findUnique({
      where: { id: videoId }
    })

    if (!video) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy video' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: video
    })
  } catch (error) {
    console.error('Get video error:', error)
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
    const videoId = parseInt(id)
    const body = await request.json()
    
    const validatedData = videoSchema.parse(body)

    const video = await db.video.update({
      where: { id: videoId },
      data: {
        title: validatedData.title,
        description: validatedData.description || null,
        video_url: validatedData.video_url,
        thumbnail_url: validatedData.thumbnail_url || null,
        duration: validatedData.duration || null,
        display_order: validatedData.display_order,
        status: validatedData.status,
      }
    })

    return NextResponse.json({
      success: true,
      data: video,
      message: 'Đã cập nhật video'
    })
  } catch (error) {
    console.error('Update video error:', error)
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
    const videoId = parseInt(id)

    await db.video.delete({
      where: { id: videoId }
    })

    return NextResponse.json({
      success: true,
      message: 'Đã xóa video'
    })
  } catch (error) {
    console.error('Delete video error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
