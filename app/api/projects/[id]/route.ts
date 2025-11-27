import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createSlug } from '@/lib/utils'
import { projectSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const projectId = parseInt(id)

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy dự án' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Get project error:', error)
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
    const projectId = parseInt(id)
    const body = await request.json()
    
    const validatedData = projectSchema.parse(body)

    // Get existing project to check current published_at
    const existingProject = await db.project.findUnique({
      where: { id: projectId },
      select: { published_at: true }
    })

    const project = await db.project.update({
      where: { id: projectId },
      data: {
        title: validatedData.title,
        description: validatedData.description || null,
        content: validatedData.content || null,
        cover_image: validatedData.cover_image || null,
        pdf_file: validatedData.pdf_file || null,
        category_id: validatedData.category_id || null,
        status: validatedData.status,
        // Set published_at if changing to published and not already set
        published_at: validatedData.status === 'published' && !existingProject?.published_at
          ? new Date()
          : undefined,
        slug: createSlug(validatedData.title),
        updated_at: new Date(),
      }
    })

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Đã cập nhật dự án'
    })
  } catch (error) {
    console.error('Update project error:', error)
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
    const projectId = parseInt(id)

    await db.project.delete({
      where: { id: projectId }
    })

    return NextResponse.json({
      success: true,
      message: 'Đã xóa dự án'
    })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
