'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/supabase'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

export default function ChatbotsPage() {
  const [chatbots, setChatbots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function fetchChatbots() {
      try {
        // Try to fetch chatbots from our API
        const response = await fetch('/api/chatbots', {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch chatbots: ${response.status}`)
        }
        
        const data = await response.json()
        setChatbots(data)
      } catch (err) {
        console.error('Error fetching chatbots:', err)
        setError('Failed to load chatbots. Please try again later.')
        
        // Fallback to direct Supabase query if API fails
        try {
          const { data, error } = await supabase
            .from('chatbots')
            .select('*')
          
          if (error) throw error
          if (data) setChatbots(data)
        } catch (supabaseErr) {
          console.error('Supabase fallback error:', supabaseErr)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchChatbots()
  }, [supabase])

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">My Chatbots</h1>
          <Link 
            href="/dashboard/chatbots/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" />
            New Chatbot
          </Link>
        </div>
        
        {loading ? (
          <div className="mt-6 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-gray-500">Loading your chatbots...</p>
          </div>
        ) : error ? (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <div className="mt-2">
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-sm text-red-700 underline hover:text-red-800"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : chatbots.length === 0 ? (
          <div className="mt-6 text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No chatbots</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new chatbot.</p>
            <div className="mt-6">
              <Link 
                href="/dashboard/chatbots/new" 
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                New Chatbot
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {chatbots.map((chatbot) => (
              <div
                key={chatbot.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{chatbot.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{chatbot.description}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          chatbot.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {chatbot.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/chatbots/${chatbot.id}`)}
                    className="col-span-1 text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/chatbots/${chatbot.id}/embed`)}
                    className="col-span-1 text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Embed
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 