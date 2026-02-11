'use client'

import { useEffect, useState, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { formatAnswerValue } from '@/lib/utils'

function SurveyResponseForm() {
  const params = useParams()
  const searchParams = useSearchParams()
  const surveyId = params.surveyId as string

  const answerValue = searchParams.get('answer') || ''
  const hashMd5 = searchParams.get('hash_md5') || ''

  const [survey, setSurvey] = useState<any>(null)
  const [responseId, setResponseId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [freeResponse, setFreeResponse] = useState('')
  const [respondentName, setRespondentName] = useState('')

  useEffect(() => {
    fetchSurveyAndRecordClick()
  }, [surveyId])

  const fetchSurveyAndRecordClick = async () => {
    try {
      // Fetch survey details
      const response = await fetch(`/api/surveys/${surveyId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Survey not found')
      }

      setSurvey(data.survey)

      // Record initial response (click tracking)
      if (answerValue) {
        const initialResponse = await fetch('/api/responses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            survey_id: data.survey.id,
            answer_value: answerValue,
            hash_md5: hashMd5 || undefined,
          }),
        })

        const responseData = await initialResponse.json()
        if (initialResponse.ok) {
          setResponseId(responseData.response.id)
          // If returning visitor already submitted details, show success state
          if (responseData.response.free_response || responseData.response.respondent_name) {
            setSuccess(true)
          }
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (!responseId) {
        throw new Error('No response ID found')
      }

      if (!freeResponse.trim() && !respondentName.trim()) {
        setError('Please add a response or your name before submitting.')
        setSubmitting(false)
        return
      }

      // Update existing response with additional details
      const response = await fetch('/api/responses', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response_id: responseId,
          free_response: freeResponse.trim(),
          respondent_name: respondentName.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update response')
      }

      setSuccess(true)
      setFreeResponse('')
      setRespondentName('')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-slate-700">Just one sec...</p>
      </div>
    )
  }

  if (error && !survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full px-6">
          <div className="border border-slate-200 rounded-xl shadow-sm p-8">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Survey Not Found</h1>
            <p className="text-slate-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!survey.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full px-6">
          <div className="border border-slate-200 rounded-xl shadow-sm p-8">
            <h1 className="text-2xl font-bold mb-4 text-slate-900">Survey Closed</h1>
            <p className="text-slate-700">This survey is no longer accepting responses.</p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full px-6">
          <div className="border border-slate-200 rounded-xl shadow-sm p-8">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2 text-slate-900">Thank You!</h1>
              <p className="text-slate-700">Your response has been submitted successfully.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const displayAnswer = formatAnswerValue(answerValue)

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <div className="max-w-2xl w-full">

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-slate-900 mb-3">
                Tell me about your answer: {displayAnswer}
              </label>
              <textarea
                value={freeResponse}
                onChange={(e) => setFreeResponse(e.target.value)}
                rows={6}
                placeholder="Share your thoughts here... (optional)"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-slate-900"
              />
              <p className="mt-2 text-sm text-slate-600">Your initial response has been recorded. You can optionally provide more details above.</p>
            </div>

            {survey.require_name && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
            >
              {submitting ? 'Updating...' : 'Add More Details'}
            </button>
          </form>
      </div>
    </div>
  )
}

export default function SurveyResponsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><p className="text-slate-700">Loading...</p></div>}>
      <SurveyResponseForm />
    </Suspense>
  )
}
