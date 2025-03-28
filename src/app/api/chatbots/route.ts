import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Define type for chatbot
type Chatbot = Database['public']['Tables']['chatbots']['Row']

// Helper function to generate API key
function generateApiKey(): string {
  return `ezbt_${uuidv4().replace(/-/g, '')}`
}

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, type, model_configuration } = body
    
    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 })
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

    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .insert({
        name,
        description,
        welcome_message: welcomeMessage,
        primary_color: primaryColor,
        user_id: session.user.id,
        is_active: true,
        model_configuration: model_configuration || { model: 'deepseek-chat', temperature: 0.7, max_tokens: 1000 },
        api_key: generateApiKey()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating chatbot:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(chatbot)
  } catch (error) {
    console.error('Unexpected error in chatbots POST route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: chatbots, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('user_id', session.user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(chatbots)
  } catch (error) {
    console.error('Unexpected error in chatbots GET route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 