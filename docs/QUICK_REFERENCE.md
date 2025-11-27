# 📋 Quick Reference: Common Tasks Migration

## 🔧 Các Task Thường Gặp

### 1. Tạo API Endpoint Mới

**Express (Old):**
```javascript
// server/routes/example.js
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const data = await db.query('SELECT * FROM table');
  res.json({ success: true, data });
});

module.exports = router;
```

**Next.js (New):**
```typescript
// app/api/example/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const data = await db.table.findMany()
  return NextResponse.json({ success: true, data })
}
```

---

### 2. Fetch Data trong Component

**Express (Old):**
```javascript
// public/script.js
fetch('/api/posts')
  .then(res => res.json())
  .then(data => {
    document.getElementById('posts').innerHTML = 
      data.posts.map(p => `<div>${p.title}</div>`).join('')
  })
```

**Next.js (New - Server Component):**
```typescript
// app/posts/page.tsx
import { db } from '@/lib/db'

export default async function PostsPage() {
  const posts = await db.post.findMany()
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

**Next.js (New - Client Component với React Query):**
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'

export default function PostsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts')
      return res.json()
    }
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {data.posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

---

### 3. Authentication Check

**Express (Old):**
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
```

**Next.js (New):**
```typescript
// app/admin/posts/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminPostsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login')
  }

  return <div>Admin Posts Page</div>
}
```

---

### 4. Form Submission

**Express (Old):**
```html
<!-- HTML -->
<form id="myForm">
  <input name="title" required />
  <button type="submit">Submit</button>
</form>

<script>
document.getElementById('myForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData))
  });
  
  if (res.ok) alert('Success!');
});
</script>
```

**Next.js (New):**
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const schema = z.object({
  title: z.string().min(1, 'Title is required')
})

type FormData = z.infer<typeof schema>

export default function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (res.ok) alert('Success!')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('title')} />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

---

### 5. File Upload

**Express (Old):**
```javascript
// server/routes/upload.js
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ path: req.file.path });
});
```

**Next.js (New với UploadThing):**
```typescript
// app/api/uploadthing/core.ts
import { createUploadthing } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete:", file.url)
      return { url: file.url }
    })
}

// app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "./core"

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})

// Component
'use client'

import { UploadButton } from "@/utils/uploadthing"

export default function UploadComponent() {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        console.log("Files:", res)
      }}
    />
  )
}
```

---

### 6. Database Query

**Express (Old):**
```javascript
// Raw SQL
const [posts] = await db.execute(`
  SELECT p.*, u.full_name as author_name 
  FROM posts p 
  LEFT JOIN users u ON p.author_id = u.id 
  WHERE p.status = ?
`, ['published']);
```

**Next.js (New với Prisma):**
```typescript
// Type-safe query
const posts = await db.post.findMany({
  where: { status: 'published' },
  include: {
    author: {
      select: { full_name: true }
    }
  }
})
```

---

### 7. Pagination

**Express (Old):**
```javascript
router.get('/posts', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  
  const [posts] = await db.execute(
    'SELECT * FROM posts LIMIT ? OFFSET ?',
    [limit, offset]
  );
  
  const [totalResult] = await db.execute('SELECT COUNT(*) as total FROM posts');
  const total = totalResult[0].total;
  
  res.json({
    posts,
    pagination: {
      page,
      totalPages: Math.ceil(total / limit)
    }
  });
});
```

**Next.js (New):**
```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 10
  
  const [posts, total] = await Promise.all([
    db.post.findMany({
      skip: (page - 1) * limit,
      take: limit
    }),
    db.post.count()
  ])
  
  return NextResponse.json({
    posts,
    pagination: {
      page,
      totalPages: Math.ceil(total / limit)
    }
  })
}
```

---

### 8. Middleware / Route Protection

**Express (Old):**
```javascript
// server/routes/admin.js
router.get('/admin/posts', authMiddleware, adminOnly, (req, res) => {
  // Handler
});
```

**Next.js (New):**
```typescript
// app/admin/posts/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminPostsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) redirect('/admin/login')
  if (session.user.role !== 'admin') redirect('/unauthorized')
  
  // Page content
  return <div>Admin Page</div>
}
```

**Or với Middleware:**
```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "admin"
      }
      return !!token
    }
  }
})

export const config = { matcher: ["/admin/:path*"] }
```

---

### 9. Environment Variables

**Express (Old):**
```javascript
// .env
DB_HOST=localhost
PORT=3000

// Usage
const port = process.env.PORT || 3000;
```

**Next.js (New):**
```bash
# .env
DATABASE_URL="mysql://..."
NEXT_PUBLIC_API_URL="http://localhost:3000"  # Public (client-side)
SECRET_KEY="secret"                          # Private (server-side only)
```

```typescript
// Server Component
const secretKey = process.env.SECRET_KEY

// Client Component
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

---

### 10. Routing

**Express (Old):**
```javascript
// server/index.js
app.get('/', (req, res) => res.sendFile('index.html'));
app.get('/posts/:slug', (req, res) => res.sendFile('post-detail.html'));
```

**Next.js (New):**
```
app/
  page.tsx              → /
  posts/
    page.tsx            → /posts
    [slug]/
      page.tsx          → /posts/:slug
```

---

## 🎯 Migration Pattern Summary

| Task | Express | Next.js |
|------|---------|---------|
| **API Route** | `routes/*.js` | `app/api/*/route.ts` |
| **Page** | `public/*.html` | `app/*/page.tsx` |
| **Database** | Raw SQL | Prisma ORM |
| **Auth** | JWT + Middleware | NextAuth.js |
| **Form** | Vanilla JS | React Hook Form + Zod |
| **Upload** | Multer | UploadThing/Cloudinary |
| **Validation** | Manual | Zod schemas |
| **State** | Fetch API | React Query |
| **Routing** | Express Router | File-based |

---

## 📚 Quick Links

- **Full Migration Guide**: `MIGRATION_TO_NEXTJS.md`
- **Implementation Guide**: `NEXTJS_IMPLEMENTATION_GUIDE.md`
- **Summary**: `MIGRATION_SUMMARY.md`

---

**Use this as a quick reference when converting code from Express to Next.js!**
