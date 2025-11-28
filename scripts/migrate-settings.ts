import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateSettings() {
  try {
    console.log('🔄 Migrating settings table...')
    
    // Drop old settings table
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS `settings_backup`')
    await prisma.$executeRawUnsafe('CREATE TABLE `settings_backup` AS SELECT * FROM `settings`')
    console.log('✅ Backed up old settings')
    
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS `settings`')
    console.log('✅ Dropped old settings table')
    
    // Create new settings table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE \`settings\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`site_name\` VARCHAR(255) NOT NULL DEFAULT 'Phường Âu Lâu - Tỉnh Lào Cai',
        \`site_logo\` VARCHAR(500),
        \`site_favicon\` VARCHAR(500),
        \`footer_about\` TEXT,
        \`contact_email\` VARCHAR(100),
        \`contact_phone\` VARCHAR(50),
        \`contact_address\` VARCHAR(255),
        \`facebook_url\` VARCHAR(255),
        \`youtube_url\` VARCHAR(255),
        \`footer_copyright\` VARCHAR(255),
        \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('✅ Created new settings table')
    
    // Insert default record
    await prisma.$executeRawUnsafe(`
      INSERT INTO \`settings\` (
        \`site_name\`,
        \`footer_about\`,
        \`contact_email\`,
        \`contact_phone\`,
        \`footer_copyright\`
      ) VALUES (
        'Phường Âu Lâu - Tỉnh Lào Cai',
        'Cổng thông tin, kế hoạch và đầu tư phường Âu Lâu, tỉnh Lào Cai',
        'info@domain.example',
        '(84) 24 1234 5678',
        'Phường Âu Lâu'
      )
    `)
    console.log('✅ Inserted default settings')
    
    console.log('✨ Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateSettings()
