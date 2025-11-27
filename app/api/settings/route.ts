import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    let settings = await db.setting.findFirst()
    
    // Create default if not exists
    if (!settings) {
      settings = await db.setting.create({
        data: {
          site_name: 'Cổng Thông Tin Quy Hoạch Quốc Gia',
          footer_about: 'Cổng thông tin Quy hoạch quốc gia - Bộ Kế hoạch và Đầu tư.',
          contact_email: 'info@domain.example',
          contact_phone: '(84) 24 1234 5678',
          footer_copyright: 'Bộ Kế hoạch và Đầu tư'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
