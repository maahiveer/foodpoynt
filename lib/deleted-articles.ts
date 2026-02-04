/**
 * DELETED ARTICLES - 410 GONE
 * 
 * This is a tombstone list of permanently deleted article slugs.
 * Articles in this list will return HTTP 410 (Gone) status.
 * 
 * Auto-generated on: 2025-12-26T10:19:16.233Z
 * Total deleted articles: 0
 * 
 * Why 410 instead of 404?
 * - Tells Google the content is PERMANENTLY gone (not just missing)
 * - Google will remove from search results faster
 * - Prevents wasted crawl budget
 */

export const DELETED_ARTICLE_SLUGS = [
    // Spam/Low Quality Content Removed
    'billionaire-brain-wave-reviews',
    'billionaire-brainwave',
    'manifesting-abundance',
    'wealth-manifestation',
    'attract-money-fast',
    'agility-writer-review',
    'babygrowth-review',
    'docuask-ai-review',
    'wispr-flow-ai',
    'the-elon-code',
    'blackout-protocol',
    'davids-shield-reviews',
    'neuro-energizer-review',

    // Add any other deleted article slugs here
] as const

/**
 * Banned URL patterns (for category-level blocking)
 */
export const BANNED_PATTERNS = [
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
    const slug = pathname.replace(/^\//, '').replace(/\/$/, '')

    // Check if matches any deleted slug
    if (DELETED_ARTICLE_SLUGS.includes(slug as any)) {
        return true
    }

    // Check if path contains non-pickleball/recipe keywords
    const deleteKeywords = ['billionaire', 'parasite', 'manifestation', 'agility-writer', 'babygrowth']
    if (deleteKeywords.some(keyword => pathname.toLowerCase().includes(keyword))) {
        return true
    }

    // Check if matches any banned pattern
    if (BANNED_PATTERNS.some(pattern => pathname.startsWith(pattern))) {
        return true
    }

    return false
}

