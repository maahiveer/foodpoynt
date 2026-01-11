import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Calendar, Clock, User } from 'lucide-react'
import { BlogHeader } from '@/components/BlogHeader'
import { BlogFooter } from '@/components/BlogFooter'

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
      (titleMatch?.[1] && cleanTitle(titleMatch[1])) ||
      (h1Match?.[1] && cleanTitle(h1Match[1])) ||
      (h2Match?.[1] && cleanTitle(h2Match[1])) ||
      article.title ||
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

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getReadingTime = (content: string) => {
      const wordsPerMinute = 200
      // Remove HTML tags and get actual text content
      const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      const wordCount = textContent.split(' ').filter(word => word.length > 0).length
      const readingTime = Math.ceil(wordCount / wordsPerMinute)
      // Cap at reasonable maximum
      return Math.min(readingTime, 30)
    }

    // Extract title from HTML content (same logic as in generateMetadata)
    const titleMatch = article.content.match(/<title[^>]*>(.*?)<\/title>/i)
    const h1Match = article.content.match(/<h1[^>]*>(.*?)<\/h1>/i)
    const h2Match = article.content.match(/<h2[^>]*>(.*?)<\/h2>/i)

    const cleanTitle = (title: string) => title.replace(/<[^>]*>/g, '').trim()

    const extractedTitle =
      (titleMatch?.[1] && cleanTitle(titleMatch[1])) ||
      (h1Match?.[1] && cleanTitle(h1Match[1])) ||
      (h2Match?.[1] && cleanTitle(h2Match[1])) ||
      article.title ||
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

    // Display the content exactly as it is in the database
    const finalContent = article.content;

    return (
      <div className="min-h-screen bg-[#030014] text-white">
        <BlogHeader categories={[]} />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <main className="container mx-auto px-6 py-12 md:py-20">
          <article className="max-w-4xl mx-auto">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: finalContent }}
            />
          </article>
        </main>
        <BlogFooter />
      </div>
    )
  } catch (error) {
    notFound()
  }
}
