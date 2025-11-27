import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createSlug } from '@/lib/utils'
import { postSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const postId = parseInt(id)

    const post = await db.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { id: true, full_name: true, username: true }
        },
        category: {
          select: { id: true, name: true }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy bài viết' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: post
    })
  } catch (error) {
    console.error('Get post error:', error)
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
    const postId = parseInt(id)
    const body = await request.json()
    
    const validatedData = postSchema.parse(body)

    // Get existing post to check current published_at
    const existingPost = await db.post.findUnique({
      where: { id: postId },
      select: { published_at: true }
    })

    const post = await db.post.update({
      where: { id: postId },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        excerpt: validatedData.excerpt || null,
        cover_image: validatedData.cover_image || null,
        category_id: validatedData.category_id || null,
        status: validatedData.status,
        // Set published_at if changing to published and not already set
        published_at: validatedData.status === 'published' && !existingPost?.published_at
          ? new Date()
          : undefined,
        slug: createSlug(validatedData.title),
        updated_at: new Date(),
      }
    })

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Đã cập nhật bài viết'
    })
  } catch (error) {
    console.error('Update post error:', error)
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
    const postId = parseInt(id)

    await db.post.delete({
      where: { id: postId }
    })

    return NextResponse.json({
      success: true,
      message: 'Đã xóa bài viết'
    })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    )
  }
}
