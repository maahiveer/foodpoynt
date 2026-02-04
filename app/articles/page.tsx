import Link from 'next/link'
import { BlogHeader } from '@/components/BlogHeader'
import { BlogFooter } from '@/components/BlogFooter'
import { supabase } from '@/lib/supabase'
import { Calendar, Clock, FolderOpen, ArrowRight, Zap } from 'lucide-react'

export const dynamic = 'force-dynamic'

const ARTICLES_PER_PAGE = 12

export const metadata = {
    title: 'All Decor Guides - decorPoynt',
    description: 'Browse all expert home decor guides and interior design tips on decorPoynt',
}

async function getCategories() {
    if (!supabase) return []
    try {
        const { data } = await supabase.from('categories').select('id, name, slug').order('name', { ascending: true })
        return data || []
    } catch (error) {
        return []
    }
}

async function getAllArticles(page: number = 1) {
    if (!supabase) return { articles: [], totalArticles: 0 }

    try {
        const { count } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published')

        const totalArticles = count || 0
        const from = (page - 1) * ARTICLES_PER_PAGE
        const to = from + ARTICLES_PER_PAGE - 1

        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .range(from, to)

        if (error) return { articles: [], totalArticles: 0 }

        return { articles: data || [], totalArticles }
    } catch (error) {
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

    const categories = await getCategories()
    const { articles, totalArticles } = await getAllArticles(currentPage)
    const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE)

    return (
        <div className="min-h-screen bg-[#030014] text-white">
            <BlogHeader categories={categories} />

            <main className="relative">
                {/* Background Ambience */}
                <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[20%] w-[60%] h-full rounded-full bg-purple-900/10 blur-[120px]" />
                </div>

                {/* Hero Section */}
                <section className="container mx-auto px-6 py-16 md:py-24 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        All Guides
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Explore our full collection of expert home decor guides, interior design tips, and room styling inspiration.
                    </p>
                </section>

                {/* Articles Masonry Grid */}
                <section className="container mx-auto px-6 pb-24">
                    {articles.length > 0 ? (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                            {articles.map((article: any) => (
                                <Link
                                    key={article.id}
                                    href={`/${article.slug}`}
                                    className="group relative flex flex-col break-inside-avoid rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 mb-8"
                                >
                                    {/* Image */}
                                    <div className="w-full overflow-hidden bg-white/5 relative">
                                        {article.featured_image ? (
                                            <img
                                                src={article.featured_image}
                                                alt={article.title}
                                                className="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="aspect-video w-full h-full flex items-center justify-center text-gray-500">
                                                <Zap className="w-10 h-10 opacity-20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#030014] to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6 flex flex-col relative">
                                        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                                            {article.excerpt || "Click to discover styling tips and step-by-step home decor advice..."}
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
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                            <h3 className="text-xl font-medium text-gray-300 mb-2">No guides found</h3>
                            <p className="text-gray-500">Check back soon for new home decor inspiration.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-16 flex items-center justify-center gap-4">
                            {currentPage > 1 && (
                                <Link
                                    href={`/articles?page=${currentPage - 1}`}
                                    className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                                >
                                    Previous
                                </Link>
                            )}
                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <Link
                                        key={p}
                                        href={`/articles?page=${p}`}
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
                                    href={`/articles?page=${currentPage + 1}`}
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

