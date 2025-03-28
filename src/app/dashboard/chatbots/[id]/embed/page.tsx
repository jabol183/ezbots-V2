'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'

export default function ChatbotEmbedPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [chatbot, setChatbot] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [appUrl, setAppUrl] = useState('')

  useEffect(() => {
    // Set app URL based on environment
    setAppUrl(process.env.NEXT_PUBLIC_APP_URL || window.location.origin)
    
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
        setError('Failed to load chatbot details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchChatbot()
  }, [params.id])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateEmbedCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateEmbedCode = () => {
    if (!chatbot) return ''
    
    return `<!-- EzAIBotz Chat Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${appUrl}/widget.js';
    script.dataset.chatbotId = '${chatbot.id}';
    script.dataset.primaryColor = '${chatbot.primary_color || '#4F46E5'}';
    script.dataset.apiUrl = '${appUrl}/api/chat';
    script.async = true;
    document.body.appendChild(script);
  })();
</script>`
  }

  const generateInlineEmbedCode = () => {
    if (!chatbot) return ''
    
    return `<iframe
  src="${appUrl}/embed/${chatbot.id}"
  width="400"
  height="600"
  frameBorder="0"
  title="Chat with ${chatbot.name}"
  style="border: 1px solid #e5e7eb; border-radius: 0.5rem;"
></iframe>`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
            <div className="mt-4">
              <button
                onClick={() => router.back()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded"
              >
                Go Back
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">{chatbot.name} - Embed Code</h1>
                <button
                  onClick={() => router.back()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded"
                >
                  Back to Chatbot
                </button>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Add this code to your website to embed the chatbot. Place it just before the closing <code>&lt;/body&gt;</code> tag.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Widget Embed Code */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Floating Chat Widget</h2>
                <p className="text-gray-600 mb-4">
                  This code adds a chat bubble to the bottom-right corner of your website. Users can click it to open the chat.
                </p>
                
                <div className="relative">
                  <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
                    <pre className="text-sm font-mono">{generateEmbedCode()}</pre>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="absolute top-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              
              {/* Inline Embed Code */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Inline Chat Widget</h2>
                <p className="text-gray-600 mb-4">
                  This code embeds the chat directly within your page as an iframe, rather than as a floating widget.
                </p>
                
                <div className="relative">
                  <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
                    <pre className="text-sm font-mono">{generateInlineEmbedCode()}</pre>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateInlineEmbedCode())
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="absolute top-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              
              {/* Preview */}
              <div className="mt-8 border-t pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Preview</h2>
                <p className="text-gray-600 mb-4">
                  This is how your chatbot will appear on your website. The actual appearance may vary slightly depending on your website's styling.
                </p>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Floating Widget Preview */}
                  <div className="border p-4 rounded-lg relative h-96 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Floating Widget</h3>
                    <div className="absolute bottom-4 right-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: chatbot.primary_color || '#4F46E5' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Inline Widget Preview */}
                  <div className="border p-4 rounded-lg h-96 bg-gray-50 flex flex-col">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Inline Widget</h3>
                    <div className="flex-1 border rounded-lg overflow-hidden">
                      <iframe 
                        src={`/embed/${chatbot.id}`}
                        className="w-full h-full"
                        frameBorder="0"
                        title={`Chat with ${chatbot.name}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 