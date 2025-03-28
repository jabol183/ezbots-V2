import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<any>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First verify that this chatbot belongs to the user
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single()

    if (chatbotError || !chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found or access denied' },
        { status: 404 }
      )
    }

    // Get conversations for this chatbot
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('id')
      .eq('chatbot_id', params.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (conversationsError) {
      return NextResponse.json(
        { error: conversationsError.message },
        { status: 400 }
      )
    }

    // If no conversations exist yet, return empty array
    if (!conversations || conversations.length === 0) {
      return NextResponse.json([])
    }

    const conversationId = conversations[0].id

    // Get messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      return NextResponse.json(
        { error: messagesError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(messages || [])
  } catch (error) {
    console.error('Error in messages route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 