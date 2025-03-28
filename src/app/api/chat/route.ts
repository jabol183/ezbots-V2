import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateChatCompletion } from '@/lib/deepseek'
import { setCorsHeaders, handleCorsPreflightRequest } from '@/lib/cors'
import { v4 as uuidv4 } from 'uuid'

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: Request) {
  return handleCorsPreflightRequest(request)
}

export async function POST(request: Request) {
  // Handle CORS
  const origin = request.headers.get('origin')
  const response = NextResponse.next()
  
  if (origin) {
    setCorsHeaders(response, origin)
  }
  
  try {
    const { message, chatbotId, sessionId = uuidv4() } = await request.json()
    
    if (!message || !chatbotId) {
      return NextResponse.json({ error: 'Message and chatbotId are required' }, { status: 400 })
    }
    
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if this is a valid chatbot
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', chatbotId)
      .single()
    
    if (chatbotError || !chatbot) {
      console.error('Chatbot fetch error:', chatbotError)
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 })
    }
    
    // Get recent message history for context (optional)
    const { data: recentMessages } = await supabase
      .from('messages')
      .select('*')
      .eq('chatbot_id', chatbotId)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(5)
    
    // Generate AI response using the DeepSeek integration
    const aiResponse = await generateChatCompletion(
      recentMessages || [],
      message,
      chatbot.model_configuration
    )
    
    // Save the message and response to the database
    const { error: insertError } = await supabase
      .from('messages')
      .insert({
        chatbot_id: chatbotId,
        session_id: sessionId,
        user_message: message,
        ai_response: aiResponse,
        metadata: {
          timestamp: new Date().toISOString(),
          ip: request.headers.get('x-forwarded-for') || 'unknown'
        }
      })
    
    if (insertError) {
      console.error('Error saving message:', insertError)
      // We still want to return the AI response even if saving fails
    }
    
    // Return the AI response to the client
    const jsonResponse = NextResponse.json({
      botResponse: aiResponse,
      sessionId
    })
    
    // Apply CORS headers to the response
    if (origin) {
      setCorsHeaders(jsonResponse, origin)
    }
    
    return jsonResponse
    
  } catch (error) {
    console.error('Unexpected error in chat API:', error)
    const errorResponse = NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
    
    // Apply CORS headers to the error response
    const origin = request.headers.get('origin')
    if (origin) {
      setCorsHeaders(errorResponse, origin)
    }
    
    return errorResponse
  }
} 