import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { videoSchema } from '@/lib/validations'

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
    const validatedData = videoSchema.parse(body)

    const video = await db.video.create({
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
      message: 'Đã tạo video mới'
    }, { status: 201 })
  } catch (error) {
    console.error('Create video error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const videos = await db.video.findMany({
      orderBy: [
        { display_order: 'asc' },
        { created_at: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: videos
    })
  } catch (error) {
    console.error('Get videos error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
