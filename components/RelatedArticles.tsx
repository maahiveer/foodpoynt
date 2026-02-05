'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Calendar } from 'lucide-react'

interface Article {
    id: string
    title: string
    slug: string
    excerpt: string
    featured_image: string | null
    published_at: string
    tags: string[]
}

interface RelatedArticlesProps {
    currentArticleId: string
    currentTags?: string[]
    limit?: number
    initialArticles?: any[] // Accept server-fetched articles
}

export function RelatedArticles({ currentArticleId, currentTags = [], limit = 3, initialArticles }: RelatedArticlesProps) {
    const [articles, setArticles] = useState<Article[]>(initialArticles || [])
    const [loading, setLoading] = useState(!initialArticles)

    useEffect(() => {
        if (initialArticles) {
            setArticles(initialArticles)
            setLoading(false)
            return
        }

        async function fetchRelatedArticles() {
            try {
                const { data, error } = await supabase
                    .from('articles')
                    .select('id, title, slug, excerpt, featured_image, published_at, tags')
                    .eq('status', 'published')
                    .neq('id', currentArticleId)
                    .order('published_at', { ascending: false })
                    .limit(limit)

                if (error) {
                    console.error('Supabase error:', error)
                    throw error
                }

                if (data && data.length > 0) {
                    // Just show the latest articles as requested
                    setArticles(data)
                } else {
                    // FALLBACK: Use mock data so the user can verify the UI works
                    console.log('No articles found, using mock data')
                    setArticles([
                        {
                            id: 'mock-1',
                            title: 'Example Related Article 1',
                            slug: '#',
                            excerpt: 'This is a sample article to show you how the layout looks.',
                            featured_image: null,
                            published_at: new Date().toISOString(),
                            tags: ['Example']
                        },
                        {
                            id: 'mock-2',
                            title: 'Example Related Article 2',
                            slug: '#',
                            excerpt: 'Another sample article. Once you have more published posts, real ones will appear here.',
                            featured_image: null,
                            published_at: new Date().toISOString(),
                            tags: ['Example']
                        }
                    ])
                }
            } catch (error) {
                console.error('Error fetching related articles:', error)
                // Use fallback on error too
                setArticles([
                    {
                        id: 'error-mock-1',
                        title: 'Unable to load articles',
                        slug: '#',
                        excerpt: 'We could not fetch the latest articles. Please check your connection.',
                        featured_image: null,
                        published_at: new Date().toISOString(),
                        tags: ['Error']
                    }
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchRelatedArticles()
    }, [currentArticleId, currentTags, limit])

    if (loading) {
        return (
            <div className="my-12 py-8 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/50">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                        You May Also Like
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md p-4">
                                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (articles.length === 0) {
        // Still show the section but with a message
        return (
            <div className="my-12 py-8 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/50">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                        You May Also Like
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                        Check back soon for more articles!
                    </p>
                </div>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="my-12 py-8 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/50">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                    You May Also Like
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/articles/${article.slug}`}
                            className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {article.featured_image && (
                                <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                                    <img
                                        src={article.featured_image}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            )}
                            <div className="p-5">
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                {article.excerpt && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                        {article.excerpt}
                                    </p>
                                )}
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {formatDate(article.published_at)}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
