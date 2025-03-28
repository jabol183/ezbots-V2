import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          full_name: string | null
          company: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          full_name?: string | null
          company?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          full_name?: string | null
          company?: string | null
        }
      }
      chatbots: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
          user_id: string
          type: 'ecommerce' | 'support' | 'appointment' | 'financial' | 'education' | 'realestate'
          config: {
            model: string
            temperature: number
            max_tokens: number
          }
        }
        Insert: {
          id?: string
          name: string
          description: string
          created_at?: string
          user_id: string
          type: 'ecommerce' | 'support' | 'appointment' | 'financial' | 'education' | 'realestate'
          config: {
            model: string
            temperature: number
            max_tokens: number
          }
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
          user_id?: string
          type?: 'ecommerce' | 'support' | 'appointment' | 'financial' | 'education' | 'realestate'
          config?: {
            model: string
            temperature: number
            max_tokens: number
          }
        }
      }
      conversations: {
        Row: {
          id: string
          chatbot_id: string
          created_at: string
          updated_at: string
          status: 'active' | 'completed' | 'archived'
        }
        Insert: {
          id?: string
          chatbot_id: string
          created_at?: string
          updated_at?: string
          status?: 'active' | 'completed' | 'archived'
        }
        Update: {
          id?: string
          chatbot_id?: string
          created_at?: string
          updated_at?: string
          status?: 'active' | 'completed' | 'archived'
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
      }
    }
  }
} 