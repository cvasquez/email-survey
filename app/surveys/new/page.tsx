'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/app/components/nav'

export default function NewSurveyPage() {
  const [title, setTitle] = useState('')
  const [requireName, setRequireName] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          require_name: requireName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create survey')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Create New Survey</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Survey Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Product Feedback Survey"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-700">
                Give your survey a descriptive title for your own reference
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="requireName"
                  type="checkbox"
                  checked={requireName}
                  onChange={(e) => setRequireName(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="requireName" className="font-medium text-gray-700">
                  Require respondent name
                </label>
                <p className="text-sm text-gray-700">
                  When enabled, respondents must provide their name along with their response
                </p>
              </div>
            </div>

            <div className="pt-4 space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Survey'}
              </button>
              <a
                href="/dashboard"
                className="inline-block px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
