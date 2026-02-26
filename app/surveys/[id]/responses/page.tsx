'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Response, Survey } from '@/types/database'
import { Nav } from '@/app/components/nav'
import { AnswerDistributionChart } from '@/app/components/answer-distribution-chart'
import { ResponseMap } from '@/app/components/response-map'
import html2canvas from 'html2canvas'

function parseUserAgent(ua: string | null): string {
  if (!ua) return '-'
  // Extract OS/platform info
  const match = ua.match(/\(([^)]+)\)/)
  if (!match) return '-'
  const info = match[1]
  if (info.includes('Windows')) return 'Windows'
  if (info.includes('Macintosh') || info.includes('Mac OS')) return 'Mac'
  if (info.includes('iPhone')) return 'iPhone'
  if (info.includes('iPad')) return 'iPad'
  if (info.includes('Android')) return 'Android'
  if (info.includes('Linux')) return 'Linux'
  return info.split(';')[0] || '-'
}

export default function ResponsesPage() {
  const params = useParams()
  const router = useRouter()
  const surveyId = params.id as string
  const supabase = createClient()

  const chartRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const [survey, setSurvey] = useState<Survey | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedStats, setCopiedStats] = useState(false)
  const [copiedResponseId, setCopiedResponseId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingSurvey, setDeletingSurvey] = useState(false)
  const [commentsOnly, setCommentsOnly] = useState(false)
  const [hideBots, setHideBots] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // RLS ensures user can only access surveys from their orgs
        const { data: surveyData, error: surveyError } = await supabase
          .from('surveys')
          .select('*')
          .eq('id', surveyId)
          .single()

        if (surveyError || !surveyData) {
          throw new Error('Survey not found')
        }

        setSurvey(surveyData)

        const responseData = await fetch(`/api/surveys/${surveyId}/responses`)
        const responseJson = await responseData.json()

        if (!responseData.ok) {
          throw new Error(responseJson.error || 'Failed to fetch responses')
        }

        setResponses(responseJson.responses)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [surveyId, supabase, router])

  const copyLink = () => {
    if (!survey) return
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    const link = `${baseUrl}/s/${survey.unique_link_id}?answer=YOUR-ANSWER-HERE`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const deleteResponse = async (responseId: string) => {
    if (!confirm('Delete this response? This cannot be undone.')) return

    setDeletingId(responseId)
    try {
      const res = await fetch(`/api/responses?id=${responseId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete response')
      }
      setResponses((prev) => prev.filter((r) => r.id !== responseId))
    } catch (err: any) {
      alert(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const deleteSurvey = async () => {
    if (!survey) return
    if (!confirm(`Delete "${survey.title}" and all its responses? This cannot be undone.`)) return

    setDeletingSurvey(true)
    try {
      const res = await fetch(`/api/surveys/${survey.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete survey')
      }
      router.push('/dashboard')
    } catch (err: any) {
      alert(err.message)
      setDeletingSurvey(false)
    }
  }

  const botCount = useMemo(() => {
    return responses.filter((r) => r.is_suspected_bot).length
  }, [responses])

  const activeResponses = useMemo(() => {
    return hideBots ? responses.filter((r) => !r.is_suspected_bot) : responses
  }, [responses, hideBots])

  const answerCounts = useMemo(() => {
    const counts: Record<string, { total: number; withComments: number }> = {}
    for (const r of activeResponses) {
      if (!counts[r.answer_value]) counts[r.answer_value] = { total: 0, withComments: 0 }
      counts[r.answer_value].total += 1
      if (r.free_response?.trim()) counts[r.answer_value].withComments += 1
    }
    return Object.entries(counts).sort((a, b) => b[1].total - a[1].total)
  }, [activeResponses])

  const totalComments = useMemo(() => {
    return activeResponses.filter((r) => r.free_response?.trim()).length
  }, [activeResponses])

  const locationBreakdowns = useMemo(() => {
    const countries: Record<string, number> = {}
    const usRegions: Record<string, number> = {}

    for (const r of activeResponses) {
      if (!r.location) continue
      const parts = r.location.split(', ')
      if (parts.length < 2) continue
      const country = parts[parts.length - 1]
      countries[country] = (countries[country] || 0) + 1
      if (country === 'United States') {
        if (parts.length >= 3) {
          // New format: "City, State, Country"
          const state = parts[parts.length - 2]
          usRegions[state] = (usRegions[state] || 0) + 1
        } else {
          // Legacy format: "City, Country" — use city as fallback
          usRegions[parts[0]] = (usRegions[parts[0]] || 0) + 1
        }
      }
    }

    return {
      countries: Object.entries(countries).sort((a, b) => b[1] - a[1]),
      usRegions: Object.entries(usRegions).sort((a, b) => b[1] - a[1]),
    }
  }, [responses])

  const filteredResponses = activeResponses.filter((response) => {
    if (commentsOnly && !response.free_response?.trim()) return false
    if (!filter) return true
    const searchLower = filter.toLowerCase()
    return (
      response.answer_value.toLowerCase().includes(searchLower) ||
      response.free_response?.toLowerCase().includes(searchLower) ||
      response.respondent_name?.toLowerCase().includes(searchLower) ||
      response.hash_md5?.toLowerCase().includes(searchLower) ||
      response.location?.toLowerCase().includes(searchLower)
    )
  })

  const exportToCSV = () => {
    if (activeResponses.length === 0) return

    const headers = ['Timestamp', 'Answer Value', 'Free Response', 'Name', 'Hash MD5', 'IP Address', 'Location', 'Device', 'Suspected Bot']
    const rows = activeResponses.map((r) => [
      r.created_at,
      r.answer_value,
      (r.free_response || '').replace(/"/g, '""'),
      r.respondent_name || '',
      r.hash_md5 || '',
      r.ip_address || '',
      r.location || '',
      parseUserAgent(r.user_agent),
      r.is_suspected_bot ? 'Yes' : 'No',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `survey-${surveyId}-responses.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyResponse = (response: Response) => {
    const parts = [`"${response.free_response || ''}"`]
    const attribution = [response.respondent_name, response.location].filter(Boolean).join(' from ')
    const answerTag = response.answer_value ? `(responded ${response.answer_value})` : ''
    const attrParts = [attribution, answerTag].filter(Boolean).join(' ')
    if (attrParts) parts.push(`- ${attrParts}`)
    navigator.clipboard.writeText(parts.join('\n'))
    setCopiedResponseId(response.id)
    setTimeout(() => setCopiedResponseId(null), 2000)
  }

  const copyStats = () => {
    if (activeResponses.length === 0) return

    const lines: string[] = []
    lines.push(survey?.title || 'Survey Results')
    lines.push(`${activeResponses.length} total responses, ${totalComments} with comments`)
    lines.push('')
    lines.push('The Results:')
    for (const [value, { total, withComments }] of answerCounts) {
      const pct = activeResponses.length > 0 ? Math.round((total / activeResponses.length) * 100) : 0
      const commentPct = total > 0 ? Math.round((withComments / total) * 100) : 0
      const pctOfAllComments = totalComments > 0 ? Math.round((withComments / totalComments) * 100) : 0
      lines.push(`${value}: ${total} (${pct}%). ${commentPct}% commented for ${pctOfAllComments}% of all comments`)
    }

    navigator.clipboard.writeText(lines.join('\n'))
    setCopiedStats(true)
    setTimeout(() => setCopiedStats(false), 2000)
  }

  const downloadPng = async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
    if (!ref.current) return
    const canvas = await html2canvas(ref.current, { backgroundColor: '#ffffff', scale: 2 })
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700">Loading responses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
            <p className="text-gray-700 mb-4">{error}</p>
            <a
              href="/dashboard"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{survey?.title}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={copyLink}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={copyStats}
              disabled={activeResponses.length === 0}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition disabled:opacity-50"
            >
              {copiedStats ? 'Copied!' : 'Copy Stats'}
            </button>
            <button
              onClick={deleteSurvey}
              disabled={deletingSurvey}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition disabled:opacity-50"
            >
              {deletingSurvey ? 'Deleting...' : 'Delete Survey'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Responses</p>
            <p className="text-2xl font-bold text-gray-900">{activeResponses.length}</p>
            {botCount > 0 && hideBots && (
              <p className="text-xs text-gray-400 mt-1">{botCount} bot{botCount !== 1 ? 's' : ''} hidden</p>
            )}
          </div>
          {answerCounts.map(([value, { total, withComments }]) => (
            <div key={value} className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 truncate">{value}</p>
              <p className="text-2xl font-bold text-gray-900">
                {total}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  ({activeResponses.length > 0 ? Math.round((total / activeResponses.length) * 100) : 0}%)
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {total > 0 ? Math.round((withComments / total) * 100) : 0}% commented
              </p>
              <p className="text-xs text-gray-500">
                {totalComments > 0 ? Math.round((withComments / totalComments) * 100) : 0}% of all comments
              </p>
            </div>
          ))}
        </div>

        {/* Visualizations */}
        {activeResponses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div ref={chartRef} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">Answer Distribution</p>
                <button
                  onClick={() => downloadPng(chartRef, `${survey?.title || 'chart'}-distribution.png`)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Save PNG
                </button>
              </div>
              <AnswerDistributionChart answerCounts={answerCounts} totalResponses={activeResponses.length} />
            </div>
            {locationBreakdowns.countries.length > 0 && (
              <div ref={mapRef} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-600">Response Locations</p>
                  <button
                    onClick={() => downloadPng(mapRef, `${survey?.title || 'map'}-locations.png`)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Save PNG
                  </button>
                </div>
                <ResponseMap countries={locationBreakdowns.countries} />
              </div>
            )}
          </div>
        )}

        {/* Location Breakdowns */}
        {(locationBreakdowns.countries.length > 0 || locationBreakdowns.usRegions.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {locationBreakdowns.countries.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm font-medium text-gray-600 mb-2">By Country</p>
                <div className="space-y-1">
                  {locationBreakdowns.countries.map(([country, count]) => (
                    <div key={country} className="flex justify-between text-sm">
                      <span className="text-gray-900">{country}</span>
                      <span className="text-gray-500">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {locationBreakdowns.usRegions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm font-medium text-gray-600 mb-2">US by Region</p>
                <div className="space-y-1">
                  {locationBreakdowns.usRegions.map(([region, count]) => (
                    <div key={region} className="flex justify-between text-sm">
                      <span className="text-gray-900">{region}</span>
                      <span className="text-gray-500">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter + Export */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              type="text"
              placeholder="Filter responses..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={commentsOnly}
                onChange={(e) => setCommentsOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Comments only
            </label>
            {botCount > 0 && (
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={hideBots}
                  onChange={(e) => setHideBots(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Hide bots ({botCount})
              </label>
            )}
          </div>
          <button
            onClick={exportToCSV}
            disabled={activeResponses.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Export to CSV
          </button>
        </div>

        {filteredResponses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-700">
              {responses.length === 0
                ? 'No responses yet. Share your survey link to start collecting responses!'
                : activeResponses.length === 0
                  ? 'All responses were flagged as bots. Uncheck "Hide bots" to see them.'
                  : 'No responses match your filter.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile card layout */}
            <div className="space-y-4 md:hidden">
              {filteredResponses.map((response) => (
                <div key={response.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{response.answer_value}</span>
                    <button
                      onClick={() => deleteResponse(response.id)}
                      disabled={deletingId === response.id}
                      className="text-red-600 text-sm disabled:opacity-50"
                    >
                      {deletingId === response.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                  {response.free_response && (
                    <div className="group/resp relative mb-2">
                      <p className="text-sm text-gray-900">{response.free_response}</p>
                      <button
                        onClick={() => copyResponse(response)}
                        className="mt-1 text-xs text-gray-400 hover:text-gray-600"
                      >
                        {copiedResponseId === response.id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>{formatDate(response.created_at)}</span>
                    {survey?.require_name && response.respondent_name && (
                      <span>{response.respondent_name}</span>
                    )}
                    {response.location && <span>{response.location}</span>}
                    <span>{parseUserAgent(response.user_agent)}</span>
                    {response.hash_md5 && (
                      <span className="font-mono">{response.hash_md5.substring(0, 12)}...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table layout */}
            <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <colgroup>
                    <col className="w-[100px]" />
                    <col className="w-[100px]" />
                    <col />
                    {survey?.require_name && <col className="w-[100px]" />}
                    <col className="w-[120px]" />
                    <col className="w-[80px]" />
                    <col className="w-[100px]" />
                    <col className="w-[70px]" />
                  </colgroup>
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Answer
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Response
                      </th>
                      {survey?.require_name && (
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Name
                        </th>
                      )}
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Device
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Hash
                      </th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResponses.map((response) => (
                      <tr key={response.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3 text-xs text-gray-500">
                          {formatDate(response.created_at)}
                        </td>
                        <td className="px-3 py-3 text-sm font-medium text-gray-900 truncate">
                          {response.answer_value}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-900">
                          {response.free_response ? (
                            <div className="group/resp relative">
                              <span>{response.free_response}</span>
                              <button
                                onClick={() => copyResponse(response)}
                                className="ml-2 text-xs text-gray-400 hover:text-gray-600 opacity-0 group-hover/resp:opacity-100 transition-opacity"
                              >
                                {copiedResponseId === response.id ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                          ) : '-'}
                        </td>
                        {survey?.require_name && (
                          <td className="px-3 py-3 text-sm text-gray-700 truncate">
                            {response.respondent_name || '-'}
                          </td>
                        )}
                        <td className="px-3 py-3 text-xs text-gray-500 truncate">
                          {response.location || '-'}
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-500 truncate">
                          {parseUserAgent(response.user_agent)}
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-500 font-mono truncate">
                          {response.hash_md5 ? response.hash_md5.substring(0, 8) : '-'}
                        </td>
                        <td className="px-3 py-3 text-right text-sm">
                          <button
                            onClick={() => deleteResponse(response.id)}
                            disabled={deletingId === response.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {deletingId === response.id ? '...' : '❌'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
