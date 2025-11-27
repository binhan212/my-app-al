# ✅ Action Plan: Migration Demo123 → Next.js (Chi Tiết Từng Bước)

## 📅 Timeline: 10 Tuần

---

## 🎯 WEEK 1: Preparation & Setup

### Day 1-2: Học và Nghiên Cứu
- [ ] Đọc toàn bộ `MIGRATION_TO_NEXTJS.md`
- [ ] Đọc toàn bộ `NEXTJS_IMPLEMENTATION_GUIDE.md`
- [ ] Xem Next.js 15 crash course (YouTube)
- [ ] Xem Prisma tutorial (YouTube)

### Day 3-4: Setup Environment
```bash
# 1. Tạo folder mới cho Next.js project
mkdir demo123-nextjs
cd demo123-nextjs

# 2. Khởi tạo Next.js project
npx create-next-app@latest . --typescript --tailwind --app --use-npm

# 3. Install core dependencies
npm install prisma @prisma/client
npm install next-auth@beta bcryptjs
npm install @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers
npm install date-fns clsx tailwind-merge

# 4. Install dev dependencies
npm install -D @types/bcryptjs tsx

# 5. Install shadcn/ui
npx shadcn@latest init
```

### Day 5: Setup Prisma
```bash
# 1. Initialize Prisma
npx prisma init

# 2. Copy schema từ NEXTJS_IMPLEMENTATION_GUIDE.md
# Paste vào prisma/schema.prisma

# 3. Tạo .env
echo 'DATABASE_URL="mysql://demo123_user:password@localhost:3306/demo123_db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"' > .env

# 4. Generate Prisma Client
npx prisma generate

# 5. Push schema to database (hoặc migrate)
npx prisma db push

# 6. Verify connection
npx prisma studio
```

### Checklist Week 1:
- [ ] Next.js project created
- [ ] All dependencies installed
- [ ] Prisma configured
- [ ] Database connected
- [ ] Can access Prisma Studio

---

## 🎯 WEEK 2: Core Setup

### Day 1: File Structure
```bash
# Tạo cấu trúc thư mục
mkdir -p app/{admin,api}
mkdir -p components/{ui,layout,forms}
mkdir -p lib
mkdir -p types
mkdir -p prisma
```

### Day 2: Database Client & Auth Setup

**Tạo `lib/db.ts`:**
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

**Tạo `lib/auth.ts`:**
- Copy toàn bộ code từ `NEXTJS_IMPLEMENTATION_GUIDE.md` (section NextAuth Configuration)

**Tạo `types/next-auth.d.ts`:**
- Copy type definitions

**Tạo `app/api/auth/[...nextauth]/route.ts`:**
- Setup NextAuth route handler

### Day 3: Utilities & Validation

**Tạo `lib/utils.ts`:**
- Copy utility functions từ guide
- createSlug, formatDate, formatNumber, etc.

**Tạo `lib/validations.ts`:**
- Copy tất cả Zod schemas từ guide

### Day 4-5: Seed Database

**Tạo `prisma/seed.ts`:**
- Copy seed script từ guide

```bash
# Add script to package.json
npm pkg set scripts.db:seed="tsx prisma/seed.ts"

# Run seed
npm run db:seed
```

**Verify:**
```bash
npx prisma studio
# Check: users, categories, slides, settings
```

### Checklist Week 2:
- [ ] File structure created
- [ ] Database client setup
- [ ] NextAuth configured
- [ ] Utils & validations created
- [ ] Database seeded successfully
- [ ] Can login to admin (test)

---

## 🎯 WEEK 3: Backend API - Part 1

### Day 1: Auth API
**Tạo `app/api/auth/[...nextauth]/route.ts`**
- Already done in Week 2

**Test:**
```bash
# Start dev server
npm run dev

# Test login at http://localhost:3000/admin/login
```

### Day 2: Posts API

**Tạo `app/api/posts/route.ts`:**
- GET /api/posts (list with pagination)
- POST /api/posts (create)

**Tạo `app/api/posts/[id]/route.ts`:**
- GET /api/posts/:id (get by ID/slug)
- PUT /api/posts/:id (update)
- DELETE /api/posts/:id

