# 📋 TODO: Apply UI/UX Standards to All Forms

> **Mục tiêu**: Chuẩn hóa tất cả forms trong dự án theo [UI_UX_FORM_STANDARDS.md](./UI_UX_FORM_STANDARDS.md)

---

## ✅ COMPLETED

- [x] **FeedbackForm** (`components/feedback/FeedbackForm.tsx`)
  - [x] Form: `space-y-6`
  - [x] Fields: `space-y-2`
  - [x] Inputs: `h-11`
  - [x] Labels: `text-sm font-medium`
  - [x] Textarea: `rows={6}`, `resize-none`
  - [x] Button: `h-11`, better typography

- [x] **LoginForm** (`app/admin/login/page.tsx`)
  - [x] Form: `space-y-6`
  - [x] Fields: `space-y-2`
  - [x] Inputs: `h-11`
  - [x] Labels: `text-sm font-medium`
  - [x] Button: `h-11`, `mt-6`

- [x] **Mobile Menu** (`components/layout/Header.tsx`)
  - [x] Hamburger icon with toggle
  - [x] Smooth slide animation
  - [x] Overlay with click-to-close
  - [x] Auto-close on navigation

---

## 🔄 IN PROGRESS

### Admin Forms (High Priority)

#### 1. PostFormDialog
**File**: `components/admin/PostFormDialog.tsx`

Cần apply:
- [ ] Form container: `space-y-6`
- [ ] Each field group: `space-y-2`
- [ ] Labels: `text-sm font-medium`
- [ ] Input: `h-11`
- [ ] Textarea content: `rows={10}`, `resize-none`
- [ ] Textarea excerpt: `rows={3}`, `resize-none`
- [ ] Buttons: `h-10` (dialog footer)

**Pattern**:
```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="title" className="text-sm font-medium">
      Tiêu đề *
    </Label>
    <Input id="title" className="h-11" />
  </div>
  
  <div className="space-y-2">
    <Label htmlFor="content" className="text-sm font-medium">
      Nội dung *
    </Label>
    <Textarea id="content" rows={10} className="resize-none" />
  </div>
</form>
```

---

#### 2. ProjectFormDialog
**File**: `components/admin/ProjectFormDialog.tsx`

Cần apply:
- [ ] Form container: `space-y-6`
- [ ] Each field group: `space-y-2`
- [ ] Labels: `text-sm font-medium`
- [ ] Input: `h-11`
- [ ] Textarea description: `rows={3}`
- [ ] Textarea content: `rows={10}`
- [ ] File upload preview: padding consistency

---

#### 3. VideoFormDialog
**File**: `components/admin/VideoFormDialog.tsx`

Cần apply:
- [ ] Form container: `space-y-6`
- [ ] Each field group: `space-y-2`
- [ ] Labels: `text-sm font-medium`
- [ ] Input: `h-11`
- [ ] Textarea description: `rows={3}`, `resize-none`
- [ ] Grid layout: `gap-6` (cho 2 columns)

---

#### 4. CategoryFormDialog
**File**: `components/admin/CategoryFormDialog.tsx`

Cần apply:
- [ ] Form container: `space-y-6`
- [ ] Each field group: `space-y-2`
- [ ] Labels: `text-sm font-medium`
- [ ] Input: `h-11`
- [ ] Textarea description: `rows={3}`, `resize-none`

---

#### 5. SlideFormDialog
**File**: `components/admin/SlideFormDialog.tsx`

Cần apply:
- [ ] Form container: `space-y-6`
- [ ] Each field group: `space-y-2`
- [ ] Labels: `text-sm font-medium`
- [ ] Input: `h-11`
- [ ] Textarea description: `rows={3}`, `resize-none`
- [ ] Image upload: consistent spacing

---

#### 6. UserFormDialog
**File**: `components/admin/UserFormDialog.tsx`

Cần apply:
- [ ] Form container: `space-y-6`
- [ ] Each field group: `space-y-2`
- [ ] Labels: `text-sm font-medium`
- [ ] Input: `h-11`
- [ ] Grid layout: `gap-6` (2 columns)

---

#### 7. SettingsForm
**File**: `components/admin/SettingsForm.tsx`

Cần apply:
- [ ] Form container: `space-y-8` (sections lớn hơn)
- [ ] Each section: `space-y-6`
- [ ] Each field group: `space-y-2`
- [ ] Labels: `text-sm font-medium`
- [ ] Input: `h-11`
- [ ] Textarea: `rows={4}`, `resize-none`

---

#### 8. SettingFormDialog
**File**: `components/admin/SettingFormDialog.tsx`

Cần apply:
- [ ] Form container: `space-y-6`
- [ ] Each field group: `space-y-2`
- [ ] Labels: `text-sm font-medium`
- [ ] Input: `h-11`
- [ ] Conditional rendering: maintain spacing

