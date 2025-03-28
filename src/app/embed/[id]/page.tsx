'use client'

import { useState, useEffect } from 'react'
import ChatWidget from '@/components/ChatWidget'
import { Database } from '@/lib/supabase'

// Define type for chatbot
type Chatbot = Database['public']['Tables']['chatbots']['Row']

export default function ChatbotEmbedPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [chatbot, setChatbot] = useState<Chatbot | null>(null)

  useEffect(() => {
    // Fetch chatbot details
    const fetchChatbot = async () => {
      try {
        const response = await fetch(`/api/chatbots/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch chatbot')
        }
        
        const data = await response.json()
        setChatbot(data)
      } catch (err) {
        console.error('Error fetching chatbot:', err)
        setError('Failed to load chatbot')
      } finally {
        setLoading(false)
      }
    }
    
    fetchChatbot()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !chatbot) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-lg font-medium">{error || 'Chatbot not available'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Embed Header */}
      <div 
        className="p-4 text-white font-medium"
        style={{ backgroundColor: chatbot?.primary_color || '#4F46E5' }}
      >
        {chatbot?.name || 'Chat Assistant'}
      </div>
      
      {/* Inline Chat Widget (full height) */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <ChatWidget 
          chatbotId={params.id}
          primaryColor={chatbot?.primary_color}
          welcomeMessage={chatbot?.welcome_message}
          embedded={true}
        />
      </div>
    </div>
  )
} 