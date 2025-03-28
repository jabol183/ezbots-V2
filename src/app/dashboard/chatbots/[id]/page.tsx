'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

type Chatbot = {
  id: string
  name: string
  description: string
  type: string
  config: {
    model: string
    temperature: number
    max_tokens: number
  }
}

export default function ChatbotDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [chatbot, setChatbot] = useState<Chatbot | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchChatbot()
    fetchMessages()
  }, [params.id])

  const fetchChatbot = async () => {
    try {
      const response = await fetch(`/api/chatbots/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch chatbot')
      }
      const data = await response.json()
      setChatbot(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const fetchMessages = async () => {
    try {
      // Try to fetch messages from API
      const response = await fetch(`/api/chatbots/${params.id}/messages`)
      
      if (!response.ok) {
        // If the endpoint doesn't exist, use sample messages instead
        console.warn('Messages API endpoint not available, using sample data')
        // Use sample messages for now as placeholder
        const sampleMessages: Message[] = [
          {
            id: '1',
            conversation_id: 'sample',
            role: 'assistant',
            content: 'Hello! How can I help you today?',
            created_at: new Date(Date.now() - 60000).toISOString()
          }
        ]
        setMessages(sampleMessages)
        return
      }
      
      const data = await response.json()
      setMessages(data)
    } catch (err) {
      console.error('Error fetching messages:', err)
      // Don't show error for messages, just use empty array
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const message = newMessage
    setNewMessage('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          chatbotId: params.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      // In our case, the response contains the AI response text and conversation ID
      // We need to construct proper message objects for the UI
      const userMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: data.conversationId,
        role: 'user',
        content: message,
        created_at: new Date().toISOString()
      }
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: data.conversationId,
        role: 'assistant',
        content: data.response,
        created_at: new Date().toISOString()
      }
      
      setMessages((prev) => [...prev, userMessage, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{chatbot?.name}</h1>
                  <p className="mt-1 text-sm text-gray-500">{chatbot?.description}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => router.push(`/dashboard/chatbots/${params.id}/settings`)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/chatbots/${params.id}/embed`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Embed Code
                  </button>
                </div>
              </div>

              {/* Chat messages */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500">No messages yet. Start a conversation!</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-lg rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message input */}
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 