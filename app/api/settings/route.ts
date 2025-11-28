import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    let settings = await db.setting.findFirst()
    
    // Create default if not exists
    if (!settings) {
      settings = await db.setting.create({
        data: {
          site_name: 'Phường Âu Lâu',
          footer_about: 'Cổng thông tin, kế hoạch và đầu tư phường Âu Lâu, tỉnh Lào Cai',
          contact_email: 'info@domain.example',
          contact_phone: '(84) 24 1234 5678',
          footer_copyright: 'Phường Âu Lâu'
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
