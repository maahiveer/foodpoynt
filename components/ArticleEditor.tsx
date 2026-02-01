'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { supabase, Category } from '@/lib/supabase'
// import { RichTextEditor } from '@/components/RichTextEditor'
import {
  Save,
  Eye,
  ArrowLeft,
  Image as ImageIcon,
  Tag,
  Calendar,
  Globe,
  FolderOpen
} from 'lucide-react'

interface ArticleEditorProps {
  article?: any // Existing article for editing
}

export function ArticleEditor({ article }: ArticleEditorProps) {
  const { user } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState(article?.title || '')
  const [slug, setSlug] = useState(article?.slug || '')
  const [content, setContent] = useState(article?.content || '')
  const [excerpt, setExcerpt] = useState(article?.excerpt || '')
  const [status, setStatus] = useState<'draft' | 'published'>(article?.status || 'draft')
  const [tags, setTags] = useState<string[]>(article?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [featuredImage, setFeaturedImage] = useState(article?.featured_image || '')
  const [categoryId, setCategoryId] = useState(article?.category_id || '')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error
        setCategories(data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setSlug(generatedSlug)
    }
  }, [title])

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = async (publishStatus: 'draft' | 'published' = status) => {
    if (!content.trim()) {
      setError('Content is required')
      return
    }

    // Use provided title or auto-generate from HTML content
    let finalTitle = title.trim()
    if (!finalTitle && content.trim()) {
      const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i)
      const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i)
      const h2Match = content.match(/<h2[^>]*>(.*?)<\/h2>/i)

      const cleanTitle = (title: string) => title.replace(/<[^>]*>/g, '').trim()

      finalTitle =
        (titleMatch?.[1] && cleanTitle(titleMatch[1])) ||
        (h1Match?.[1] && cleanTitle(h1Match[1])) ||
        (h2Match?.[1] && cleanTitle(h2Match[1])) ||
        'Untitled Article'
    }

    setLoading(true)
    setError('')

    // Generate slug from finalTitle if slug is empty
    let finalSlug = slug.trim()
    if (!finalSlug && finalTitle) {
      finalSlug = finalTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    if (!finalSlug || finalSlug === 'untitled-article') {
      setError('A title or slug is required to save the article')
      setLoading(false)
      return
    }

    try {
      const articleData = {
        title: finalTitle,
        slug: finalSlug,
        content: content.trim(),
        excerpt: excerpt.trim(),
        status: publishStatus,
        author_id: null, // Use null for environment-based auth
        tags,
        featured_image: featuredImage.trim() || null,
        category_id: categoryId || null,
        published_at: publishStatus === 'published' ? new Date().toISOString() : null,
      }

      console.log('Saving article:', articleData)
      console.log('Supabase client:', supabase)

      // Check if we're using mock client
      if (!supabase || typeof supabase.from !== 'function') {
        throw new Error('Supabase not properly configured. Please check your environment variables.')
      }

      let data, error

      if (article?.id) {
        // Update existing article
        const result = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', article.id)
          .select()
          .single()
        data = result.data
        error = result.error
      } else {
        // Create new article
        const result = await supabase
          .from('articles')
          .insert(articleData)
          .select()
          .single()
        data = result.data
        error = result.error
      }

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Database error: ${error.message || 'Unknown error'}`)
      }

      console.log('Article saved successfully:', data)

      // Show success message
      setSuccess(`Article ${publishStatus === 'published' ? 'published' : 'saved as draft'} successfully!`)
      setError('') // Clear any previous errors

      // Redirect to admin dashboard after a short delay
      setTimeout(() => {
        router.push('/admin')
      }, 2000)

    } catch (err: any) {
      console.error('Error saving article:', err)
      setError(err.message || 'Failed to save article. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    // Create a temporary article object for preview
    const tempArticle = {
      title,
      slug,
      content,
      excerpt,
      status: 'draft' as const,
      author_id: user?.id || '',
      tags,
      featured_image: featuredImage,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Store in sessionStorage for preview
    sessionStorage.setItem('previewArticle', JSON.stringify(tempArticle))
    window.open('/preview', '_blank')
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {article?.id ? 'Edit Article' : 'Create New Article'}
          </h1>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter article title (will auto-generate from HTML if empty)"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Leave empty to auto-generate from HTML title, h1, or h2 tag
            </p>
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Slug *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-600 text-slate-500 dark:text-slate-400 text-sm">
                /articles/
              </span>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-r-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="article-slug"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Brief description of the article"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label htmlFor="featured-image" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Featured Image URL
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-600 text-slate-500 dark:text-slate-400 text-sm">
                <ImageIcon className="h-4 w-4 mr-2" />
                URL
              </span>
              <input
                type="url"
                id="featured-image"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-r-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-600 text-slate-500 dark:text-slate-400 text-sm">
                <FolderOpen className="h-4 w-4 mr-2" />
                Category
              </span>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-r-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleAddTag}
              className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Type a tag and press Enter"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Content (HTML Mode)
              </label>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded">
                ⚠️ Visual Editor Disabled (Stability Mode)
              </span>
            </div>

            <textarea
              className="w-full h-[500px] p-4 border border-slate-300 dark:border-slate-600 rounded-lg font-mono text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="<p>Write your article content here...</p>"
              spellCheck={false}
            />

            <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-end">
              Use standard HTML tags for formatting
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Status
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600"
                />
                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Draft</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="published"
                  checked={status === 'published'}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600"
                />
                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Published</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePreview}
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleSave('draft')}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </button>
              <button
                onClick={() => handleSave('published')}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Globe className="h-4 w-4 mr-2" />
                {loading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
