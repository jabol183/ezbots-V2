import { NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://localhost:3000',
  process.env.NEXT_PUBLIC_APP_URL || '',
  // Add more allowed origins as needed
]

/**
 * Checks if an origin should be allowed CORS access
 * This allows embedding from any origin in a real-world scenario
 * You can customize this with more strict rules
 */
export function isOriginAllowed(origin: string): boolean {
  // If the app is in development, be more strict
  if (process.env.NODE_ENV === 'development') {
    return ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*');
  }
  
  // In production, we can be more permissive to allow embedding
  // If you need more security, modify this logic as needed
  return true;
}

/**
 * Sets CORS headers on a NextResponse object
 */
export function setCorsHeaders(response: NextResponse, origin: string): NextResponse {
  // Check if the origin is allowed
  if (isOriginAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else {
    // For security, you might want to set a default origin instead of the requested one
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  }
  
  // Set other CORS headers
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age', '86400') // 24 hours
  
  return response
}

/**
 * Handles CORS preflight requests
 */
export function handleCorsPreflightRequest(request: Request): NextResponse {
  const origin = request.headers.get('origin') || ''
  const response = new NextResponse(null, { status: 204 }) // No content needed for OPTIONS
  
  return setCorsHeaders(response, origin)
} 