import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'posts'

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Không có file được upload' },
        { status: 400 }
      )
    }

    // Validate file type based on upload type
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const pdfTypes = ['application/pdf']
    const dwgTypes = ['application/acad', 'application/x-acad', 'application/autocad_drawing', 'image/vnd.dwg', 'image/x-dwg', 'application/dwg', 'application/x-dwg', 'application/x-autocad', 'image/vnd.dxf']
    
    if (type === 'pdfs') {
      if (!pdfTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, message: 'Chỉ chấp nhận file PDF' },
          { status: 400 }
        )
      }
      // PDF size limit: 10MB
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, message: 'File PDF quá lớn. Tối đa 10MB' },
          { status: 400 }
        )
      }
    } else if (type === 'dwg') {
      // DWG files - check by extension since MIME type varies
      const ext = path.extname(file.name).toLowerCase()
      if (ext !== '.dwg') {
        return NextResponse.json(
          { success: false, message: 'Chỉ chấp nhận file .dwg' },
          { status: 400 }
        )
      }
      // DWG size limit: 50MB
      const maxSize = 50 * 1024 * 1024
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, message: 'File DWG quá lớn. Tối đa 50MB' },
          { status: 400 }
        )
      }
    } else {
      // Image upload
      if (!imageTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, message: 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)' },
          { status: 400 }
        )
      }
      // Image size limit: 5MB
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, message: 'File ảnh quá lớn. Tối đa 5MB' },
          { status: 400 }
        )
      }
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const ext = path.extname(file.name)
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`
    const filepath = path.join(uploadDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return URL
    const fileUrl = `/uploads/${type}/${filename}`

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        filename: filename,
        size: file.size,
        type: file.type
      },
      message: 'Upload thành công'
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi upload file' },
      { status: 500 }
    )
  }
}
