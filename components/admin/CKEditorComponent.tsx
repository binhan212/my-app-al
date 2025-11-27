'use client'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Heading,
  Link,
  List,
  BlockQuote,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageUpload,
  Table,
  TableToolbar,
  MediaEmbed,
  Alignment,
  Font,
} from 'ckeditor5'

import 'ckeditor5/ckeditor5.css'

interface CKEditorComponentProps {
  value: string
  onChange: (data: string) => void
}

export default function CKEditorComponent({ value, onChange }: CKEditorComponentProps) {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        licenseKey: 'GPL', // Bản GPL miễn phí
        toolbar: {
          items: [
            'undo', 'redo',
            '|',
            'heading',
            '|',
            'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
            '|',
            'bold', 'italic', 'underline',
            '|',
            'link', 'uploadImage', 'insertTable', 'blockQuote', 'mediaEmbed',
            '|',
            'alignment',
            '|',
            'bulletedList', 'numberedList', 'outdent', 'indent'
          ]
        },
        plugins: [
          Bold,
          Essentials,
          Italic,
          Mention,
          Paragraph,
          Undo,
          Heading,
          Link,
          List,
          BlockQuote,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageResize,
          ImageUpload,
          Table,
          TableToolbar,
          MediaEmbed,
          Alignment,
          Font,
        ],
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
          ]
        },
        image: {
          toolbar: [
            'imageStyle:inline',
            'imageStyle:block',
            'imageStyle:side',
            '|',
            'toggleImageCaption',
            'imageTextAlternative',
            '|',
            'resizeImage'
          ]
        },
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        }
      }}
      data={value}
      onChange={(_event, editor) => {
        const data = editor.getData()
        onChange(data)
      }}
    />
  )
}
