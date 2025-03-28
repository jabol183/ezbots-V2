'use client'

import React, { useState } from 'react'

interface ChatWidgetProps {
  chatbotId: string
  apiUrl?: string
  primaryColor?: string
  welcomeMessage?: string
  embedded?: boolean
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  chatbotId,
  apiUrl = '/api/chat',
  primaryColor = '#4F46E5',
  welcomeMessage = 'Hello! How can I help you today?',
  embedded = false
}) => {
  const [isOpen, setIsOpen] = useState(embedded ? true : false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: welcomeMessage }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState('')

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) return
    
    // Add user message to chat
    setMessages(prev => [...prev, { sender: 'user', text: message }])
    const userMessage = message
    setMessage('')
    setIsLoading(true)
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          chatbotId,
          sessionId
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }
      
      // Save the session ID if it's the first message
      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId)
      }
      
      // Add bot response to chat
      setMessages(prev => [...prev, { sender: 'bot', text: data.botResponse }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Sorry, I encountered an error. Please try again later.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className={embedded ? "w-full h-full flex flex-col" : "fixed bottom-4 right-4 z-50"}>
      {/* Chat bubble button - only show if not embedded */}
      {!embedded && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg focus:outline-none"
          style={{ backgroundColor: primaryColor }}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          )}
        </button>
      )}
      
      {/* Chat window - always show if embedded, otherwise show when isOpen */}
      {(isOpen || embedded) && (
        <div className={embedded 
          ? "flex-1 flex flex-col overflow-hidden"
          : "absolute bottom-16 right-0 w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
        }>
          {/* Header - only show if not embedded */}
          {!embedded && (
            <div className="p-4 text-white" style={{ backgroundColor: primaryColor }}>
              <h3 className="font-medium">Chat Assistant</h3>
            </div>
          )}
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.sender === 'bot' 
                    ? 'bg-gray-100 rounded-lg p-2 max-w-[80%]' 
                    : 'bg-blue-100 rounded-lg p-2 max-w-[80%] ml-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-gray-100 rounded-lg p-2 max-w-[80%] mb-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input */}
          <form onSubmit={sendMessage} className="p-2 border-t">
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-r-lg text-white disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
                disabled={isLoading || !message.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default ChatWidget 