import { BlogHeader } from "@/components/BlogHeader";
import { BlogHero } from "@/components/BlogHero";
import { ArticleListSSR } from "@/components/ArticleListSSR";
import { BlogFooter } from "@/components/BlogFooter";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import type { Metadata } from "next";

// Force dynamic rendering so newly published articles appear immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pickpoynt.com';
const ARTICLES_PER_PAGE = 10;

export const metadata: Metadata = {
  title: "PickPoynt - Decisions made simple",
  description: "Make informed purchasing decisions with PickPoynt's comprehensive product reviews, buying guides, and consumer insights.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "PickPoynt - Decisions made simple",
    description: "Make informed purchasing decisions with PickPoynt's comprehensive product reviews, buying guides, and consumer insights.",
    url: siteUrl,
    siteName: "PickPoynt",
    type: "website",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PickPoynt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "PickPoynt - Decisions made simple",
    description: "Make informed purchasing decisions with PickPoynt's comprehensive product reviews, buying guides, and consumer insights.",
    images: ['/og-image.png'],
  },
};

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

interface SiteSetting {
  setting_key: string
  setting_value: string | null
}

async function getHomepageBanners() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' ||
    !supabase
  ) {
    return { leftBanner: null, rightBanner: null }
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['homepage_left_banner', 'homepage_right_banner'])

    if (error) {
      console.error('Error fetching homepage banners:', error)
      return { leftBanner: null, rightBanner: null }
    }

    const settings = data as SiteSetting[]
    const leftBanner = settings?.find(s => s.setting_key === 'homepage_left_banner')?.setting_value || null
    const rightBanner = settings?.find(s => s.setting_key === 'homepage_right_banner')?.setting_value || null

    return { leftBanner, rightBanner }
  } catch (error) {
    console.error('Error fetching homepage banners:', error)
    return { leftBanner: null, rightBanner: null }
  }
}

async function getArticles(page: number = 1) {
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
      console.error('Error fetching published articles:', error)
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

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const categories = await getCategories()
  const { articles, totalArticles } = await getArticles(currentPage)
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE)
  const { leftBanner, rightBanner } = await getHomepageBanners()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <BlogHeader categories={categories} />
      <main>


        {/* Category Grid - "WordsAtScale" Style */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-50 mb-2 uppercase tracking-wide">
              Start Exploring
            </h2>
          </div>

          {/* Newsletter Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-3 relative flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 rounded-xl bg-[#0a0f1c] border border-slate-800 shadow-2xl overflow-hidden group">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full pointer-events-none"></div>

              <div className="flex-1 relative z-10 text-center md:text-left mb-8 md:mb-0">
                <span className="inline-block py-1 px-3 rounded bg-blue-900/50 text-blue-300 text-xs font-bold tracking-wider mb-4 border border-blue-800">
                  WEEKLY INSIGHTS
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4 leading-none">
                  Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Newsletter</span>
                </h2>
                <p className="text-slate-400 text-lg max-w-xl mx-auto md:mx-0 font-medium">
                  Get exclusive SEO tips, product breakdowns, and digital marketing strategies delivered straight to your inbox.
                </p>
              </div>

              <div className="relative z-10 w-full md:w-auto shrink-0 animate-fade-in">
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-5 py-3.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full sm:w-72 shadow-inner"
                  />
                  <button className="px-8 py-3.5 bg-[#d4f5e0] text-[#0f1f18] font-black uppercase tracking-wide rounded-lg hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg shadow-emerald-900/20">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Standard Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.filter((c: any) => !c.parent_id).map((category: any, index: number) => {
              // Standard card styling for all categories
              return (
                <Link
                  href={`/categories/${category.slug}`}
                  key={category.id}
                  className="relative flex flex-col justify-between p-8 rounded-xl bg-[#0a0f1c] border border-slate-800 hover:border-slate-700 transition-all group min-h-[250px] hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/10"
                >
                  <div className="flex flex-col h-full items-center text-center justify-between z-10 relative">
                    <div className="w-full">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-blue-400 transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2 group-hover:text-slate-400 transition-colors">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <div className="w-full mt-auto">
                      <span className="inline-block px-6 py-2.5 bg-[#d4f5e0] text-[#0f1f18] text-sm font-black rounded uppercase tracking-wide group-hover:bg-white transition-colors w-full sm:w-auto">
                        {(() => {
                          const nameLower = category.name.toLowerCase();
                          if (nameLower.includes('tool')) return "TRY NOW!";
                          if (nameLower.includes('deal') || nameLower.includes('discount')) return "SAVE NOW!";
                          return "LEARN NOW!";
                        })()}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <BlogFooter />
    </div>
  );
}
