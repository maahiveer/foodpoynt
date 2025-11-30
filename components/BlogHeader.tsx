import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

// PickPoynt Logo Component
function PickPoyntLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-[#1e3a8a] font-bold text-2xl tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        PickPoynt
      </span>
      <span className="text-slate-600 dark:text-slate-400 text-xs -mt-1">
        Decisions made simple
      </span>
    </div>
  )
}

interface Category {
  id: string
  name: string
  slug: string
  parent_id?: string | null
}

interface BlogHeaderProps {
  categories: Category[]
}

export function BlogHeader({ categories }: BlogHeaderProps) {
  // Group categories into hierarchy
  const topLevelCategories = categories.filter(c => !c.parent_id)
  const getSubcategories = (parentId: string) => categories.filter(c => c.parent_id === parentId)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <PickPoyntLogo className="h-12" />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              Home
            </Link>

            {/* Dynamic Category Links with Dropdowns */}
            {topLevelCategories.map((category) => {
              const subcategories = getSubcategories(category.id)
              const hasSubcategories = subcategories.length > 0

              if (hasSubcategories) {
                return (
                  <div key={category.id} className="relative group">
                    <button className="flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
                      <Link href={`/categories/${category.slug}`}>
                        {category.name}
                      </Link>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        {subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/categories/${sub.slug}`}
                            className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            role="menuitem"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                >
                  {category.name}
                </Link>
              )
            })}

            <Link
              href="/about"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              Contact
            </Link>
          </nav>

        </div>
      </div>
    </header>
  )
}
