import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Define database schema types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      chatbots: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          welcome_message: string
          primary_color: string
          user_id: string
          is_active: boolean
          model_configuration: Json
          api_key: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          welcome_message: string
          primary_color: string
          user_id: string
          is_active: boolean
          model_configuration: Json
          api_key: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          welcome_message?: string
          primary_color?: string
          user_id?: string
          is_active?: boolean
          model_configuration?: Json
          api_key?: string
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          chatbot_id: string
          session_id: string
          content: string
          role: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          chatbot_id: string
          session_id: string
          content: string
          role: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          chatbot_id?: string
          session_id?: string
          content?: string
          role?: string
          metadata?: Json | null
        }
      }
      analytics: {
        Row: {
          id: string
          created_at: string
          chatbot_id: string
          event_type: string
          event_data: Json
        }
        Insert: {
          id?: string
          created_at?: string
          chatbot_id: string
          event_type: string
          event_data: Json
        }
        Update: {
          id?: string
          created_at?: string
          chatbot_id?: string
          event_type?: string
          event_data?: Json
        }
      }
      feedback: {
        Row: {
          id: string
          created_at: string
          message_id: string
          rating: number
          comment: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          message_id: string
          rating: number
          comment?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          message_id?: string
          rating?: number
          comment?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_tables: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 