import { NextResponse, type NextRequest } from 'next/server'

const FALLBACK_PASSWORD = 'press-start-1985'

/** Must mirror sessionToken() in src/lib/auth.ts (Web Crypto for the proxy runtime). */
async function expectedToken(): Promise<string> {
  const pw = process.env.ADMIN_PASSWORD || FALLBACK_PASSWORD
  const data = new TextEncoder().encode(`portfolio::${pw}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only guard the admin area; /admin/login is public.
  if (!pathname.startsWith('/admin') || pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  const token = await expectedToken()
  if (request.cookies.get('pw_admin_session')?.value === token) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = '/admin/login'
  url.search = `?from=${encodeURIComponent(pathname)}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin/:path*'],
}
