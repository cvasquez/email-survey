'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/app/components/nav'

export default function NewSurveyPage() {
  const [title, setTitle] = useState('')
  const [question, setQuestion] = useState('')
  const [answerOptions, setAnswerOptions] = useState<string[]>(['', ''])
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
          question: question.trim() || undefined,
          answer_options: answerOptions.filter((o) => o.trim()),
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
    <div className="min-h-screen bg-[#fff5ec]">
      <Nav />

      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#ffffff] border border-[#e8dfd2] rounded-lg p-8">
          <h2 className="text-xl font-semibold text-[#2a1a10] mb-6">Create New Survey</h2>

          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#6b4f3f] mb-2">
                Survey Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Product Feedback Survey"
                className="w-full px-3 py-2 bg-[#fdf6ee] border border-[#e8dfd2] rounded-md text-[#2a1a10] placeholder-[#a68b7a] focus:outline-none focus:ring-1 focus:ring-[#e66b67] focus:border-[#e66b67] transition-colors"
              />
              <p className="mt-1 text-sm text-[#a68b7a]">
                Give your survey a descriptive title for your own reference
              </p>
            </div>

            <div>
              <label htmlFor="question" className="block text-sm font-medium text-[#6b4f3f] mb-2">
                Question Text <span className="font-normal text-[#a68b7a]">(optional)</span>
              </label>
              <input
                id="question"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., How satisfied are you with our service?"
                className="w-full px-3 py-2 bg-[#fdf6ee] border border-[#e8dfd2] rounded-md text-[#2a1a10] placeholder-[#a68b7a] focus:outline-none focus:ring-1 focus:ring-[#e66b67] focus:border-[#e66b67] transition-colors"
              />
              <p className="mt-1 text-sm text-[#a68b7a]">
                Shown to respondents on the survey page
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6b4f3f] mb-2">
                Answer Options
              </label>
              <div className="space-y-2">
                {answerOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const updated = [...answerOptions]
                        updated[index] = e.target.value
                        setAnswerOptions(updated)
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 bg-[#fdf6ee] border border-[#e8dfd2] rounded-md text-[#2a1a10] placeholder-[#a68b7a] focus:outline-none focus:ring-1 focus:ring-[#e66b67] focus:border-[#e66b67] transition-colors"
                    />
                    {answerOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setAnswerOptions(answerOptions.filter((_, i) => i !== index))}
                        className="text-[#a68b7a] hover:text-[#EF4444] transition-colors px-2 py-2"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setAnswerOptions([...answerOptions, ''])}
                className="mt-2 text-sm text-[#e66b67] hover:text-[#c95551] transition-colors"
              >
                + Add Option
              </button>
              <p className="mt-1 text-sm text-[#a68b7a]">
                These will be used to generate survey links
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="requireName"
                  type="checkbox"
                  checked={requireName}
                  onChange={(e) => setRequireName(e.target.checked)}
                  className="h-4 w-4 rounded border-[#d6c8b6] bg-[#fdf6ee] text-[#e66b67] focus:ring-[#e66b67] focus:ring-offset-0"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="requireName" className="font-medium text-[#2a1a10]">
                  Require respondent name
                </label>
                <p className="text-sm text-[#a68b7a]">
                  When enabled, respondents must provide their name along with their response
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#e66b67] text-white font-medium text-sm rounded-md hover:bg-[#c95551] focus:ring-2 focus:ring-[#e66b67] focus:ring-offset-2 focus:ring-offset-[#ffffff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating...' : 'Create Survey'}
              </button>
              <a
                href="/dashboard"
                className="inline-block px-6 py-2 text-sm text-[#6b4f3f] border border-[#d6c8b6] rounded-md hover:text-[#2a1a10] hover:border-[#444] transition-colors"
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
