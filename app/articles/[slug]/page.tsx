import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Calendar, Clock, User } from 'lucide-react'
import type { Metadata } from 'next'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

// Force dynamic rendering so newly published articles appear immediately
export const dynamic = 'force-dynamic';
export const dynamicParams = true

// Don't pre-generate pages - render on-demand for immediate updates
export async function generateStaticParams() {
  return []
}

async function getArticle(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    return null;
  }
  try {
    const { data: article } = await supabase
      .from('articles')
      .select('*, user_profiles(full_name)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    return article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params

  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    return { title: 'Article Not Found' }
  }

  const article = await getArticle(slug)

  if (!article) {
    return { title: 'Article Not Found' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pickpoynt.com';
  const cleanContent = article.content.replace(/<[^>]*>/g, '').substring(0, 160)
  const description = article.excerpt || cleanContent

  return {
    title: article.title,
    description: description,
    keywords: article.tags?.join(', ') || '',
    openGraph: {
      title: article.title,
      description: description,
      type: 'article',
      publishedTime: article.published_at,
      authors: [article.user_profiles?.full_name || 'PickPoynt Author'],
      tags: article.tags || [],
      url: `${siteUrl}/articles/${article.slug}`,
      siteName: 'PickPoynt',
      images: [
        {
          url: article.featured_image || `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: description,
      images: [article.featured_image || `${siteUrl}/og-image.png`],
      creator: '@pickpoynt',
    },
    alternates: {
      canonical: `${siteUrl}/articles/${article.slug}`,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pickpoynt.com';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const wordCount = textContent.split(' ').filter(word => word.length > 0).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return Math.min(readingTime, 30)
  }

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.featured_image || `${siteUrl}/og-image.png`,
    "datePublished": article.published_at,
    "dateModified": article.updated_at,
    "author": {
      "@type": "Person",
      "name": article.user_profiles?.full_name || "PickPoynt Author"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PickPoynt",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/articles/${article.slug}`
    },
    "keywords": article.tags?.join(', ') || '',
    "articleSection": article.tags?.[0] || 'General',
    "wordCount": article.content.split(' ').length
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Simple Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/95 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <div className="flex flex-col">
                <span className="text-[#1e3a8a] font-bold text-2xl tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  PickPoynt
                </span>
                <span className="text-slate-600 dark:text-slate-400 text-xs -mt-1">
                  Decisions made simple
                </span>
              </div>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden max-w-4xl mx-auto">
            {/* Article Header */}
            <div className="p-8 border-b border-slate-200 dark:border-slate-700">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{article.user_profiles?.full_name || 'PickPoynt Author'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.published_at || article.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{getReadingTime(article.content)} min read</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {article.featured_image && (
              <div className="w-full h-64 md:h-96 relative">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="article-content p-8 prose prose-slate dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
