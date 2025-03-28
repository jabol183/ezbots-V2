import { NextResponse } from 'next/server'

/**
 * Sets CORS headers on a NextResponse object
 * @param response The NextResponse object to set headers on
 * @param origin The origin making the request
 */
export function setCorsHeaders(response: NextResponse, origin: string) {
  response.headers.set('Access-Control-Allow-Origin', origin)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  
  return response
}

/**
 * Handles CORS preflight requests
 * @param request The incoming request
 */
export function handleCors(request: Request) {
  const origin = request.headers.get('origin') || '*'
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    setCorsHeaders(response, origin)
    return response
  }
  
  return null
} 