import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/drawings/[id] - Get drawing by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const drawing = await db.drawing.findUnique({
      where: { id }
    })

    if (!drawing) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy bản vẽ' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: drawing
    })
  } catch (error) {
    console.error('Get drawing error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi lấy thông tin bản vẽ' },
      { status: 500 }
    )
  }
}

// PUT /api/drawings/[id] - Update drawing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: paramId } = await params
    const id = parseInt(paramId)
    const body = await request.json()
    const { title, dwg_file, icon, status, display_order } = body

    if (!title || !dwg_file) {
      return NextResponse.json(
        { success: false, message: 'Tiêu đề và file DWG là bắt buộc' },
        { status: 400 }
      )
    }

    const drawing = await db.drawing.update({
      where: { id },
      data: {
        title,
        dwg_file,
        icon: icon || null,
        status: status || 'active',
        display_order: display_order || 0
      }
    })

    return NextResponse.json({
      success: true,
      data: drawing
    })
  } catch (error) {
    console.error('Update drawing error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi cập nhật bản vẽ' },
      { status: 500 }
    )
  }
}

// DELETE /api/drawings/[id] - Delete drawing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: paramId } = await params
    const id = parseInt(paramId)
    await db.drawing.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Xóa bản vẽ thành công'
    })
  } catch (error) {
    console.error('Delete drawing error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xóa bản vẽ' },
      { status: 500 }
    )
  }
}
