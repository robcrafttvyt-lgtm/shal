import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Rate limiting store (In production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; lastReset: number }>()

// CSRF token store (In production, use session storage)
const csrfTokenStore = new Map<string, { token: string; expires: number }>()

// Rate limiting configuration
const RATE_LIMITS = {
  login: { requests: 5, window: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  register: { requests: 3, window: 60 * 60 * 1000 }, // 3 requests per hour
  api: { requests: 100, window: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  checkout: { requests: 10, window: 60 * 60 * 1000 }, // 10 requests per hour
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

export function rateLimit(identifier: string, type: keyof typeof RATE_LIMITS): RateLimitResult {
  const limit = RATE_LIMITS[type]
  const now = Date.now()
  const key = `${type}:${identifier}`
  
  const current = rateLimitStore.get(key)
  
  if (!current || now - current.lastReset > limit.window) {
    // Reset the counter
    rateLimitStore.set(key, { count: 1, lastReset: now })
    return {
      success: true,
      remaining: limit.requests - 1,
      resetTime: now + limit.window
    }
  }
  
  if (current.count >= limit.requests) {
    return {
      success: false,
      remaining: 0,
      resetTime: current.lastReset + limit.window
    }
  }
  
  current.count++
  rateLimitStore.set(key, current)
  
  return {
    success: true,
    remaining: limit.requests - current.count,
    resetTime: current.lastReset + limit.window
  }
}

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export function generateCSRFToken(sessionId: string): string {
  const token = crypto.randomBytes(32).toString('hex')
  const expires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  
  csrfTokenStore.set(sessionId, { token, expires })
  
  return token
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokenStore.get(sessionId)
  
  if (!stored || stored.expires < Date.now()) {
    csrfTokenStore.delete(sessionId)
    return false
  }
  
  return stored.token === token
}

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000) // Limit length
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Şifre en az 8 karakter olmalıdır')
  }
  
  if (password.length > 128) {
    errors.push('Şifre çok uzun')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Şifre en az bir küçük harf içermelidir')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Şifre en az bir büyük harf içermelidir')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Şifre en az bir rakam içermelidir')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Şifre en az bir özel karakter içermelidir')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validatePhoneNumber(phone: string): boolean {
  // Turkish phone number validation
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function hashPassword(password: string): string {
  // In production, use bcrypt
  return crypto.createHash('sha256').update(password + process.env.PASSWORD_SALT || 'default-salt').digest('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function createSecureHeaders(): Record<string, string> {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.paypal.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://www.paypal.com; frame-src https://js.stripe.com https://www.paypal.com;",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
}

export function logSecurityEvent(event: {
  type: 'rate_limit' | 'csrf_failure' | 'invalid_login' | 'suspicious_activity'
  ip: string
  userAgent?: string
  details?: any
}) {
  // In production, log to security monitoring service
  console.warn('Security Event:', {
    ...event,
    timestamp: new Date().toISOString()
  })
}

export class SecurityError extends Error {
  constructor(
    message: string,
    public type: 'rate_limit' | 'csrf' | 'validation' | 'authentication' = 'validation',
    public statusCode: number = 400
  ) {
    super(message)
    this.name = 'SecurityError'
  }
}

// Middleware for API routes
export function withSecurity(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const ip = getClientIP(req)
      const userAgent = req.headers.get('user-agent') || ''
      
      // Apply rate limiting
      const limitResult = rateLimit(ip, 'api')
      if (!limitResult.success) {
        logSecurityEvent({
          type: 'rate_limit',
          ip,
          userAgent,
          details: { endpoint: req.url }
        })
        
        return new NextResponse('Too Many Requests', {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((limitResult.resetTime - Date.now()) / 1000).toString(),
            ...createSecureHeaders()
          }
        })
      }
      
      // Add security headers to response
      const response = await handler(req)
      const secureHeaders = createSecureHeaders()
      
      Object.entries(secureHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response
      
    } catch (error) {
      if (error instanceof SecurityError) {
        return new NextResponse(error.message, {
          status: error.statusCode,
          headers: createSecureHeaders()
        })
      }
      
      console.error('Security middleware error:', error)
      return new NextResponse('Internal Server Error', {
        status: 500,
        headers: createSecureHeaders()
      })
    }
  }
}

// Input validation schemas
export const ValidationSchemas = {
  user: {
    email: (email: string) => validateEmail(sanitizeInput(email)),
    password: (password: string) => validatePassword(password),
    phone: (phone: string) => validatePhoneNumber(sanitizeInput(phone)),
    name: (name: string) => {
      const sanitized = sanitizeInput(name)
      return sanitized.length >= 2 && sanitized.length <= 50 && /^[a-zA-ZığüşöçıĞÜŞÖÇI\s]+$/.test(sanitized)
    }
  },
  product: {
    title: (title: string) => {
      const sanitized = sanitizeInput(title)
      return sanitized.length >= 3 && sanitized.length <= 200
    },
    description: (description: string) => {
      const sanitized = sanitizeInput(description)
      return sanitized.length >= 10 && sanitized.length <= 2000
    },
    price: (price: number) => {
      return typeof price === 'number' && price > 0 && price <= 100000
    }
  }
}
