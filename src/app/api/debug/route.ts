import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Get request information
  const url = request.url;
  const method = request.method;
  
  // Get headers
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  
  try {
    // Try to create Supabase client and get session
    const cookieStore = cookies();
    const cookiesList: Record<string, string> = {};
    
    // Get all cookies
    for (const name of cookieStore.getAll().map(cookie => cookie.name)) {
      const value = cookieStore.get(name)?.value;
      if (value) {
        cookiesList[name] = value;
      }
    }
    
    // Try to create Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Try to get session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    // Get all environment variables (safe ones only)
    const envVars: Record<string, string> = {
      NODE_ENV: process.env.NODE_ENV || '',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      // Don't include actual API keys, just check if they exist
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
      DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ? 'SET' : 'NOT_SET',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
    };
    
    return NextResponse.json({
      request: {
        url,
        method,
        headers,
      },
      cookies: cookiesList,
      session: sessionData,
      sessionError: sessionError ? {
        message: sessionError.message,
        name: sessionError.name,
        code: sessionError.code,
      } : null,
      environment: envVars,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in debug route:', error);
    return NextResponse.json({
      error: 'Error in debug route',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 