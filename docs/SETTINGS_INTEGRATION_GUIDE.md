# 🎨 Settings Integration Guide

## ✅ Hoàn thành

Đã tích hợp Settings module để cấu hình động cho Header và Footer.

## 📋 Settings Keys Được Sử Dụng

Hệ thống sử dụng các settings keys sau trong Header/Footer:

| Setting Key | Type | Sử dụng | Mặc định |
|-------------|------|---------|----------|
| `site_name` | text | Header logo text, Footer copyright | "BỘ KẾ HOẠCH VÀ ĐẦU TƯ" |
| `site_logo` | text (URL) | Header logo image | "BP" circle |
| `site_description` | text | Footer "Về chúng tôi" section | "Cổng thông tin..." |
| `contact_email` | text | Footer contact section | "info@domain.example" |
| `contact_phone` | text | Footer contact section | "(84) 24 1234 5678" |

## 🔧 Cách Thêm Settings

### 1. Qua Admin Panel

1. Đăng nhập admin: `/admin/login`
2. Vào **Settings** trong sidebar
3. Click **Tạo Setting Mới**
4. Điền thông tin:

**Site Name:**
```
Key: site_name
Type: text
Value: Bộ Kế hoạch và Đầu tư Việt Nam
```

**Site Logo:**
```
Key: site_logo
Type: text
Value: /uploads/logo/logo.png
```

**Site Description:**
```
Key: site_description
Type: text
Value: Cổng thông tin và cơ sở dữ liệu tích hợp quốc gia về quy hoạch
```

**Contact Email:**
```
Key: contact_email
Type: text
Value: info@mpi.gov.vn
```

**Contact Phone:**
```
Key: contact_phone
Type: text
Value: (84) 24 3824 5656
```

### 2. Qua Database Seed

Thêm vào Prisma seed script (`prisma/seed.ts`):

```typescript
await prisma.setting.createMany({
  data: [
    {
      setting_key: 'site_name',
      setting_value: 'Bộ Kế hoạch và Đầu tư',
      setting_type: 'text'
    },
    {
      setting_key: 'site_logo',
      setting_value: '/uploads/logo/logo.png',
      setting_type: 'text'
    },
    {
      setting_key: 'site_description',
      setting_value: 'Cổng thông tin và cơ sở dữ liệu tích hợp quốc gia về quy hoạch',
      setting_type: 'text'
    },
    {
      setting_key: 'contact_email',
      setting_value: 'info@mpi.gov.vn',
      setting_type: 'text'
    },
    {
      setting_key: 'contact_phone',
      setting_value: '(84) 24 3824 5656',
      setting_type: 'text'
    }
  ]
})
```

### 3. Qua API

```bash
# POST /api/settings
curl -X POST http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "setting_key": "site_name",
    "setting_value": "Bộ Kế hoạch và Đầu tư",
    "setting_type": "text"
  }'
```

## 🎯 Kiến Trúc

### Data Flow

```
[Database: settings table]
         ↓
[Root Layout: app/layout.tsx]
  - Fetch 5 settings keys
  - Convert to object: { site_name: "...", ... }
         ↓
[LayoutContent: client component]
  - Receives settings as props
  - Passes to Header & Footer
         ↓
[Header Component]          [Footer Component]
  - siteName                 - siteName
  - siteLogo                 - siteDescription
                             - contactEmail
                             - contactPhone
```

### File Changes

**1. app/layout.tsx** (Root Layout)
- ✅ Converted to async Server Component
- ✅ Fetches settings from database
- ✅ Passes settings to LayoutContent

**2. components/layout/LayoutContent.tsx**
- ✅ Added settings props interface
- ✅ Passes settings to Header/Footer

**3. components/layout/Header.tsx**
- ✅ Added HeaderProps interface
- ✅ Dynamic site name from settings
- ✅ Dynamic logo image with Next.js Image component
- ✅ Fallback to default "BP" circle if no logo