**Test:**
```bash
# GET posts
curl http://localhost:3000/api/posts

# GET post by slug
curl http://localhost:3000/api/posts/test-post
```

### Day 3: Categories API

**Tạo `app/api/categories/route.ts`:**
- GET /api/categories
- POST /api/categories

**Tạo `app/api/categories/[id]/route.ts`:**
- PUT /api/categories/:id
- DELETE /api/categories/:id

### Day 4: Slides API

**Tạo `app/api/slides/route.ts`:**
- GET /api/slides
- POST /api/slides

**Tạo `app/api/slides/[id]/route.ts`:**
- PUT, DELETE

### Day 5: Videos API

**Tạo `app/api/videos/route.ts`:**
- GET /api/videos
- POST /api/videos

**Tạo `app/api/videos/[id]/route.ts`:**
- PUT, DELETE

### Checklist Week 3:
- [ ] Posts API working
- [ ] Categories API working
- [ ] Slides API working
- [ ] Videos API working
- [ ] All tested with curl/Postman

---

## 🎯 WEEK 4: Backend API - Part 2

### Day 1: Projects API
- `app/api/projects/route.ts`
- `app/api/projects/[id]/route.ts`

### Day 2: Feedback API
- `app/api/feedback/route.ts`
- `app/api/feedback/[id]/route.ts`

### Day 3: Users API
- `app/api/users/route.ts`
- `app/api/users/[id]/route.ts`

### Day 4: Settings API
- `app/api/settings/route.ts`

### Day 5: Upload API

**Option 1: UploadThing**
```bash
npm install uploadthing @uploadthing/react
```

**Option 2: Next.js API Route**
```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  const path = join(process.cwd(), 'public/uploads', file.name)
  await writeFile(path, buffer)
  
  return NextResponse.json({ 
    success: true, 
    url: `/uploads/${file.name}` 
  })
}
```

### Checklist Week 4:
- [ ] Projects API complete
- [ ] Feedback API complete
- [ ] Users API complete
- [ ] Settings API complete
- [ ] Upload working
- [ ] All APIs tested

---

## 🎯 WEEK 5: Frontend Public - Part 1

### Day 1: Layout Components

**Tạo `components/layout/Header.tsx`:**
```typescript
'use client'
import Link from 'next/link'
// Implementation from guide
```

**Tạo `components/layout/Footer.tsx`:**
```typescript
export function Footer() {
  // Implementation
}
```

**Tạo `app/layout.tsx`:**
```typescript
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

### Day 2: Hero Carousel Component

**Tạo `components/carousel/HeroCarousel.tsx`:**
- Client component with slides từ API
- Auto-rotate every 5 seconds

### Day 3: Home Page

**Tạo `app/page.tsx`:**
- Server component
- Fetch posts, videos
- Display carousel
- News section
- Videos section

**Test:**
```bash
npm run dev
# Visit http://localhost:3000
```

### Day 4: Post Card Component

**Tạo `components/posts/PostCard.tsx`:**
```typescript
import Image from 'next/image'
import Link from 'next/link'

export function PostCard({ post }) {
  return (
    <Link href={`/tin-tuc/${post.slug}`}>
      <article className="...">
        {/* Implementation */}
      </article>
    </Link>
  )
}
```

### Day 5: News List Page

**Tạo `app/tin-tuc/page.tsx`:**
- Client component with pagination
- Use React Query
- Filter by category
- Search functionality

### Checklist Week 5:
- [ ] Header & Footer working
- [ ] Hero carousel working
- [ ] Home page complete
- [ ] Post card component
- [ ] News listing page working

---

## 🎯 WEEK 6: Frontend Public - Part 2

### Day 1-2: Post Detail Page

**Tạo `app/tin-tuc/[slug]/page.tsx`:**
```typescript
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export async function generateMetadata({ params }) {
  const post = await db.post.findUnique({
    where: { slug: params.slug }
  })
  
  return {
    title: post?.title,
    description: post?.excerpt
  }
}

