const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function checkSlugs() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        console.log('Supabase env vars missing')
        return
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, status')
        .eq('status', 'published')
        .limit(10)

    if (error) {
        console.error('Error:', error)
        return
    }

    console.log('Sample Slugs:')
    data.forEach(article => {
        console.log(`- Title: "${article.title}" | Slug: "${article.slug}"`)
    })
}

checkSlugs()
