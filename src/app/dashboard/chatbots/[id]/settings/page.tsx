'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'

type ChatbotConfig = {
  model: string
  temperature: number
  max_tokens: number
}

type Chatbot = {
  id: string
  name: string
  description: string
  type: string
  config: ChatbotConfig
}

export default function ChatbotSettingsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [chatbot, setChatbot] = useState<Chatbot | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [config, setConfig] = useState<ChatbotConfig>({
    model: 'deepseek-chat',
    temperature: 0.7,
    max_tokens: 1000,
  })

  useEffect(() => {
    fetchChatbot()
  }, [params.id])

  const fetchChatbot = async () => {
    try {
      const response = await fetch(`/api/chatbots/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch chatbot')
      }
      const data = await response.json()
      setChatbot(data)
      setConfig(data.config)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const response = await fetch(`/api/chatbots/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: chatbot?.name,
          description: chatbot?.description,
          type: chatbot?.type,
          config,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update chatbot')
      }

      router.push(`/dashboard/chatbots/${params.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Chatbot Settings</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={chatbot?.name || ''}
                    onChange={(e) => setChatbot((prev) => prev ? { ...prev, name: e.target.value } : null)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                    value={chatbot?.description || ''}
                    onChange={(e) => setChatbot((prev) => prev ? { ...prev, description: e.target.value } : null)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                    AI Model
                  </label>
                  <select
                    id="model"
                    name="model"
                    required
                    value={config.model}
                    onChange={(e) => setConfig((prev) => ({ ...prev, model: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="deepseek-chat">DeepSeek Chat</option>
                    <option value="deepseek-coder">DeepSeek Coder</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                    Temperature
                  </label>
                  <input
                    type="range"
                    id="temperature"
                    name="temperature"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.temperature}
                    onChange={(e) => setConfig((prev) => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="mt-1 block w-full"
                  />
                  <div className="mt-1 text-sm text-gray-500">
                    {config.temperature} (Higher values make the output more random, lower values make it more focused)
                  </div>
                </div>

                <div>
                  <label htmlFor="max_tokens" className="block text-sm font-medium text-gray-700">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    id="max_tokens"
                    name="max_tokens"
                    min="100"
                    max="4000"
                    step="100"
                    value={config.max_tokens}
                    onChange={(e) => setConfig((prev) => ({ ...prev, max_tokens: parseInt(e.target.value) }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
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