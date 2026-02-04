'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMagicLink, setIsMagicLink] = useState(false)
  const { signIn, signInWithMagicLink } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Check if credentials match environment variables
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      
      // Debug logging
      console.log('Debug Login Info:')
      console.log('Entered email:', email)
      console.log('Entered password:', password)
      console.log('Admin email from env:', adminEmail)
      console.log('Admin password from env:', adminPassword ? 'Set' : 'Not Set')
      console.log('Email match:', email === adminEmail)
      console.log('Password match:', password === adminPassword)
      
      if (!adminEmail || !adminPassword) {
        setError('Admin credentials not configured. Please contact the administrator.')
        return
      }
      
      if (email !== adminEmail || password !== adminPassword) {
        setError(`Invalid admin credentials. Expected: ${adminEmail}, Got: ${email}`)
        return
      }
      
      if (isMagicLink) {
        await signInWithMagicLink(email)
        alert('Check your email for the magic link!')
      } else {
        // For environment-based auth, we'll create a session manually
        // This bypasses Supabase auth and uses environment variables
        localStorage.setItem('admin_authenticated', 'true')
        localStorage.setItem('admin_email', email)
        router.push('/admin')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Enter your admin credentials to access the panel
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {!isMagicLink && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <input
                  id="magic-link"
                  name="magic-link"
                  type="checkbox"
                  checked={isMagicLink}
                  onChange={(e) => setIsMagicLink(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded"
                />
                <label htmlFor="magic-link" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                  Use magic link (passwordless login)
                </label>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isMagicLink ? 'Sending magic link...' : 'Signing in...'}
                  </div>
                ) : (
                  isMagicLink ? 'Send Magic Link' : 'Sign In'
                )}
              </button>
            </div>

            <div className="mt-4 text-center">
              <a
                href="/"
                className="text-sm text-slate-600 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
              >
                ← Back to blog
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
