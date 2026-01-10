require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkArticles() {
    console.log('🔍 Checking for articles in database...\n');

    try {
        // Get all articles
        const { data: articles, error } = await supabase
            .from('articles')
            .select('id, title, slug, status, created_at, published_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Error fetching articles:', error.message);
            return;
        }

        if (!articles || articles.length === 0) {
            console.log('✅ SUCCESS! No articles found in database.');
            console.log('📝 Your database is clean - all articles have been deleted.\n');
            return;
        }

        console.log(`⚠️  Found ${articles.length} article(s) in database:\n`);

        articles.forEach((article, index) => {
            console.log(`${index + 1}. Title: ${article.title}`);
            console.log(`   Slug: ${article.slug}`);
            console.log(`   Status: ${article.status}`);
            console.log(`   Created: ${new Date(article.created_at).toLocaleDateString()}`);
            console.log(`   ID: ${article.id}\n`);
        });

        console.log(`\n📊 Summary:`);
        console.log(`   Total articles: ${articles.length}`);
        console.log(`   Published: ${articles.filter(a => a.status === 'published').length}`);
        console.log(`   Draft: ${articles.filter(a => a.status === 'draft').length}`);

    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

checkArticles();
