import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/lib/supabase'

// Set CORS headers helper
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
    
    // Check user authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return setCorsHeaders(NextResponse.json({ error: 'Authentication error' }, { status: 401 }));
    }
    
    if (!session) {
      return setCorsHeaders(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
    }
    
    // First check if the chatbot belongs to the user
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();
    
    if (chatbotError) {
      return setCorsHeaders(NextResponse.json(
        { error: 'Chatbot not found or access denied' },
        { status: 404 }
      ));
    }
    
    // Get messages for this chatbot
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chatbot_id', params.id)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return setCorsHeaders(NextResponse.json(
        { error: error.message || 'Failed to fetch messages' },
        { status: 400 }
      ));
    }
    
    // If no messages found, return empty array
    if (!messages || messages.length === 0) {
      return setCorsHeaders(NextResponse.json([]));
    }
    
    return setCorsHeaders(NextResponse.json(messages));
  } catch (error) {
    console.error('Unexpected error in messages route:', error);
    return setCorsHeaders(NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    ));
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Check user authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return setCorsHeaders(NextResponse.json({ error: 'Authentication error' }, { status: 401 }));
    }
    
    if (!session) {
      return setCorsHeaders(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
    }
    
    // Verify the chatbot exists and belongs to the user
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();
    
    if (chatbotError) {
      return setCorsHeaders(NextResponse.json(
        { error: 'Chatbot not found or access denied' },
        { status: 404 }
      ));
    }
    
    // Parse the request body
    const body = await request.json();
    
    if (!body.content || !body.session_id || !body.role) {
      return setCorsHeaders(NextResponse.json(
        { error: 'Missing required fields: content, session_id, and role are required' },
        { status: 400 }
      ));
    }
    
    // Prepare the message data
    const messageData = {
      chatbot_id: params.id,
      session_id: body.session_id,
      content: body.content,
      role: body.role,
      metadata: body.metadata || null
    };
    
    // Insert the message
    const { data: message, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating message:', error);
      return setCorsHeaders(NextResponse.json(
        { error: error.message || 'Failed to create message' },
        { status: 400 }
      ));
    }
    
    return setCorsHeaders(NextResponse.json(message));
  } catch (error) {
    console.error('Unexpected error in messages POST route:', error);
    return setCorsHeaders(NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    ));
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return setCorsHeaders(new NextResponse(null, { status: 204 }));
} 