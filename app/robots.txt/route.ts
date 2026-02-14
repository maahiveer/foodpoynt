import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const host = request.headers.get('host') || ''

    // Block only preview deployments if needed, but allow main vercel app for verification
    // if (host.includes('-git-') || host.includes('-preview-')) {
    //     return new Response(
    //         `User-agent: *
    //         Disallow: /`,
    //         {
    //             headers: {
    //                 'Content-Type': 'text/plain',
    //             },
    //         }
    //     )
    // }

    // Allow crawlers on all domains including Vercel



    // Allow crawlers on custom domain
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${host}`

    return new Response(
        `# Allow all crawlers
User-agent: *
Allow: /

# Disallow admin and preview routes
Disallow: /admin/
Disallow: /preview/
Disallow: /api/

# Crawl-delay to prevent server overload
Crawl-delay: 1

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml`,
        {
            headers: {
                'Content-Type': 'text/plain',
            },
        }
    )
}
