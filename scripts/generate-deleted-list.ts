/**
 * Script to generate a list of deleted article slugs
 * This will fetch all articles from Supabase and identify non-pickleball content
 * 
 * Usage: npx tsx scripts/generate-deleted-list.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Article {
    slug: string
    title: string
    status: string
}

// Keywords that indicate pickleball content (KEEP these)
const PICKLEBALL_KEYWORDS = [
    'pickleball',
    'paddle',
    'court',
    'dink',
    'volley',
    'serve',
    'tournament',
    'doubles',
    'singles'
]

// Keywords that indicate old content to DELETE
const DELETE_KEYWORDS = [
    'review',
    'ai',
    'writer',
    'baby',
    'growth',
    'agility',
    'software',
    'tool',
    'app',
    'saas',
    'plugin',
    'extension',
    'billionaire',
    'brainwave',
    'manifestation',
    'wealth',
    'money',
    'supplement',
    'health',
    'diet',
    'weight',
    'loss'
]

function shouldDelete(article: Article): boolean {
    const text = `${article.title} ${article.slug}`.toLowerCase()

    // If it contains pickleball keywords, KEEP it
    if (PICKLEBALL_KEYWORDS.some(keyword => text.includes(keyword))) {
        return false
    }

    // If it contains delete keywords, DELETE it
    if (DELETE_KEYWORDS.some(keyword => text.includes(keyword))) {
        return true
    }

    // Default: if not pickleball-related, delete it
    return true
}

async function generateDeletedList() {
    console.log('🔍 Fetching all articles from Supabase...\n')

    const { data: articles, error } = await supabase
        .from('articles')
        .select('slug, title, status')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('❌ Error fetching articles:', error)
        process.exit(1)
    }

    if (!articles || articles.length === 0) {
        console.log('⚠️ No articles found in database')
        return
    }

    console.log(`📊 Found ${articles.length} total articles\n`)

    const toKeep: Article[] = []
    const toDelete: Article[] = []

    articles.forEach((article: Article) => {
        if (shouldDelete(article)) {
            toDelete.push(article)
        } else {
            toKeep.push(article)
        }
    })

    console.log('✅ ARTICLES TO KEEP (Pickleball):')
    console.log('─'.repeat(50))
    toKeep.forEach(article => {
        console.log(`  • ${article.title} (${article.slug})`)
    })

    console.log('\n❌ ARTICLES TO DELETE (Non-Pickleball):')
    console.log('─'.repeat(50))
    toDelete.forEach(article => {
        console.log(`  • ${article.title} (${article.slug})`)
    })

    console.log('\n📈 SUMMARY:')
    console.log(`  Keep: ${toKeep.length} articles`)
    console.log(`  Delete: ${toDelete.length} articles`)

    // Generate the TypeScript array
    const slugsArray = toDelete.map(a => `    '${a.slug}',`).join('\n')

    const fileContent = `/**
 * DELETED ARTICLES - 410 GONE
 * 
 * This is a tombstone list of permanently deleted article slugs.
 * Articles in this list will return HTTP 410 (Gone) status.
 * 
 * Auto-generated on: ${new Date().toISOString()}
 * Total deleted articles: ${toDelete.length}
 * 
 * Why 410 instead of 404?
 * - Tells Google the content is PERMANENTLY gone (not just missing)
 * - Google will remove from search results faster
 * - Prevents wasted crawl budget
 */

export const DELETED_ARTICLE_SLUGS = [
${slugsArray}
] as const

/**
 * Banned URL patterns (for category-level blocking)
 */
export const BANNED_PATTERNS = [
    '/health',
    '/manifestation',
    '/supplements',
    '/reviews', // Block all review category pages
    '/ai-tools', // Block AI tools category
    '/software', // Block software category
] as const

/**
 * Check if a path should return 410 Gone
 */
export function isDeleted(pathname: string): boolean {
    const slug = pathname.replace(/^\\//, '').replace(/\\/$/, '')

    // Check if matches any deleted slug
    if (DELETED_ARTICLE_SLUGS.includes(slug as any)) {
        return true
    }

    // Check if path contains non-pickleball keywords
    const deleteKeywords = ['billionaire', 'brainwave', 'parasite', 'manifestation', 'agility-writer', 'babygrowth']
    if (deleteKeywords.some(keyword => pathname.toLowerCase().includes(keyword))) {
        return true
    }

    // Check if matches any banned pattern
    if (BANNED_PATTERNS.some(pattern => pathname.startsWith(pattern))) {
        return true
    }

    return false
}
`

    // Write to file
    const outputPath = path.join(process.cwd(), 'lib', 'deleted-articles.ts')
    fs.writeFileSync(outputPath, fileContent, 'utf-8')

    console.log(`\n✅ Generated deleted-articles.ts with ${toDelete.length} slugs`)
    console.log(`📁 File saved to: ${outputPath}`)

    // Also generate a list for Google Search Console removal
    const urlList = toDelete.map(a => `https://DecorPoynt.com/${a.slug}`).join('\n')
    const urlListPath = path.join(process.cwd(), 'scripts', 'urls-to-remove.txt')
    fs.writeFileSync(urlListPath, urlList, 'utf-8')

    console.log(`\n📋 URL removal list saved to: ${urlListPath}`)
    console.log(`   Use this file to bulk-remove URLs from Google Search Console`)
}

generateDeletedList().catch(console.error)
