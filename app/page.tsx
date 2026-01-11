import Link from 'next/link'
import { ArrowRight, ChevronRight, UtensilsCrossed, Cookie, Salad, Pizza, Coffee, Soup, Cake, Leaf, FolderOpen } from 'lucide-react'
import { supabase, Category } from '@/lib/supabase'

export const revalidate = 0 // Ensure fresh data on every request

async function getCategories(): Promise<Category[]> {
  if (!supabase) return []

  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return categories || []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

const getCategoryIcon = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('italian') || lowerName.includes('pizza') || lowerName.includes('pasta')) return Pizza
  if (lowerName.includes('asian') || lowerName.includes('chinese') || lowerName.includes('japanese')) return UtensilsCrossed
  if (lowerName.includes('dessert') || lowerName.includes('sweet') || lowerName.includes('cake')) return Cake
  if (lowerName.includes('breakfast') || lowerName.includes('coffee')) return Coffee
  if (lowerName.includes('healthy') || lowerName.includes('salad')) return Salad
  if (lowerName.includes('vegan') || lowerName.includes('plant')) return Leaf
  if (lowerName.includes('quick') || lowerName.includes('fast')) return UtensilsCrossed
  if (lowerName.includes('comfort') || lowerName.includes('soup')) return Soup
  if (lowerName.includes('cookie') || lowerName.includes('snack')) return Cookie
  return FolderOpen
}

const getCategoryGradient = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('italian')) return 'from-green-600/20 to-red-600/20 hover:border-green-500/50'
  if (lowerName.includes('asian')) return 'from-orange-600/20 to-yellow-600/20 hover:border-orange-500/50'
  if (lowerName.includes('dessert')) return 'from-pink-600/20 to-purple-600/20 hover:border-pink-500/50'
  if (lowerName.includes('breakfast')) return 'from-amber-600/20 to-orange-600/20 hover:border-amber-500/50'
  if (lowerName.includes('healthy')) return 'from-emerald-600/20 to-teal-600/20 hover:border-emerald-500/50'
  if (lowerName.includes('vegan')) return 'from-lime-600/20 to-green-600/20 hover:border-lime-500/50'
  if (lowerName.includes('quick')) return 'from-blue-600/20 to-cyan-600/20 hover:border-blue-500/50'
  if (lowerName.includes('comfort')) return 'from-rose-600/20 to-red-600/20 hover:border-rose-500/50'
  return 'from-slate-600/20 to-slate-800/20 hover:border-slate-500/50'
}

const getIconColor = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('italian')) return 'text-green-400'
  if (lowerName.includes('asian')) return 'text-orange-400'
  if (lowerName.includes('dessert')) return 'text-pink-400'
  if (lowerName.includes('breakfast')) return 'text-amber-400'
  if (lowerName.includes('healthy')) return 'text-emerald-400'
  if (lowerName.includes('vegan')) return 'text-lime-400'
  if (lowerName.includes('quick')) return 'text-blue-400'
  if (lowerName.includes('comfort')) return 'text-rose-400'
  return 'text-slate-400'
}

export default async function Home() {
  const categories = await getCategories()

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
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative pt-12 pb-12 md:pt-20 md:pb-16 overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img
            src="/images/hero-bg.png"
            alt="Delicious cooking background"
            className="w-full h-full object-cover"
            style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030014]/60 to-[#030014]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Elevate your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">cooking</span>.
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Delicious recipes, cooking tips, and culinary inspiration from the kitchen.
            For food lovers, by food lovers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/articles" className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              Explore Recipes <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/about" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur text-white font-medium transition-all flex items-center justify-center">
              Our Mission
            </Link>
          </div>
        </div>
      </div>

      {/* Recipe Categories Section */}
      <section className="container mx-auto px-6 py-16 relative z-10 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore by Category</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover delicious recipes organized by cuisine and meal type
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.name)
              const gradient = getCategoryGradient(category.name)
              const iconColor = getIconColor(category.name)

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br border border-white/10 p-6 md:p-8 transition-all hover:-translate-y-2 hover:shadow-2xl ${gradient}`}
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <Icon className={`w-10 h-10 md:w-12 md:h-12 mb-3 ${iconColor} group-hover:scale-110 transition-transform`} />
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1">{category.name}</h3>
                    <p className="text-xs md:text-sm text-gray-400 line-clamp-1">
                      {category.description || `Explore ${category.name} recipes`}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
            <h3 className="text-xl font-medium text-gray-300 mb-2">No categories found</h3>
            <p className="text-gray-500">Add categories in the admin panel to see them here.</p>
            <Link href="/admin/categories" className="mt-4 inline-block text-purple-400 hover:text-purple-300">
              Go to Category Manager &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* Footer Simple */}
      <footer className="border-t border-white/5 py-12 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} PickPoynt. All rights reserved.</p>
      </footer>
    </main>
  )
}

