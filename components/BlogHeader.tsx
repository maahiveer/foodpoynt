'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  parent_id?: string | null
}

interface BlogHeaderProps {
  categories: Category[]
  theme?: 'dark' | 'light'
}

export function BlogHeader({ categories, theme = 'dark' }: BlogHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isDark = theme === 'dark'

  return (
    <header className={`sticky top-0 z-50 w-full backdrop-blur-xl transition-colors duration-300 ${isDark
        ? 'bg-[#030014]/80 border-b border-white/5'
        : 'bg-white/80 border-b border-slate-200/60 shadow-sm'
      }`}>
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className={`font-mono text-lg tracking-wider font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'
              }`}>
              PickPoynt&trade;
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Home
            </Link>
            <Link
              href="/articles"
              className={`text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Recipes
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={`md:hidden py-6 border-t animate-in fade-in slide-in-from-top-4 duration-300 ${isDark ? 'border-white/5' : 'border-slate-200'
            }`}>
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`text-lg font-medium transition-colors px-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/articles"
                className={`text-lg font-medium transition-colors px-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Recipes
              </Link>
              <Link
                href="/about"
                className={`text-lg font-medium transition-colors px-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`text-lg font-medium transition-colors px-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

