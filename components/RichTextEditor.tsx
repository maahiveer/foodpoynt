'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-96 w-full bg-slate-50 animate-pulse rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">Loading Editor...</div>
})

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
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
    ]
  }), [])

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
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: #cbd5e1 !important;
          background-color: #f8fafc;
        }
        .dark .ql-toolbar {
          border-color: #475569 !important;
          background-color: #1e293b;
          color: #e2e8f0;
        }
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: #cbd5e1 !important;
          background-color: white;
          font-size: 1rem;
        }
        .dark .ql-container {
          border-color: #475569 !important;
          background-color: #0f172a;
          color: #e2e8f0;
        }
        .ql-editor {
          min-height: 400px;
        }
        .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
        }
        /* Fix dark mode toolbar icons */
        .dark .ql-snow .ql-stroke {
          stroke: #e2e8f0;
        }
        .dark .ql-snow .ql-fill {
          fill: #e2e8f0;
        }
        .dark .ql-snow .ql-picker {
          color: #e2e8f0;
        }
        .dark .ql-snow .ql-picker-options {
          background-color: #1e293b;
        }
      `}</style>
      <ReactQuill
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
