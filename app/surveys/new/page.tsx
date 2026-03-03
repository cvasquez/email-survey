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
    <div className="min-h-screen bg-[#0A0A0A]">
      <Nav />

      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-8">
          <h2 className="text-xl font-semibold text-[#EDEDED] mb-6">Create New Survey</h2>

          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#A1A1A1] mb-2">
                Survey Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Product Feedback Survey"
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#262626] rounded-md text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
              />
              <p className="mt-1 text-sm text-[#666666]">
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
                  className="h-4 w-4 rounded border-[#333333] bg-[#1A1A1A] text-[#3B82F6] focus:ring-[#3B82F6] focus:ring-offset-0"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="requireName" className="font-medium text-[#EDEDED]">
                  Require respondent name
                </label>
                <p className="text-sm text-[#666666]">
                  When enabled, respondents must provide their name along with their response
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#3B82F6] text-white font-medium text-sm rounded-md hover:bg-[#2563EB] focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#141414] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating...' : 'Create Survey'}
              </button>
              <a
                href="/dashboard"
                className="inline-block px-6 py-2 text-sm text-[#A1A1A1] border border-[#333333] rounded-md hover:text-[#EDEDED] hover:border-[#444] transition-colors"
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
