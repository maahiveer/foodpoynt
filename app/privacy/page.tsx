import { BlogHeader } from '@/components/BlogHeader'
import { BlogFooter } from '@/components/BlogFooter'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Privacy Policy - PickPoynt',
  description: 'Privacy Policy for PickPoynt. Learn how we collect, use, and protect your personal information.',
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

export default async function PrivacyPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <BlogHeader categories={categories} />

      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 sm:p-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-8">
                Privacy Policy
              </h1>

              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Information We Collect</h2>
                <p className="mb-4">
                  We collect information you provide directly to us, such as when you create an account,
                  subscribe to our newsletter, or contact us. This may include your name, email address,
                  and any other information you choose to provide.
                </p>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">How We Use Your Information</h2>
                <p className="mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Personalize your experience on our blog</li>
                </ul>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Cookies and Tracking</h2>
                <p className="mb-4">
                  We use cookies and similar tracking technologies to collect and use personal information
                  about you. This includes Google Analytics and Google AdSense cookies to analyze traffic
                  and serve personalized ads.
                </p>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Google AdSense</h2>
                <p className="mb-4">
                  Our website uses Google AdSense, a web advertising service provided by Google.
                  Google AdSense uses cookies to serve ads on our site. Google's use of advertising
                  cookies enables it and its partners to serve ads to our users based on their visit
                  to our site and/or other sites on the Internet.
                </p>
                <p className="mb-4">
                  Users may opt out of personalized advertising by visiting
                  <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Google Ad Settings
                  </a>.
                </p>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Data Security</h2>
                <p className="mb-4">
                  We implement appropriate security measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Third-Party Services</h2>
                <p className="mb-4">
                  We may use third-party services such as Google Analytics, Google AdSense, and
                  other analytics tools. These services may collect information about your use of
                  our website.
                </p>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Your Rights</h2>
                <p className="mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your personal information</li>
                  <li>Opt out of marketing communications</li>
                </ul>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="mb-4">
                  Email: privacy@pickpoynt.com<br />
                  Address: PickPoynt, Privacy Department
                </p>

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Changes to This Policy</h2>
                <p className="mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any
                  changes by posting the new Privacy Policy on this page and updating the "Last updated"
                  date.
                </p>
              </div>
            </article>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}



