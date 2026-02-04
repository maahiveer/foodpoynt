/**
 * Script to check if old article URLs are properly returning 404/410
 * This helps verify that deleted content is being handled correctly
 */

// List of old article URLs that should be deleted
const OLD_URLS = [
    'https://DecorPoynt.com/agility-writer-review',
    'https://DecorPoynt.com/babygrowth-review',
    'https://DecorPoynt.com/billionaire-brain-wave-reviews',
    'https://DecorPoynt.com/billionaire-brainwave',
    'https://DecorPoynt.com/manifesting-abundance',
    'https://DecorPoynt.com/wealth-manifestation',
    'https://DecorPoynt.com/attract-money-fast',
]

async function checkUrls() {
    console.log('🔍 Checking old URLs for proper 404/410 responses...\n')

    for (const url of OLD_URLS) {
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                redirect: 'manual' // Don't follow redirects
            })

            const status = response.status
            const statusText = response.statusText

            if (status === 404 || status === 410) {
                console.log(`✅ ${url}`)
                console.log(`   Status: ${status} ${statusText} (Good - will be removed from Google)`)
            } else if (status === 200) {
                console.log(`❌ ${url}`)
                console.log(`   Status: ${status} ${statusText} (BAD - still accessible!)`)
            } else {
                console.log(`⚠️  ${url}`)
                console.log(`   Status: ${status} ${statusText}`)
            }
            console.log('')
        } catch (error) {
            console.log(`❌ ${url}`)
            console.log(`   Error: ${error}`)
            console.log('')
        }
    }

    console.log('\n📋 NEXT STEPS:')
    console.log('1. If URLs return 404/410: Submit removal requests in Google Search Console')
    console.log('2. If URLs return 200: Add slugs to lib/deleted-articles.ts')
    console.log('3. Use Google Search Console → Removals → New Request')
    console.log('4. Submit each URL for temporary removal (works in 24-48 hours)')
}

checkUrls().catch(console.error)
