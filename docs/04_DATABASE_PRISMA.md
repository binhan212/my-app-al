# 04. DATABASE & PRISMA ORM - Chi Tiết Đầy Đủ

> ⏱️ **Thời gian đọc**: 90-120 phút  
> 🎯 **Mục tiêu**: Hiểu 100% schema database, relationships, và Prisma queries

---

## 📘 MỤC LỤC

1. [Database Schema Overview](#1-database-schema-overview)
2. [Chi Tiết Từng Table](#2-chi-tiết-từng-table)
3. [Relationships (Quan Hệ)](#3-relationships-quan-hệ)
4. [Prisma Client Queries](#4-prisma-client-queries)
5. [Migrations & Seeding](#5-migrations--seeding)
6. [Best Practices](#6-best-practices)

---

## 1. Database Schema Overview

### 1.1. Danh Sách Tables

Project có **12 tables** chính:

| Table | Mục Đích | Số Columns | Relationships |
|-------|----------|------------|---------------|
| `users` | Quản lý user (admin/editor) | 10 | → posts, media, feedback |
| `categories` | Danh mục (posts & projects) | 7 | ↔ posts, projects, self |
| `posts` | Bài viết/Tin tức | 12 | ← users, categories, tags |
| `about` | Trang giới thiệu | 5 | Standalone |
| `tags` | Tags cho posts | 3 | ↔ posts (many-to-many) |
| `post_tags` | Pivot table posts-tags | 2 | Join table |
| `projects` | Dự án quy hoạch | 11 | ← categories |
| `slides` | Carousel slideshow | 8 | Standalone |
| `videos` | Video library | 9 | Standalone |
| `media` | File uploads | 8 | ← users |
| `settings` | Site settings | 11 | Singleton |
| `feedback` | Ý kiến người dùng | 11 | ← users |

### 1.2. ERD (Entity Relationship Diagram)

```
┌─────────────┐
│   users     │
│  (admin)    │
└──────┬──────┘
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌────────────┐      ┌──────────┐
│   posts    │◄─────┤categories│
└─────┬──────┘      └────┬─────┘
      │                  │
      │                  ▼
      │            ┌──────────┐
      │            │ projects │
      │            └──────────┘
      │
      ▼
┌──────────┐      ┌──────┐
│post_tags │◄────►│ tags │
└──────────┘      └──────┘

Standalone Tables:
┌────────┐  ┌────────┐  ┌──────────┐  ┌──────────┐
│ slides │  │ videos │  │ settings │  │ feedback │
└────────┘  └────────┘  └──────────┘  └──────────┘
```

---

## 2. Chi Tiết Từng Table

### 2.1. Table `users`

**Mục đích**: Quản lý tài khoản admin và editor

#### Schema

```prisma
model User {
  id            Int       @id @default(autoincrement())
  username      String    @unique @db.VarChar(50)
  email         String    @unique @db.VarChar(100)
  password_hash String    @db.VarChar(255)
  full_name     String?   @db.VarChar(100)
  avatar        String?   @db.VarChar(255)
  role          UserRole  @default(user)
  status        UserStatus @default(active)
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt

  posts         Post[]
  media         Media[]
  feedback_replies Feedback[] @relation("FeedbackReplies")

  @@map("users")
}

enum UserRole {
  admin
  editor
  user
}

enum UserStatus {
  active
  inactive
}
```

#### Chi Tiết Columns

| Column | Type | Required | Unique | Mô Tả |
|--------|------|----------|--------|-------|
| `id` | Int | ✅ | ✅ | Primary key, auto-increment |
| `username` | String(50) | ✅ | ✅ | Tên đăng nhập |
| `email` | String(100) | ✅ | ✅ | Email (phải unique) |
| `password_hash` | String(255) | ✅ | ❌ | Mật khẩu đã hash (bcrypt) |
| `full_name` | String(100) | ❌ | ❌ | Họ tên đầy đủ |
| `avatar` | String(255) | ❌ | ❌ | URL ảnh đại diện |
| `role` | Enum | ✅ | ❌ | admin, editor, user |
| `status` | Enum | ✅ | ❌ | active, inactive |
| `created_at` | DateTime | ✅ | ❌ | Ngày tạo (auto) |
| `updated_at` | DateTime | ✅ | ❌ | Ngày cập nhật (auto) |

#### Business Rules

1. **Password**:
   - Lưu dưới dạng hash (bcrypt)
   - Không bao giờ lưu plaintext
   - Min 8 ký tự khi tạo

2. **Role**:
   - `admin`: Full quyền
   - `editor`: Tạo/sửa content
   - `user`: Chỉ xem (không dùng trong hệ thống admin)

3. **Status**:
   - `active`: Có thể đăng nhập
   - `inactive`: Bị khóa

#### Query Examples

```typescript
// Tìm user theo username
const user = await db.user.findUnique({
  where: { username: 'admin' }
})

// Lấy user kèm posts
const userWithPosts = await db.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      orderBy: { created_at: 'desc' },
      take: 10
    }
  }
})

// Tạo user mới
const newUser = await db.user.create({
  data: {
    username: 'editor1',
    email: 'editor@example.com',
    password_hash: await bcrypt.hash('password123', 10),
    full_name: 'Editor One',
    role: 'editor',
    status: 'active'
  }
})

// Update user
await db.user.update({
  where: { id: 1 },
  data: {
    full_name: 'New Name',
    avatar: '/uploads/avatar.jpg'
  }
})

// Đếm users theo role
const adminCount = await db.user.count({
  where: { role: 'admin' }
})
```

---

### 2.2. Table `categories`

**Mục đích**: Phân loại posts và projects (hỗ trợ hierarchy)

#### Schema

```prisma
model Category {
  id            Int       @id @default(autoincrement())
  name          String    @db.VarChar(100)
  slug          String    @unique @db.VarChar(100)
  description   String?   @db.Text
  parent_id     Int?
  display_order Int       @default(0)
  created_at    DateTime  @default(now())

  parent        Category?  @relation("CategoryHierarchy", fields: [parent_id], references: [id], onDelete: SetNull)
  children      Category[] @relation("CategoryHierarchy")
  posts         Post[]
  projects      Project[]

  @@map("categories")
}
```

#### Chi Tiết Columns

| Column | Type | Required | Unique | Mô Tả |
|--------|------|----------|--------|-------|
| `id` | Int | ✅ | ✅ | Primary key |
| `name` | String(100) | ✅ | ❌ | Tên danh mục |
| `slug` | String(100) | ✅ | ✅ | URL-friendly (vd: "tin-tuc") |
| `description` | Text | ❌ | ❌ | Mô tả danh mục |
| `parent_id` | Int | ❌ | ❌ | ID danh mục cha (null = root) |
| `display_order` | Int | ✅ | ❌ | Thứ tự hiển thị |
| `created_at` | DateTime | ✅ | ❌ | Ngày tạo |

#### Self-Referencing Relationship

```
Danh mục cha
  ├── Danh mục con 1
  ├── Danh mục con 2
  └── Danh mục con 3
      ├── Danh mục cháu 1
      └── Danh mục cháu 2
```

**Ví dụ thực tế**:

```
Tin Tức (parent_id: null)
  ├── Thời sự (parent_id: 1)
  ├── Chính sách (parent_id: 1)
  └── Sự kiện (parent_id: 1)

Dự Án (parent_id: null)
  ├── Quy hoạch vùng (parent_id: 2)
  └── Quy hoạch đô thị (parent_id: 2)
```

#### Query Examples

```typescript
// Lấy tất cả categories root (không có parent)
const rootCategories = await db.category.findMany({
  where: { parent_id: null },
  orderBy: { display_order: 'asc' }
})

// Lấy category kèm children
const categoryWithChildren = await db.category.findUnique({
  where: { id: 1 },
  include: {
    children: {
      orderBy: { display_order: 'asc' }
    }
  }
})

// Lấy category kèm parent
const categoryWithParent = await db.category.findUnique({
  where: { slug: 'thoi-su' },
  include: {
    parent: true
  }
})

// Lấy category kèm posts
const categoryWithPosts = await db.category.findUnique({
  where: { slug: 'tin-tuc' },
  include: {
    posts: {
      where: { status: 'published' },
      orderBy: { published_at: 'desc' },
      take: 10
    }
  }
})

// Tạo category mới
const newCategory = await db.category.create({
  data: {
    name: 'Tin Tức',
    slug: 'tin-tuc',
    description: 'Tin tức và sự kiện',
    display_order: 1
  }
})

// Tạo sub-category
const subCategory = await db.category.create({
  data: {
    name: 'Thời Sự',
    slug: 'thoi-su',
    parent_id: 1,  // ID của "Tin Tức"
    display_order: 1
  }
})
```

---

### 2.3. Table `posts`

**Mục đích**: Lưu bài viết/tin tức

#### Schema

```prisma
model Post {
  id           Int        @id @default(autoincrement())
  title        String     @db.VarChar(255)
  slug         String     @unique @db.VarChar(255)
  content      String     @db.LongText
  excerpt      String?    @db.Text
  cover_image  String?    @db.VarChar(255)
  author_id    Int
  category_id  Int?
  status       PostStatus @default(draft)
  views        Int        @default(0)
  published_at DateTime?
  created_at   DateTime   @default(now())
  updated_at   DateTime   @updatedAt

  author       User       @relation(fields: [author_id], references: [id], onDelete: Cascade)
  category     Category?  @relation(fields: [category_id], references: [id], onDelete: SetNull)
  tags         PostTag[]

  @@index([slug])
  @@index([status])
  @@index([published_at])
  @@map("posts")
}

enum PostStatus {
  draft
  published
  archived
}
```

#### Chi Tiết Columns

| Column | Type | Required | Unique | Mô Tả |
|--------|------|----------|--------|-------|
| `id` | Int | ✅ | ✅ | Primary key |
| `title` | String(255) | ✅ | ❌ | Tiêu đề bài viết |
| `slug` | String(255) | ✅ | ✅ | URL-friendly (auto từ title) |
| `content` | LongText | ✅ | ❌ | Nội dung HTML (rich text) |
| `excerpt` | Text | ❌ | ❌ | Tóm tắt ngắn |
| `cover_image` | String(255) | ❌ | ❌ | URL ảnh bìa |
| `author_id` | Int | ✅ | ❌ | Foreign key → users.id |
| `category_id` | Int | ❌ | ❌ | Foreign key → categories.id |
| `status` | Enum | ✅ | ❌ | draft, published, archived |
| `views` | Int | ✅ | ❌ | Số lượt xem |
| `published_at` | DateTime | ❌ | ❌ | Ngày xuất bản |
| `created_at` | DateTime | ✅ | ❌ | Ngày tạo |
| `updated_at` | DateTime | ✅ | ❌ | Ngày cập nhật |

#### Indexes

```prisma
@@index([slug])          // Tìm kiếm theo slug nhanh
@@index([status])        // Filter theo status nhanh
@@index([published_at])  // Sort theo ngày xuất bản nhanh
```

#### Business Rules

1. **Slug**:
   - Auto-generate từ title
   - Phải unique
   - Format: `bai-viet-moi-nhat`

2. **Status Workflow**:
   ```
   draft → published → archived
     ↑         ↓
     └─────────┘
   ```

3. **Published Date**:
   - `null` khi `status = draft`
   - Set datetime khi publish
   - Dùng để sort posts mới nhất

4. **Views**:
   - +1 mỗi lần view detail page
   - Không tính views từ admin

#### Query Examples

```typescript
// Lấy posts published, có phân trang
const posts = await db.post.findMany({
  where: {
    status: 'published',
    published_at: { lte: new Date() }  // Không hiển thị scheduled posts
  },
  include: {
    author: {
      select: { full_name: true, avatar: true }
    },
    category: {
      select: { name: true, slug: true }
    }
  },
  orderBy: { published_at: 'desc' },
  skip: (page - 1) * limit,
  take: limit
})

// Lấy post detail theo slug
const post = await db.post.findUnique({
  where: { slug: 'bai-viet-moi' },
  include: {
    author: true,
    category: true,
    tags: {
      include: {
        tag: true
      }
    }
  }
})

// Tạo post mới
const newPost = await db.post.create({
  data: {
    title: 'Bài Viết Mới',
    slug: createSlug('Bài Viết Mới'),  // Helper function
    content: '<p>Nội dung...</p>',
    excerpt: 'Tóm tắt ngắn',
    cover_image: '/uploads/posts/image.jpg',
    author_id: 1,
    category_id: 2,
    status: 'draft'
  }
})

// Publish post
await db.post.update({
  where: { id: 1 },
  data: {
    status: 'published',
    published_at: new Date()
  }
})

// Tăng views
await db.post.update({
  where: { id: 1 },
  data: {
    views: { increment: 1 }
  }
})

// Tìm kiếm posts
const searchResults = await db.post.findMany({
  where: {
    status: 'published',
    OR: [
      { title: { contains: keyword } },
      { content: { contains: keyword } },
      { excerpt: { contains: keyword } }
    ]
  },
  take: 20
})

// Lấy posts cùng category
const relatedPosts = await db.post.findMany({
  where: {
    category_id: currentPost.category_id,
    id: { not: currentPost.id },
    status: 'published'
  },
  take: 5,
  orderBy: { published_at: 'desc' }
})

// Stats
const stats = await db.post.groupBy({
  by: ['status'],
  _count: true
})
// Result: [{ status: 'draft', _count: 5 }, { status: 'published', _count: 20 }]
```

---

### 2.4. Table `tags` và `post_tags`

**Mục đích**: Many-to-Many relationship giữa posts và tags

#### Schema

```prisma
model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique @db.VarChar(50)
  slug  String @unique @db.VarChar(50)

  posts PostTag[]

  @@map("tags")
}

model PostTag {
  post_id Int
  tag_id  Int

  post Post @relation(fields: [post_id], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tag_id], references: [id], onDelete: Cascade)

  @@id([post_id, tag_id])
  @@map("post_tags")
}
```

#### Relationship Diagram

```
posts (1) ←→ (many) post_tags (many) ←→ (1) tags

Ví dụ:
Post "Quy hoạch 2024"
  ├── Tag: "quy-hoach"
  ├── Tag: "do-thi"
  └── Tag: "2024"
```

#### Query Examples

```typescript
// Lấy post kèm tags
const postWithTags = await db.post.findUnique({
  where: { id: 1 },
  include: {
    tags: {
      include: {
        tag: true
      }
    }
  }
})

// Result:
// {
//   id: 1,
//   title: "...",
//   tags: [
//     { tag: { id: 1, name: "Quy hoạch", slug: "quy-hoach" } },
//     { tag: { id: 2, name: "Đô thị", slug: "do-thi" } }
//   ]
// }

// Tạo post với tags
const post = await db.post.create({
  data: {
    title: 'New Post',
    slug: 'new-post',
    content: '...',
    author_id: 1,
    tags: {
      create: [
        {
          tag: {
            connectOrCreate: {
              where: { slug: 'quy-hoach' },
              create: { name: 'Quy hoạch', slug: 'quy-hoach' }
            }
          }
        }
      ]
    }
  }
})

// Thêm tag vào post có sẵn
await db.postTag.create({
  data: {
    post_id: 1,
    tag_id: 2
  }
})

// Xóa tag khỏi post
await db.postTag.delete({
  where: {
    post_id_tag_id: {
      post_id: 1,
      tag_id: 2
    }
  }
})

// Lấy posts theo tag
const postsWithTag = await db.post.findMany({
  where: {
    tags: {
      some: {
        tag: {
          slug: 'quy-hoach'
        }
      }
    }
  }
})

// Lấy tags phổ biến nhất
const popularTags = await db.tag.findMany({
  include: {
    _count: {
      select: { posts: true }
    }
  },
  orderBy: {
    posts: {
      _count: 'desc'
    }
  },
  take: 10
})
```

---

### 2.5. Table `projects`

**Mục đích**: Quản lý dự án quy hoạch (có file PDF)

#### Schema

```prisma
model Project {
  id           Int           @id @default(autoincrement())
  title        String        @db.VarChar(255)
  slug         String        @unique @db.VarChar(255)
  description  String?       @db.Text
  content      String?       @db.LongText
  cover_image  String?       @db.VarChar(500)
  pdf_file     String?       @db.VarChar(500)
  category_id  Int?
  status       ProjectStatus @default(draft)
  published_at DateTime?
  views        Int           @default(0)
  created_at   DateTime      @default(now())
  updated_at   DateTime      @updatedAt

  category Category? @relation(fields: [category_id], references: [id], onDelete: SetNull)

  @@index([slug])
  @@index([status])
  @@index([published_at])
  @@map("projects")
}

enum ProjectStatus {
  draft
  published
  archived
}
```

#### Chi Tiết Columns

| Column | Type | Required | Unique | Mô Tả |
|--------|------|----------|--------|-------|
| `id` | Int | ✅ | ✅ | Primary key |
| `title` | String(255) | ✅ | ❌ | Tên dự án |
| `slug` | String(255) | ✅ | ✅ | URL-friendly |
| `description` | Text | ❌ | ❌ | Mô tả ngắn |
| `content` | LongText | ❌ | ❌ | Nội dung chi tiết |
| `cover_image` | String(500) | ❌ | ❌ | Ảnh bìa dự án |
| `pdf_file` | String(500) | ❌ | ❌ | File PDF đính kèm |
| `category_id` | Int | ❌ | ❌ | Foreign key → categories |
| `status` | Enum | ✅ | ❌ | draft, published, archived |
| `published_at` | DateTime | ❌ | ❌ | Ngày công bố |
| `views` | Int | ✅ | ❌ | Lượt xem |
| `created_at` | DateTime | ✅ | ❌ | Ngày tạo |
| `updated_at` | DateTime | ✅ | ❌ | Ngày cập nhật |

#### Query Examples

```typescript
// Lấy projects published
const projects = await db.project.findMany({
  where: { status: 'published' },
  include: {
    category: {
      select: { name: true, slug: true }
    }
  },
  orderBy: { published_at: 'desc' },
  take: 12
})

// Lấy project detail
const project = await db.project.findUnique({
  where: { slug: 'du-an-quy-hoach-ha-noi' },
  include: {
    category: true
  }
})

// Tạo project mới
const newProject = await db.project.create({
  data: {
    title: 'Quy Hoạch Hà Nội 2030',
    slug: 'quy-hoach-ha-noi-2030',
    description: 'Dự án quy hoạch tổng thể...',
    content: '<p>Nội dung chi tiết...</p>',
    cover_image: '/uploads/projects/hanoi.jpg',
    pdf_file: '/uploads/pdfs/hanoi-2030.pdf',
    category_id: 3,
    status: 'draft'
  }
})

// Upload PDF
await db.project.update({
  where: { id: 1 },
  data: {
    pdf_file: '/uploads/pdfs/new-file.pdf'
  }
})
```

---

### 2.6. Table `slides`

**Mục đích**: Quản lý slideshow homepage

#### Schema

```prisma
model Slide {
  id            Int      @id @default(autoincrement())
  title         String?  @db.VarChar(255)
  description   String?  @db.Text
  image_url     String   @db.VarChar(255)
  link_url      String?  @db.VarChar(255)
  display_order Int      @default(0)
  is_active     Boolean  @default(true)
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  @@map("slides")
}
```

#### Query Examples

```typescript
// Lấy slides active
const slides = await db.slide.findMany({
  where: { is_active: true },
  orderBy: { display_order: 'asc' }
})

// Tạo slide mới
const newSlide = await db.slide.create({
  data: {
    title: 'Slide 1',
    description: 'Description...',
    image_url: '/uploads/slides/slide1.jpg',
    link_url: '/tin-tuc/bai-viet',
    display_order: 1,
    is_active: true
  }
})

// Reorder slides
await db.slide.update({
  where: { id: 1 },
  data: { display_order: 2 }
})
```

---

### 2.7. Table `videos`

**Mục đích**: Quản lý thư viện video

#### Schema

```prisma
model Video {
  id            Int         @id @default(autoincrement())
  title         String      @db.VarChar(255)
  description   String?     @db.Text
  video_url     String      @db.VarChar(500)
  thumbnail_url String?     @db.VarChar(500)
  duration      String?     @db.VarChar(20)
  display_order Int         @default(0)
  status        VideoStatus @default(active)
  created_at    DateTime    @default(now())
  updated_at    DateTime    @updatedAt

  @@index([status])
  @@index([display_order])
  @@map("videos")
}

enum VideoStatus {
  active
  inactive
}
```

#### Query Examples

```typescript
// Lấy videos active
const videos = await db.video.findMany({
  where: { status: 'active' },
  orderBy: { display_order: 'asc' }
})

// Tạo video mới
const newVideo = await db.video.create({
  data: {
    title: 'Video Giới Thiệu',
    description: 'Giới thiệu dự án...',
    video_url: 'https://youtube.com/watch?v=xxx',
    thumbnail_url: '/uploads/videos/thumb.jpg',
    duration: '5:30',
    display_order: 1,
    status: 'active'
  }
})
```

---

### 2.8. Table `media`

**Mục đích**: Quản lý file uploads (images, PDFs)

#### Schema

```prisma
model Media {
  id            Int      @id @default(autoincrement())
  filename      String   @db.VarChar(255)
  original_name String   @db.VarChar(255)
  file_path     String   @db.VarChar(255)
  file_type     String?  @db.VarChar(50)
  file_size     Int?
  uploaded_by   Int?
  created_at    DateTime @default(now())

  uploader User? @relation(fields: [uploaded_by], references: [id], onDelete: SetNull)

  @@map("media")
}
```

#### Query Examples

```typescript
// Lấy media của user
const userMedia = await db.media.findMany({
  where: { uploaded_by: 1 },
  orderBy: { created_at: 'desc' }
})

// Upload file mới
const newMedia = await db.media.create({
  data: {
    filename: 'abc123.jpg',
    original_name: 'my-photo.jpg',
    file_path: '/uploads/media/abc123.jpg',
    file_type: 'image/jpeg',
    file_size: 1024000,  // bytes
    uploaded_by: 1
  }
})

// Xóa file
await db.media.delete({
  where: { id: 1 }
})
```

---

### 2.9. Table `settings`

**Mục đích**: Lưu cấu hình site (singleton)

#### Schema

```prisma
model Setting {
  id               Int      @id @default(autoincrement())
  site_name        String   @default("Cổng Thông Tin Quy Hoạch Quốc Gia") @db.VarChar(255)
  site_logo        String?  @db.VarChar(500)
  site_favicon     String?  @db.VarChar(500)
  footer_about     String?  @db.Text
  contact_email    String?  @db.VarChar(100)
  contact_phone    String?  @db.VarChar(50)
  contact_address  String?  @db.VarChar(255)
  facebook_url     String?  @db.VarChar(255)
  youtube_url      String?  @db.VarChar(255)
  footer_copyright String?  @db.VarChar(255)
  updated_at       DateTime @updatedAt

  @@map("settings")
}
```

#### Query Examples

```typescript
// Lấy settings (luôn luôn id = 1)
const settings = await db.setting.findUnique({
  where: { id: 1 }
})

// Update settings
await db.setting.update({
  where: { id: 1 },
  data: {
    site_name: 'Tên Mới',
    contact_email: 'new@example.com'
  }
})
```

---

### 2.10. Table `feedback`

**Mục đích**: Lưu ý kiến từ người dùng

#### Schema

```prisma
model Feedback {
  id          Int            @id @default(autoincrement())
  name        String         @db.VarChar(100)
  email       String         @db.VarChar(100)
  phone       String?        @db.VarChar(20)
  subject     String         @db.VarChar(255)
  message     String         @db.Text
  admin_reply String?        @db.Text
  status      FeedbackStatus @default(pending)
  replied_at  DateTime?
  replied_by  Int?
  created_at  DateTime       @default(now())
  updated_at  DateTime       @updatedAt

  replier User? @relation("FeedbackReplies", fields: [replied_by], references: [id], onDelete: SetNull)

  @@index([status])
  @@index([created_at])
  @@map("feedback")
}

enum FeedbackStatus {
  pending
  replied
  archived
}
```

#### Query Examples

```typescript
// Lấy feedback pending
const pendingFeedback = await db.feedback.findMany({
  where: { status: 'pending' },
  orderBy: { created_at: 'desc' }
})

// Reply feedback
await db.feedback.update({
  where: { id: 1 },
  data: {
    admin_reply: 'Cảm ơn bạn đã góp ý...',
    status: 'replied',
    replied_at: new Date(),
    replied_by: 1  // Admin ID
  }
})

// Stats
const stats = await db.feedback.groupBy({
  by: ['status'],
  _count: true
})
```

---

## 3. Relationships (Quan Hệ)

### 3.1. One-to-Many

#### users → posts (1 user có nhiều posts)

```typescript
// Lấy user kèm posts
const user = await db.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true
  }
})

// Lấy post kèm author
const post = await db.post.findUnique({
  where: { id: 1 },
  include: {
    author: true
  }
})
```

#### categories → posts (1 category có nhiều posts)

```typescript
const category = await db.category.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { status: 'published' }
    }
  }
})
```

### 3.2. Many-to-Many

#### posts ↔ tags

```typescript
// Tạo post với tags
const post = await db.post.create({
  data: {
    title: 'Post',
    slug: 'post',
    content: '...',
    author_id: 1,
    tags: {
      create: [
        {
          tag: {
            connectOrCreate: {
              where: { slug: 'tag-1' },
              create: { name: 'Tag 1', slug: 'tag-1' }
            }
          }
        }
      ]
    }
  }
})
```

### 3.3. Self-Referencing

#### categories (parent-children)

```typescript
// Lấy full tree
const tree = await db.category.findMany({
  where: { parent_id: null },
  include: {
    children: {
      include: {
        children: true  // Nested children
      }
    }
  }
})
```

---

## 4. Prisma Client Queries

### 4.1. CRUD Operations

```typescript
// CREATE
const user = await db.user.create({
  data: { username: 'admin', email: 'admin@example.com', password_hash: '...' }
})

// READ
const users = await db.user.findMany()
const user = await db.user.findUnique({ where: { id: 1 } })
const user = await db.user.findFirst({ where: { role: 'admin' } })

// UPDATE
await db.user.update({
  where: { id: 1 },
  data: { full_name: 'New Name' }
})

// DELETE
await db.user.delete({ where: { id: 1 } })
```

### 4.2. Advanced Queries

```typescript
// Pagination
const posts = await db.post.findMany({
  skip: (page - 1) * limit,
  take: limit
})

// Sorting
const posts = await db.post.findMany({
  orderBy: [
    { published_at: 'desc' },
    { title: 'asc' }
  ]
})

// Filtering
const posts = await db.post.findMany({
  where: {
    status: 'published',
    category_id: { in: [1, 2, 3] },
    title: { contains: 'quy hoạch' },
    published_at: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31')
    }
  }
})

// Aggregation
const stats = await db.post.aggregate({
  _count: true,
  _avg: { views: true },
  _sum: { views: true },
  _max: { views: true }
})

// GroupBy
const statsByCategory = await db.post.groupBy({
  by: ['category_id'],
  _count: true,
  having: {
    category_id: { not: null }
  }
})
```

---

## 5. Migrations & Seeding

### 5.1. Prisma Migrate

```bash
# Tạo migration mới
npx prisma migrate dev --name add_tags_table

# Apply migrations
npx prisma migrate deploy

# Reset database (⚠️ Xóa toàn bộ data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

### 5.2. Seeding

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  // Tạo admin user
  await db.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password_hash: await bcrypt.hash('admin123', 10),
      full_name: 'Administrator',
      role: 'admin',
      status: 'active'
    }
  })

  // Tạo categories
  await db.category.createMany({
    data: [
      { name: 'Tin Tức', slug: 'tin-tuc', display_order: 1 },
      { name: 'Dự Án', slug: 'du-an', display_order: 2 }
    ]
  })

  // Tạo settings
  await db.setting.create({
    data: {
      site_name: 'Quy Hoạch Quốc Gia',
      contact_email: 'info@example.com'
    }
  })
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
```

```bash
# Run seed
npx prisma db seed
```

---

## 6. Best Practices

### 6.1. Always Use Transactions

```typescript
// ✅ GOOD: Transaction
await db.$transaction(async (tx) => {
  const post = await tx.post.create({ data: { ... } })
  
  await tx.postTag.createMany({
    data: tagIds.map(tagId => ({ post_id: post.id, tag_id: tagId }))
  })
})

// ❌ BAD: No transaction (có thể bị inconsistent)
const post = await db.post.create({ data: { ... } })
await db.postTag.createMany({ ... })  // Có thể fail
```

### 6.2. Select Only What You Need

```typescript
// ✅ GOOD
const users = await db.user.findMany({
  select: {
    id: true,
    username: true,
    email: true
  }
})

// ❌ BAD: Lấy toàn bộ (bao gồm password_hash)
const users = await db.user.findMany()
```

### 6.3. Use Include Wisely

```typescript
// ✅ GOOD: Nested include khi cần
const post = await db.post.findUnique({
  where: { id: 1 },
  include: {
    author: {
      select: { full_name: true, avatar: true }  // Chỉ lấy fields cần thiết
    },
    category: true
  }
})

// ❌ BAD: Include toàn bộ relation
const post = await db.post.findUnique({
  where: { id: 1 },
  include: {
    author: {
      include: {
        posts: {  // Không cần thiết
          include: {
            category: true
          }
        }
      }
    }
  }
})
```

### 6.4. Handle Errors

```typescript
try {
  const post = await db.post.findUniqueOrThrow({
    where: { slug: params.slug }
  })
} catch (error) {
  if (error.code === 'P2025') {
    // Record not found
    notFound()
  }
  throw error
}
```

### 6.5. Use Indexes

```prisma
// ✅ GOOD: Index cho columns hay query
model Post {
  slug String @unique  // Auto index

  @@index([status])
  @@index([published_at])
}
```

---

## 🎯 Tóm Tắt

✅ **12 tables** với relationships rõ ràng  
✅ **Enums** cho status fields  
✅ **Indexes** cho performance  
✅ **Cascade delete** khi cần  
✅ **Timestamps** auto update  
✅ **Foreign keys** đầy đủ  

**Next**: Đọc [05_AUTHENTICATION.md](./05_AUTHENTICATION.md) để hiểu authentication flow.