---

#### 9. FeedbackFormDialog (Admin Reply)
**File**: `components/admin/FeedbackFormDialog.tsx`

Cần apply:
- [ ] Form container: `space-y-6`
- [ ] Each field group: `space-y-2`
- [ ] Labels: `text-sm font-medium`
- [ ] Input: `h-11`
- [ ] Textarea reply: `rows={6}`, `resize-none`

---

## 📝 CHECKLIST MẪU (Copy cho mỗi form)

```markdown
### [Form Name] - [File Path]

Progress: 0/8

- [ ] Form container: `className="space-y-6"`
- [ ] Field groups: `className="space-y-2"`
- [ ] Labels: `className="text-sm font-medium"`
- [ ] Input fields: `className="h-11"`
- [ ] Textarea: `rows={n}`, `className="resize-none"`
- [ ] Button: `className="h-10"` or `h-11`
- [ ] Grid layouts: `gap-6` instead of `gap-4`
- [ ] Responsive: test on mobile

**After completion:**
- [ ] Test form submission
- [ ] Check mobile responsiveness
- [ ] Verify error states display correctly
```

---

## 🎯 PRIORITY ORDER

### Phase 1: High-Traffic Forms (Week 1)
1. ✅ FeedbackForm (Public)
2. ✅ LoginForm (Public)
3. PostFormDialog (Admin - most used)
4. ProjectFormDialog (Admin)

### Phase 2: Admin Management (Week 2)
5. VideoFormDialog
6. SlideFormDialog
7. UserFormDialog

### Phase 3: Settings & Misc (Week 3)
8. SettingsForm
9. SettingFormDialog
10. FeedbackFormDialog (Admin reply)
11. CategoryFormDialog

---

## 📊 PROGRESS TRACKING

| Form | File | Status | Lines Changed | Notes |
|------|------|--------|---------------|-------|
| FeedbackForm | `components/feedback/FeedbackForm.tsx` | ✅ Done | ~30 | Perfect |
| LoginForm | `app/admin/login/page.tsx` | ✅ Done | ~15 | Perfect |
| PostFormDialog | `components/admin/PostFormDialog.tsx` | 🔄 Todo | - | High priority |
| ProjectFormDialog | `components/admin/ProjectFormDialog.tsx` | 🔄 Todo | - | High priority |
| VideoFormDialog | `components/admin/VideoFormDialog.tsx` | 🔄 Todo | - | Medium priority |
| SlideFormDialog | `components/admin/SlideFormDialog.tsx` | 🔄 Todo | - | Medium priority |
| UserFormDialog | `components/admin/UserFormDialog.tsx` | 🔄 Todo | - | Medium priority |
| SettingsForm | `components/admin/SettingsForm.tsx` | 🔄 Todo | - | Low priority |
| SettingFormDialog | `components/admin/SettingFormDialog.tsx` | 🔄 Todo | - | Low priority |
| FeedbackFormDialog | `components/admin/FeedbackFormDialog.tsx` | 🔄 Todo | - | Low priority |
| CategoryFormDialog | `components/admin/CategoryFormDialog.tsx` | 🔄 Todo | - | Low priority |

**Overall Progress: 2/11 (18%)**

---

## 🚀 QUICK APPLY COMMAND

Để apply cho 1 form, làm theo steps:

1. **Mở file form**
2. **Find & Replace**:
   ```
   Find: className="space-y-4"
   Replace: className="space-y-6"
   ```
3. **Thêm vào mỗi field group**:
   ```tsx
   <div className="space-y-2">
     <Label className="text-sm font-medium">...</Label>
     <Input className="h-11" />
   </div>
   ```
4. **Update Textarea**:
   ```tsx
   <Textarea rows={6} className="resize-none" />
   ```
5. **Test**: Mở form, check spacing visually

---

## 🎨 VISUAL GUIDE

### Before:
```
Label
Input (36px)
Label
Input (36px)
```
→ Cramped, dính nhau, khó nhìn

### After:
```
Label (font-medium)
  ↓ (8px spacing)
Input (44px height)
  ↓ (24px spacing)
Label (font-medium)
  ↓ (8px spacing)
Input (44px height)
```
→ Thoáng, dễ đọc, pro!

---

## 📚 REFERENCES

- [UI_UX_FORM_STANDARDS.md](./UI_UX_FORM_STANDARDS.md) - Full documentation
- [07_UI_COMPONENTS.md](./07_UI_COMPONENTS.md) - shadcn/ui usage
- Tailwind spacing: https://tailwindcss.com/docs/space

---

**Last updated**: November 28, 2025  
**Next review**: Complete Phase 1 forms first, then reassess
