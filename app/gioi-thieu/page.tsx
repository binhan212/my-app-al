import { db } from '@/lib/db'
import Image from 'next/image'

export const revalidate = 0 // Dynamic rendering for fresh data

export default async function AboutPage() {
  const about = await db.about.findFirst({
    orderBy: { created_at: 'desc' }
  })

  return (
    <main className="bg-slate-50 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Giới thiệu</h1>
        
        {about ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {about.image_url && (
              <div className="relative w-full h-[500px]">
                <Image
                  src={about.image_url}
                  alt="Giới thiệu"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                />
              </div>
            )}
            
            <div className="p-8">
              <div 
                className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-blue-600"
                dangerouslySetInnerHTML={{ __html: about.content }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-slate-500 text-lg">
              Chưa có nội dung giới thiệu
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
