'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'

type ChatbotType = 'ecommerce' | 'support' | 'appointment' | 'financial' | 'education' | 'realestate'

export default function NewChatbotPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ChatbotType>('support')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Prepare the request data
      const chatbotData = {
        name,
        description,
        type,
        model_configuration: {
          model: 'deepseek-chat',
          temperature: 0.7,
          max_tokens: 1000,
        }
      };
      
      console.log('Submitting chatbot data:', chatbotData);
      
      // Use port 3000 specifically instead of dynamic detection
      const baseApiUrl = `${window.location.protocol}//${window.location.hostname}:3000`;
      console.log(`Using API base URL: ${baseApiUrl}`);
      
      const response = await fetch(`${baseApiUrl}/api/chatbots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatbotData),
        credentials: 'include', // Include cookies with the request
      });

      // Get the raw response text for debugging
      const responseText = await response.text();
      console.log('Raw API response:', responseText);
      
      // Check if response is HTML (error page) or JSON
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        console.error('Received HTML instead of JSON:', responseText.substring(0, 150) + '...');
        throw new Error(`Received HTML response instead of JSON. Status: ${response.status}`);
      }
      
      // Then parse as JSON if possible
      let data: any = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (error) {
        const jsonError = error as Error;
        console.error('Error parsing JSON response:', jsonError, 'Response was:', responseText);
        throw new Error(`Invalid JSON response: ${jsonError.message}`);
      }
      
      console.log('Parsed API response:', data);

      if (!response.ok) {
        throw new Error(data.error || `Failed to create chatbot: ${response.status} ${response.statusText}`)
      }

      router.push(`/dashboard/chatbots/${data.id}`)
    } catch (err) {
      console.error('Error creating chatbot:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Chatbot</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Chatbot Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g. Support Assistant"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Describe what this chatbot will help with..."
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Chatbot Type
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value as ChatbotType)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="ecommerce">E-Commerce Assistant</option>
                  <option value="support">Customer Support</option>
                  <option value="appointment">Appointment Scheduler</option>
                  <option value="financial">Financial Services</option>
                  <option value="education">Educational Assistant</option>
                  <option value="realestate">Real Estate Guide</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  This will determine the chatbot's initial settings and appearance.
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Chatbot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
} 