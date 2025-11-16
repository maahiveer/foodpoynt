'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, Article } from '@/lib/supabase'
import { Calendar, Clock } from 'lucide-react'

export function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const articlesPerPage = 10

  useEffect(() => {
    fetchArticles()
    
    // Refresh articles every 30 seconds to catch newly published articles
    const refreshInterval = setInterval(() => {
      fetchArticles()
    }, 30000)
    
    return () => clearInterval(refreshInterval)
  }, [currentPage])

  const fetchArticles = async () => {
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
        console.log('Supabase not configured yet. Please set up your environment variables.')
        setArticles([])
        setLoading(false)
        return
      }

      console.log('Fetching published articles...')
      
      // Calculate offset for pagination
      const offset = (currentPage - 1) * articlesPerPage
      
      // First, get the total count
      const { count } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
      
      // Then fetch the paginated articles
      // Fetch all published articles and sort them properly
      console.log('Querying articles with status=published...')
      const { data: allArticles, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
      
      console.log('Raw query result:', {
        count: allArticles?.length || 0,
        error: fetchError?.message,
        articles: allArticles?.map((a: any) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          status: a.status,
          published_at: a.published_at,
          created_at: a.created_at
        }))
      })
      
      if (fetchError) {
        console.error('Error fetching articles:', fetchError)
        throw fetchError
      }
      
      // Sort articles: use published_at if available, otherwise use created_at
      const sortedArticles = (allArticles || []).sort((a: any, b: any) => {
        const dateA = a.published_at || a.created_at
        const dateB = b.published_at || b.created_at
        return new Date(dateB).getTime() - new Date(dateA).getTime()
      })
      
      // Apply pagination
      const data = sortedArticles.slice(offset, offset + articlesPerPage)
      const error = null

      if (error) {
        console.error('Error fetching articles:', error)
        throw error
      }

      console.log('Articles fetched:', data)
      console.log('Total articles found:', data?.length || 0)
      
      // Debug: Log all article details
      if (data && data.length > 0) {
        console.log('Article details:')
        data.forEach((article: any, index: number) => {
          console.log(`${index + 1}. ${article.title}`)
          console.log(`   - Slug: ${article.slug || 'MISSING'}`)
          console.log(`   - Status: ${article.status}`)
          console.log(`   - Published At: ${article.published_at || 'NULL'}`)
          console.log(`   - Created At: ${article.created_at}`)
          if (!article.slug) {
            console.warn('⚠️ Article missing slug:', article.id, article.title)
          }
        })
      } else {
        console.warn('⚠️ No articles returned from query!')
        console.log('Query filters: status=published')
      }
      
      setArticles(data || [])
      
      // Calculate total pages
      const total = count || 0
      setTotalPages(Math.ceil(total / articlesPerPage))
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
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

  if (loading) {
    return (
      <section id="articles" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Latest Articles
            </h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="articles" className="py-16 sm:py-24 mt-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                Latest Articles
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Discover insights, tutorials, and stories about technology and development
              </p>
            </div>
            <button
              onClick={() => {
                setLoading(true)
                fetchArticles()
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="mt-12 text-center">
            {!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Setup Required
                </h3>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  To start using your blog, you need to configure Supabase:
                </p>
                <ol className="text-left text-blue-700 dark:text-blue-300 space-y-2 max-w-md mx-auto">
                  <li>1. Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
                  <li>2. Run the SQL schema from <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">supabase-schema.sql</code></li>
                  <li>3. Copy your project URL and anon key</li>
                  <li>4. Create a <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">.env.local</code> file with your credentials</li>
                </ol>
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-400">No articles published yet.</p>
            )}
          </div>
        ) : (
                  <div className="mt-12 max-w-4xl mx-auto space-y-6">
                    {articles.map((article) => {
                      // Ensure slug exists
                      if (!article.slug) {
                        console.error('Article missing slug:', article.id, article.title)
                        return null
                      }
                      return (
                      <article
                        key={article.id}
                        className="group relative bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="p-6 flex gap-6">
                          {/* Small Image on Left */}
                          {article.featured_image && (
                            <div className="w-32 h-24 flex-shrink-0">
                              <img
                                src={article.featured_image}
                                alt={article.title}
                                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          
                          {/* Content on Right */}
                          <div className="flex-1">
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                              <time
                                dateTime={article.published_at}
                                className="flex items-center gap-1"
                              >
                                <Calendar className="h-4 w-4" />
                                {formatDate(article.published_at || article.created_at)}
                              </time>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {getReadingTime(article.content)} min read
                              </div>
                            </div>
                            
                            <h2 className="text-xl font-bold leading-tight text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              <Link 
                                href={`/articles/${article.slug}`}
                                className="block"
                                scroll={true}
                                onClick={(e) => {
                                  if (!article.slug) {
                                    e.preventDefault()
                                    console.error('Article slug is missing:', article)
                                  }
                                }}
                              >
                                {article.title}
                              </Link>
                            </h2>
                            
                            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
                              {article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...'}
                            </p>
                            
                            {/* Tags */}
                            {article.tags && article.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {article.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {/* Read More Link */}
                            <div className="flex items-center">
                              <Link
                                href={`/articles/${article.slug}`}
                                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                scroll={true}
                                onClick={(e) => {
                                  if (!article.slug) {
                                    e.preventDefault()
                                    console.error('Article slug is missing:', article)
                                  }
                                }}
                              >
                                Read more
                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                </div>
              </article>
                      )
                    })}
          </div>
        )}
        
        {/* Pagination Controls */}
        {articles.length > 0 && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center">
            <nav className="flex items-center space-x-2" aria-label="Pagination">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-500 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                Next
              </button>
            </nav>
            
            {/* Page Info */}
            <div className="ml-4 text-sm text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
