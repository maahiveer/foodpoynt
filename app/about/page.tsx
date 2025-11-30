import { BlogHeader } from '@/components/BlogHeader'
import { BlogFooter } from '@/components/BlogFooter'
import { Mail, Youtube, Linkedin, Github, Twitter } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'About Me - PickPoynt',
  description: 'Learn about the creator of PickPoynt - your trusted source for honest product reviews, buying guides, and consumer insights.',
}

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

export default async function AboutPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <BlogHeader categories={categories} />

      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 sm:p-12">
              {/* Header Section */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">PP</span>
                  </div>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  About Me
                </h1>
              </div>

              {/* In the Spotlight Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">In the spotlight</h2>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center mb-6">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mr-6">
                      <span className="text-3xl font-bold text-white">PP</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">PickPoynt Creator</h3>
                      <p className="text-slate-600 dark:text-slate-400">Founder & Product Reviewer</p>
                    </div>
                  </div>

                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
                    I am the creator and owner of PickPoynt, a comprehensive product review platform
                    dedicated to helping consumers make informed purchasing decisions.
                  </p>

                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    My passion lies in testing, analyzing, and reviewing products across various categories.
                    I am an avid researcher and conduct rigorous tests to present only the most accurate
                    and unbiased product reviews the market has to offer.
                  </p>

                  <p className="text-slate-600 dark:text-slate-400">
                    Here you can find honest, detailed reviews of the latest products, along with
                    comprehensive buying guides and comparison charts to help you choose the best products
                    for your needs and budget.
                  </p>
                </div>
              </div>

              {/* Newsletter Section */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-8 rounded-xl border border-green-200 dark:border-green-800 mb-12">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Join The Newsletter + Access Free Buying Guides
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Get the latest product reviews, exclusive deals, and comprehensive buying guides delivered to your inbox.
                  Plus, access to free comparison charts and product recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* What I Offer Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">What I Offer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">In-Depth Product Reviews</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Comprehensive, unbiased reviews covering features, performance,
                      pros and cons, and real-world testing results.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Buying Guides & Comparisons</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Detailed buying guides and side-by-side comparisons to help you
                      make the best purchasing decisions for your needs.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Product Categories</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Reviews across multiple categories including electronics, home & garden,
                      health & fitness, beauty, and lifestyle products.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Exclusive Deals & Discounts</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Access to exclusive deals, discount codes, and special offers
                      on reviewed products to help you save money.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Contact Me Here</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Have a product you'd like me to review? Questions about a specific product?
                  You can contact me anytime, and I'll get back to you as soon as possible.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="mailto:hello@pickpoynt.com"
                    className="flex items-center px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Mail className="h-5 w-5 mr-3 text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">Email</span>
                  </a>

                  <a
                    href="https://youtube.com/@pickpoynt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 bg-red-100 dark:bg-red-900/20 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Youtube className="h-5 w-5 mr-3 text-red-600 dark:text-red-400" />
                    <span className="text-slate-700 dark:text-slate-300">YouTube</span>
                  </a>

                  <a
                    href="https://linkedin.com/in/pickpoynt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Linkedin className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-slate-700 dark:text-slate-300">LinkedIn</span>
                  </a>

                  <a
                    href="https://github.com/pickpoynt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Github className="h-5 w-5 mr-3 text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">GitHub</span>
                  </a>

                  <a
                    href="https://twitter.com/pickpoynt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Twitter className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-slate-700 dark:text-slate-300">Twitter</span>
                  </a>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Ready to Find Your Perfect Product?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Explore our latest product reviews and buying guides to make informed purchasing decisions with PickPoynt.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Browse Product Reviews
                </a>
              </div>
            </article>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}



