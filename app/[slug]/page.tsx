import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Calendar, Clock, User } from 'lucide-react'

import { BlogFooter } from '@/components/BlogFooter'
import { BlogHeader } from '@/components/BlogHeader'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

// Force dynamic rendering so newly published articles appear immediately
export const dynamic = 'force-dynamic';
export const dynamicParams = true
export const revalidate = 0 // Disable ISR caching

// Don't pre-generate pages - render on-demand for immediate updates
export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pickpoynt.com';

  // Reject reserved paths
  const reservedPaths = ['', 'about', 'contact', 'privacy', 'terms', 'admin', 'articles', 'preview']
  if (!slug || reservedPaths.includes(slug)) {
    return {
      title: 'Article Not Found',
    }
  }

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    return {
      title: 'Article Not Found',
    }
  }

  try {
    const { data: article } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!article) {
      return {
        title: 'Article Not Found',
      }
    }

    // Extract title from HTML content with multiple fallbacks
    const titleMatch = article.content.match(/<title[^>]*>(.*?)<\/title>/i)
    const h1Match = article.content.match(/<h1[^>]*>(.*?)<\/h1>/i)
    const h2Match = article.content.match(/<h2[^>]*>(.*?)<\/h2>/i)

    // Clean HTML tags from extracted title
    const cleanTitle = (title: string) => title.replace(/<[^>]*>/g, '').trim()

    const extractedTitle =
      article.title ||
      (titleMatch?.[1] && cleanTitle(titleMatch[1])) ||
      (h1Match?.[1] && cleanTitle(h1Match[1])) ||
      (h2Match?.[1] && cleanTitle(h2Match[1])) ||
      'Untitled Article'

    // Clean HTML tags from content for description
    const cleanContent = article.content.replace(/<[^>]*>/g, '').substring(0, 160)
    const description = article.excerpt || cleanContent
    const articleUrl = `${siteUrl}/${article.slug}`;

    return {
      title: extractedTitle,
      description: description,
      keywords: article.tags?.join(', ') || '',
      authors: [{ name: article.user_profiles?.full_name || 'PickPoynt Author' }],
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title: extractedTitle,
        description: description,
        url: articleUrl,
        siteName: 'PickPoynt',
        type: 'article',
        publishedTime: article.published_at,
        modifiedTime: article.updated_at,
        authors: [article.user_profiles?.full_name || 'PickPoynt Author'],
        tags: article.tags || [],
        images: article.featured_image ? [
          {
            url: article.featured_image,
            width: 1200,
            height: 630,
            alt: extractedTitle,
          }
        ] : [
          {
            url: '/og-image.png',
            width: 1200,
            height: 630,
            alt: extractedTitle,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: extractedTitle,
        description: description,
        images: article.featured_image ? [article.featured_image] : ['/og-image.png'],
        creator: '@pickpoynt',
      },
      alternates: {
        canonical: articleUrl,
      },
    }
  } catch (error) {
    return {
      title: 'Article Not Found',
    }
  }
}

import { ArticleRenderer } from '@/components/ArticleRenderer'

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params

  // Reject reserved paths that should not be handled by this route
  const reservedPaths = ['', 'about', 'contact', 'privacy', 'terms', 'admin', 'articles', 'preview']
  if (!slug || reservedPaths.includes(slug)) {
    notFound()
  }

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    notFound()
  }

  try {
    const { data: article } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!article) {
      notFound()
    }

    // Extract title from HTML content (same logic as in generateMetadata)
    const titleMatch = article.content.match(/<title[^>]*>(.*?)<\/title>/i)
    const h1Match = article.content.match(/<h1[^>]*>(.*?)<\/h1>/i)
    const h2Match = article.content.match(/<h2[^>]*>(.*?)<\/h2>/i)

    const cleanTitle = (title: string) => title.replace(/<[^>]*>/g, '').trim()

    const extractedTitle =
      article.title ||
      (titleMatch?.[1] && cleanTitle(titleMatch[1])) ||
      (h1Match?.[1] && cleanTitle(h1Match[1])) ||
      (h2Match?.[1] && cleanTitle(h2Match[1])) ||
      'Untitled Article'

    // Generate structured data for SEO
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pickpoynt.com';
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": extractedTitle,
      "description": article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 160),
      "image": article.featured_image || `${siteUrl}/og-image.png`,
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
      "datePublished": article.published_at || article.created_at,
      "dateModified": article.updated_at,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${siteUrl}/${article.slug}`
      },
      "keywords": article.tags?.join(', ') || '',
      "articleSection": article.tags?.[0] || 'General',
      "wordCount": article.content.split(' ').length
    }

    // Sanitize content to remove soft hyphens and invisible characters that cause rendering artifacts
    const finalContent = article.content
      .replace(/&shy;/g, '')
      .replace(/\u00AD/g, '')
      .replace(/\u200B/g, '');



    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
        {/* Blog Header included */}
        <BlogHeader />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">

            {/* Article Header */}
            <header className="p-6 md:p-10 border-b border-slate-100 dark:border-slate-700">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags?.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-extrabold !text-slate-900 dark:!text-white mb-6 leading-tight break-words">
                {(extractedTitle || 'Untitled Article')
                  .replace(/&nbsp;/g, ' ')
                  .replace(/&amp;/g, '&')
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'")
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')}
              </h1>

              {/* Meta Data */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-8 border-t border-b border-slate-100 dark:border-slate-700 py-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="font-medium">{article.user_profiles?.full_name || "PickPoynt Author"}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  <time dateTime={article.published_at || article.created_at}>
                    {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{Math.ceil(article.content.split(' ').length / 200)} min read</span>
                </div>
              </div>

              {/* Featured Image */}
              {article.featured_image && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={article.featured_image}
                    alt={extractedTitle}
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className="p-6 md:p-12">
              <div
                className="prose prose-lg prose-slate dark:prose-invert max-w-none article-content"
                style={{
                  wordBreak: 'normal',
                  overflowWrap: 'break-word',
                  hyphens: 'none',
                  WebkitHyphens: 'none'
                }}
              >
                <ArticleRenderer content={finalContent} />
              </div>
            </div>

          </article>
        </main>

        <BlogFooter />
      </div>
    )
  } catch (error) {
    notFound()
  }
}
