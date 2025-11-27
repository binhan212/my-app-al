import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createSlug } from '@/lib/utils'
import { postSchema } from '@/lib/validations'

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
    const validatedData = postSchema.parse(body)

    const post = await db.post.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        excerpt: validatedData.excerpt || null,
        cover_image: validatedData.cover_image || null,
        category_id: validatedData.category_id || null,
        status: validatedData.status,
        published_at: validatedData.status === 'published' ? new Date() : null,
        slug: createSlug(validatedData.title),
        author_id: parseInt(session.user.id),
      }
    })

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Đã tạo bài viết mới'
    }, { status: 201 })
  } catch (error) {
    console.error('Create post error:', error)
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

    const [posts, total] = await Promise.all([
      db.post.findMany({
        include: {
          author: {
            select: { id: true, full_name: true, username: true }
          },
          category: {
            select: { id: true, name: true }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      db.post.count()
    ])

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
