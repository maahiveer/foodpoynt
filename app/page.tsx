import { BlogHeader } from "@/components/BlogHeader";
import { BlogHero } from "@/components/BlogHero";
import { ArticleListSSR } from "@/components/ArticleListSSR";
import { BlogFooter } from "@/components/BlogFooter";
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

        {/* Homepage Content with Banners */}
        <div className="flex gap-6 max-w-[1920px] mx-auto px-4">
          {/* Left Banner */}
          {leftBanner && (
            <aside className="hidden xl:block w-64 flex-shrink-0 sticky top-8 self-start">
              <div
                className="aspect-[9/16] w-full overflow-hidden rounded-lg shadow-lg"
                dangerouslySetInnerHTML={{ __html: leftBanner }}
              />
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <ArticleListSSR
              articles={articles}
              currentPage={currentPage}
              totalPages={totalPages}
              totalArticles={totalArticles}
            />
          </div>

          {/* Right Banner */}
          {rightBanner && (
            <aside className="hidden xl:block w-64 flex-shrink-0 sticky top-8 self-start">
              <div
                className="aspect-[9/16] w-full overflow-hidden rounded-lg shadow-lg"
                dangerouslySetInnerHTML={{ __html: rightBanner }}
              />
            </aside>
          )}
        </div>
      </main>
      <BlogFooter />
    </div>
  );
}
