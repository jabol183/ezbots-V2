import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { 
  Chatbot, 
  Conversation, 
  Message, 
  ConversationByDay 
} from '@/types/analytics'

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient<any>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const timeRange = searchParams.get('timeRange') || '7d'

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    switch (timeRange) {
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    // Get user's chatbots
    const { data: chatbots } = await supabase
      .from('chatbots')
      .select('id')
      .eq('user_id', session.user.id)

    if (!chatbots) {
      return NextResponse.json({ error: 'No chatbots found' }, { status: 404 })
    }

    const chatbotIds = chatbots.map((c: Chatbot) => c.id)

    // Get conversations in date range
    const { data: conversations } = await supabase
      .from('conversations')
      .select('*')
      .in('chatbot_id', chatbotIds)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    // Get messages for these conversations
    const conversationIds = conversations?.map((c: Conversation) => c.id) || []
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .in('conversation_id', conversationIds)

    // Calculate metrics
    const totalConversations = conversations?.length || 0
    const totalMessages = messages?.length || 0

    // Calculate average response time (simplified)
    const responseTimes: number[] = []
    messages?.forEach((message: Message, index: number) => {
      if (message.role === 'assistant' && index > 0) {
        const prevMessage = messages[index - 1]
        if (prevMessage.role === 'user') {
          const responseTime = new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime()
          responseTimes.push(responseTime / 1000) // Convert to seconds
        }
      }
    })
    const averageResponseTime = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0

    // Calculate user satisfaction (simplified)
    const userSatisfaction = 85 // This would be calculated based on user feedback in a real application

    // Get popular topics (simplified)
    const popularTopics = [
      { topic: 'Product Information', count: 150 },
      { topic: 'Pricing', count: 120 },
      { topic: 'Technical Support', count: 90 },
      { topic: 'Account Issues', count: 75 },
      { topic: 'General Inquiries', count: 60 },
    ]

    // Get conversations by day
    const conversationsByDay = conversations?.reduce((acc: ConversationByDay[], conversation: Conversation) => {
      const date = conversation.created_at.split('T')[0]
      const existingDay = acc.find((d) => d.date === date)
      if (existingDay) {
        existingDay.count++
      } else {
        acc.push({ date, count: 1 })
      }
      return acc
    }, []) || []

    // Sort by date
    conversationsByDay.sort((a: ConversationByDay, b: ConversationByDay) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    return NextResponse.json({
      totalConversations,
      totalMessages,
      averageResponseTime,
      userSatisfaction,
      popularTopics,
      conversationsByDay,
    })
  } catch (error) {
    console.error('Error in analytics route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 