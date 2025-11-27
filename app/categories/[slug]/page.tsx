import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BlogHeader } from '@/components/BlogHeader'
import { BlogFooter } from '@/components/BlogFooter'
import { ArticleListSSR } from '@/components/ArticleListSSR'
import { supabase } from '@/lib/supabase'

interface CategoryPageProps {
    params: Promise<{
        slug: string
    }>
    searchParams: Promise<{ page?: string }>
}

export const dynamic = 'force-dynamic'

const ARTICLES_PER_PAGE = 10

export async function generateMetadata({ params }: CategoryPageProps) {
    const { slug } = await params

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
        return { title: 'Category Not Found' }
    }

    try {
        const { data: category } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .single()

        if (!category) {
            return { title: 'Category Not Found' }
        }

        return {
            title: `${category.name} - PickPoynt`,
            description: category.description || `Browse all articles in ${category.name}`,
        }
    } catch (error) {
        return { title: 'Category Not Found' }
    }
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
            .select('id, name, slug')
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

async function getCategoryArticles(categoryId: string, page: number = 1) {
    if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' ||
        !supabase
    ) {
        return { articles: [], totalArticles: 0 }
    }

    try {
        // Get total count for this category
        const { count } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published')
            .eq('category_id', categoryId)

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
            .eq('category_id', categoryId)
            .order('published_at', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })
            .range(from, to)

        if (error) {
            console.error('Error fetching category articles:', error)
            return { articles: [], totalArticles: 0 }
        }

        const filteredArticles = (data || []).filter(
            (article: any) => !!article.slug && article.slug.trim() !== ''
        )

        return { articles: filteredArticles, totalArticles }
    } catch (error) {
        console.error('Error fetching category articles:', error)
        return { articles: [], totalArticles: 0 }
    }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { slug } = await params
    const search = await searchParams
    const currentPage = Number(search.page) || 1

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
        notFound()
    }

    try {
        const { data: category } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .single()

        if (!category) {
            notFound()
        }

        const categories = await getCategories()
        const { articles, totalArticles } = await getCategoryArticles(category.id, currentPage)
        const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE)

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <BlogHeader categories={categories} />
                <main>
                    {/* Home Button */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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

                    {/* Category Hero Section (replaces BlogHero) */}
                    <section className="py-8 sm:py-12">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-4xl mx-auto text-center">
                                <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6">
                                    <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                                    {category.name}
                                </h1>
                                {category.description && (
                                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-6">
                                        {category.description}
                                    </p>
                                )}
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {totalArticles} {totalArticles === 1 ? 'article' : 'articles'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Article List with same styling as homepage */}
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
    } catch (error) {
        notFound()
    }
}
