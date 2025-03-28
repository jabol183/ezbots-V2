import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Define type for chatbot
type Chatbot = Database['public']['Tables']['chatbots']['Row']

// Helper function to generate API key (UUID format to match schema)
function generateApiKey(): string {
  return uuidv4();
}

// Set CORS headers helper
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function POST(req: Request) {
  console.log('------------ API REQUEST START ------------');
  console.log('POST /api/chatbots - Request received');
  
  // Log request information
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  
  // Log headers
  console.log('Request headers:');
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
    console.log(`  ${key}: ${value}`);
  });
  
  try {
    console.log('Creating Supabase client...');
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    console.log('Checking session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return setCorsHeaders(NextResponse.json({ error: 'Authentication error', details: sessionError.message }, { status: 401 }));
    }
    
    console.log('Session result:', session ? 'Session found' : 'No session');

    if (!session) {
      console.log('ERROR: No auth session found');
      return setCorsHeaders(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
    }

    if (!session.user || !session.user.id) {
      console.error('Missing user ID in session:', session);
      return setCorsHeaders(NextResponse.json({ error: 'User ID not found in session' }, { status: 401 }));
    }
    
    console.log('User ID from session:', session.user.id);

    // Log the raw request body for debugging
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);
    
    // Parse the body manually
    let body;
    try {
      body = JSON.parse(rawBody);
      console.log('Parsed request body:', body);
    } catch (err) {
      console.error('Error parsing JSON request body:', err);
      return setCorsHeaders(NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 }));
    }
    
    const { name, description, type, model_configuration } = body;
    console.log('Extracted fields:', { name, description, type, model_configuration });
    
    if (!name || !description) {
      return setCorsHeaders(NextResponse.json({ error: 'Name and description are required' }, { status: 400 }));
    }

    // Map type to welcome message
    let welcomeMessage = 'How can I help you today?'
    if (type === 'ecommerce') {
      welcomeMessage = 'Hello! Looking for product recommendations?'
    } else if (type === 'support') {
      welcomeMessage = 'Hi there! How can I assist you with your questions?'
    } else if (type === 'appointment') {
      welcomeMessage = 'Hi! Would you like to schedule an appointment?'
    }

    // Primary color based on type
    let primaryColor = '#4F46E5' // default indigo
    if (type === 'ecommerce') {
      primaryColor = '#10B981' // green
    } else if (type === 'financial') {
      primaryColor = '#6366F1' // indigo
    } else if (type === 'education') {
      primaryColor = '#F59E0B' // amber
    }

    // Prepare the insert data
    const insertData = {
      name,
      description,
      welcome_message: welcomeMessage,
      primary_color: primaryColor,
      user_id: session.user.id,
      is_active: true,
      model_configuration: model_configuration || { model: 'deepseek-chat', temperature: 0.7, max_tokens: 1000 },
      api_key: generateApiKey()
    };
    
    console.log('Data to insert:', insertData);

    // First check if a chatbot with this name already exists for this user
    const { data: existingChatbot, error: checkError } = await supabase
      .from('chatbots')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('name', name)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking for existing chatbot:', checkError);
    }
    
    if (existingChatbot) {
      console.log('Chatbot with this name already exists:', existingChatbot);
      return setCorsHeaders(NextResponse.json({ 
        error: 'A chatbot with this name already exists',
        details: 'Please choose a different name' 
      }, { status: 400 }));
    }
    
    console.log('Inserting chatbot data into database...');
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating chatbot:', error);
      return setCorsHeaders(NextResponse.json({ 
        error: error.message || 'Failed to create chatbot', 
        details: error.details || 'Database error - check schema and permissions',
        code: error.code 
      }, { status: 400 }));
    }
    
    if (!chatbot) {
      console.error('Chatbot creation failed with no error but no chatbot returned');
      return setCorsHeaders(NextResponse.json({ 
        error: 'Unknown error creating chatbot', 
        details: 'The operation completed but no chatbot was returned'
      }, { status: 500 }));
    }

    console.log('Successfully created chatbot:', chatbot);
    return setCorsHeaders(NextResponse.json(chatbot));
  } catch (error) {
    console.error('Unexpected error in chatbots POST route:', error)
    return setCorsHeaders(NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    ));
  }
}

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return setCorsHeaders(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
    }

    const { data: chatbots, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('user_id', session.user.id)

    if (error) {
      return setCorsHeaders(NextResponse.json({ error: error.message }, { status: 400 }));
    }

    return setCorsHeaders(NextResponse.json(chatbots));
  } catch (error) {
    console.error('Unexpected error in chatbots GET route:', error)
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