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

        {/* Category Bento Grid Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">Explore Topics</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Dive into our comprehensive guides, reviews, and insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {categories.filter((c: any) => !c.parent_id).map((category: any, index: number) => {
              // Bento Grid Logic: Cycle through different span patterns
              // Pattern repeats every 10 items
              const i = index % 10;
              let spanClass = "col-span-1 row-span-1"; // Default

              if (i === 0) spanClass = "md:col-span-2 md:row-span-2"; // Big Square
              else if (i === 1) spanClass = "md:col-span-1 md:row-span-1";
              else if (i === 2) spanClass = "md:col-span-1 md:row-span-2"; // Tall
              else if (i === 3) spanClass = "md:col-span-2 md:row-span-1"; // Wide
              else if (i === 4) spanClass = "md:col-span-1 md:row-span-1";
              else if (i === 5) spanClass = "md:col-span-1 md:row-span-1";
              else if (i === 6) spanClass = "md:col-span-2 md:row-span-1"; // Wide
              else if (i === 7) spanClass = "md:col-span-1 md:row-span-1";
              else if (i === 8) spanClass = "md:col-span-1 md:row-span-1";
              else if (i === 9) spanClass = "md:col-span-2 md:row-span-1"; // Wide

              // Fallback specifically for mobile to be simple or 2-col
              const mobileClass = "col-span-1";

              // Generate a consistent random image
              const bgImage = `https://picsum.photos/seed/${category.id}/800/600`;

              return (
                <Link
                  href={`/categories/${category.slug}`}
                  key={category.id}
                  className={`group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${mobileClass} ${spanClass}`}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${bgImage})` }}
                  />

                  {/* Overlay Gradient - Darker at bottom for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                      <h3 className="text-2xl font-bold text-white mb-1 shadow-black/50 drop-shadow-md">
                        {category.name}
                      </h3>
                      <div className="h-0.5 w-12 bg-blue-500 rounded-full mb-2 group-hover:w-full transition-all duration-500" />

                      <div className="flex items-center text-blue-200 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                        <span>Explore Category</span>
                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
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
