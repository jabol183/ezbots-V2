import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/lib/supabase'

// Set CORS headers helper
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Get the session for authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return setCorsHeaders(NextResponse.json({ error: 'Authentication error' }, { status: 401 }));
    }
    
    if (!session) {
      return setCorsHeaders(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
    }
    
    // Get the chatbot by ID, ensuring it belongs to the current user
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching chatbot:', error);
      return setCorsHeaders(NextResponse.json(
        { error: error.message || 'Failed to fetch chatbot' },
        { status: error.code === 'PGRST116' ? 404 : 400 }
      ));
    }
    
    if (!chatbot) {
      return setCorsHeaders(NextResponse.json({ error: 'Chatbot not found' }, { status: 404 }));
    }
    
    return setCorsHeaders(NextResponse.json(chatbot));
  } catch (error) {
    console.error('Unexpected error fetching chatbot:', error);
    return setCorsHeaders(NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    ));
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Get session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return setCorsHeaders(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Check if the chatbot exists and belongs to the user
    const { data: existingChatbot, error: fetchError } = await supabase
      .from('chatbots')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();
    
    if (fetchError) {
      return setCorsHeaders(NextResponse.json({ error: 'Chatbot not found or access denied' }, { status: 404 }));
    }
    
    // Update the chatbot
    const { data: updatedChatbot, error } = await supabase
      .from('chatbots')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();
    
    if (error) {
      return setCorsHeaders(NextResponse.json({ error: error.message }, { status: 400 }));
    }
    
    return setCorsHeaders(NextResponse.json(updatedChatbot));
  } catch (error) {
    console.error('Unexpected error updating chatbot:', error);
    return setCorsHeaders(NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    ));
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Get session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return setCorsHeaders(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
    }
    
    // Check if the chatbot exists and belongs to the user
    const { data: existingChatbot, error: fetchError } = await supabase
      .from('chatbots')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();
    
    if (fetchError) {
      return setCorsHeaders(NextResponse.json({ error: 'Chatbot not found or access denied' }, { status: 404 }));
    }
    
    // Delete the chatbot
    const { error } = await supabase
      .from('chatbots')
      .delete()
      .eq('id', params.id);
    
    if (error) {
      return setCorsHeaders(NextResponse.json({ error: error.message }, { status: 400 }));
    }
    
    return setCorsHeaders(NextResponse.json({ success: true }));
  } catch (error) {
    console.error('Unexpected error deleting chatbot:', error);
    return setCorsHeaders(NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    ));
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return setCorsHeaders(new NextResponse(null, { status: 204 }));
} 