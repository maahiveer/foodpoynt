'use client'

import React, { useMemo, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new')
    function ReactQuillWrapper({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />
    }
    return ReactQuillWrapper
  },
  {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-slate-50 animate-pulse rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">Loading Editor...</div>
  }
)

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<any>(null)

  const imageHandler = useCallback(() => {
    const url = window.prompt('Enter Image URL (leave empty to upload file from your computer):')

    // If user clicks Cancel (null), abort
    if (url === null) return

    // If user enters a URL, use it
    if (url.trim() !== '') {
      const quill = quillRef.current?.getEditor()
      if (quill) {
        const range = quill.getSelection()
        quill.insertEmbed(range?.index || 0, 'image', url.trim())
      }
      return
    }

    // Otherwise, proceed with file upload
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Maximum width for blog images (1200px is standard)
          const MAX_WIDTH = 1200
          if (width > MAX_WIDTH) {
            height = (MAX_WIDTH / width) * height
            width = MAX_WIDTH
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          // Compress to JPEG with 0.7 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7)

          const quill = quillRef.current?.getEditor()
          if (quill) {
            const range = quill.getSelection()
            quill.insertEmbed(range?.index || 0, 'image', compressedDataUrl)
          }
        }
      }
    }
  }, [])

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), [imageHandler])

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'script', 'indent', 'direction',
    'align',
    'link', 'image', 'video'
  ]

  return (
    <div className="rich-text-editor">
      <style jsx global>{`
        /* ... existing styles ... */
        
        /* Enforce paragraph spacing in editor */
        .ql-editor p {
          margin-bottom: 1em !important;
          line-height: 1.6 !important;
        }

        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: #cbd5e1 !important;
          background-color: #f8fafc !important;
        }
        .dark .ql-toolbar {
          border-color: #475569 !important;
          background-color: #1e293b !important;
          color: #e2e8f0 !important;
        }
        .ql-toolbar .ql-stroke {
          stroke: #334155;
        }
        .ql-toolbar .ql-fill {
          fill: #334155;
        }
        .ql-toolbar .ql-picker {
          color: #334155;
        }
        
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: #cbd5e1 !important;
          background-color: white !important;
          font-size: 1rem;
          color: #334155 !important; /* Force dark text */
        }
        .ql-editor {
          min-height: 400px;
          color: #334155 !important; /* Force dark text */
          caret-color: #334155 !important; /* Force dark cursor */
        }
        .ql-editor.ql-blank::before {
          color: #94a3b8 !important;
          font-style: italic;
        }

        /* Dark Mode Overrides */
        .dark .ql-container {
          border-color: #475569 !important;
          background-color: #0f172a !important;
          color: #e2e8f0 !important;
        }
        .dark .ql-editor {
          color: #e2e8f0 !important;
          caret-color: #e2e8f0 !important;
        }
        .dark .ql-editor p {
          color: #e2e8f0 !important; 
        }
        .dark .ql-editor.ql-blank::before {
          color: #64748b !important;
        }
        
        /* Fix dark mode toolbar icons */
        .dark .ql-snow .ql-stroke {
          stroke: #e2e8f0 !important;
        }
        .dark .ql-snow .ql-fill {
          fill: #e2e8f0 !important;
        }
        .dark .ql-snow .ql-picker {
          color: #e2e8f0 !important;
        }
        .dark .ql-snow .ql-picker-options {
          background-color: #1e293b !important;
          color: #e2e8f0 !important;
        }
      `}</style>
      <ReactQuill
        forwardedRef={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  )
}
