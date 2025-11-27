import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const settingsSchema = z.object({
  site_name: z.string().min(1),
  site_logo: z.string().optional().nullable(),
  site_favicon: z.string().optional().nullable(),
  footer_about: z.string().optional().nullable(),
  contact_email: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  contact_address: z.string().optional().nullable(),
  facebook_url: z.string().optional().nullable(),
  youtube_url: z.string().optional().nullable(),
  footer_copyright: z.string().optional().nullable()
})

// PUT /api/settings/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const settingId = parseInt(id)
    const body = await request.json()
    const data = settingsSchema.parse(body)

    const settings = await db.setting.update({
      where: { id: settingId },
      data
    })

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.issues },
        { status: 400 }
      )
    }

    console.error('Update settings error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
