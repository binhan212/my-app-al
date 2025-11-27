# Settings Image Type Support - Implementation Guide

## 🎯 Tổng quan

Đã thêm tính năng **upload ảnh** cho Settings module, cho phép người dùng upload logo, banner, và các ảnh khác thay vì phải nhập đường dẫn thủ công.

---

## ✨ Tính năng mới

### 1. **Loại Setting: IMAGE**

Thêm loại `image` vào Setting types:
- `text` - Văn bản thông thường
- `number` - Số
- `boolean` - True/False
- `json` - JSON object
- **`image`** - Ảnh (mới) ✨

### 2. **Upload ảnh trực tiếp**

Khi chọn type `image`, form sẽ hiển thị:
- **Image Preview** - Xem trước ảnh
- **File Upload Button** - Upload ảnh từ máy tính
- **Manual URL Input** - Hoặc nhập URL thủ công (optional)

### 3. **Preview trong bảng**

Settings table sẽ hiển thị:
- Thumbnail ảnh (40x40px)
- Đường dẫn file đầy đủ

---

## 🚀 Cách sử dụng

### Tạo Setting mới với type Image

1. Vào `/admin/settings`
2. Click **"Thêm Cài đặt"**
3. Nhập Key (ví dụ: `site_logo`, `banner_home`, `favicon`)
4. Chọn **Loại: Image**
5. Upload ảnh hoặc nhập URL
6. Click **"Tạo mới"**

### Ví dụ Settings cho ảnh

```javascript
// Logo website
Key: site_logo
Type: image
Value: /uploads/logo/logo.png

// Favicon
Key: site_favicon
Type: image
Value: /uploads/logo/favicon.ico

// Banner trang chủ
Key: home_banner
Type: image
Value: /uploads/media/banner-home.jpg

// OG Image cho SEO
Key: og_image
Type: image
Value: /uploads/media/og-default.png
```

---

## 📁 Files đã thay đổi

### 1. **Schema & Validation**

**`lib/validations.ts`**
```typescript
export const settingSchema = z.object({
  setting_key: z.string().min(1).max(100),
  setting_value: z.string().optional(),
  setting_type: z.enum(["text", "number", "boolean", "json", "image"]).default("text"), // ✅ Added 'image'
})
```

### 2. **SettingFormDialog Component**

**`components/admin/SettingFormDialog.tsx`**

**Thêm:**
- State `isUploading` - Track upload progress
- State `previewImage` - Preview ảnh trước khi submit
- Function `handleFileUpload` - Upload file lên `/api/upload`
- Conditional rendering cho type `image`

**Upload Logic:**
```typescript
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', 'logo') // Upload vào /uploads/logo/

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()
  setValue('setting_value', result.data.url) // Set URL vào form
  setPreviewImage(result.data.url)           // Show preview
}
```

**UI cho Image Type:**
```tsx
{currentType === 'image' ? (
  <div className="space-y-3">
    {/* Image Preview */}
    {(previewImage || currentValue) && (
      <div className="relative w-40 h-40 border rounded-lg overflow-hidden">
        <Image src={previewImage || currentValue || ''} alt="Preview" fill className="object-cover" />
      </div>
    )}
    
    {/* File Upload */}
    <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
    
    {/* Manual URL Input (optional) */}
    <Input placeholder="Hoặc nhập URL ảnh..." {...register('setting_value')} />
  </div>
) : (
  // Text/Number/Boolean/JSON inputs...
)}
```

### 3. **SettingsTable Component**

**`components/admin/SettingsTable.tsx`**

**Thêm:**
- Image preview trong table
- Badge color cho type `image`

```tsx
<TableCell>
  {setting.setting_type === 'image' && setting.setting_value ? (
    <div className="flex items-center gap-2">
      <div className="relative h-10 w-10 rounded border overflow-hidden">
        <Image src={setting.setting_value} alt={setting.setting_key} fill className="object-cover" />
      </div>
      <span className="text-xs text-muted-foreground truncate max-w-xs">
        {setting.setting_value}
      </span>
    </div>
  ) : (
    <div className="max-w-md truncate">
      {setting.setting_value || <span className="text-muted-foreground italic">Trống</span>}
    </div>
  )}
</TableCell>
```

### 4. **Settings Page**

**`app/admin/settings/page.tsx`**

