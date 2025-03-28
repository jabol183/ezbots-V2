import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/lib/supabase'

// Set CORS headers helper
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function GET(request: Request) {
  console.log('TEST-DB: Received request');
  
  try {
    // Try to create Supabase client
    console.log('TEST-DB: Creating Supabase client');
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('TEST-DB: Checking environment variables');
    console.log('TEST-DB: NEXT_PUBLIC_SUPABASE_URL set?', !!supabaseUrl);
    console.log('TEST-DB: NEXT_PUBLIC_SUPABASE_ANON_KEY set?', !!supabaseAnonKey);
    
    // Try to get session
    console.log('TEST-DB: Getting session');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('TEST-DB: Session error:', sessionError);
    }
    
    console.log('TEST-DB: Session found?', !!session);
    
    // Try to query database
    console.log('TEST-DB: Querying database tables');
    const { data: tables, error: tablesError } = await supabase.rpc('get_tables');
    
    if (tablesError) {
      console.error('TEST-DB: Error getting tables:', tablesError);
      
      // Try a different query
      console.log('TEST-DB: Trying a simpler query');
      const { data: simpleData, error: simpleError } = await supabase
        .from('chatbots')
        .select('count')
        .limit(1);
        
      if (simpleError) {
        console.error('TEST-DB: Simple query error:', simpleError);
        return setCorsHeaders(NextResponse.json({
          status: 'error',
          message: 'Database connection failed',
          sessionResult: { success: !sessionError, error: sessionError },
          dbResult: { success: false, error: simpleError }
        }));
      }
      
      return setCorsHeaders(NextResponse.json({
        status: 'partial',
        message: 'Database connected but tables RPC failed',
        sessionResult: { success: !sessionError, error: sessionError },
        dbResult: { success: true, data: 'Simple query succeeded' }
      }));
    }
    
    return setCorsHeaders(NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      sessionResult: { success: !sessionError, error: sessionError },
      dbResult: { success: true, tables: tables }
    }));
  } catch (error) {
    console.error('TEST-DB: Unexpected error:', error);
    return setCorsHeaders(NextResponse.json({
      status: 'error',
      message: 'Unexpected error in test-db route',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 }));
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return setCorsHeaders(new NextResponse(null, { status: 204 }));
} 