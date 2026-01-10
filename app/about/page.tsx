import { BlogHeader } from '@/components/BlogHeader'
import { BlogFooter } from '@/components/BlogFooter'
import { Mail, Youtube, Linkedin, Twitter } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'About Manish Kumar Jain - Food Enthusiast & Founder of PickPoynt',
  description: 'Meet Manish Kumar Jain, the founder of PickPoynt. A passionate home cook sharing delicious recipes, cooking tips, and culinary inspiration.',
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <BlogHeader categories={categories} />

      <main className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">

            {/* Minimal Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                Passion for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Cooking.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Recipes, tips, and culinary inspiration born from real hours spent in the kitchen.
              </p>
            </div>

            <article className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">

              {/* Profile Section */}
              <div className="relative">
                {/* Banner Background */}
                <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-600 to-purple-700 w-full"></div>

                <div className="px-8 sm:px-12 pb-12">
                  <div className="relative -mt-16 sm:-mt-20 mb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
                    <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden shrink-0 bg-slate-200">
                      <img
                        src="/manish-kumar-jain.png"
                        alt="Manish Kumar Jain"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="pb-2">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Manish Kumar Jain</h2>
                      <p className="text-blue-600 dark:text-blue-400 font-medium text-lg">Founder & Chief Editor</p>
                    </div>

                    <div className="sm:ml-auto pb-4">
                      <a
                        href="https://www.linkedin.com/in/manish-kumar-jain-220177395"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <Linkedin className="w-5 h-5" />
                        Connect on LinkedIn
                      </a>
                    </div>
                  </div>

                  {/* Bio Content */}
                  <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Why I Love Cooking</h3>
                      <p>
                        Hi, I'm <strong>Manish Kumar Jain</strong>. My journey with cooking started in my grandmother's kitchen, but it quickly became a lifelong passion. There's something incredibly satisfying about creating delicious meals, experimenting with flavors, and sharing food with loved ones.
                      </p>
                      <p>
                        I spend my weekends (and let's be honest, quite a few weekday evenings) in the <strong>kitchen</strong>, testing new recipes and perfecting old favorites. Whether it's mastering the perfect pasta sauce or discovering the secrets to fluffy pancakes, I live for the culinary details.
                      </p>
                      <p>
                        Cooking isn't just a hobby to me; it's a way of life. It's creative, rewarding, and brings people together. But finding reliable recipes can be challenging. That's why I started PickPoynt—to share my kitchen experiences and help you create amazing meals, without the fluff.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">The PickPoynt Mission</h3>
                      <p>
                        My mission with PickPoynt is simple: to create a resource that is packed with genuine, kitchen-tested recipes. I believe that the best dishes aren't always the most complicated—it's what works best for your taste and lifestyle.
                      </p>
                      <p>
                        Every recipe on this site comes from real-world testing in my kitchen. Whether I'm analyzing flavor profiles or cooking techniques, my goal is to give you the honest information you need to create delicious meals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact / Socials */}
              <div className="bg-slate-50 dark:bg-slate-700/30 p-8 sm:p-12 border-t border-slate-100 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">Let's Connect</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="mailto:hello@pickpoynt.com"
                    className="flex items-center px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors shadow-sm text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <Mail className="h-5 w-5 mr-3 text-slate-400" />
                    hello@pickpoynt.com
                  </a>

                  <a
                    href="https://www.linkedin.com/in/manish-kumar-jain-220177395"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors shadow-sm text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <Linkedin className="h-5 w-5 mr-3 text-blue-600" />
                    LinkedIn
                  </a>

                  <a
                    href="https://youtube.com/@pickpoynt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:border-red-500 dark:hover:border-red-500 transition-colors shadow-sm text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <Youtube className="h-5 w-5 mr-3 text-red-600" />
                    YouTube
                  </a>

                  <a
                    href="https://twitter.com/pickpoynt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:border-sky-500 dark:hover:border-sky-500 transition-colors shadow-sm text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <Twitter className="h-5 w-5 mr-3 text-sky-500" />
                    Twitter
                  </a>
                </div>
              </div>

            </article>

            {/* Newsletter CTA */}
            <div className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 bg-purple-500 rounded-full blur-3xl opacity-20"></div>

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
                <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg">
                  Get the latest reviews, exclusive insights, and personal updates from me delivered directly to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm w-full"
                  />
                  <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-600/30">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}



