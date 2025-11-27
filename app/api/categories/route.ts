import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createSlug } from '@/lib/utils'
import { categorySchema } from '@/lib/validations'

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
    const validatedData = categorySchema.parse(body)

    const category = await db.category.create({
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
      message: 'Đã tạo danh mục mới'
    }, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const categories = await db.category.findMany({
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
      },
      orderBy: [
        { display_order: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
