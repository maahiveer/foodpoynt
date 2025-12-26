/**
 * Script to check if old article URLs are properly returning 404/410 LOCALLY
 */

// List of old article URLs to check against localhost
const SLUGS = [
    'agility-writer-review',
    'babygrowth-review',
    'billionaire-brain-wave-reviews',
    'manifesting-abundance',
    'wealth-manifestation',
    'attract-money-fast',
    'random-slug-that-does-not-exist' // Should be 404
]

const BASE_URL = 'http://localhost:3000'

async function checkLocalUrls() {
    console.log(`🔍 Checking URLs against ${BASE_URL}...\n`)

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 3000))

    for (const slug of SLUGS) {
        const url = `${BASE_URL}/${slug}`
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                redirect: 'manual'
            })

            const status = response.status

            if (status === 410) {
                console.log(`✅ /${slug} -> 410 GONE (Perfect!)`)
            } else if (status === 404) {
                console.log(`✅ /${slug} -> 404 NOT FOUND (Good)`)
            } else if (status === 307 || status === 308) {
                console.log(`❌ /${slug} -> ${status} REDIRECT (Bad - still redirecting!)`)
            } else {
                console.log(`⚠️  /${slug} -> ${status}`)
            }
        } catch (error) {
            console.log(`❌ /${slug} -> Error connection refused (Is server running?)`)
        }
    }
}

checkLocalUrls().catch(console.error)
