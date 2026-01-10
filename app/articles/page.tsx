import Link from 'next/link'
import { BlogHeader } from '@/components/BlogHeader'
import { BlogFooter } from '@/components/BlogFooter'
import { ArticleListSSR } from '@/components/ArticleListSSR'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const ARTICLES_PER_PAGE = 10

export const metadata = {
    title: 'All Recipes',
    description: 'Browse all recipes and culinary inspiration',
}

async function getCategories() {
    if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' ||
        !supabase
    ) {
        return []
    }

    try {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name, slug, parent_id')
            .order('name', { ascending: true })

        if (error) {
            console.error('Error fetching categories:', error)
            return []
        }

        return data || []
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

async function getAllArticles(page: number = 1) {
    if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' ||
        !supabase
    ) {
        return { articles: [], totalArticles: 0 }
    }

    try {
        // Get total count
        const { count } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published')

        const totalArticles = count || 0

        // Get paginated articles
        const from = (page - 1) * ARTICLES_PER_PAGE
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
            console.error('Error fetching articles:', error)
            return { articles: [], totalArticles: 0 }
        }

        const filteredArticles = (data || []).filter(
            (article: any) => !!article.slug && article.slug.trim() !== ''
        )

        return { articles: filteredArticles, totalArticles }
    } catch (error) {
        console.error('Error fetching articles:', error)
        return { articles: [], totalArticles: 0 }
    }
}

export default async function ArticlesPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const search = await searchParams
    const currentPage = Number(search.page) || 1

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Database not configured</p>
            </div>
        )
    }

    const categories = await getCategories()
    const { articles, totalArticles } = await getAllArticles(currentPage)
    const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <BlogHeader categories={categories} />
            <main>
                {/* Breadcrumb / Home Button */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-white">
                    <div className="max-w-4xl mx-auto">
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
                </div>

                {/* Hero Section */}
                <section className="py-8 sm:py-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                                All Articles
                            </h1>
                            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400">
                                Explore our full collection of pickleball guides, gear reviews, and stories.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Article List */}
                <ArticleListSSR
                    articles={articles}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalArticles={totalArticles}
                />
            </main>
            <BlogFooter />
        </div>
    )
}
