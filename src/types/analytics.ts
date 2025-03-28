export interface Chatbot {
  id: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  chatbot_id: string;
}

export interface Message {
  id: string;
  created_at: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface PopularTopic {
  topic: string;
  count: number;
}

export interface ConversationByDay {
  date: string;
  count: number;
}

export interface AnalyticsData {
  totalConversations: number;
  totalMessages: number;
  averageResponseTime: number;
  userSatisfaction: number;
  popularTopics: PopularTopic[];
  conversationsByDay: ConversationByDay[];
} 