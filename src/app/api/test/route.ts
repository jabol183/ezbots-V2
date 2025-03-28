import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  // Try to parse request body
  let body = {};
  try {
    const text = await request.text();
    if (text) {
      body = JSON.parse(text);
    }
  } catch (error) {
    // Ignore parse error and return empty body
  }
  
  return NextResponse.json({
    success: true,
    message: 'POST request received',
    timestamp: new Date().toISOString(),
    receivedData: body
  });
} 