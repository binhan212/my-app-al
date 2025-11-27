import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createSlug } from '@/lib/utils'
import { categorySchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const categoryId = parseInt(id)

    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        parent: {
          select: { id: true, name: true }
        },
        _count: {
          select: {
            posts: true,
            projects: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy danh mục' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('Get category error:', error)
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
    const categoryId = parseInt(id)
    const body = await request.json()
    
    const validatedData = categorySchema.parse(body)

    const category = await db.category.update({
      where: { id: categoryId },
      data: {
        name: validatedData.name,
        slug: createSlug(validatedData.name),
        description: validatedData.description || null,
        parent_id: validatedData.parent_id || null,
        display_order: validatedData.display_order,
      }
    })

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Đã cập nhật danh mục'
    })
  } catch (error) {
    console.error('Update category error:', error)
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
    const categoryId = parseInt(id)

    await db.category.delete({
      where: { id: categoryId }
    })

    return NextResponse.json({
      success: true,
      message: 'Đã xóa danh mục'
    })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