export default async function PostDetailPage({ params }) {
  const post = await db.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: true,
      category: true
    }
  })

  if (!post || post.status !== 'published') {
    notFound()
  }

  // Increment views
  await db.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  })

  return (
    <article>
      <h1>{post.title}</h1>
      {/* Full implementation */}
    </article>
  )
}
```

### Day 3: Projects Pages

**Tạo `app/du-an/page.tsx`:**
- Similar to news listing

**Tạo `app/du-an/[slug]/page.tsx`:**
- Similar to post detail
- Add PDF download link

### Day 4: Videos Page

**Tạo `app/videos/page.tsx`:**
- Grid of embedded videos
- YouTube iframe

### Day 5: Feedback Form

**Tạo `app/y-kien/page.tsx`:**
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { feedbackSchema } from '@/lib/validations'

export default function FeedbackPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(feedbackSchema)
  })

  const onSubmit = async (data) => {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (res.ok) {
      alert('Cảm ơn bạn đã gửi góp ý!')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### Checklist Week 6:
- [ ] Post detail page working
- [ ] Projects pages working
- [ ] Videos page working
- [ ] Feedback form working
- [ ] All public pages tested

---

## 🎯 WEEK 7: Admin Panel - Part 1

### Day 1: Admin Layout & Login

**Tạo `app/admin/login/page.tsx`:**
```typescript
'use client'

import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

export default function LoginPage() {
  const onSubmit = async (data) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl: '/admin/dashboard'
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Login form */}
      </form>
    </div>
  )
}
```

**Tạo `app/admin/layout.tsx`:**
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login')
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
```

### Day 2: Admin Sidebar

**Tạo `components/layout/AdminSidebar.tsx`:**
```typescript
import Link from 'next/link'
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Image, 
  Video,
  MessageSquare,
  Users,
  Settings 
} from 'lucide-react'

export function AdminSidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: FileText, label: 'Bài viết', href: '/admin/posts' },
    { icon: FolderOpen, label: 'Danh mục', href: '/admin/categories' },
    { icon: Image, label: 'Slides', href: '/admin/slides' },
    { icon: Video, label: 'Videos', href: '/admin/videos' },
    { icon: FileText, label: 'Dự án', href: '/admin/projects' },
    { icon: MessageSquare, label: 'Góp ý', href: '/admin/feedback' },
    { icon: Users, label: 'Người dùng', href: '/admin/users' },
    { icon: Settings, label: 'Cài đặt', href: '/admin/settings' },
  ]

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav>
        {menuItems.map(item => (
          <Link 
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800"
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

### Day 3: Dashboard

**Tạo `app/admin/dashboard/page.tsx`:**
```typescript
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminDashboard() {
  const [postsCount, usersCount, projectsCount, feedbackCount] = await Promise.all([
    db.post.count(),
    db.user.count(),
    db.project.count(),
    db.feedback.count({ where: { status: 'pending' } })
  ])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Bài viết" value={postsCount} />
        <StatsCard title="Người dùng" value={usersCount} />
        <StatsCard title="Dự án" value={projectsCount} />
        <StatsCard title="Góp ý chờ" value={feedbackCount} />
      </div>
    </div>
  )
}
```

### Day 4-5: Install shadcn/ui Components

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add table
npx shadcn@latest add toast
npx shadcn@latest add form
```

### Checklist Week 7:
- [ ] Admin login working
- [ ] Admin layout with sidebar
- [ ] Dashboard with stats
- [ ] shadcn/ui components installed
- [ ] Can navigate admin panel

---

## 🎯 WEEK 8: Admin Panel - Part 2

### Day 1-2: Posts Management

**Tạo `app/admin/posts/page.tsx`:**
- List all posts
- Data table with actions
- Delete functionality

**Tạo `app/admin/posts/create/page.tsx`:**
- Create new post form
- Rich text editor (TipTap)
- Image upload
- Category selection

**Tạo `app/admin/posts/[id]/edit/page.tsx`:**
- Edit post form
- Pre-filled data

