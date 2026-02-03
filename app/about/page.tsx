import { BlogHeader } from '@/components/BlogHeader'
import { BlogFooter } from '@/components/BlogFooter'
import { Mail, Youtube, Linkedin, Twitter } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'About Devika Nanda - Gardening Enthusiast & Founder of PickPoynt',
  description: 'Meet Devika Nanda, the founder of PickPoynt. A passionate gardener sharing organic growing tips, garden design inspiration, and sustainable living advice.',
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
    <div className="min-h-screen bg-[#030014] text-white">
      <BlogHeader categories={categories} />

      <main className="py-12 sm:py-24 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[120px]" />
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">

            {/* Hero Section */}
            <div className="text-center mb-20">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                Passion for <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Gardening.</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Expert tips, plant care guides, and landscaping inspiration born from real hours spent in the soil.
              </p>
            </div>

            <article className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">

              {/* Profile Section */}
              <div className="relative">
                {/* Banner Background */}
                <div className="h-32 sm:h-48 bg-gradient-to-r from-green-600/20 to-emerald-600/20 w-full relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030014]/20" />
                </div>

                <div className="px-8 sm:px-12 pb-12">
                  <div className="relative -mt-16 sm:-mt-20 mb-10 flex flex-col sm:flex-row items-center sm:items-end gap-8 text-center sm:text-left">
                    <div className="h-32 w-32 sm:h-44 sm:w-44 rounded-full border-4 border-[#030014] shadow-2xl overflow-hidden shrink-0 bg-white/5">
                      <img
                        src="/manish-kumar-jain.png"
                        alt="Devika Nanda"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="pb-4">
                      <h2 className="text-3xl font-bold text-white mb-2">Devika Nanda</h2>
                      <p className="text-green-400 font-medium text-lg">Founder & Chief Editor</p>
                    </div>

                    <div className="sm:ml-auto pb-4">
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-full font-bold transition-all shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Linkedin className="w-5 h-5" />
                        Connect
                      </a>
                    </div>
                  </div>

                  {/* Bio Content */}
                  <div className="prose prose-lg prose-invert max-w-none text-gray-400 leading-relaxed space-y-12">
                    <section>
                      <h3 className="text-2xl font-bold text-white mb-4">Why I Love Gardening</h3>
                      <div className="space-y-4">
                        <p>
                          Hi, I&apos;m <strong>Devika Nanda</strong>. My journey with gardening started in my family&apos;s backyard, but it quickly became a lifelong passion. There&apos;s something incredibly satisfying about growing your own food, nurturing life from seed, and sharing the harvest with loved ones.
                        </p>
                        <p>
                          I spend my weekends in the <strong>garden</strong>, tending to my plants and experimenting with new varieties. Whether it&apos;s mastering soil health or discovering the secrets to a thriving vegetable patch, I live for the botanical details.
                        </p>
                        <p>
                          Gardening isn&apos;t just a hobby to me; it&apos;s a way of life. It&apos;s creative, rewarding, and connects us with nature. But finding reliable gardening advice can be challenging. That&apos;s why I started PickPoynt—to share my gardening experiences and help you grow a thriving outdoor space.
                        </p>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-2xl font-bold text-white mb-4">The PickPoynt Mission</h3>
                      <div className="space-y-4">
                        <p>
                          My mission with PickPoynt is simple: to create a resource that is packed with genuine, garden-tested advice. I believe that the most beautiful gardens aren&apos;t always the most complicated—it&apos;s what works best for your environment and lifestyle.
                        </p>
                        <p>
                          Every guide on this site comes from real-world testing in my garden. Whether I&apos;m analyzing plant performance or growing techniques, my goal is to give you the honest information you need to create a beautiful, productive garden.
                        </p>
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              {/* Contact / Socials */}
              <div className="bg-white/5 p-8 sm:p-12 border-t border-white/10">
                <h3 className="text-2xl font-bold text-white mb-8 text-center">Let&apos;s Connect</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="mailto:hello@pickpoynt.com"
                    className="flex items-center px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:border-green-500/50 transition-all text-gray-300 font-medium"
                  >
                    <Mail className="h-5 w-5 mr-3 text-green-400" />
                    hello@pickpoynt.com
                  </a>

                  <a
                    href="https://youtube.com/@pickpoynt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:border-red-500/50 transition-all text-gray-300 font-medium"
                  >
                    <Youtube className="h-5 w-5 mr-3 text-red-500" />
                    YouTube
                  </a>

                  <a
                    href="https://twitter.com/pickpoynt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:border-sky-500/50 transition-all text-gray-300 font-medium"
                  >
                    <Twitter className="h-5 w-5 mr-3 text-sky-500" />
                    Twitter
                  </a>
                </div>
              </div>

            </article>

            {/* Newsletter CTA */}
            <div className="mt-20 relative rounded-3xl p-8 sm:p-16 text-center border border-white/10 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 -z-10" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

              <h2 className="text-4xl font-bold mb-6 text-white">Join Our Community</h2>
              <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Get the latest gardening tips, seasonal planting guides, and personal updates delivered directly to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 backdrop-blur-sm w-full transition-all"
                />
                <button type="submit" className="px-10 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-bold transition-all shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}



