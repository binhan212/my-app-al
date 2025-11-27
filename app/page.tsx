import { db } from '@/lib/db'
import { HeroSection } from '@/components/home/HeroSection'
import { NewsSection } from '@/components/home/NewsSection'
import { ProjectsSection } from '@/components/home/ProjectsSection'
import { VideoSection } from '@/components/home/VideoSection'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  // Fetch data in parallel
  const [slides, posts, projects, videos, settings] = await Promise.all([
    // Get active slides
    db.slide.findMany({
      where: { is_active: true },
      orderBy: { display_order: 'asc' },
      take: 5
    }),
    
    // Get latest published posts (5 for hero cards + extra for news section)
    db.post.findMany({
      where: { 
        status: 'published',
        published_at: { lte: new Date() }
      },
      include: {
        author: {
          select: { id: true, full_name: true }
        },
        category: {
          select: { id: true, name: true }
        }
      },
      orderBy: { published_at: 'desc' },
      take: 9
    }),

    // Get latest published projects
    db.project.findMany({
      where: {
        status: 'published',
        published_at: { lte: new Date() }
      },
      include: {
        category: {
          select: { id: true, name: true }
        }
      },
      orderBy: { published_at: 'desc' },
      take: 3
    }),
    
    // Get active videos
    db.video.findMany({
      where: { status: 'active' },
      orderBy: { display_order: 'asc' },
      take: 3
    }),

    // Get site settings (single record)
    db.setting.findFirst()
  ])

  return (
    <>
      <HeroSection 
        slides={slides} 
        siteName={settings?.site_name || 'Quy hoạch Quốc gia'}
        siteDescription={settings?.footer_about || 'Cổng thông tin Quy hoạch quốc gia'}
        recentPosts={posts.slice(0, 5)}
      />
      <NewsSection posts={posts.slice(0, 4)} />
      <ProjectsSection projects={projects} />
      <VideoSection videos={videos} />
    </>
  )
}
