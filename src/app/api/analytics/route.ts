import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Define types for analytics data
type PopularTopic = {
  topic: string;
  count: number;
}

export async function GET(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession()
    
    // Check if the user is authenticated
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the time range from query parameters
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7' // Default to 7 days
    
    // Convert timeRange to a number and calculate the start date
    const days = parseInt(timeRange)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    // Query analytics for the user's chatbots
    const { data: chatbots, error: chatbotsError } = await supabase
      .from('chatbots')
      .select('id, name')
      .eq('user_id', session.user.id)
    
    if (chatbotsError) {
      console.error('Error fetching chatbots:', chatbotsError)
      return NextResponse.json({ error: 'Failed to fetch chatbots' }, { status: 500 })
    }
    
    // If no chatbots found, return empty analytics
    if (!chatbots || chatbots.length === 0) {
      return NextResponse.json({
        totalConversations: 0,
        totalMessages: 0,
        averageResponseTime: 0,
        userSatisfaction: 0,
        popularTopics: [],
        conversationsByDay: {}
      })
    }
    
    // Get chatbot IDs
    const chatbotIds = chatbots.map(chatbot => chatbot.id)
    
    // Query analytics for these chatbots
    const { data: analytics, error: analyticsError } = await supabase
      .from('analytics')
      .select('*')
      .in('chatbot_id', chatbotIds)
    
    if (analyticsError) {
      console.error('Error fetching analytics:', analyticsError)
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }
    
    // If no analytics found, return empty analytics
    if (!analytics || analytics.length === 0) {
      return NextResponse.json({
        totalConversations: 0,
        totalMessages: 0,
        averageResponseTime: 0,
        userSatisfaction: 0,
        popularTopics: [],
        conversationsByDay: {}
      })
    }
    
    // Calculate aggregated analytics
    const totalConversations = analytics.reduce((sum, item) => sum + (item.conversation_count || 0), 0)
    const totalMessages = analytics.reduce((sum, item) => sum + (item.message_count || 0), 0)
    
    // Calculate weighted average response time
    const totalResponseTimeWeighted = analytics.reduce((sum, item) => 
      sum + (item.average_response_time || 0) * (item.message_count || 0), 0)
    const averageResponseTime = totalMessages > 0 
      ? totalResponseTimeWeighted / totalMessages 
      : 0
    
    // Calculate weighted user satisfaction
    const totalSatisfactionWeighted = analytics.reduce((sum, item) => 
      sum + (item.user_satisfaction || 0) * (item.conversation_count || 0), 0)
    const userSatisfaction = totalConversations > 0 
      ? totalSatisfactionWeighted / totalConversations 
      : 0
    
    // Aggregate popular topics from all chatbots
    const popularTopics = analytics.reduce<PopularTopic[]>((topics, item) => {
      const itemTopics = item.popular_topics || []
      return [...topics, ...itemTopics]
    }, [])
      .sort((a: PopularTopic, b: PopularTopic) => b.count - a.count)
      .slice(0, 5)
    
    // Aggregate conversations by day
    const conversationsByDay: Record<string, number> = {}
    
    // Create date entries for the past 'days' days
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      conversationsByDay[dateStr] = 0
    }
    
    // Fill in the actual data from analytics
    analytics.forEach(item => {
      const itemConversationsByDay = item.conversations_by_day || {}
      
      Object.entries(itemConversationsByDay).forEach(([date, count]) => {
        if (new Date(date) >= startDate) {
          conversationsByDay[date] = (conversationsByDay[date] || 0) + (count as number)
        }
      })
    })
    
    // Return the aggregated analytics
    return NextResponse.json({
      totalConversations,
      totalMessages,
      averageResponseTime,
      userSatisfaction,
      popularTopics,
      conversationsByDay
    })
    
  } catch (error) {
    console.error('Unexpected error in analytics API:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    )
  }
} 