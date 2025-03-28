import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      chatbots: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          description: string | null
          welcome_message: string
          primary_color: string
          is_active: boolean
          api_key: string
          model_configuration: {
            model?: string
            temperature?: number
            max_tokens?: number
          }
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          description?: string | null
          welcome_message?: string
          primary_color?: string
          is_active?: boolean
          api_key?: string
          model_configuration?: {
            model?: string
            temperature?: number
            max_tokens?: number
          }
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          description?: string | null
          welcome_message?: string
          primary_color?: string
          is_active?: boolean
          api_key?: string
          model_configuration?: {
            model?: string
            temperature?: number
            max_tokens?: number
          }
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          chatbot_id: string
          session_id: string
          user_message: string
          ai_response: string
          metadata: Record<string, any> | null
        }
        Insert: {
          id?: string
          created_at?: string
          chatbot_id: string
          session_id: string
          user_message: string
          ai_response: string
          metadata?: Record<string, any> | null
        }
        Update: {
          id?: string
          created_at?: string
          chatbot_id?: string
          session_id?: string
          user_message?: string
          ai_response?: string
          metadata?: Record<string, any> | null
        }
      }
      analytics: {
        Row: {
          id: string
          created_at: string
          chatbot_id: string
          conversation_count: number
          message_count: number
          average_response_time: number
          user_satisfaction: number
          popular_topics: Array<{ topic: string; count: number }>
          conversations_by_day: Record<string, number>
        }
        Insert: {
          id?: string
          created_at?: string
          chatbot_id: string
          conversation_count?: number
          message_count?: number
          average_response_time?: number
          user_satisfaction?: number
          popular_topics?: Array<{ topic: string; count: number }>
          conversations_by_day?: Record<string, number>
        }
        Update: {
          id?: string
          created_at?: string
          chatbot_id?: string
          conversation_count?: number
          message_count?: number
          average_response_time?: number
          user_satisfaction?: number
          popular_topics?: Array<{ topic: string; count: number }>
          conversations_by_day?: Record<string, number>
        }
      }
      feedback: {
        Row: {
          id: string
          created_at: string
          message_id: string
          rating: number | null
          comment: string | null
          source: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          message_id: string
          rating?: number | null
          comment?: string | null
          source?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          message_id?: string
          rating?: number | null
          comment?: string | null
          source?: string | null
        }
      }
    }
  }
} 