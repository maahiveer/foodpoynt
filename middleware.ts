import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isDeleted } from '@/lib/deleted-articles'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // 1. DELETED CONTENT - Return 410 Gone
  // Check if this URL is a deleted article and return 410 status
  if (isDeleted(pathname)) {
    return new NextResponse('Gone - This content has been permanently removed', {
      status: 410,
      statusText: 'Gone',
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': 'noindex, nofollow'
      }
    })
  }

  // Block indexing on *.vercel.app domains to prevent duplicate content
  // AND ensure we never block the primary domain (DecorPoynt.com)
  const hostname = request.headers.get('host') || ''
  const isVercelDomain = hostname.endsWith('.vercel.app');
  const isPrimaryDomain = hostname === 'www.DecorPoynt.com' || hostname === 'DecorPoynt.com';

  if ((isVercelDomain && !isPrimaryDomain) || pathname.startsWith('/admin')) {
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



