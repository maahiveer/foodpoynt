import Link from 'next/link'

export function BlogFooter() {
  return (
    <footer className="bg-[#030014] border-t border-white/5 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-mono text-lg tracking-wider font-bold text-white">
            decorPoynt&trade;
          </div>
          <nav className="flex items-center gap-8 text-sm text-gray-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </nav>
          <div className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} decorPoynt. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