Updated type definition:
```typescript
type Setting = {
  id: number
  setting_key: string
  setting_value: string | null
  setting_type: 'text' | 'number' | 'boolean' | 'json' | 'image' // ✅ Added 'image'
  updated_at: Date
}
```

---

## 🔧 Migration Script

**`scripts/update-settings-image-type.ts`**

Script tự động update các settings hiện có:
- Tìm settings có key chứa: `logo`, `icon`, `banner`, `image`, `avatar`, `thumbnail`
- Kiểm tra value có phải URL ảnh không
- Auto update type thành `image` nếu phù hợp

**Chạy migration:**
```bash
npx tsx scripts/update-settings-image-type.ts
```

---

## 🎨 Upload Directory

Ảnh sẽ được upload vào:
```
/public/uploads/logo/
```

Có thể thay đổi folder bằng cách sửa parameter `type`:
```typescript
formData.append('type', 'logo')    // → /uploads/logo/
formData.append('type', 'media')   // → /uploads/media/
formData.append('type', 'banners') // → /uploads/banners/
```

---

## 📊 Database Schema

**Prisma Schema** (không cần thay đổi):
```prisma
model Setting {
  id            Int      @id @default(autoincrement())
  setting_key   String   @unique @db.VarChar(100)
  setting_value String?  @db.Text           // ✅ Đủ chứa URL
  setting_type  String   @default("text") @db.VarChar(50) // ✅ Hỗ trợ "image"
  updated_at    DateTime @updatedAt

  @@map("settings")
}
```

**Không cần migration database** vì `setting_type` đã là `String`, có thể chứa bất kỳ giá trị nào.

---

## ✅ Testing Checklist

### Test Case 1: Tạo Setting mới với Image
- [ ] Tạo setting key `test_logo`
- [ ] Chọn type `image`
- [ ] Upload file ảnh (.jpg, .png)
- [ ] Verify preview hiển thị đúng
- [ ] Save → Check database có URL đúng
- [ ] Check table hiển thị thumbnail

### Test Case 2: Edit Setting Image
- [ ] Edit setting vừa tạo
- [ ] Upload ảnh khác
- [ ] Verify preview update
- [ ] Save → Check URL mới
- [ ] Delete file cũ (manual nếu cần)

### Test Case 3: Manual URL Input
- [ ] Tạo setting mới type `image`
- [ ] Không upload, nhập URL thủ công
- [ ] Verify preview hiển thị
- [ ] Save → Check hoạt động

### Test Case 4: Switch Type
- [ ] Tạo setting type `text`
- [ ] Edit → Đổi type thành `image`
- [ ] Verify form hiển thị upload input
- [ ] Upload ảnh
- [ ] Save → Verify type updated

---

## 🎯 Use Cases

### 1. **Logo Website**
```javascript
Key: site_logo
Type: image
Value: /uploads/logo/company-logo.png
```

### 2. **Favicon**
```javascript
Key: site_favicon
Type: image
Value: /uploads/logo/favicon.ico
```

### 3. **Social Media Share Image (OG Image)**
```javascript
Key: og_image
Type: image
Value: /uploads/media/og-default.jpg
```

### 4. **Banner trang chủ**
```javascript
Key: home_banner
Type: image
Value: /uploads/media/hero-banner.jpg
```

### 5. **Footer Logo**
```javascript
Key: footer_logo
Type: image
Value: /uploads/logo/footer-logo-white.png
```

---

## 🚨 Lưu ý

1. **File size limit**: Mặc định 5MB (có thể config trong `/api/upload`)
2. **Allowed formats**: jpg, jpeg, png, gif, webp, svg
3. **Storage**: Files lưu trong `/public/uploads/logo/`
4. **Path trong DB**: Relative path `/uploads/logo/filename.png`
5. **Display**: Sử dụng Next.js `<Image>` component cho optimization

---

## 🎉 Kết quả

- ✅ Không cần nhớ đường dẫn file
- ✅ Upload trực tiếp từ máy tính
- ✅ Preview ảnh realtime
- ✅ Tự động optimize với Next.js Image
- ✅ Dễ quản lý, dễ thay đổi
- ✅ Hoàn toàn tương thích ngược (backward compatible)

---

**Thời gian implement**: ~15 phút  
**Files changed**: 6 files  
**Impact**: 🎯 MAJOR IMPROVEMENT - UX tốt hơn nhiều cho việc quản lý settings ảnh
