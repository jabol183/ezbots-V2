import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { setCorsHeaders } from '@/lib/cors'
import { generateChatCompletion } from '@/lib/deepseek'

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  const response = NextResponse.next()
  
  // Set CORS headers if needed
  if (origin) {
    setCorsHeaders(response, origin)
  }

  try {
    const { message, chatbotId } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get chatbot details
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', chatbotId)
      .single()
    
    if (chatbotError) {
      return NextResponse.json({ error: 'Failed to fetch chatbot' }, { status: 500 })
    }
    
    if (!chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 })
    }
    
    // Get or create a conversation
    let conversationId = ''
    
    // Look for an existing conversation first
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('chatbot_id', chatbotId)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (existingConversation && existingConversation.length > 0) {
      conversationId = existingConversation[0].id
    } else {
      // Create a new conversation if none exists
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          chatbot_id: chatbotId,
          user_id: session.user.id,
          title: 'New Conversation',
        })
        .select()
      
      if (convError || !newConversation) {
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
      }
      
      conversationId = newConversation[0].id
    }
    
    // Save user message to database
    const { error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: message,
      })
    
    if (msgError) {
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }
    
    // Get conversation history for context
    const { data: messageHistory } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    
    // Generate AI response
    const aiResponse = await generateChatCompletion(
      messageHistory || [],
      message,
      chatbot.config
    )
    
    // Save AI response to database
    const { error: aiMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: aiResponse,
      })
    
    if (aiMsgError) {
      return NextResponse.json({ error: 'Failed to save AI response' }, { status: 500 })
    }
    
    // Return the response
    return NextResponse.json({
      response: aiResponse,
      conversationId,
    })
  } catch (error) {
    console.error('Chat handler error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
} 