'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import type { Survey } from '@/types/database'
import { Nav } from '@/app/components/nav'
import { SurveysChart } from '@/app/components/surveys-chart'

export default function DashboardPage() {
  const [surveys, setSurveys] = useState<(Survey & { response_count: number; comment_count: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

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
    <div className="min-h-screen bg-[#fff5ec]">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#2a1a10]">Surveys</h2>
          <a
            href="/surveys/new"
            className="px-4 py-2 bg-[#e66b67] text-white text-sm font-medium rounded-md hover:bg-[#c95551] transition-colors"
          >
            + New Survey
          </a>
        </div>

        {!loading && !error && surveys.length > 0 && (
          <SurveysChart surveys={surveys} />
        )}

        {loading && (
          <div className="text-center py-12">
            <p className="text-[#6b4f3f]">Loading surveys...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md">
            {error}
          </div>
        )}

        {!loading && !error && surveys.length === 0 && (
          <div className="text-center py-12 bg-[#ffffff] border border-[#e8dfd2] rounded-lg">
            <p className="text-[#6b4f3f] mb-4">No surveys yet. Create your first survey!</p>
            <a
              href="/surveys/new"
              className="inline-block px-4 py-2 bg-[#e66b67] text-white text-sm font-medium rounded-md hover:bg-[#c95551] transition-colors"
            >
              + New Survey
            </a>
          </div>
        )}

        {!loading && !error && surveys.length > 0 && (
          <div className="space-y-4 md:hidden">
            {surveys.map((survey) => (
              <div key={survey.id} className="bg-[#ffffff] border border-[#e8dfd2] rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <a href={`/surveys/${survey.id}/responses`} className="font-medium text-[#2a1a10] hover:text-[#e66b67]">{survey.title}</a>
                    <div className="text-xs text-[#a68b7a] mt-0.5">{survey.unique_link_id}</div>
                  </div>
                  {survey.is_active ? (
                    <span className="px-2 text-xs leading-5 font-medium rounded-full bg-[#22C55E]/10 text-[#22C55E]">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 text-xs leading-5 font-medium rounded-full bg-[#a68b7a]/10 text-[#a68b7a]">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-[#6b4f3f] mb-3">
                  <span>{survey.response_count} responses</span>
                  <span>{formatDate(survey.created_at)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <button
                    onClick={() => copyLink(survey.unique_link_id)}
                    className="text-[#e66b67] hover:text-[#c95551] transition-colors"
                  >
                    {copiedId === survey.unique_link_id ? 'Copied!' : 'Copy Link'}
                  </button>
                  <a
                    href={`/surveys/${survey.id}/responses`}
                    className="text-[#6b4f3f] hover:text-[#e66b67] transition-colors"
                  >
                    View
                  </a>
                  <button
                    onClick={() => deleteSurvey(survey.id, survey.title)}
                    disabled={deletingId === survey.id}
                    className="text-[#EF4444] hover:text-[#DC2626] disabled:opacity-50 transition-colors"
                  >
                    {deletingId === survey.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && surveys.length > 0 && (
          <div className="hidden md:block bg-[#ffffff] border border-[#e8dfd2] rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="border-b border-[#e8dfd2]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#a68b7a] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#a68b7a] uppercase tracking-wider">
                    Responses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#a68b7a] uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#a68b7a] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#a68b7a] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {surveys.map((survey) => (
                  <tr key={survey.id} className="border-b border-[#e8dfd2] last:border-b-0 hover:bg-[#fdf6ee] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={`/surveys/${survey.id}/responses`} className="text-sm font-medium text-[#2a1a10] hover:text-[#e66b67]">{survey.title}</a>
                      <div className="text-xs text-[#a68b7a] mt-1">
                        Link ID: {survey.unique_link_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2a1a10] font-medium">
                      {survey.response_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b4f3f]">
                      {formatDate(survey.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {survey.is_active ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-[#22C55E]/10 text-[#22C55E]">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-[#a68b7a]/10 text-[#a68b7a]">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => copyLink(survey.unique_link_id)}
                        className="text-[#e66b67] hover:text-[#c95551] transition-colors"
                      >
                        {copiedId === survey.unique_link_id ? 'Copied!' : 'Copy Link'}
                      </button>
                      <a
                        href={`/surveys/${survey.id}/responses`}
                        className="text-[#6b4f3f] hover:text-[#e66b67] transition-colors"
                      >
                        View
                      </a>
                      <button
                        onClick={() => deleteSurvey(survey.id, survey.title)}
                        disabled={deletingId === survey.id}
                        className="text-[#EF4444] hover:text-[#DC2626] disabled:opacity-50 transition-colors"
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
