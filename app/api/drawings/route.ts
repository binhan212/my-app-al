import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/drawings - Get all drawings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: { status?: 'active' | 'inactive' } = {}
    if (status === 'active' || status === 'inactive') {
      where.status = status
    }

    const [drawings, total] = await Promise.all([
      db.drawing.findMany({
        where,
        orderBy: [
          { display_order: 'asc' },
          { created_at: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.drawing.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        drawings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get drawings error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi lấy danh sách bản vẽ' },
      { status: 500 }
    )
  }
}

// POST /api/drawings - Create new drawing
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, dwg_file, icon, status, display_order } = body

    if (!title || !dwg_file) {
      return NextResponse.json(
        { success: false, message: 'Tiêu đề và file DWG là bắt buộc' },
        { status: 400 }
      )
    }

    const drawing = await db.drawing.create({
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
    }, { status: 201 })
  } catch (error) {
    console.error('Create drawing error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tạo bản vẽ' },
      { status: 500 }
    )
  }
}
