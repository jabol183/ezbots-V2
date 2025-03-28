'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'

interface EmbedPageProps {
  params: { 
    id: string 
  }
}

export default function EmbedPage({ params }: EmbedPageProps) {
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  // Generate embed code
  const embedCode = `<script 
  src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/chatbot-widget.js" 
  data-chatbot-id="${params.id}"
  data-api-endpoint="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/chat">
</script>`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <div>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <Link 
                    href="/dashboard/chatbots" 
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2"
                  >
                    Chatbots
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Embed Code</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Embed Your Chatbot</h1>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Installation Instructions</h2>
            <p className="text-gray-600 mb-4">
              Copy the following code and paste it before the closing <code className="bg-gray-100 px-1 py-0.5 rounded">&lt;/body&gt;</code> tag on any page where you want the chatbot to appear:
            </p>
            
            <div className="relative">
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">{embedCode}</pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Preview</h2>
            <div className="border border-gray-200 rounded-lg p-4 flex justify-center items-center h-64 bg-gray-50">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-gray-600">Your chatbot will appear like this on your website</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Customization Options</h2>
            <p className="text-gray-600 mb-2">
              You can customize the appearance of your chatbot by modifying the following attributes:
            </p>
            <ul className="list-disc pl-5 text-gray-600 mb-4">
              <li><code className="bg-gray-100 px-1 py-0.5 rounded">data-api-endpoint</code> - The API endpoint for your chatbot (defaults to your current domain)</li>
              <li><code className="bg-gray-100 px-1 py-0.5 rounded">data-theme-color</code> - Custom primary color (optional, default: #4F46E5)</li>
              <li><code className="bg-gray-100 px-1 py-0.5 rounded">data-bubble-text</code> - Custom text for the welcome message (optional)</li>
            </ul>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Back to Settings
            </button>
            <Link
              href={`/dashboard/chatbots/${params.id}/analytics`}
              className="px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700 transition ml-2"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 