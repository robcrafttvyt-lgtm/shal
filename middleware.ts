import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIP, createSecureHeaders, logSecurityEvent } from './lib/security'

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/admin',
  '/profil',
  '/siparisler'
]

// API routes that need rate limiting
const API_ROUTES = [
  '/api'
]

// Routes that need special rate limiting
const SPECIAL_RATE_LIMIT_ROUTES = {
  '/giris': 'login',
  '/kayit': 'register',
  '/checkout': 'checkout'
} as const

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''

  // Create response with security headers
  const response = NextResponse.next()
  const secureHeaders = createSecureHeaders()

  // Apply security headers to all requests
  Object.entries(secureHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Apply rate limiting based on route
  let rateLimitType: keyof typeof import('./lib/security').RATE_LIMITS = 'api'
  let shouldRateLimit = false

  if (API_ROUTES.some(route => pathname.startsWith(route))) {
    rateLimitType = 'api'
    shouldRateLimit = true
  } else if (pathname in SPECIAL_RATE_LIMIT_ROUTES) {
    rateLimitType = SPECIAL_RATE_LIMIT_ROUTES[pathname as keyof typeof SPECIAL_RATE_LIMIT_ROUTES] as any
    shouldRateLimit = true
  }

  if (shouldRateLimit) {
    const limitResult = rateLimit(ip, rateLimitType)
    
    if (!limitResult.success) {
      logSecurityEvent({
        type: 'rate_limit',
        ip,
        userAgent,
        details: { 
          path: pathname,
          type: rateLimitType 
        }
      })

      const retryAfter = Math.ceil((limitResult.resetTime - Date.now()) / 1000)
      
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter 
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': retryAfter.toString(),
              ...secureHeaders
            }
          }
        )
      } else {
        // For page routes, redirect to rate limit page or show error
        const url = request.nextUrl.clone()
        url.pathname = '/rate-limit'
        url.searchParams.set('retryAfter', retryAfter.toString())
        return NextResponse.redirect(url)
      }
    }

    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', limitResult.remaining.toString())
    response.headers.set('X-RateLimit-Remaining', limitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', limitResult.resetTime.toString())
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    const userCookie = request.cookies.get('user')?.value
    
    if (!userCookie) {
      // Not logged in, redirect to login
      const url = request.nextUrl.clone()
      url.pathname = '/giris'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    try {
      const user = JSON.parse(userCookie)
      if (user.type !== 'admin') {
        // Not admin, redirect to homepage
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    } catch (error) {
      // Invalid user data, redirect to login
      const url = request.nextUrl.clone()
      url.pathname = '/giris'
      return NextResponse.redirect(url)
    }
  }

  // Block common attack patterns
  const suspiciousPatterns = [
    /\.\.\//,  // Directory traversal
    /<script/i, // XSS attempts
    /union\s+select/i, // SQL injection
    /exec\s*\(/i, // Code execution
    /eval\s*\(/i, // Code execution
  ]

  const fullUrl = request.url
  const queryString = request.nextUrl.searchParams.toString()
  
  if (suspiciousPatterns.some(pattern => pattern.test(fullUrl) || pattern.test(queryString))) {
    logSecurityEvent({
      type: 'suspicious_activity',
      ip,
      userAgent,
      details: {
        url: fullUrl,
        query: queryString,
        blocked: true
      }
    })

    return new NextResponse('Forbidden', { 
      status: 403,
      headers: secureHeaders
    })
  }

  // Bot detection (simple)
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i
  ]

  const isBot = botPatterns.some(pattern => pattern.test(userAgent))
  
  if (isBot && (pathname.startsWith('/admin') || pathname.startsWith('/api/admin'))) {
    logSecurityEvent({
      type: 'suspicious_activity',
      ip,
      userAgent,
      details: {
        reason: 'Bot accessing admin area',
        blocked: true
      }
    })

    return new NextResponse('Forbidden', { 
      status: 403,
      headers: secureHeaders
    })
  }

  // Add security tracking headers
  response.headers.set('X-Request-ID', crypto.randomUUID())
  response.headers.set('X-Content-Type-Options', 'nosniff')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
