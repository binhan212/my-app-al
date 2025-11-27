import { z } from "zod"

// Post validation schema
export const postSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(255),
  content: z.string().min(1, "Nội dung không được để trống"),
  excerpt: z.string().max(500).optional(),
  cover_image: z.string().optional().or(z.literal("")),
  category_id: z.number().int().positive().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
})

export type PostFormData = z.infer<typeof postSchema>

// Project validation schema
export const projectSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(255),
  description: z.string().max(500).optional(),
  content: z.string().optional(),
  cover_image: z.string().optional().or(z.literal("")),
  pdf_file: z.string().optional().or(z.literal("")),
  category_id: z.number().int().positive().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
})

export type ProjectFormData = z.infer<typeof projectSchema>

// Video validation schema
export const videoSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(255),
  description: z.string().optional(),
  video_url: z.string().url("URL video không hợp lệ").max(500),
  thumbnail_url: z.string().optional().or(z.literal("")),
  duration: z.string().max(20).optional(),
  display_order: z.number().int().default(0),
  status: z.enum(["active", "inactive"]).default("active"),
})

export type VideoFormData = z.infer<typeof videoSchema>

// Category validation schema
export const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống").max(100),
  description: z.string().optional(),
  parent_id: z.number().int().positive().optional().nullable(),
  display_order: z.number().int().default(0),
})

export type CategoryFormData = z.infer<typeof categorySchema>

// Slide validation schema
export const slideSchema = z.object({
  title: z.string().max(255).optional(),
  description: z.string().optional(),
  image_url: z.string().min(1, "Hình ảnh không được để trống").max(255),
  link_url: z.string().optional().or(z.literal("")),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
})

export type SlideFormData = z.infer<typeof slideSchema>

// Feedback validation schema
export const feedbackSchema = z.object({
  name: z.string().min(1, "Tên không được để trống").max(100),
  email: z.string().email("Email không hợp lệ").max(100),
  phone: z.string().max(20).optional(),
  subject: z.string().min(1, "Tiêu đề không được để trống").max(255),
  message: z.string().min(1, "Nội dung không được để trống"),
  admin_reply: z.string().optional(),
  status: z.enum(["pending", "answered", "archived"]).default("pending"),
})

export type FeedbackFormData = z.infer<typeof feedbackSchema>

// User validation schema
export const userSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập tối thiểu 3 ký tự").max(50),
  email: z.string().email("Email không hợp lệ").max(100),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").optional(),
  full_name: z.string().max(100).optional(),
  avatar: z.string().optional().or(z.literal("")),
  role: z.enum(["admin", "editor", "user"]).default("user"),
  status: z.enum(["active", "inactive"]).default("active"),
})

export type UserFormData = z.infer<typeof userSchema>

// Settings validation schema
export const settingSchema = z.object({
  setting_key: z.string().min(1, "Key không được để trống").max(100),
  setting_value: z.string().optional(),
  setting_type: z.enum(["text", "number", "boolean", "json", "image"]).default("text"),
})

export type SettingFormData = z.infer<typeof settingSchema>

// About validation schema
export const aboutSchema = z.object({
  content: z.string().min(1, "Nội dung không được để trống"),
  image_url: z.string().optional().or(z.literal("")),
})

export type AboutFormData = z.infer<typeof aboutSchema>
