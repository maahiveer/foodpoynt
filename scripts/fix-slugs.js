const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function fixEmptySlugs() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        console.log('Supabase env vars missing')
        return
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, slug')
        .or('slug.eq.,slug.is.null')

    if (error) {
        console.error('Error fetching articles:', error)
        return
    }

    console.log(`Found ${articles.length} articles with empty/null slugs.`)

    for (const article of articles) {
        const newSlug = article.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')

        console.log(`Updating "${article.title}" -> "${newSlug}"`)

        const { error: updateError } = await supabase
            .from('articles')
            .update({ slug: newSlug })
            .eq('id', article.id)

        if (updateError) {
            console.error(`Error updating article ${article.id}:`, updateError)
        }
    }

    console.log('Finished fixing slugs.')
}

fixEmptySlugs()
