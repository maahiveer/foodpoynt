'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, Article } from '@/lib/supabase'
import { Calendar, Clock, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react'

type ArticleRecord = Article & {
    tags?: string[]
    featured_image?: string | null
    category?: {
        id: string
        name: string
        slug: string
    } | null
}

const ARTICLES_PER_PAGE = 10

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const wordCount = textContent.split(' ').filter((word) => word.length > 0).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return Math.min(readingTime, 30)
}

export function PaginatedArticleList() {
    const [articles, setArticles] = useState<ArticleRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalArticles, setTotalArticles] = useState(0)

    useEffect(() => {
        fetchArticles()
    }, [currentPage])

    const fetchArticles = async () => {
        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' ||
            !supabase
        ) {
            setLoading(false)
            return
        }

        setLoading(true)

        try {
            // Get total count
            const { count } = await supabase
                .from('articles')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'published')

            setTotalArticles(count || 0)

            // Get paginated articles
            const from = (currentPage - 1) * ARTICLES_PER_PAGE
            const to = from + ARTICLES_PER_PAGE - 1

            const { data, error } = await supabase
                .from('articles')
                .select(`
          *,
          category:categories(id, name, slug)
        `)
                .eq('status', 'published')
                .order('published_at', { ascending: false, nullsFirst: false })
                .order('created_at', { ascending: false })
                .range(from, to)

            if (error) {
                console.error('Error fetching published articles:', error)
                setArticles([])
            } else {
                const filteredArticles = (data || []).filter(
                    (article: ArticleRecord) => !!article.slug && article.slug.trim() !== ''
                )
                setArticles(filteredArticles)
            }
        } catch (error) {
            console.error('Error fetching articles:', error)
            setArticles([])
        } finally {
            setLoading(false)
        }
    }

    const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE)

    const goToPage = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <section id="articles" className="py-16 sm:py-24 mt-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                        Latest Topics
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        Discover insights, tutorials, and stories about technology and development
                    </p>
                </div>

                {loading ? (
                    <div className="mt-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading articles...</p>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="mt-12 text-center">
                        <p className="text-slate-600 dark:text-slate-400">
                            No published articles yet. Publish your first post from the admin dashboard to see it here.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mt-12 max-w-4xl mx-auto space-y-6">
                            {articles.map((article) => (
                                <article
                                    key={article.id}
                                    className="group relative bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="p-6 flex gap-6">
                                        {article.featured_image && (
                                            <div className="w-32 h-24 flex-shrink-0">
                                                <img
                                                    src={article.featured_image}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                                                <time dateTime={article.published_at || article.created_at} className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {formatDate(article.published_at || article.created_at)}
                                                </time>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {getReadingTime(article.content)} min read
                                                </div>
                                            </div>

                                            <h2 className="text-xl font-bold leading-tight text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                <Link href={`/${article.slug}`} className="block" scroll>
                                                    {article.title}
                                                </Link>
                                            </h2>

                                            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
                                                {article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...'}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {article.category && (
                                                    <Link
                                                        href={`/categories/${article.category.slug}`}
                                                        className="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                                                    >
                                                        <FolderOpen className="h-3 w-3 mr-1" />
                                                        {article.category.name}
                                                    </Link>
                                                )}
                                                {article.tags && article.tags.length > 0 && article.tags.slice(0, 2).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center">
                                                <Link
                                                    href={`/${article.slug}`}
                                                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                                    scroll
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
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                        // Show first page, last page, current page, and pages around current
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => goToPage(page)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                            ? 'bg-blue-600 text-white'
                                                            : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                                            return <span key={page} className="px-2 text-slate-500">...</span>
                                        }
                                        return null
                                    })}
                                </div>

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>
                        )}

                        {/* Page Info */}
                        <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                            Showing {((currentPage - 1) * ARTICLES_PER_PAGE) + 1} - {Math.min(currentPage * ARTICLES_PER_PAGE, totalArticles)} of {totalArticles} articles
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}
