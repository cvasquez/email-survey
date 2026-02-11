'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Survey } from '@/types/database'

export default function DashboardPage() {
  const [surveys, setSurveys] = useState<(Survey & { response_count: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('/api/surveys')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch surveys')
        }

        setSurveys(data.surveys)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSurveys()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const copyLink = (surveyId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    const link = `${baseUrl}/s/${surveyId}?answer=YOUR-ANSWER-HERE`
    navigator.clipboard.writeText(link)
    setCopiedId(surveyId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const deleteSurvey = async (surveyId: string, title: string) => {
    if (!confirm(`Delete "${title}" and all its responses? This cannot be undone.`)) {
      return
    }

    setDeletingId(surveyId)
    try {
      const response = await fetch(`/api/surveys/${surveyId}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete survey')
      }
      setSurveys((prev) => prev.filter((s) => s.id !== surveyId))
    } catch (err: any) {
      alert(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">Email Survey Tool</h1>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-gray-900"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Surveys</h2>
          <a
            href="/surveys/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Create New Survey
          </a>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-700">Loading surveys...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {!loading && !error && surveys.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-700 mb-4">No surveys yet. Create your first survey!</p>
            <a
              href="/surveys/new"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Survey
            </a>
          </div>
        )}

        {!loading && !error && surveys.length > 0 && (
          <div className="space-y-4 md:hidden">
            {surveys.map((survey) => (
              <div key={survey.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <a href={`/surveys/${survey.id}/responses`} className="font-medium text-gray-900 hover:text-blue-600">{survey.title}</a>
                    <div className="text-xs text-gray-500 mt-0.5">{survey.unique_link_id}</div>
                  </div>
                  {survey.is_active ? (
                    <span className="px-2 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-700 mb-3">
                  <span>{survey.response_count} responses</span>
                  <span>{formatDate(survey.created_at)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <button
                    onClick={() => copyLink(survey.unique_link_id)}
                    className="text-blue-600"
                  >
                    {copiedId === survey.unique_link_id ? 'Copied!' : 'Copy Link'}
                  </button>
                  <a
                    href={`/surveys/${survey.id}/responses`}
                    className="text-indigo-600"
                  >
                    View
                  </a>
                  <button
                    onClick={() => deleteSurvey(survey.id, survey.title)}
                    disabled={deletingId === survey.id}
                    className="text-red-600 disabled:opacity-50"
                  >
                    {deletingId === survey.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && surveys.length > 0 && (
          <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Responses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {surveys.map((survey) => (
                  <tr key={survey.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={`/surveys/${survey.id}/responses`} className="text-sm font-medium text-gray-900 hover:text-blue-600">{survey.title}</a>
                      <div className="text-xs text-gray-700 mt-1">
                        Link ID: {survey.unique_link_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {survey.response_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(survey.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {survey.is_active ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => copyLink(survey.unique_link_id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {copiedId === survey.unique_link_id ? 'Copied!' : 'Copy Link'}
                      </button>
                      <a
                        href={`/surveys/${survey.id}/responses`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </a>
                      <button
                        onClick={() => deleteSurvey(survey.id, survey.title)}
                        disabled={deletingId === survey.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deletingId === survey.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