**4. components/layout/Footer.tsx**
- ✅ Added FooterProps interface
- ✅ Dynamic description, email, phone from settings
- ✅ Dynamic copyright with site name

## 🖼️ Logo Upload

### Qua Upload API

1. Upload logo qua `/api/upload`:

```typescript
const formData = new FormData()
formData.append('file', logoFile)
formData.append('type', 'logo')

const res = await fetch('/api/upload', {
  method: 'POST',
  body: formData
})

const data = await res.json()
// data.url = "/uploads/logo/logo-123456.png"
```

2. Update setting:

```typescript
await fetch('/api/settings/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    setting_value: data.url
  })
})
```

### Qua Admin Settings Page

1. Vào `/admin/settings`
2. Edit setting `site_logo`
3. Paste URL: `/uploads/logo/your-logo.png`
4. Save

## 🎨 NewsSection Redesign

### Changes

Redesigned NewsSection theo index.html để cleaner:

**Before:**
- Heavy Card components everywhere
- Featured post in Card with CardContent
- Side posts in Cards

**After:**
- Clean article + aside layout
- Featured: `<article>` với shadow-md, hover effects
- Side list: Simple divs với hover:bg-gray-50
- No CardContent wrapper
- Better hover transitions
- Optimized images with Next.js Image

### Layout Structure

```
<section>
  <div class="grid lg:grid-cols-3">
    <!-- Featured (2 cols) -->
    <article class="lg:col-span-2">
      <Link>
        <div> <Image /> </div>
        <h3>Title</h3>
        <div>Date • Category</div>
        <p>Excerpt</p>
      </Link>
    </article>

    <!-- Side List (1 col) -->
    <aside>
      {posts.map(post => (
        <div hover:bg-gray-50>
          <Link>
            <Image />
            <h4>Title</h4>
            <p>Date</p>
          </Link>
        </div>
      ))}
    </aside>
  </div>
</section>
```

## 🧪 Testing

### 1. Test Settings Display

```bash
# Start dev server
npm run dev

# Add settings via admin
# Visit http://localhost:3000
# Check Header shows new site name
# Check Footer shows new description/contact
```

### 2. Test Logo Upload

```bash
# Upload logo via /api/upload
# Update site_logo setting
# Refresh homepage
# Check Header shows logo image
```

### 3. Test NewsSection

```bash
# Add 4+ posts with cover images
# Visit homepage
# Check featured post (large, left side)
# Check 3 side posts (thumbnails, right side)
# Test hover effects
```

## 🚀 Production Checklist

- [ ] Upload production logo to `/public/uploads/logo/`
- [ ] Create all 5 settings in production database
- [ ] Test Header/Footer render correctly
- [ ] Test NewsSection with real posts
- [ ] Verify image optimization (Next.js Image)
- [ ] Check responsive design (mobile/tablet/desktop)

## 📊 Settings Best Practices

1. **Use Descriptive Keys**: `site_name` not `name`
2. **Set Defaults**: Always provide fallback values in components
3. **Type Correctly**: Use `text` for URLs/emails/names
4. **Cache Settings**: Root layout caches settings (no revalidate needed)
5. **Validate URLs**: Check logo URL exists before displaying

## 🔧 Future Enhancements

Potential additional settings keys:

```typescript
// Social Media
'social_facebook': 'https://facebook.com/...'
'social_twitter': 'https://twitter.com/...'

// SEO
'meta_keywords': 'quy hoạch, kế hoạch, đầu tư'
'meta_description': 'Cổng thông tin...'

// Analytics
'google_analytics_id': 'G-XXXXXXXXXX'

// Features
'enable_comments': 'true' (boolean)
'posts_per_page': '10' (number)

// Appearance
'primary_color': '#1f4aa6' (text)
'header_background': '#1f4aa6' (text)
```

---

**Completed**: ✅ Settings Integration + NewsSection Redesign  
**Status**: Production Ready 🚀
