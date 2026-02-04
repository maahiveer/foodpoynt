import { createClient } from '@supabase/supabase-js'

// Check if we have valid environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Environment check:', {
  supabaseUrl: supabaseUrl ? 'Set' : 'Not set',
  supabaseAnonKey: supabaseAnonKey ? 'Set' : 'Not set',
  urlValid: supabaseUrl && supabaseUrl.startsWith('https://') && supabaseUrl !== 'https://placeholder.supabase.co',
  keyValid: supabaseAnonKey && supabaseAnonKey !== 'placeholder-key'
})

// Only create real client if we have valid URLs
let supabase: any = null

if (supabaseUrl &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'placeholder-key') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Real Supabase client created successfully')
  } catch (error) {
    console.warn('❌ Failed to create Supabase client:', error)
    supabase = createMockClient()
  }
} else {
  console.warn('⚠️ Using mock Supabase client - environment variables not properly configured')
  // Create a mock client for development
  supabase = createMockClient()
}

const mockBuilder = {
  select: () => mockBuilder,
  insert: () => mockBuilder,
  update: () => mockBuilder,
  delete: () => mockBuilder,
  eq: () => mockBuilder,
  order: () => mockBuilder,
  limit: () => mockBuilder,
  single: () => Promise.resolve({ data: null, error: null }),
  maybeSingle: () => Promise.resolve({ data: null, error: null }),
  match: () => mockBuilder,
  then: (resolve: any) => resolve({ data: [], error: null })
}

function createMockClient() {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signUp: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
      signInWithOtp: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => mockBuilder
  }
}

export { supabase }

// Database types
export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  status: 'draft' | 'published'
  author_id: string
  created_at: string
  updated_at: string
  published_at?: string
  tags: string[]
  featured_image?: string
  category_id?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string | null
  created_at: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'admin' | 'editor'
  created_at: string
}
