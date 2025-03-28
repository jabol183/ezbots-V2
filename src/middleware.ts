import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Skip middleware for API routes to avoid interfering with them
  if (path.startsWith('/api/')) {
    console.log('Middleware: Skipping API route:', path);
    return NextResponse.next();
  }

  // Skip middleware in production mode when using static exports
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SKIP_MIDDLEWARE === 'true') {
    return NextResponse.next()
  }

  try {
    const response = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res: response })

    // Refresh session if expired & within a server component
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Handle redirects based on authentication status
    // Paths that should redirect to login if not authenticated
    const protectedRoutes = ['/dashboard']
    // Check if the path starts with any of the protected routes
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

    // Redirect to login if accessing protected route without session
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Redirect to dashboard if accessing auth routes with active session
    const authRoutes = ['/login', '/signup']
    if (authRoutes.includes(path) && session) {
      const redirectUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // Return next response to prevent breaking the app on error
    return NextResponse.next()
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts, /icons, /images (inside /public)
     * 4. /favicon.ico, /sitemap.xml (commonly used static files)
     * 5. All files with extensions (e.g. /file.json)
     */
    '/((?!_next|api\\/|fonts|icons|images|favicon.ico|sitemap.xml|.*\\..*$).*)',
  ],
} 