import { Database } from './supabase'

export type ChatbotConfig = Database['public']['Tables']['chatbots']['Row']['config']

type Message = {
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

/**
 * Generates a chat completion using the DeepSeek API or other language model
 * @param messageHistory Previous messages in the conversation
 * @param newMessage The latest user message
 * @param config Configuration for the language model
 * @returns A string containing the AI's response
 */
export async function generateChatCompletion(
  messageHistory: Message[],
  newMessage: string,
  config: ChatbotConfig
): Promise<string> {
  try {
    // In a production environment, this would call the actual AI model API
    // For demo purposes, we'll use a mock implementation
    
    // Format the conversation history for the AI
    const formattedMessages = messageHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
    
    // Add the new message
    formattedMessages.push({
      role: 'user',
      content: newMessage
    })
    
    // For demonstration, generate a mock response
    // In production, this would be replaced with actual API calls to DeepSeek or another provider
    const mockResponses = [
      "Thank you for your message! I'm here to help.",
      "That's a great question. Let me provide some information.",
      "I understand your query. Here's what I can tell you.",
      "Thanks for reaching out. I'm processing your request.",
      "I'd be happy to assist with that. Let me look into it."
    ]
    
    // Simple mock response selection
    let aiResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
    
    // Append some context from the user's message to make it seem more relevant
    if (newMessage.toLowerCase().includes('help')) {
      aiResponse += " I'll do my best to provide the help you need."
    } else if (newMessage.toLowerCase().includes('question')) {
      aiResponse += " I'm designed to answer all kinds of questions."
    } else if (newMessage.toLowerCase().includes('thanks') || newMessage.toLowerCase().includes('thank you')) {
      aiResponse = "You're welcome! Is there anything else I can assist you with?"
    }
    
    // For a real implementation with DeepSeek AI or similar:
    /*
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: config.model || 'deepseek-chat',
        messages: formattedMessages,
        temperature: config.temperature || 0.7,
        max_tokens: config.max_tokens || 150,
      })
    })
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    
    const result = await response.json()
    return result.choices[0].message.content
    */
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return aiResponse
  } catch (error) {
    console.error('Error generating AI response:', error)
    throw new Error('Failed to generate AI response')
  }
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