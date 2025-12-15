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
        <BlogHero />

        {/* Category Grid - "WordsAtScale" Style */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-50 mb-2 uppercase tracking-wide">
              Start Exploring
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.filter((c: any) => !c.parent_id).map((category: any, index: number) => {
              // First item is the "Hero" span-3
              const isHero = index === 0;
              const spanClass = isHero ? "md:col-span-3" : "col-span-1";
              const heightClass = isHero ? "min-h-[350px]" : "min-h-[250px]";

              // Image for the Hero section
              const heroImage = "https://picsum.photos/seed/seo-academy/500/500";

              return (
                <Link
                  href={`/categories/${category.slug}`}
                  key={category.id}
                  className={`relative flex flex-col justify-between p-8 rounded-xl bg-[#0a0f1c] border border-slate-800 hover:border-slate-700 transition-all group ${spanClass} ${heightClass}`}
                >
                  <div className="flex flex-col md:flex-row h-full items-center gap-8">
                    {/* Hero specific layout */}
                    {isHero && (
                      <div className="shrink-0 hidden md:block w-1/3">
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-800 relative">
                          <img src={heroImage} alt={category.name} className="object-cover w-full h-full opacity-90" />
                        </div>
                      </div>
                    )}

                    <div className={`flex flex-col ${isHero ? "md:w-2/3 items-start text-left" : "w-full items-center text-center"} h-full justify-between`}>
                      <div className="w-full">
                        <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
                          {category.name}
                        </h3>
                        {/* Description mainly for Hero or if available */}
                        {isHero || category.description ? (
                          <p className="text-slate-400 text-sm sm:text-base font-medium mb-6 line-clamp-3">
                            {category.description || "Master this topic with our comprehensive guides, expert reviews, and data-driven insights tailored for your success."}
                          </p>
                        ) : null}
                      </div>

                      <div className={`mt-auto ${isHero ? "w-auto" : "w-full"}`}>
                        <span className="inline-block px-8 py-3 bg-[#d4f5e0] text-[#0f1f18] text-sm sm:text-base font-black rounded uppercase tracking-wide hover:bg-white transition-colors">
                          {isHero ? "Enrol Now for FREE" : (
                            index % 2 === 0 ? "TRY NOW!" : "LEARN NOW!"
                          )}
                        </span>
                      </div>
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
