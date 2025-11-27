import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createSlug } from '@/lib/utils'
import { projectSchema } from '@/lib/validations'

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
    const validatedData = projectSchema.parse(body)

    const project = await db.project.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || null,
        content: validatedData.content || null,
        cover_image: validatedData.cover_image || null,
        pdf_file: validatedData.pdf_file || null,
        category_id: validatedData.category_id || null,
        status: validatedData.status,
        published_at: validatedData.status === 'published' ? new Date() : null,
        slug: createSlug(validatedData.title),
      }
    })

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Đã tạo dự án mới'
    }, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [projects, total] = await Promise.all([
      db.project.findMany({
        include: {
          category: {
            select: { id: true, name: true }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      db.project.count()
    ])

    return NextResponse.json({
      success: true,
      data: {
        projects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
