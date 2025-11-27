/**
 * Fix published_at for existing published posts and projects
 * Run with: npx tsx scripts/fix-published-at.ts
 */

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log('🔧 Fixing published_at for existing published content...\n')

  try {
    // Fix Posts
    const postsToFix = await db.post.findMany({
      where: {
        status: 'published',
        published_at: null
      },
      select: { id: true, title: true, created_at: true }
    })

    if (postsToFix.length > 0) {
      console.log(`📝 Found ${postsToFix.length} published posts without published_at:`)
      
      for (const post of postsToFix) {
        await db.post.update({
          where: { id: post.id },
          data: { published_at: post.created_at }
        })
        console.log(`   ✅ Fixed post #${post.id}: ${post.title}`)
      }
      console.log()
    } else {
      console.log('✅ No posts to fix\n')
    }

    // Fix Projects
    const projectsToFix = await db.project.findMany({
      where: {
        status: 'published',
        published_at: null
      },
      select: { id: true, title: true, created_at: true }
    })

    if (projectsToFix.length > 0) {
      console.log(`🚀 Found ${projectsToFix.length} published projects without published_at:`)
      
      for (const project of projectsToFix) {
        await db.project.update({
          where: { id: project.id },
          data: { published_at: project.created_at }
        })
        console.log(`   ✅ Fixed project #${project.id}: ${project.title}`)
      }
      console.log()
    } else {
      console.log('✅ No projects to fix\n')
    }

    // Summary
    console.log('=' .repeat(50))
    console.log('✨ Migration completed successfully!')
    console.log(`   Posts fixed: ${postsToFix.length}`)
    console.log(`   Projects fixed: ${projectsToFix.length}`)
    console.log('=' .repeat(50))

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

main()
