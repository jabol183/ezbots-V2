'use client'

import React, { useState, useEffect, useRef } from 'react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatWidgetProps {
  chatbotId: string
  apiEndpoint?: string
  theme?: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
}

export default function ChatWidget({
  chatbotId,
  apiEndpoint = '/api/chat',
  theme = {
    primaryColor: '#4F46E5',
    secondaryColor: '#E5E7EB',
    fontFamily: 'system-ui, sans-serif',
  },
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize the widget with a welcome message
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! How can I assist you today?',
        timestamp: new Date(),
      },
    ])
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    try {
      setIsLoading(true)
      setError(null)

      // Add user message to the chat
      const userMessage: ChatMessage = {
        role: 'user',
        content: inputValue,
        timestamp: new Date(),
      }
      setMessages((prev: ChatMessage[]) => [...prev, userMessage])
      setInputValue('')

      // Send message to the server
      const response = await fetch(`${apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          chatbotId,
          conversationId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      // Save the conversation ID if this is a new conversation
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId)
      }

      // Add assistant response to the chat
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }
      setMessages((prev: ChatMessage[]) => [...prev, assistantMessage])
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChat = () => {
    setIsOpen((prev: boolean) => !prev)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: theme.primaryColor,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          position: 'absolute',
          bottom: 0,
          right: 0,
        }}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            width: '350px',
            height: '500px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            marginBottom: '70px',
          }}
        >
          {/* Chat header */}
          <div
            style={{
              padding: '15px',
              backgroundColor: theme.primaryColor,
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Chat Support</span>
            <button
              onClick={toggleChat}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages container */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  alignSelf:
                    message.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor:
                    message.role === 'user'
                      ? theme.primaryColor
                      : theme.secondaryColor,
                  color: message.role === 'user' ? 'white' : 'black',
                  padding: '10px 15px',
                  borderRadius:
                    message.role === 'user'
                      ? '15px 15px 0 15px'
                      : '15px 15px 15px 0',
                  maxWidth: '80%',
                }}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: theme.secondaryColor,
                  color: 'black',
                  padding: '10px 15px',
                  borderRadius: '15px 15px 15px 0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '5px',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'grey',
                      animation: 'pulse 1s infinite',
                    }}
                  ></div>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'grey',
                      animation: 'pulse 1s infinite 0.2s',
                    }}
                  ></div>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'grey',
                      animation: 'pulse 1s infinite 0.4s',
                    }}
                  ></div>
                </div>
              </div>
            )}
            {error && (
              <div
                style={{
                  alignSelf: 'center',
                  backgroundColor: '#FEE2E2',
                  color: '#B91C1C',
                  padding: '10px 15px',
                  borderRadius: '15px',
                  margin: '10px 0',
                }}
              >
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            style={{
              borderTop: '1px solid #E5E7EB',
              padding: '15px',
              display: 'flex',
              gap: '10px',
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '10px 15px',
                borderRadius: '25px',
                border: '1px solid #E5E7EB',
                outline: 'none',
                fontSize: '14px',
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              style={{
                backgroundColor: theme.primaryColor,
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '10px 15px',
                cursor: 'pointer',
                opacity: isLoading || !inputValue.trim() ? 0.7 : 1,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
} 