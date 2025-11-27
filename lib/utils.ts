import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Create URL-friendly slug from Vietnamese text
 */
export function createSlug(text: string): string {
  const from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ"
  const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy"
  
  let slug = text.toLowerCase()
  
  for (let i = 0; i < from.length; i++) {
    slug = slug.replace(new RegExp(from[i], 'g'), to[i])
  }
  
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  return slug
}

/**
 * Format date to Vietnamese locale
 */
export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, formatStr, { locale: vi })
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

/**
 * Extract YouTube video ID from URL
 */
export function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + '...'
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}