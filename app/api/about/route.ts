import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { aboutSchema } from '@/lib/validations'

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
    const validatedData = aboutSchema.parse(body)

    const about = await db.about.create({
      data: {
        content: validatedData.content,
        image_url: validatedData.image_url || null,
      }
    })

    return NextResponse.json({
      success: true,
      data: about,
      message: 'Đã tạo nội dung giới thiệu mới'
    }, { status: 201 })
  } catch (error) {
    console.error('Create about error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const aboutItems = await db.about.findMany({
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: aboutItems
    })
  } catch (error) {
    console.error('Get about error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
