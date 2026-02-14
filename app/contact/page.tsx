import { BlogHeader } from '@/components/BlogHeader'
import { BlogFooter } from '@/components/BlogFooter'
import { ContactForm } from '@/components/ContactForm'
import { Mail, Phone, MapPin } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Contact Us - foodPoynt',
  description: 'Get in touch with the foodPoynt team. We are here to answer your cooking questions and hear your feedback.',
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

export default async function ContactPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <BlogHeader categories={categories} />

      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 sm:p-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
                Contact Us
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 text-center">
                Have a recipe question, suggestion, or want to collaborate? We'd love to hear from you!
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                    Get in Touch
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Email</h3>
                        <p className="text-slate-600 dark:text-slate-400">hello@foodpoynt.com</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">We'll respond within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Phone</h3>
                        <p className="text-slate-600 dark:text-slate-400">+1 (555) 123-4567</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">Mon-Fri 9AM-6PM EST</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Office</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          123 Tech Street<br />
                          San Francisco, CA 94105
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Social Media
                    </h3>
                    <div className="flex space-x-4">
                      <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        Twitter
                      </a>
                      <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        LinkedIn
                      </a>
                      <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                    Send us a Message
                  </h2>
                  <ContactForm />
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
