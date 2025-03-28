import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get all headers from the request
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  
  // Return the headers as JSON
  return NextResponse.json({
    headers,
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  // Get all headers from the request
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  
  // Try to parse the body
  let body;
  try {
    body = await request.json();
  } catch (error) {
    // If we can't parse JSON, try to get text
    try {
      body = await request.text();
    } catch (e) {
      body = "Could not read request body";
    }
  }
  
  // Return the headers and body as JSON
  return NextResponse.json({
    headers,
    body,
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString()
  });
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
} 