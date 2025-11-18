import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

interface ArticleSitemap {
  slug: string
  updated_at: string | null
  published_at: string | null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tracksatscale.vercel.app'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/affiliate-disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Get published articles from database
  let articlePages: MetadataRoute.Sitemap = []
  
  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
    ) {
      const { data: articles, error } = await supabase
        .from('articles')
        .select('slug, updated_at, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (!error && articles) {
        articlePages = (articles as ArticleSitemap[])
          .filter((article: ArticleSitemap) => article.slug && article.slug.trim() !== '')
          .map((article: ArticleSitemap) => ({
            url: `${baseUrl}/${article.slug}`,
            lastModified: article.updated_at
              ? new Date(article.updated_at)
              : article.published_at
              ? new Date(article.published_at)
              : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
          }))
      }
    }
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error)
  }

  return [...staticPages, ...articlePages]
}

// Force dynamic rendering so newly published articles appear immediately
export const dynamic = 'force-dynamic'
export const revalidate = 0

