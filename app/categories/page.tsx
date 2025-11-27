import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FolderOpen, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Categories - PickPoynt',
    description: 'Browse all article categories',
}

export default async function CategoriesPage() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
                <p className="text-slate-600 dark:text-slate-400">Database not configured</p>
            </div>
        )
    }

    try {
        const { data: categories } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true })

        // Get article counts for each category
        const categoriesWithCounts = await Promise.all(
            (categories || []).map(async (category: any) => {
                const { count } = await supabase
                    .from('articles')
                    .select('*', { count: 'exact', head: true })
                    .eq('category_id', category.id)
                    .eq('status', 'published')

                return {
                    ...category,
                    articleCount: count || 0,
                }
            })
        )

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Home Button */}
                    <div className="max-w-4xl mx-auto mb-6">
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                        >
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Home
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="max-w-4xl mx-auto mb-12 text-center">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                            Browse by Category
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Explore articles organized by topic
                        </p>
                    </div>

                    {/* Categories Grid */}
                    <div className="max-w-6xl mx-auto">
                        {!categoriesWithCounts || categoriesWithCounts.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow">
                                <FolderOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                                <p className="text-slate-600 dark:text-slate-400">
                                    No categories available yet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categoriesWithCounts.map((category: any) => (
                                    <Link
                                        key={category.id}
                                        href={`/categories/${category.slug}`}
                                        className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                <FolderOpen className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {category.name}
                                                </h2>
                                                {category.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                                        {category.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                                    <FileText className="h-4 w-4 mr-1" />
                                                    {category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        console.error('Error fetching categories:', error)
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
                <p className="text-slate-600 dark:text-slate-400">Error loading categories</p>
            </div>
        )
    }
}
