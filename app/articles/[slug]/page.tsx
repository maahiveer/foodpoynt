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

  // Display the content exactly as it is in the database
  const finalContent = article.content;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />


      <main className="w-full p-0 m-0">
        <div className="w-full p-0 m-0">
          <article className="w-full max-w-none p-0 m-0">
            <div className="article-content w-full">
              <div dangerouslySetInnerHTML={{ __html: finalContent }} />
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
