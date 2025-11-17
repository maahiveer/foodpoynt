import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Calendar, Clock, User } from 'lucide-react'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

// Allow dynamic route generation for new articles
export const dynamicParams = true

export async function generateStaticParams() {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    return []
  }

  try {
    const { data: articles } = await supabase
      .from('articles')
      .select('slug')
      .eq('status', 'published')

    // Filter out invalid slugs
    return articles
      ?.filter((article: any) => {
        const slug = article?.slug
        return slug && typeof slug === 'string' && slug.trim() !== ''
      })
      .map((article: any) => ({
        slug: article.slug,
      })) || []
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params
  
  // Reject empty or invalid slugs
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
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

  // Clean HTML tags from content for description
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
      authors: ['TrackScale'],
      tags: article.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: description,
    },
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
  }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Article Not Found',
    }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  
  // Reject empty or invalid slugs
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
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

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 160),
    "image": article.featured_image || undefined,
    "author": {
      "@type": "Person",
      "name": article.user_profiles?.full_name || "TrackScale Author"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TrackScale Blog",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
    "datePublished": article.published_at || article.created_at,
    "dateModified": article.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `/articles/${article.slug}`
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Remove hash from URL and add sidebar functionality */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (window.location.hash) {
              window.history.replaceState(null, null, window.location.pathname);
            }
            
            // Smooth scroll for sidebar links
            document.addEventListener('DOMContentLoaded', function() {
              const sidebarLinks = document.querySelectorAll('.sidebar a');
              sidebarLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                  e.preventDefault();
                  const targetId = this.getAttribute('href');
                  const targetElement = document.querySelector(targetId);
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                });
              });
              
              // Active link highlighting
              window.addEventListener('scroll', () => {
                const sections = document.querySelectorAll('section');
                const scrollPosition = window.scrollY + 100;
                
                sections.forEach(section => {
                  const sectionTop = section.offsetTop;
                  const sectionHeight = section.offsetHeight;
                  const sectionId = section.getAttribute('id');
                  
                  if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    sidebarLinks.forEach(link => {
                      link.classList.remove('active');
                      if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                      }
                    });
                  }
                });
              });
            });
          `
        }}
      />
      
      {/* Simple Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/95 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
                <span className="text-[#1e3a8a] font-bold text-xl tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  tr
                  <span className="inline-flex items-center justify-center w-5 h-5 mx-0.5 rounded-sm bg-gradient-to-r from-orange-500 to-red-500">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                  </span>
                  cksc
                  <span className="inline-flex items-center justify-center w-5 h-5 mx-0.5 rounded-sm bg-gradient-to-r from-orange-500 to-red-500">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1"/>
                      <path d="M12 2v4m0 12v4m10-10h-4m-12 0H2" stroke="currentColor" strokeWidth="1" fill="none"/>
                    </svg>
                  </span>
                  le
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
          <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="article-content">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </article>
        </div>
      </main>
    </div>
  )
  } catch (error) {
    console.error('Error fetching article:', error)
    notFound()
  }
}

