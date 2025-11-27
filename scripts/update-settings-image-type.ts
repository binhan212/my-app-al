/**
 * Update Settings to support Image type
 * This script adds 'image' as a valid setting_type option
 * Run with: npx tsx scripts/update-settings-image-type.ts
 */

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log('🔧 Updating Settings to support Image type...\n')

  try {
    // Check if there are any settings with type 'image'
    const imageSettings = await db.setting.findMany({
      where: { setting_type: 'image' }
    })

    console.log(`📊 Found ${imageSettings.length} settings with type 'image'`)

    // Update any settings that should be image type (e.g., logo-related settings)
    const logoKeywords = ['logo', 'icon', 'banner', 'image', 'avatar', 'thumbnail']
    
    const settingsToUpdate = await db.setting.findMany({
      where: {
        OR: logoKeywords.map(keyword => ({
          setting_key: { contains: keyword }
        })),
        setting_type: { not: 'image' }
      }
    })

    if (settingsToUpdate.length > 0) {
      console.log(`\n🔄 Found ${settingsToUpdate.length} settings that might be images:`)
      
      for (const setting of settingsToUpdate) {
        console.log(`   • ${setting.setting_key} (current type: ${setting.setting_type})`)
        console.log(`     Value: ${setting.setting_value || 'NULL'}`)
        
        // Only update if the value looks like an image URL
        if (setting.setting_value && 
            (setting.setting_value.startsWith('/uploads/') || 
             setting.setting_value.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i))) {
          
          await db.setting.update({
            where: { id: setting.id },
            data: { setting_type: 'image' }
          })
          console.log(`     ✅ Updated to type 'image'`)
        } else {
          console.log(`     ⏭️  Skipped (value doesn't look like an image)`)
        }
      }
    } else {
      console.log('\n✅ No settings need to be updated')
    }

    console.log('\n' + '='.repeat(50))
    console.log('✨ Settings image type support added successfully!')
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

main()
