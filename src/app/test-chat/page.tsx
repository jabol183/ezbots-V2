'use client'

import { useState, useEffect } from 'react'
import ChatWidget from '@/components/ChatWidget'

export default function TestChatPage() {
  const [chatbotId, setChatbotId] = useState<string>('')
  const [chatbots, setChatbots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Fetch available chatbots for testing
    const fetchChatbots = async () => {
      try {
        const response = await fetch('/api/chatbots')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch chatbots')
        }
        
        setChatbots(data)
        if (data.length > 0) {
          setChatbotId(data[0].id)
        }
      } catch (err) {
        console.error('Error fetching chatbots:', err)
        setError('Failed to load chatbots. Please make sure you are logged in.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchChatbots()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="h-12 w-12 rounded-full border-4 border-t-indigo-600 border-b-indigo-300 border-l-indigo-300 border-r-indigo-300 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl font-bold mb-8">Chat Widget Test</h1>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
        </div>
      ) : chatbots.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">No chatbots found. Please create a chatbot first.</p>
          <a 
            href="/dashboard/chatbots/new" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Chatbot
          </a>
        </div>
      ) : (
        <>
          <div className="mb-8 w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a chatbot to test:
            </label>
            <select
              value={chatbotId}
              onChange={(e) => setChatbotId(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              {chatbots.map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-8 w-full max-w-md">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This is a test page for the chat widget. The widget below is using your selected chatbot.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* The page content is just a placeholder. The chat widget is fixed to the bottom-right */}
          <div className="prose max-w-3xl">
            <h2>Example Page Content</h2>
            <p>This is an example page that demonstrates how the chat widget can be embedded into any page.</p>
            <p>The chat widget is positioned in the bottom-right corner and can be opened by clicking on the chat bubble icon.</p>
            <p>Try interacting with the chatbot to see how it works!</p>
          </div>
          
          {/* Chat Widget */}
          {chatbotId && <ChatWidget chatbotId={chatbotId} />}
        </>
      )}
    </div>
  )
} 