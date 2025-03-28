import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const headers: Record<string, string> = {};
  
  // Get all request headers
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  
  // Return headers as JSON
  return NextResponse.json({ 
    headers,
    url: request.url,
    method: request.method,
  });
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 