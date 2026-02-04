import { BlogHeader } from '@/components/BlogHeader'
import { BlogFooter } from '@/components/BlogFooter'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Affiliate Disclaimer - decorPoynt',
  description: 'Affiliate disclaimer for decorPoynt. Learn about our affiliate relationships and how they may affect our content.',
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

export default async function AffiliateDisclaimerPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <BlogHeader categories={categories} />

      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 sm:p-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-8">
                Affiliate Disclaimer
              </h1>

              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Important Notice
                  </h2>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    This website may contain affiliate links. If you click on an affiliate link and make a purchase,
                    we may receive a commission at no additional cost to you.
                  </p>
                </div>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">What Are Affiliate Links?</h2>
                <p className="mb-4">
                  Affiliate links are special URLs that allow us to earn a small commission when you make a purchase
                  through our links. These links help us maintain and improve our website while providing you with
                  valuable content and recommendations.
                </p>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Our Affiliate Relationships</h2>
                <p className="mb-4">
                  decorPoynt participates in various affiliate marketing programs, which means we may earn
                  commissions on purchases made through our links to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Amazon Associates Program</li>
                  <li>Technology product retailers</li>
                  <li>Software and service providers</li>
                  <li>Online course platforms</li>
                  <li>Cloud service providers</li>
                  <li>Development tools and resources</li>
                </ul>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Our Commitment to You</h2>
                <p className="mb-4">
                  We want to be completely transparent about our affiliate relationships. Here's our commitment to you:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>Honest Reviews:</strong> We only recommend products and services we genuinely believe in</li>
                  <li><strong>No Bias:</strong> Affiliate relationships do not influence our editorial content</li>
                  <li><strong>Clear Disclosure:</strong> We clearly mark affiliate links when they appear</li>
                  <li><strong>Value First:</strong> Our primary goal is to provide value to our readers</li>
                  <li><strong>Transparency:</strong> We're open about our monetization methods</li>
                </ul>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">How We Use Affiliate Commissions</h2>
                <p className="mb-4">
                  Any commissions we earn from affiliate links are used to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Maintain and improve our website</li>
                  <li>Create high-quality content for our readers</li>
                  <li>Invest in better tools and resources</li>
                  <li>Support our team and operations</li>
                  <li>Keep our content free and accessible</li>
                </ul>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Your Choice</h2>
                <p className="mb-4">
                  Using our affiliate links is completely optional. You can:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Purchase directly from the vendor without using our links</li>
                  <li>Search for the product on your own</li>
                  <li>Use alternative retailers</li>
                  <li>Choose not to make any purchases</li>
                </ul>
                <p className="mb-4">
                  We appreciate when you use our links as it helps support our work, but we never want you to feel
                  pressured to make purchases you don't need or want.
                </p>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">FTC Compliance</h2>
                <p className="mb-4">
                  We comply with the Federal Trade Commission (FTC) guidelines regarding affiliate marketing.
                  This means:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>We clearly disclose our affiliate relationships</li>
                  <li>We provide honest and unbiased opinions</li>
                  <li>We don't make false or misleading claims</li>
                  <li>We maintain editorial independence</li>
                </ul>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Questions About Affiliate Links</h2>
                <p className="mb-4">
                  If you have any questions about our affiliate relationships or how we use affiliate links,
                  please don't hesitate to contact us. We're happy to provide more information about our
                  monetization methods.
                </p>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Changes to This Disclaimer</h2>
                <p className="mb-4">
                  We may update this affiliate disclaimer from time to time to reflect changes in our
                  affiliate relationships or to comply with new regulations. We will notify you of any
                  significant changes by updating the "Last updated" date at the top of this page.
                </p>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about this Affiliate Disclaimer, please contact us at:
                </p>
                <p className="mb-4">
                  Email: affiliates@decorPoynt.com<br />
                  Address: decorPoynt, Affiliate Department
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Thank You for Your Support
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    We appreciate your trust in our recommendations. When you use our affiliate links,
                    you're helping us continue to provide valuable content and resources to the developer
                    community. Thank you for supporting decorPoynt!
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}