**Install TipTap:**
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image
```

### Day 3: Categories Management

**Tạo `app/admin/categories/page.tsx`:**
- List categories
- Inline create/edit
- Delete

### Day 4: Slides Management

**Tạo `app/admin/slides/page.tsx`:**
- List slides
- Drag & drop reorder
- Create/Edit dialog

### Day 5: Videos Management

**Tạo `app/admin/videos/page.tsx`:**
- List videos
- Create/Edit form
- YouTube URL embedding

### Checklist Week 8:
- [ ] Posts CRUD complete
- [ ] Categories CRUD complete
- [ ] Slides CRUD complete
- [ ] Videos CRUD complete
- [ ] Rich text editor working
- [ ] Image upload working

---

## 🎯 WEEK 9: Admin Panel - Part 3 & Testing

### Day 1: Projects Management
- `app/admin/projects/page.tsx`
- Similar to posts management
- PDF upload

### Day 2: Feedback Management
- `app/admin/feedback/page.tsx`
- List feedback
- Reply functionality
- Status update

### Day 3: Users Management
- `app/admin/users/page.tsx`
- List users
- Create/Edit users
- Role management

### Day 4: Settings
- `app/admin/settings/page.tsx`
- Site settings form
- Logo upload
- Save to database

### Day 5: Full Testing
- [ ] Test all public pages
- [ ] Test all admin pages
- [ ] Test create/edit/delete for all entities
- [ ] Test authentication
- [ ] Test file uploads
- [ ] Test validation
- [ ] Fix bugs

### Checklist Week 9:
- [ ] All admin features complete
- [ ] All features tested
- [ ] No major bugs
- [ ] Ready for deployment

---

## 🎯 WEEK 10: Optimization & Deployment

### Day 1-2: Performance Optimization

**Image Optimization:**
```typescript
// Use Next.js Image component everywhere
import Image from 'next/image'

<Image
  src={post.cover_image}
  alt={post.title}
  width={800}
  height={400}
  priority={index < 2} // Priority for first 2 images
/>
```

**Static Generation:**
```typescript
// For posts
export async function generateStaticParams() {
  const posts = await db.post.findMany({
    where: { status: 'published' },
    select: { slug: true }
  })

  return posts.map(post => ({
    slug: post.slug
  }))
}
```

**Metadata:**
```typescript
// Add to all pages
export const metadata = {
  title: 'Trang chủ',
  description: 'Cổng thông tin...',
  openGraph: {
    images: ['/og-image.jpg']
  }
}
```

### Day 3: SEO & Accessibility

- [ ] Add meta tags to all pages
- [ ] Add structured data (JSON-LD)
- [ ] Check accessibility with Lighthouse
- [ ] Add alt text to all images
- [ ] Proper heading hierarchy

### Day 4-5: Deployment

**Option 1: Vercel (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
```

**Option 2: Docker + VPS**

**Tạo `Dockerfile`:**
```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

**Tạo `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://user:pass@db:3306/demo123_db
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=https://yourdomain.com
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: demo123_db
      MYSQL_USER: user
      MYSQL_PASSWORD: pass
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

**Deploy:**
```bash
# Build and run
docker-compose up -d

# Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/demo123

# SSL with Let's Encrypt
sudo certbot --nginx -d yourdomain.com
```

### Checklist Week 10:
- [ ] Performance optimized
- [ ] SEO implemented
- [ ] Deployed to production
- [ ] SSL configured
- [ ] Database migrated
- [ ] Final testing on production
- [ ] Monitoring setup
- [ ] Go live! 🎉

---

## ✅ Final Verification Checklist

### Functionality
- [ ] All public pages working
- [ ] All admin features working
- [ ] Authentication working
- [ ] File uploads working
- [ ] Forms validation working
- [ ] Search working
- [ ] Pagination working

### Performance
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Fast page transitions

### SEO
- [ ] Meta tags on all pages
- [ ] Open Graph tags
- [ ] Structured data
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured

### Security
- [ ] HTTPS enabled
- [ ] Auth properly secured
- [ ] No exposed secrets
- [ ] SQL injection protected (Prisma)
- [ ] XSS protected (React)
- [ ] CSRF protected (NextAuth)

### Monitoring
- [ ] Error tracking (Sentry?)
- [ ] Analytics (Google Analytics?)
- [ ] Performance monitoring
- [ ] Database backups automated

---

## 🎉 Congratulations!

Nếu bạn hoàn thành tất cả các bước trên, project của bạn đã được migrate thành công sang Next.js!

### Next Steps:
1. Monitor production for bugs
2. Gather user feedback
3. Iterate and improve
4. Add new features
5. Keep dependencies updated

---

**Good luck! 🚀**
