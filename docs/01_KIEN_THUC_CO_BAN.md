# 01. KIẾN THỨC CƠ BẢN - Tất Cả Khái Niệm Bạn Cần Biết

> ⏱️ **Thời gian đọc**: 60-90 phút  
> 🎯 **Mục tiêu**: Hiểu 100% các công nghệ dùng trong project

---

## 📘 MỤC LỤC

1. [Next.js là gì?](#1-nextjs-là-gì)
2. [React Server vs Client Components](#2-react-server-vs-client-components)
3. [Prisma ORM](#3-prisma-orm)
4. [NextAuth.js Authentication](#4-nextauthjs-authentication)
5. [Docker & Docker Compose](#5-docker--docker-compose)
6. [TypeScript Cơ Bản](#6-typescript-cơ-bản)
7. [Tailwind CSS](#7-tailwind-css)
8. [Zod Validation](#8-zod-validation)

---

## 1. Next.js là gì?

### 1.1. React Cơ Bản - Cho Người Hoàn Toàn Mới

#### React là gì?

**React** = Thư viện JavaScript để **xây dựng giao diện người dùng** (UI)

**Ví dụ dễ hiểu:**

```
Trang web truyền thống (HTML tĩnh):
- Muốn đổi nội dung → Phải reload cả trang
- Giống như xem tivi, chỉ xem thôi, không tương tác

React (Trang web động):
- Đổi nội dung mà không reload trang
- Giống như chơi game, click là phản hồi ngay
```

#### Component là gì?

Component = **Mảnh ghép UI có thể tái sử dụng**

```jsx
// Component Button (viết 1 lần, dùng nhiều lần)
function Button() {
  return <button>Click me</button>
}

// Sử dụng
<Button />  // Tạo button 1
<Button />  // Tạo button 2
<Button />  // Tạo button 3
```

**Ví dụ thực tế:**
```
Website = Lego House
Component = Các mảnh Lego

Header Component     ┐
Sidebar Component    ├─→ Ghép lại thành Website hoàn chỉnh
Content Component    │
Footer Component     ┘
```

#### React Component Cơ Bản

```jsx
// Component hiển thị tên
function Greeting() {
  const name = "An"
  
  return (
    <div>
      <h1>Xin chào, {name}!</h1>
      <p>Chào mừng đến với website</p>
    </div>
  )
}
```

#### State - Trạng thái của Component

**State** = Dữ liệu có thể thay đổi, khi thay đổi → UI tự động cập nhật

```jsx
import { useState } from 'react'

function Counter() {
  // State: count ban đầu = 0
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Bạn đã click: {count} lần</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
```

**Giải thích:**
1. `useState(0)` = Tạo biến `count` với giá trị ban đầu = 0
2. `setCount(count + 1)` = Tăng count lên 1
3. UI tự động hiển thị số mới (không cần reload trang)

#### Props - Truyền Dữ Liệu Giữa Components

**Props** = Cách truyền dữ liệu từ component cha → component con

```jsx
// Component con nhận props
function UserCard({ name, age, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Tuổi: {age}</p>
      <p>Email: {email}</p>
    </div>
  )
}

// Component cha truyền props
function App() {
  return (
    <div>
      <UserCard name="An" age={25} email="an@example.com" />
      <UserCard name="Bình" age={30} email="binh@example.com" />
    </div>
  )
}
```

**Ví dụ thực tế:**
```
Props giống như điền form:
UserCard = Form mẫu (template)
Props = Thông tin điền vào (name, age, email)
```

#### React Hooks - Công Cụ Mạnh Mẽ

**Hooks** = Các hàm đặc biệt để thêm tính năng cho component

**Hook thường dùng:**

1. **useState** - Quản lý state
```jsx
const [isOpen, setIsOpen] = useState(false)
```

2. **useEffect** - Chạy code khi component render
```jsx
useEffect(() => {
  // Code chạy khi component xuất hiện
  console.log('Component đã render')
}, [])
```

3. **useRouter** (Next.js) - Điều hướng trang
```jsx
const router = useRouter()
router.push('/login')  // Chuyển sang trang login
```

#### Vấn Đề Của React Thuần

Khi dùng React thuần (Create React App), bạn phải tự làm:

```
❌ Routing (chuyển trang)
   → Phải cài React Router
   → Phải config routes thủ công

❌ SEO (Google tìm được website)
   → React render ở browser → Google không thấy nội dung
   → Phải cài thêm tool như React Helmet

❌ API Routes (Backend)
   → Không có backend → Phải tạo server riêng (Express, NestJS...)

❌ Image Optimization
   → Ảnh load chậm → Phải tự optimize

❌ Performance
   → Code splitting thủ công
   → Lazy loading thủ công
```

**Ví dụ thực tế:**

```jsx
// React thuần - Phải cài React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

// Phải config thủ công, dễ lỗi
```

### 1.2. Next.js = React + Siêu Năng Lực

**Next.js** = React Framework với **mọi thứ đã setup sẵn**

```
React (thư viện)  →  Next.js (framework đầy đủ)
Giống như:
Bột mì (React)    →  Bánh mì sandwich đóng gói sẵn (Next.js)
Động cơ xe        →  Xe hơi hoàn chỉnh
```

**Định nghĩa đơn giản:**
- **React** = Công cụ để xây UI
- **Next.js** = React + Routing + SEO + Backend + Performance

### 1.3. Tại Sao Dùng Next.js Thay Vì React Thuần?

#### So Sánh Chi Tiết

| Tính Năng | React Thuần (CRA) | Next.js | Giải Thích |
|-----------|-------------------|---------|------------|
| **Routing** | ❌ Tự cài React Router | ✅ Có sẵn (file-based) | Next.js: Tạo file `page.tsx` = tự động có route |
| **SEO** | ❌ Kém | ✅ Tốt | Next.js render HTML trên server → Google đọc được |
| **Performance** | ❌ Chậm (client render) | ✅ Nhanh (server render) | Next.js gửi HTML sẵn → hiển thị ngay |
| **API Routes** | ❌ Cần Backend riêng | ✅ Có sẵn | Next.js: Tạo `route.ts` = có API endpoint |
| **Image** | ❌ `<img>` thường | ✅ `<Image>` tối ưu | Next.js tự resize, lazy load, WebP |
| **Code Splitting** | ❌ Phải config | ✅ Tự động | Next.js tự chia nhỏ code → load nhanh hơn |
| **Setup Time** | ❌ 1-2 ngày | ✅ 10 phút | Next.js có sẵn mọi thứ |

#### Ví Dụ Cụ Thể

**1. Routing (Chuyển Trang)**

```jsx
// ❌ React thuần - Phải cài react-router-dom
npm install react-router-dom

// App.jsx - Phải config thủ công
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </BrowserRouter>
  )
}

// ✅ Next.js - Tạo file = tự động có route
app/
  page.tsx              → localhost:3000/
  about/
    page.tsx            → localhost:3000/about
  posts/
    page.tsx            → localhost:3000/posts

// Không cần config gì cả!
```

**2. SEO (Google Tìm Kiếm)**

```jsx
// ❌ React thuần - Google không thấy nội dung
// HTML ban đầu:
<div id="root"></div>  ← Rỗng!

// JavaScript chạy xong mới có nội dung
// → Google crawler không đợi → SEO kém

// ✅ Next.js - HTML có sẵn nội dung
<div>
  <h1>Bài viết về Next.js</h1>
  <p>Nội dung đầy đủ...</p>
</div>

// → Google đọc được ngay → SEO tốt
```

**3. API Routes**

```jsx
// ❌ React thuần - Phải tạo server riêng
// Backend (Express.js):
const express = require('express')
const app = express()

app.get('/api/posts', async (req, res) => {
  const posts = await db.query('SELECT * FROM posts')
  res.json(posts)
})

app.listen(4000)

// Frontend (React):
fetch('http://localhost:4000/api/posts')

// ✅ Next.js - API Routes tích hợp sẵn
// app/api/posts/route.ts
export async function GET() {
  const posts = await db.post.findMany()
  return Response.json(posts)
}

// Frontend (cùng project):
fetch('/api/posts')  // Gọn gàng!
```

**4. Fetch Data**

```jsx
// ❌ React thuần - Phải dùng useEffect
function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {posts.map(post => <div key={post.id}>{post.title}</div>)}
    </div>
  )
}

// ✅ Next.js - Fetch trực tiếp (Server Component)
async function Posts() {
  const posts = await db.post.findMany()  // Gọn gàng!
  
  return (
    <div>
      {posts.map(post => <div key={post.id}>{post.title}</div>)}
    </div>
  )
}

// Không cần useState, useEffect, loading state!
```

### 1.4. Next.js App Router (v13+)

Dự án này dùng **App Router** (mới nhất), không phải Pages Router (cũ).

#### Cấu Trúc Folder = Routes

```
app/
  ├── page.tsx              → localhost:3000/
  ├── tin-tuc/
  │   └── page.tsx          → localhost:3000/tin-tuc
  ├── du-an/
  │   ├── page.tsx          → localhost:3000/du-an
  │   └── [slug]/
  │       └── page.tsx      → localhost:3000/du-an/du-an-1
  └── admin/
      ├── layout.tsx        → Layout cho /admin/*
      └── posts/
          └── page.tsx      → localhost:3000/admin/posts
```

**Quy tắc vàng**:
- `page.tsx` = 1 route
- `layout.tsx` = wrapper cho nhiều pages
- `[slug]` = dynamic route (slug là biến)

### 1.5. File Đặc Biệt Trong App Router

| File | Mục Đích | Ví Dụ Thực Tế |
|------|----------|----------------|
| `page.tsx` | Nội dung chính của route | Trang danh sách tin tức |
| `layout.tsx` | Bọc nhiều pages (header, footer) | Layout admin có sidebar |
| `loading.tsx` | UI khi đang load data | Hiển thị skeleton khi fetch posts |
| `error.tsx` | UI khi có lỗi | Hiển thị "Đã xảy ra lỗi" |
| `not-found.tsx` | UI khi không tìm thấy | Trang 404 |
| `route.ts` | API endpoint (Backend) | API lấy danh sách posts |

**Ví dụ cụ thể:**

```
app/admin/posts/
  ├── page.tsx          → Hiển thị danh sách posts
  ├── loading.tsx       → Hiển thị khi đang load
  ├── error.tsx         → Hiển thị khi lỗi
  └── not-found.tsx     → Hiển thị khi không có posts

Khi user vào /admin/posts:
1. Next.js hiển thị loading.tsx (vòng xoay loading)
2. Fetch data từ database
3. Nếu thành công → Hiển thị page.tsx (danh sách posts)
4. Nếu lỗi → Hiển thị error.tsx
5. Nếu không có data → Hiển thị not-found.tsx
```

### 1.6. Ví Dụ Thực Tế - So Sánh React vs Next.js

#### Ví Dụ 1: Trang Danh Sách Bài Viết

**React Thuần (Cách cũ):**

```jsx
// src/pages/Posts.jsx
import { useState, useEffect } from 'react'

function PostsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Fetch data khi component mount
  useEffect(() => {
    fetch('/api/posts')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])
  
  if (loading) return <div>Đang tải...</div>
  if (error) return <div>Lỗi: {error}</div>
  
  return (
    <div>
      <h1>Danh Sách Tin Tức</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  )
}

export default PostsPage
```

**Next.js (Cách mới):**

```tsx
// app/tin-tuc/page.tsx
import { db } from '@/lib/db'

export default async function TinTucPage() {
  // Fetch data TRỰC TIẾP từ database (không cần API)
  const posts = await db.post.findMany({
    orderBy: { created_at: 'desc' }
  })
  
  return (
    <div>
      <h1>Danh Sách Tin Tức</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  )
}
```

**So sánh:**
- React: 30 dòng code, phức tạp, nhiều state
- Next.js: 15 dòng code, đơn giản, không cần useState/useEffect

#### Ví Dụ 2: Routing (Chuyển Trang)

**React Thuần:**

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Posts from './pages/Posts'
import PostDetail from './pages/PostDetail'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Trang chủ</Link>
        <Link to="/posts">Tin tức</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:slug" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
```

**Next.js:**

```tsx
// Chỉ cần tạo folders và files:
app/
  page.tsx              → / (Trang chủ)
  tin-tuc/
    page.tsx            → /tin-tuc (Tin tức)
    [slug]/
      page.tsx          → /tin-tuc/bai-viet-1 (Chi tiết)

// Link giữa các trang:
import Link from 'next/link'

<Link href="/">Trang chủ</Link>
<Link href="/tin-tuc">Tin tức</Link>
```

**So sánh:**
- React: Phải config routes trong code, dễ lỗi
- Next.js: Tạo folder/file = tự động có route

### 1.7. Ví Dụ Thực Tế Dự Án Này

#### Page Đơn Giản (HTML Tĩnh)

```tsx
// app/gioi-thieu/page.tsx
export default function GioiThieuPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">Giới Thiệu</h1>
      <p className="mt-4">
        Đây là trang giới thiệu về công ty chúng tôi.
      </p>
    </div>
  )
}
```

→ Tự động tạo route: **http://localhost:3000/gioi-thieu**

**Giải thích:**
- Không cần config route
- Tạo file `app/gioi-thieu/page.tsx` = có route `/gioi-thieu`
- `className` = Tailwind CSS classes

#### Page Với Data Từ Database

```tsx
// app/tin-tuc/page.tsx
import { db } from '@/lib/db'
import Image from 'next/image'
import Link from 'next/link'

export default async function TinTucPage() {
  // ✅ Fetch TRỰC TIẾP từ database (không cần API)
  const posts = await db.post.findMany({
    where: { status: 'published' },
    include: {
      author: true,      // Lấy kèm thông tin tác giả
      category: true     // Lấy kèm thông tin danh mục
    },
    orderBy: { published_at: 'desc' },
    take: 10  // Lấy 10 bài mới nhất
  })
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Tin Tức Mới Nhất</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => (
          <article key={post.id} className="border rounded-lg p-4">
            {/* Ảnh cover */}
            {post.cover_image && (
              <Image
                src={post.cover_image}
                alt={post.title}
                width={600}
                height={400}
                className="rounded-lg mb-4"
              />
            )}
            
            {/* Danh mục */}
            <span className="text-sm text-blue-600">
              {post.category?.name}
            </span>
            
            {/* Tiêu đề */}
            <h2 className="text-xl font-bold mt-2">{post.title}</h2>
            
            {/* Tóm tắt */}
            <p className="text-gray-600 mt-2">{post.excerpt}</p>
            
            {/* Tác giả */}
            <p className="text-sm text-gray-500 mt-4">
              Bởi: {post.author.full_name}
            </p>
            
            {/* Link đọc thêm */}
            <Link 
              href={`/tin-tuc/${post.slug}`}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Đọc thêm →
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
```

**Điểm đặc biệt của Next.js:**

1. **Fetch trực tiếp từ DB** - Không cần tạo API riêng
2. **Code chạy trên SERVER** - Không gửi database query xuống browser
3. **HTML có sẵn nội dung** - SEO tốt, load nhanh
4. **Type-safe** - TypeScript biết `post` có những field gì

**So sánh với React thuần:**

```jsx
// ❌ React thuần - Phải làm thế này:

// 1. Tạo API riêng (Backend):
// server.js
app.get('/api/posts', async (req, res) => {
  const posts = await db.query('SELECT * FROM posts')
  res.json(posts)
})

// 2. Frontend - Fetch từ API:
function TinTucPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .finally(() => setLoading(false))
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}

// ✅ Next.js - Chỉ cần:
async function TinTucPage() {
  const posts = await db.post.findMany()
  return <div>{posts.map(...)}</div>
}

// Đơn giản hơn NHIỀU!
```

#### Dynamic Route (Route Động)

```tsx
// app/tin-tuc/[slug]/page.tsx
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

export default async function PostDetailPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // Lấy bài viết theo slug
  const post = await db.post.findUnique({
    where: { slug: params.slug }
  })
  
  // Nếu không tìm thấy → Hiển thị 404
  if (!post) {
    notFound()
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
```

**Cách hoạt động:**
- URL: `/tin-tuc/bai-viet-moi-nhat`
- `params.slug` = `"bai-viet-moi-nhat"`
- Next.js tìm post có slug này trong database
- Nếu có → Hiển thị
- Nếu không → Hiển thị trang 404

---

## 2. React Server vs Client Components

### 2.1. Khái Niệm

Trong Next.js App Router, có 2 loại component:

1. **Server Component** (mặc định)
2. **Client Component** (cần khai báo `'use client'`)

### 2.2. Server Component

#### Đặc Điểm:
- ✅ Chạy trên **server** (Node.js)
- ✅ Có thể fetch data trực tiếp từ database
- ✅ Không gửi JavaScript xuống browser → Nhanh hơn
- ❌ **KHÔNG** dùng được hooks (useState, useEffect)
- ❌ **KHÔNG** dùng được browser API (localStorage, window)
- ❌ **KHÔNG** dùng được event handlers (onClick, onChange)

#### Ví Dụ:

```tsx
// app/posts/page.tsx (Server Component - mặc định)
import { db } from '@/lib/db'

export default async function PostsPage() {
  // ✅ Fetch trực tiếp từ DB
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

### 2.3. Client Component

#### Đặc Điểm:
- ✅ Chạy trên **browser** (JavaScript)
- ✅ Dùng được hooks (useState, useEffect)
- ✅ Dùng được event handlers (onClick, onChange)
- ✅ Dùng được browser API
- ❌ **KHÔNG** fetch trực tiếp từ database (phải qua API)

#### Ví Dụ:

```tsx
'use client' // ← QUAN TRỌNG: Khai báo Client Component

import { useState } from 'react'

export function SearchForm() {
  const [query, setQuery] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle search
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <button type="submit">Tìm kiếm</button>
    </form>
  )
}
```

### 2.4. Khi Nào Dùng Cái Gì?

| Tình Huống | Dùng |
|------------|------|
| Fetch data từ database | ✅ Server Component |
| Hiển thị static content | ✅ Server Component |
| Có form với input (useState) | ❌ Client Component |
| Có button với onClick | ❌ Client Component |
| Dùng useEffect, useState | ❌ Client Component |
| Dùng localStorage, window | ❌ Client Component |
| Gọi API từ browser | ❌ Client Component |

### 2.5. Pattern Kết Hợp (Quan Trọng!)

**Tốt nhất**: Server Component (parent) chứa Client Component (child)

```tsx
// app/posts/page.tsx (Server Component)
import { db } from '@/lib/db'
import { SearchForm } from '@/components/SearchForm' // Client Component

export default async function PostsPage() {
  const posts = await db.post.findMany()
  
  return (
    <div>
      <h1>Tin Tức</h1>
      {/* Client Component cho search form */}
      <SearchForm />
      
      {/* Server Component cho hiển thị data */}
      <div>
        {posts.map(post => (
          <div key={post.id}>{post.title}</div>
        ))}
      </div>
    </div>
  )
}
```

---

## 3. Prisma ORM

### 3.1. ORM Là Gì?

**ORM** = Object-Relational Mapping

Dịch sang tiếng người: **Biến database table thành JavaScript object**

```
Database Table (MySQL)     →     JavaScript Object (TypeScript)
----------------------           ---------------------------
users (table)              →     db.user.findMany()
  ├── id (int)             →       { id: 1, name: "An" }
  ├── name (varchar)
  └── email (varchar)
```

### 3.2. Tại Sao Dùng Prisma?

#### Cách Cũ (SQL thuần):

```javascript
// ❌ Dễ lỗi, không có type-safe
const users = await db.query('SELECT * FROM users WHERE id = ?', [userId])
```

#### Cách Mới (Prisma):

```typescript
// ✅ Type-safe, autocomplete, dễ đọc
const user = await db.user.findUnique({
  where: { id: userId }
})
```

### 3.3. Prisma Schema

File quan trọng nhất: `prisma/schema.prisma`

```prisma
// prisma/schema.prisma

// 1. Datasource: Kết nối database nào?
datasource db {
  provider = "mysql"                    // Dùng MySQL
  url      = env("DATABASE_URL")        // Lấy từ .env
}

// 2. Generator: Tạo Prisma Client
generator client {
  provider = "prisma-client-js"
}

// 3. Models: Định nghĩa tables
model User {
  id         Int      @id @default(autoincrement())
  username   String   @unique
  password   String
  full_name  String
  email      String?
  role       UserRole @default(editor)
  created_at DateTime @default(now())
  
  // Relationship: 1 user có nhiều posts
  posts Post[]
  
  @@map("users")  // Tên table trong DB
}

model Post {
  id           Int      @id @default(autoincrement())
  title        String
  content      String   @db.Text
  slug         String   @unique
  status       PostStatus @default(draft)
  author_id    Int
  category_id  Int?
  created_at   DateTime @default(now())
  published_at DateTime?
  
  // Relationships
  author   User      @relation(fields: [author_id], references: [id])
  category Category? @relation(fields: [category_id], references: [id])
  
  @@map("posts")
}

// Enum: Giá trị cố định
enum PostStatus {
  draft
  published
  archived
}

enum UserRole {
  admin
  editor
}
```

### 3.4. Prisma Queries Cơ Bản

#### 3.4.1. CREATE (Tạo mới)

```typescript
// Tạo 1 user mới
const user = await db.user.create({
  data: {
    username: 'admin',
    password: 'hashed-password',
    full_name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  }
})
```

#### 3.4.2. READ (Đọc)

```typescript
// Lấy TẤT CẢ users
const allUsers = await db.user.findMany()

// Lấy 1 user theo ID
const user = await db.user.findUnique({
  where: { id: 1 }
})

// Lấy users với điều kiện
const admins = await db.user.findMany({
  where: { role: 'admin' }
})

// Lấy với quan hệ (include)
const userWithPosts = await db.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true  // Lấy kèm posts của user này
  }
})

// Pagination
const posts = await db.post.findMany({
  skip: 0,     // Bỏ qua 0 records
  take: 10,    // Lấy 10 records
  orderBy: { created_at: 'desc' }
})
```

#### 3.4.3. UPDATE (Cập nhật)

```typescript
// Update 1 user
const updatedUser = await db.user.update({
  where: { id: 1 },
  data: {
    full_name: 'New Name',
    email: 'newemail@example.com'
  }
})

// Update nhiều users
await db.user.updateMany({
  where: { role: 'editor' },
  data: { status: 'active' }
})
```

#### 3.4.4. DELETE (Xóa)

```typescript
// Xóa 1 user
await db.user.delete({
  where: { id: 1 }
})

// Xóa nhiều users
await db.user.deleteMany({
  where: { role: 'editor' }
})
```

### 3.5. Prisma Migrations

#### Migration Là Gì?

Migration = **Lịch sử thay đổi database schema**

```
Migration 1: Tạo table users
Migration 2: Thêm column email vào users
Migration 3: Tạo table posts
Migration 4: Thêm relationship users ↔ posts
```

#### Commands:

```bash
# Development: Push schema trực tiếp (không tạo migration file)
npx prisma db push

# Production: Tạo migration file
npx prisma migrate dev --name add_email_column

# Apply migrations to production
npx prisma migrate deploy

# Reset database (XÓA TẤT CẢ DATA!)
npx prisma migrate reset
```

---

## 4. NextAuth.js Authentication

### 4.1. NextAuth.js Là Gì?

**NextAuth.js** = Thư viện authentication cho Next.js

Giúp bạn làm:
- ✅ Login/Logout
- ✅ Session management
- ✅ Protected routes
- ✅ Social login (Google, Facebook, GitHub...)
- ✅ Email/Password login

### 4.2. Cấu Hình Cơ Bản

File quan trọng: `lib/auth.ts`

```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from './db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // 1. Providers: Cách đăng nhập
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null
        
        // Tìm user trong database
        const user = await db.user.findUnique({
          where: { username: credentials.username }
        })
        
        if (!user) return null
        
        // Kiểm tra password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        
        if (!isValid) return null
        
        // Trả về user object
        return {
          id: user.id.toString(),
          name: user.full_name,
          email: user.email,
          role: user.role
        }
      }
    })
  ],
  
  // 2. Callbacks: Customize session/token
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  
  // 3. Pages: Custom login page
  pages: {
    signIn: '/admin/login'
  },
  
  // 4. Session: Dùng JWT (không lưu DB)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  }
}
```

### 4.3. Login Flow

```
1. User điền form → Submit
   ↓
2. NextAuth gọi authorize() function
   ↓
3. authorize() kiểm tra username/password trong DB
   ↓
4. Nếu đúng → Tạo JWT token → Lưu vào cookie
   ↓
5. User được redirect về trang admin
```

### 4.4. Sử Dụng Session

#### Server Component:

```tsx
// app/admin/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/admin/login')
  }
  
  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
    </div>
  )
}
```

#### Client Component:

```tsx
'use client'

import { useSession } from 'next-auth/react'

export function UserProfile() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <div>Loading...</div>
  if (!session) return <div>Not logged in</div>
  
  return <div>Hello, {session.user.name}</div>
}
```

### 4.5. Protected Routes

#### Middleware:

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  }
})

export const config = {
  matcher: ['/admin/:path*']  // Protect all /admin routes
}
```

---

## 5. Docker & Docker Compose

### 5.1. Docker Là Gì?

**Docker** = Đóng gói ứng dụng + môi trường chạy vào 1 "hộp" (container)

**Ví dụ thực tế:**

```
Không có Docker:
- Dev A: Windows, Node 18, MySQL 8.0 → Code chạy OK
- Dev B: Mac, Node 20, MySQL 5.7 → Code lỗi ❌
- Server: Ubuntu, Node 16, MySQL 8.0 → Code lỗi ❌

Có Docker:
- Dev A, B, Server: Đều chạy cùng 1 Docker image
  → Code chạy giống hệt nhau ✅
```

### 5.2. Docker Concepts

#### 5.2.1. Image vs Container

```
Image = Blueprint (bản vẽ)
Container = House (ngôi nhà xây theo bản vẽ)

Ví dụ:
- mysql:8.0 (Image)
  → Chạy → mysql-container-1 (Container)
  → Chạy → mysql-container-2 (Container)
```

#### 5.2.2. Dockerfile

File để build Docker image:

```dockerfile
# Dockerfile

# 1. Base image: Nền tảng
FROM node:20-alpine

# 2. Working directory
WORKDIR /app

# 3. Copy files
COPY package*.json ./
COPY . .

# 4. Install dependencies
RUN npm install

# 5. Build app
RUN npm run build

# 6. Expose port
EXPOSE 3000

# 7. Start command
CMD ["npm", "start"]
```

### 5.3. Docker Compose

**docker-compose.yml** = Chạy nhiều containers cùng lúc

```yaml
# docker-compose.yml

version: '3.8'

services:
  # 1. MySQL Database
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: demo123_db
      MYSQL_USER: demo123_user
      MYSQL_PASSWORD: demo123_pass
    ports:
      - "3307:3306"  # Host:Container
    volumes:
      - mysql_data:/var/lib/mysql
  
  # 2. Next.js App
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "mysql://demo123_user:demo123_pass@db:3306/demo123_db"
    depends_on:
      - db

volumes:
  mysql_data:
```

### 5.4. Docker Commands

```bash
# Build image
docker build -t my-app .

# Run container
docker run -p 3000:3000 my-app

# Docker Compose
docker-compose up -d        # Start all services
docker-compose down         # Stop all services
docker-compose logs -f app  # View logs
docker-compose ps           # List running containers

# Container management
docker ps                   # List running containers
docker stop <container-id>  # Stop container
docker rm <container-id>    # Remove container
docker exec -it <id> bash   # SSH into container
```

---

## 6. TypeScript Cơ Bản

### 6.1. TypeScript Là Gì?

**TypeScript** = JavaScript + Types (Kiểu dữ liệu)

```typescript
// JavaScript (không biết kiểu)
function add(a, b) {
  return a + b
}
add(1, 2)       // 3 ✅
add("1", "2")   // "12" ❌ (không như mong đợi)

// TypeScript (có kiểu)
function add(a: number, b: number): number {
  return a + b
}
add(1, 2)       // 3 ✅
add("1", "2")   // ❌ Compile error!
```

### 6.2. Types Cơ Bản

```typescript
// Primitives
let name: string = "An"
let age: number = 25
let isActive: boolean = true
let nothing: null = null
let notDefined: undefined = undefined

// Arrays
let numbers: number[] = [1, 2, 3]
let names: string[] = ["An", "Binh"]

// Objects
let user: {
  name: string
  age: number
  email?: string  // Optional (có thể không có)
} = {
  name: "An",
  age: 25
}

// Functions
function greet(name: string): string {
  return `Hello, ${name}`
}

// Arrow functions
const add = (a: number, b: number): number => a + b
```

### 6.3. Interfaces & Types

```typescript
// Interface: Định nghĩa object shape
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor'  // Union type
}

// Type alias
type UserRole = 'admin' | 'editor'
type UserId = number

// Sử dụng
const user: User = {
  id: 1,
  name: "An",
  email: "an@example.com",
  role: "admin"
}
```

### 6.4. Generics (Nâng Cao)

```typescript
// Generic: Tái sử dụng với nhiều types
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0]
}

const firstNumber = getFirst<number>([1, 2, 3])  // number
const firstName = getFirst<string>(['a', 'b'])   // string
```

---

## 7. Tailwind CSS

### 7.1. Tailwind Là Gì?

**Tailwind CSS** = Utility-first CSS framework

Thay vì viết CSS:

```css
/* style.css */
.button {
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}
```

Dùng classes:

```html
<button class="bg-blue-600 text-white px-4 py-2 rounded">
  Click me
</button>
```

### 7.2. Common Classes

```html
<!-- Colors -->
<div class="bg-blue-500 text-white">Blue background, white text</div>

<!-- Spacing -->
<div class="p-4 m-2">Padding 1rem, Margin 0.5rem</div>
<div class="px-6 py-3">Padding X=1.5rem, Y=0.75rem</div>

<!-- Layout -->
<div class="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>

<!-- Typography -->
<h1 class="text-2xl font-bold">Heading</h1>
<p class="text-sm text-gray-600">Small gray text</p>

<!-- Responsive -->
<div class="w-full md:w-1/2 lg:w-1/3">
  Mobile: full width
  Tablet: half width
  Desktop: 1/3 width
</div>

<!-- Hover, Focus -->
<button class="bg-blue-500 hover:bg-blue-700 focus:ring-2">
  Hover me
</button>
```

---

## 8. Zod Validation

### 8.1. Zod Là Gì?

**Zod** = Schema validation library

Kiểm tra dữ liệu có đúng format không.

```typescript
import { z } from 'zod'

// Định nghĩa schema
const userSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().min(18),
  role: z.enum(['admin', 'editor'])
})

// Validate data
const result = userSchema.safeParse({
  username: 'an',
  email: 'invalid-email',
  age: 17,
  role: 'admin'
})

if (!result.success) {
  console.log(result.error.errors)
  // [
  //   { path: ['username'], message: 'String must contain at least 3 characters' },
  //   { path: ['email'], message: 'Invalid email' },
  //   { path: ['age'], message: 'Number must be greater than or equal to 18' }
  // ]
}
```

### 8.2. Ví Dụ Trong Dự Án

```typescript
// lib/validations.ts
import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(255),
  content: z.string().min(1, "Nội dung không được để trống"),
  excerpt: z.string().max(500).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  category_id: z.number().int().positive().optional().nullable()
})

// Type inference
export type PostFormData = z.infer<typeof postSchema>
// PostFormData = {
//   title: string
//   content: string
//   excerpt?: string
//   status: 'draft' | 'published' | 'archived'
//   category_id?: number | null
// }
```

---

## 🎯 Tổng Kết

Sau khi đọc xong phần này, bạn đã hiểu:

✅ Next.js App Router và file-based routing  
✅ Server Component vs Client Component  
✅ Prisma ORM và cách query database  
✅ NextAuth.js authentication flow  
✅ Docker containerization  
✅ TypeScript type system  
✅ Tailwind CSS utility classes  
✅ Zod schema validation  

### Tiếp Theo

→ Đọc **[02_CAU_TRUC_THU_MUC.md](./02_CAU_TRUC_THU_MUC.md)** để biết file nào ở đâu!

---

**Chúc mừng! Bạn đã hoàn thành phần cơ bản! 🎉**
