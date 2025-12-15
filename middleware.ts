import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { BANNED_PATTERNS } from '@/lib/banned-patterns'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current URL starts with any banned pattern
  const isBanned = BANNED_PATTERNS.some(pattern => pathname.startsWith(pattern))

  if (isBanned) {
    // Return a 410 Gone status
    return new NextResponse('Page Gone', { status: 410, statusText: 'Gone' })
  }

  const response = NextResponse.next()

  // Block indexing on Vercel deployment URL
  const hostname = request.headers.get('host') || ''
  if (hostname.includes('vercel.app')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  // Set no-cache headers for all pages to prevent caching
  // This ensures articles appear immediately after publishing
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  response.headers.set('X-Cache-Control', 'no-store')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}



