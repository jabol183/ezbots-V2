import { Database } from './supabase'

export type ChatbotConfig = Database['public']['Tables']['chatbots']['Row']['config']

type Message = {
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

// DeepSeek AI integration for EzAIBotz

type ChatMessage = {
  role: string;
  content: string;
};

type ChatConfig = {
  model?: string;
  temperature?: number;
  max_tokens?: number;
};

/**
 * Generates a chat completion response using the DeepSeek API
 */
export async function generateChatCompletion(
  history: any[],
  userMessage: string,
  config: ChatConfig = {}
): Promise<string> {
  // Get API key from environment variables
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.error("DEEPSEEK_API_KEY is not set in environment variables");
    return "I'm sorry, but I cannot respond right now due to a configuration issue. Please contact the administrator.";
  }

  // Format message history for DeepSeek API
  const messages: ChatMessage[] = [];
  
  // Add system message based on the last few messages to provide context
  messages.push({
    role: "system",
    content: "You are a helpful assistant that provides accurate, concise, and friendly responses."
  });
  
  // Add previous messages from history if available
  if (history && history.length > 0) {
    const recentHistory = history.slice(-5); // Only use the last 5 messages for context
    
    recentHistory.forEach(msg => {
      if (msg.role === 'user') {
        messages.push({ role: 'user', content: msg.content });
      } else if (msg.role === 'assistant') {
        messages.push({ role: 'assistant', content: msg.content });
      }
    });
  }
  
  // Add the new user message
  messages.push({ role: "user", content: userMessage });

  try {
    // For development, return a mock response
    if (process.env.NODE_ENV === 'development' && !apiKey.startsWith('sk-')) {
      return mockDeepSeekResponse(userMessage);
    }
    
    // Real API call
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'deepseek-chat',
        messages: messages,
        temperature: config.temperature || 0.7,
        max_tokens: config.max_tokens || 1000
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('DeepSeek API error:', data);
      return `I'm sorry, but I encountered an error processing your request. (Error: ${data.error?.message || 'Unknown error'})`;
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    return "I apologize, but I'm having trouble connecting to my knowledge base. Please try again in a moment.";
  }
}

/**
 * Provides a mock response for development when the API key is not configured
 */
function mockDeepSeekResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // Simple pattern matching for common questions
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! How can I assist you today?";
  }
  
  if (lowerMessage.includes('help')) {
    return "I'm here to help! What do you need assistance with?";
  }
  
  if (lowerMessage.includes('thank')) {
    return "You're welcome! Let me know if you need anything else.";
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
    return "Our pricing starts at $9.99 per month for the basic plan, $19.99 for the premium plan, and $29.99 for the enterprise plan. Each plan includes different features. Would you like me to explain the differences?";
  }
  
  if (lowerMessage.includes('feature') || lowerMessage.includes('can you do')) {
    return "I can help with product information, answer questions about your account, assist with troubleshooting, and provide general support. What specific information are you looking for?";
  }
  
  // Default response
  return "I understand you're asking about " + userMessage.substring(0, 30) + "... Could you provide more details so I can help you better?";
}

export class DeepSeekAI {
  private apiKey: string
  private baseUrl: string = 'https://api.deepseek.com/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateResponse(
    messages: { role: 'user' | 'assistant'; content: string }[],
    config: ChatbotConfig
  ) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages,
          temperature: config.temperature,
          max_tokens: config.max_tokens,
        }),
      })

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('Error generating response:', error)
      throw error
    }
  }

  async createEmbedding(text: string) {
    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-embedding',
          input: text,
        }),
      })

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data[0].embedding
    } catch (error) {
      console.error('Error creating embedding:', error)
      throw error
    }
  }
} 