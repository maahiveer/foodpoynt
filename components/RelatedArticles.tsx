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
}

export function RelatedArticles({ currentArticleId, currentTags = [], limit = 3 }: RelatedArticlesProps) {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRelatedArticles() {
            try {
                // First, try to get articles with similar tags
                let query = supabase
                    .from('articles')
                    .select('id, title, slug, excerpt, featured_image, published_at, tags')
                    .eq('status', 'published')
                    .neq('id', currentArticleId)
                    .order('published_at', { ascending: false })
                    .limit(limit)

                const { data, error } = await query

                if (error) throw error

                // If we have tags, prioritize articles with matching tags
                if (data && currentTags.length > 0) {
                    const sorted = data.sort((a: any, b: any) => {
                        const aMatches = a.tags?.filter((tag: string) => currentTags.includes(tag)).length || 0
                        const bMatches = b.tags?.filter((tag: string) => currentTags.includes(tag)).length || 0
                        return bMatches - aMatches
                    })
                    setArticles(sorted)
                } else {
                    setArticles(data || [])
                }
            } catch (error) {
                console.error('Error fetching related articles:', error)
                setArticles([])
            } finally {
                setLoading(false)
            }
        }

        fetchRelatedArticles()
    }, [currentArticleId, currentTags, limit])

    if (loading) {
        return (
            <div className="my-12 py-8 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                        Related Articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse">
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
        return null
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
