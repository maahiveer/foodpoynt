import Link from 'next/link'
import { ArrowRight, Star, Shield, Zap, Calendar, Clock, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export const revalidate = 0 // Ensure fresh data on every request

async function getLatestArticles() {
  if (!supabase) return []

  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, featured_image, created_at, tags')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Error fetching articles:', error)
      return []
    }

    return articles || []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

export default async function Home() {
  const articles = await getLatestArticles()

  return (
    <main className="min-h-screen relative bg-[#030014] text-white overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px]" />
      </div>

      {/* Navigation / Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between z-20 relative">
        <div className="font-mono text-lg tracking-wider font-bold">
          PickPoynt&trade;
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link href="/articles" className="hover:text-white transition-colors">Reviews</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="mailto:hello@pickpoynt.com" className="hover:text-white transition-colors">Contact</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-32 relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          The Future of Reviews
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Decisions made <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">simple</span>.
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Unbiased reviews, data-driven comparisons, and real-world testing.
          We dive deep so you don't have to.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/articles" className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
            Browse All Reviews <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/about" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur text-white font-medium transition-all flex items-center justify-center">
            Our Mission
          </Link>
        </div>
      </div>

      {/* Latest Articles Grid */}
      <section className="container mx-auto px-6 py-20 border-t border-white/5 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Latest Reviews</h2>
          <Link href="/articles" className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
            View archive <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/${article.slug}`}
                className="group relative flex flex-col h-full rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10"
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
                      <Zap className="w-10 h-10 opacity-20" />
                    </div>
                  )}

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030014] to-transparent opacity-60" />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col relative">
                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs font-medium px-2 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                    {article.excerpt || "Click to read the full unbiased review and analysis..."}
                  </p>

                  <div className="mt-auto flex items-center text-xs text-gray-500 gap-4 pt-4 border-t border-white/5">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.created_at).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      5 min read
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
            <h3 className="text-xl font-medium text-gray-300 mb-2">No reviews published yet</h3>
            <p className="text-gray-500">Check back soon for our latest in-depth analysis.</p>
          </div>
        )}
      </section>

      {/* Feature Grid (Compact) */}
      <section className="container mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
            <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Expert Analysis</h3>
              <p className="text-sm text-gray-400">Deep dives into specs and performance from industry veterans.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
            <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-500">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Data Driven</h3>
              <p className="text-sm text-gray-400">We test everything. Benchmarks, battery life, and durability.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
            <div className="p-3 rounded-lg bg-pink-500/10 text-pink-500">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">100% Unbiased</h3>
              <p className="text-sm text-gray-400">We purchase our own review units. No sponsored bias.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="border-t border-white/5 py-12 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} PickPoynt. All rights reserved.</p>
      </footer>
    </main>
  )
}
