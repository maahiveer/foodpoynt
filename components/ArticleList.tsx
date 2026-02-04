import Link from 'next/link'
import { supabase, Article } from '@/lib/supabase'
import { Calendar, Clock, FolderOpen } from 'lucide-react'

type ArticleRecord = Article & {
  tags?: string[]
  featured_image?: string | null
  category?: {
    id: string
    name: string
    slug: string
  } | null
}

async function fetchPublishedArticles(limit = 10): Promise<ArticleRecord[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' ||
    !supabase
  ) {
    return []
  }

  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) {
    console.error('Error fetching published articles:', error)
    return []
  }

  return data.filter(
    (article: ArticleRecord) => !!article.slug && article.slug.trim() !== ''
  )
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getReadingTime = (content: string) => {
  const wordsPerMinute = 200
  const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = textContent.split(' ').filter((word) => word.length > 0).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return Math.min(readingTime, 30)
}

export async function ArticleList() {
  const articles = await fetchPublishedArticles()

  return (
    <section id="articles" className="py-16 sm:py-24 mt-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Latest Articles
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Discover insights, tutorials, and stories about technology and development
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              No published articles yet. Publish your first post from the admin dashboard to see it here.
            </p>
          </div>
        ) : (
          <div className="mt-12 max-w-4xl mx-auto space-y-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group relative bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6 flex gap-6">
                  {article.featured_image && (
                    <div className="w-32 h-24 flex-shrink-0">
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                      <time dateTime={article.published_at || article.created_at} className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(article.published_at || article.created_at)}
                      </time>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getReadingTime(article.content)} min read
                      </div>
                    </div>

                    <h2 className="text-xl font-bold leading-tight text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <Link href={`/${article.slug}`} className="block" scroll>
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
                      {article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...'}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.category && (
                        <Link
                          href={`/categories/${article.category.slug}`}
                          className="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                        >
                          <FolderOpen className="h-3 w-3 mr-1" />
                          {article.category.name}
                        </Link>
                      )}
                      {article.tags && article.tags.length > 0 && article.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center">
                      <Link
                        href={`/${article.slug}`}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        scroll
                      >
                        Read more
                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
