import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BlogHeader } from '@/components/BlogHeader'
import { BlogFooter } from '@/components/BlogFooter'
import { supabase } from '@/lib/supabase'
import { Calendar, Clock, ArrowRight, FolderOpen } from 'lucide-react'
import { getCategoryIcon, getIconColor } from '@/lib/category-utils'

interface CategoryPageProps {
    params: Promise<{
        slug: string
    }>
    searchParams: Promise<{ page?: string }>
}

export const dynamic = 'force-dynamic'

const ARTICLES_PER_PAGE = 12


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
            title: `${category.name} Gardening - PickPoynt`,
            description: category.description || `Browse all expert ${category.name} gardening guides on PickPoynt`,
        }
    } catch (error) {
        return { title: 'Category Not Found' }
    }
}

async function getCategories() {
    if (!supabase) return []
    try {
        const { data } = await supabase.from('categories').select('id, name, slug, parent_id').order('name', { ascending: true })
        return data || []
    } catch (error) {
        return []
    }
}

async function getCategoryArticles(categoryId: string, page: number = 1) {
    if (!supabase) return { articles: [], totalArticles: 0 }

    try {
        const { count } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published')
            .eq('category_id', categoryId)

        const totalArticles = count || 0
        const from = (page - 1) * ARTICLES_PER_PAGE
        const to = from + ARTICLES_PER_PAGE - 1

        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('status', 'published')
            .eq('category_id', categoryId)
            .order('created_at', { ascending: false })
            .range(from, to)

        if (error) return { articles: [], totalArticles: 0 }

        return { articles: data || [], totalArticles }
    } catch (error) {
        return { articles: [], totalArticles: 0 }
    }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { slug } = await params
    const search = await searchParams
    const currentPage = Number(search.page) || 1

    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!category) notFound()

    const categories = await getCategories()
    const { articles, totalArticles } = await getCategoryArticles(category.id, currentPage)
    const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE)
    const Icon = getCategoryIcon(category.name)
    const iconColor = getIconColor(category.name)

    return (
        <div className="min-h-screen bg-[#030014] text-white">
            <BlogHeader categories={categories} />

            <main className="relative">
                {/* Background Ambience */}
                <div className="absolute top-0 left-0 w-full h-96 overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[100%] rounded-full bg-purple-900/20 blur-[120px]" />
                </div>

                {/* Hero Section */}
                <section className="container mx-auto px-6 py-16 md:py-24 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 mb-8 backdrop-blur-xl group">
                            {/* Decorative Glow */}
                            <div className={`absolute -inset-4 rounded-full blur-2xl opacity-20 ${iconColor.replace('text-', 'bg-')} transition-opacity group-hover:opacity-40`} />
                            <Icon className={`w-12 h-12 ${iconColor} relative z-10`} />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            {category.name}
                        </h1>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                            {category.description || `Discover our handpicked collection of expert ${category.name.toLowerCase()} gardening guides.`}
                        </p>
                        <div className="text-sm font-mono tracking-widest text-purple-400 uppercase">
                            {totalArticles} {totalArticles === 1 ? 'Guide' : 'Guides'} Found
                        </div>
                    </div>
                </section>

                {/* Articles Grid */}
                <section className="container mx-auto px-6 pb-24 relative z-10">
                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article: any) => (
                                <Link
                                    key={article.id}
                                    href={`/${article.slug}`}
                                    className="group relative flex flex-col h-full rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10"
                                >
                                    {/* Image */}
                                    <div className="aspect-[16/9] w-full overflow-hidden bg-white/5 relative">
                                        {article.featured_image ? (
                                            <img
                                                src={article.featured_image}
                                                alt={article.title}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                <FolderOpen className="w-10 h-10 opacity-20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#030014] to-transparent opacity-60" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6 flex flex-col relative">
                                        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                                            {article.excerpt || "Explore our detailed guide and discover step-by-step gardening instructions..."}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex items-center text-xs text-gray-500 gap-4">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(article.created_at).toLocaleDateString(undefined, {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    5 min
                                                </span>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                            <h3 className="text-2xl font-medium text-gray-300 mb-2">Coming Soon</h3>
                            <p className="text-gray-500">We're currently preparing some amazing {category.name.toLowerCase()} gardening guides for you.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-16 flex items-center justify-center gap-4">
                            {currentPage > 1 && (
                                <Link
                                    href={`/categories/${slug}?page=${currentPage - 1}`}
                                    className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                                >
                                    Previous
                                </Link>
                            )}
                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <Link
                                        key={p}
                                        href={`/categories/${slug}?page=${p}`}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${p === currentPage
                                            ? 'bg-purple-600 border-purple-500 text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                                            }`}
                                    >
                                        {p}
                                    </Link>
                                ))}
                            </div>
                            {currentPage < totalPages && (
                                <Link
                                    href={`/categories/${slug}?page=${currentPage + 1}`}
                                    className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    )}
                </section>
            </main>

            <BlogFooter />
        </div>
    )
}

