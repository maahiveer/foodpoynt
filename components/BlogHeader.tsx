import Link from 'next/link'

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
}

interface BlogHeaderProps {
  categories: Category[]
}

export function BlogHeader({ categories }: BlogHeaderProps) {
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

            {/* Dynamic Category Links */}
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
              >
                {category.name}
              </Link>
            ))}

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
