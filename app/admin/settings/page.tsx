import { db } from '@/lib/db'
import { SettingsForm } from '@/components/admin/SettingsForm'

export default async function SettingsPage() {
  // Get the single settings record (or create if not exists)
  let settings = await db.setting.findFirst()
  
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt Website</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin chung của website (logo, tên site, thông tin liên hệ, footer...)
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  )
}
