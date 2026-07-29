import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security Middleware
 * Adds security headers and basic protection to all routes
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security Headers - Protection against common attacks
  const securityHeaders = {
    // Prevent clickjacking attacks
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // XSS Protection (legacy but still useful)
    'X-XSS-Protection': '1; mode=block',
    
    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Disable dangerous browser features
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()',
    
    // Enforce HTTPS (only in production)
    ...(process.env.NODE_ENV === 'production' && {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    }),
    
    // Content Security Policy - prevents XSS attacks
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.telegram.org https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  };

  // Apply all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Log suspicious activity
  const suspiciousPatterns = [
    /(\.\.|\.\/)/,  // Path traversal
    /(<script|javascript:|onerror=)/i,  // XSS attempts
    /(union.*select|insert.*into|drop.*table)/i,  // SQL injection
  ];

  const url = request.url;
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(url));
  
  if (isSuspicious) {
    // Get IP from headers (works with proxies)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    
    console.warn(`🚨 Suspicious request detected: ${url} from IP: ${ip}`);
    // In production, you might want to block these requests
    // return new NextResponse('Forbidden', { status: 403 });
  }

  return response;
}

// Apply middleware to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
