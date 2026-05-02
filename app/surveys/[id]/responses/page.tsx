'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Response, Survey } from '@/types/database'
import { AppShell } from '@/app/components/app-shell'
import { ResponseMap } from '@/app/components/response-map'
import html2canvas from 'html2canvas'

function parseUserAgent(ua: string | null): string {
  if (!ua) return '-'
  const match = ua.match(/\(([^)]+)\)/)
  if (!match) return '-'
  const info = match[1]
  if (info.includes('Windows')) return 'Windows'
  if (info.includes('Macintosh') || info.includes('Mac OS')) return 'Mac'
  if (info.includes('iPhone')) return 'iOS'
  if (info.includes('iPad')) return 'iPadOS'
  if (info.includes('Android')) return 'Android'
  if (info.includes('Linux')) return 'Linux'
  return info.split(';')[0] || '-'
}

const ANSWER_PALETTE = ['#e66b67', '#2a1a10', '#a68b7a', '#ff9a87', '#6b4f3f', '#c69f86', '#8a3315', '#d6c8b6']

export default function ResponsesPage() {
  const params = useParams()
  const router = useRouter()
  const surveyId = params.id as string
  const supabase = createClient()

  const distRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const [survey, setSurvey] = useState<Survey | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [copiedResponseId, setCopiedResponseId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingSurvey, setDeletingSurvey] = useState(false)
  const [commentsOnly, setCommentsOnly] = useState(false)
  const [hideBots, setHideBots] = useState(true)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [linksOpen, setLinksOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: surveyData, error: surveyError } = await supabase
          .from('surveys')
          .select('*')
          .eq('id', surveyId)
          .single()

        if (surveyError || !surveyData) throw new Error('Survey not found')
        setSurvey(surveyData)

        const responseData = await fetch(`/api/surveys/${surveyId}/responses`)
        const responseJson = await responseData.json()
        if (!responseData.ok) throw new Error(responseJson.error || 'Failed to fetch responses')
        setResponses(responseJson.responses)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [surveyId, supabase, router])

  const flash = (key: string) => {
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const copyShareLink = () => {
    if (!survey) return
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    const link = `${baseUrl}/s/${survey.unique_link_id}?answer=YOUR-ANSWER-HERE`
    navigator.clipboard.writeText(link)
    flash('share')
  }

  const copyAnswerLink = (option: string) => {
    if (!survey) return
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    const url = `${baseUrl}/s/${survey.unique_link_id}?answer=${encodeURIComponent(option)}`
    try {
      const blob = new Blob([`<a href="${url}">${option}</a>`], { type: 'text/html' })
      const textBlob = new Blob([url], { type: 'text/plain' })
      navigator.clipboard.write([new ClipboardItem({ 'text/html': blob, 'text/plain': textBlob })])
    } catch {
      navigator.clipboard.writeText(url)
    }
    flash('answer-' + option)
  }

  const copyAllAnswerLinks = () => {
    if (!survey || !survey.answer_options) return
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    const htmlLines = survey.answer_options.map((option: string) => {
      const url = `${baseUrl}/s/${survey.unique_link_id}?answer=${encodeURIComponent(option)}`
      return `<a href="${url}">${option}</a>`
    })
    const plainLines = survey.answer_options.map((option: string) => {
      return `${option}: ${baseUrl}/s/${survey.unique_link_id}?answer=${encodeURIComponent(option)}`
    })
    try {
      const blob = new Blob([htmlLines.join('<br>')], { type: 'text/html' })
      const textBlob = new Blob([plainLines.join('\n')], { type: 'text/plain' })
      navigator.clipboard.write([new ClipboardItem({ 'text/html': blob, 'text/plain': textBlob })])
    } catch {
      navigator.clipboard.writeText(plainLines.join('\n'))
    }
    flash('all-answers')
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

  const renameSurvey = async () => {
    if (!survey || !titleDraft.trim()) return
    try {
      const res = await fetch(`/api/surveys/${survey.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleDraft.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to rename survey')
      setSurvey({ ...survey, title: titleDraft.trim() })
      setEditingTitle(false)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const botCount = useMemo(() => responses.filter((r) => r.is_suspected_bot).length, [responses])
  const activeResponses = useMemo(() => hideBots ? responses.filter((r) => !r.is_suspected_bot) : responses, [responses, hideBots])

  const answerCounts = useMemo(() => {
    const counts: Record<string, { total: number; withComments: number }> = {}
    for (const r of activeResponses) {
      if (!counts[r.answer_value]) counts[r.answer_value] = { total: 0, withComments: 0 }
      counts[r.answer_value].total += 1
      if (r.free_response?.trim()) counts[r.answer_value].withComments += 1
    }
    return Object.entries(counts).sort((a, b) => b[1].total - a[1].total)
  }, [activeResponses])

  const totalComments = useMemo(() => activeResponses.filter((r) => r.free_response?.trim()).length, [activeResponses])

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
          const state = parts[parts.length - 2]
          usRegions[state] = (usRegions[state] || 0) + 1
        } else {
          usRegions[parts[0]] = (usRegions[parts[0]] || 0) + 1
        }
      }
    }
    return {
      countries: Object.entries(countries).sort((a, b) => b[1] - a[1]),
      usRegions: Object.entries(usRegions).sort((a, b) => b[1] - a[1]),
    }
  }, [activeResponses])

  const filteredResponses = activeResponses.filter((response) => {
    if (commentsOnly && !response.free_response?.trim()) return false
    if (!filter) return true
    const q = filter.toLowerCase()
    return (
      response.answer_value.toLowerCase().includes(q) ||
      response.free_response?.toLowerCase().includes(q) ||
      response.respondent_name?.toLowerCase().includes(q) ||
      response.hash_md5?.toLowerCase().includes(q) ||
      response.location?.toLowerCase().includes(q)
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
    flash('stats')
  }

  const downloadPng = async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
    if (!ref.current) return
    const buttons = ref.current.querySelectorAll<HTMLElement>('[data-html2canvas-ignore]')
    buttons.forEach((btn) => (btn.style.visibility = 'hidden'))
    const canvas = await html2canvas(ref.current, { backgroundColor: '#ffffff', scale: 2 })
    buttons.forEach((btn) => (btn.style.visibility = ''))
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  }

  if (loading) {
    return (
      <AppShell active="surveys">
        <div className="wmd-list-empty" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 18 }}>
          Loading responses…
        </div>
      </AppShell>
    )
  }

  if (error || !survey) {
    return (
      <AppShell active="surveys">
        <div className="wmd-card">
          <div className="wmd-card-body">
            <h1 className="wmd-pageh" style={{ fontSize: 24 }}>Couldn&apos;t load this survey</h1>
            <p className="wmd-pagedeck">{error || 'Survey not found.'}</p>
            <a className="wmd-btn-primary" href="/dashboard" style={{ marginTop: 16, display: 'inline-flex' }}>← Back to surveys</a>
          </div>
        </div>
      </AppShell>
    )
  }

  const totalActive = activeResponses.length
  const topAnswer = answerCounts[0]

  return (
    <AppShell active="surveys">
      <header className="wmd-pagehead">
        <div>
          <div className="wmd-crumbs">
            <a href="/dashboard">Surveys</a>
            <span className="wmd-crumb-sep">/</span>
            <span style={{ color: 'var(--ink-2)', textTransform: 'none', letterSpacing: 0, fontSize: 13 }}>{survey.title}</span>
          </div>
          <div className="wmd-rh-head">
            {editingTitle ? (
              <>
                <input
                  className="wmd-form-input"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  autoFocus
                  style={{ fontSize: 28, fontWeight: 700, padding: '6px 10px' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') renameSurvey()
                    if (e.key === 'Escape') setEditingTitle(false)
                  }}
                />
                <button className="wmd-btn-primary wmd-btn-sm" onClick={renameSurvey}>Save</button>
                <button className="wmd-btn-ghost wmd-btn-sm" onClick={() => setEditingTitle(false)}>Cancel</button>
              </>
            ) : (
              <>
                <h1 className="wmd-pageh">{survey.title}</h1>
                {survey.is_active ? (
                  <span className="wmd-livetag"><span className="wmd-livedot" /> Live</span>
                ) : (
                  <span className="wmd-pausedtag">Paused</span>
                )}
                <button
                  className="wmd-btn-ghost wmd-btn-sm"
                  onClick={() => { setTitleDraft(survey.title); setEditingTitle(true) }}
                >
                  Rename
                </button>
              </>
            )}
          </div>
          <p className="wmd-pagedeck">
            {survey.question ? `${survey.question} · ` : ''}Created {formatDate(survey.created_at)}
          </p>
        </div>
        <div className="wmd-pageactions">
          <button className="wmd-btn-ghost" onClick={copyShareLink}>{copiedKey === 'share' ? 'Copied!' : 'Copy link'}</button>
          <button className="wmd-btn-ghost" onClick={copyStats} disabled={totalActive === 0}>{copiedKey === 'stats' ? 'Copied!' : 'Copy stats'}</button>
          <button className="wmd-btn-ghost wmd-btn-warn" onClick={deleteSurvey} disabled={deletingSurvey}>
            {deletingSurvey ? 'Deleting…' : 'Delete survey'}
          </button>
        </div>
      </header>

      {survey.answer_options && survey.answer_options.length > 0 && (
        <section className="wmd-card">
          <button
            type="button"
            onClick={() => setLinksOpen((v) => !v)}
            className="wmd-card-head"
            aria-expanded={linksOpen}
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: 'transparent' }}
          >
            <div>
              <h2 className="wmd-card-h">Survey links <span style={{ fontWeight: 500, color: 'var(--ink-3)', fontSize: 13, marginLeft: 6 }}>· {survey.answer_options.length}</span></h2>
              <span className="wmd-card-meta">Drop these into your email. Each one carries a different answer.</span>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600 }}>{linksOpen ? 'Hide' : 'Show'}</span>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'var(--ink-3)', transform: linksOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s ease' }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </button>
          {linksOpen && (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 22px', marginTop: 4 }}>
                <button className="wmd-card-link" onClick={copyAllAnswerLinks}>
                  {copiedKey === 'all-answers' ? 'Copied all!' : 'Copy all'}
                </button>
              </div>
              <div className="wmd-links">
                {survey.answer_options.map((option: string, i: number) => {
                  const baseUrl = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_APP_URL || window.location.origin) : ''
                  const url = `${baseUrl}/s/${survey.unique_link_id}?answer=${encodeURIComponent(option)}`
                  const color = ANSWER_PALETTE[i % ANSWER_PALETTE.length]
                  return (
                    <div className="wmd-link" key={option}>
                      <span className="wmd-link-pill" style={{ background: color, color: '#fff' }}>{option}</span>
                      <code className="wmd-link-url">{url}</code>
                      <button className="wmd-link-copy" onClick={() => copyAnswerLink(option)}>
                        {copiedKey === 'answer-' + option ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </section>
      )}

      <section className="wmd-stat-row">
        <div className="wmd-stat-card">
          <div className="wmd-stat-lbl">Total responses</div>
          <div className="wmd-stat-num">{totalActive.toLocaleString()}</div>
          <div className="wmd-stat-trend">
            {botCount > 0 && hideBots ? `${botCount} bot${botCount === 1 ? '' : 's'} hidden` : `from ${responses.length} click${responses.length === 1 ? '' : 's'}`}
          </div>
        </div>
        <div className="wmd-stat-card">
          <div className="wmd-stat-lbl">Comments</div>
          <div className="wmd-stat-num">
            {totalComments.toLocaleString()} <span className="wmd-stat-pct">· {totalActive > 0 ? Math.round((totalComments / totalActive) * 100) : 0}%</span>
          </div>
          <div className="wmd-stat-trend">of responses</div>
        </div>
        {topAnswer && (
          <div className="wmd-stat-card wmd-stat-card-accent">
            <div className="wmd-stat-lbl">{topAnswer[0]}</div>
            <div className="wmd-stat-num">
              {topAnswer[1].total.toLocaleString()}{' '}
              <span className="wmd-stat-pct">· {totalActive > 0 ? Math.round((topAnswer[1].total / totalActive) * 100) : 0}%</span>
            </div>
            <div className="wmd-stat-trend">leading answer</div>
          </div>
        )}
        {answerCounts[1] && (
          <div className="wmd-stat-card">
            <div className="wmd-stat-lbl">{answerCounts[1][0]}</div>
            <div className="wmd-stat-num">
              {answerCounts[1][1].total.toLocaleString()}{' '}
              <span className="wmd-stat-pct">· {totalActive > 0 ? Math.round((answerCounts[1][1].total / totalActive) * 100) : 0}%</span>
            </div>
            <div className="wmd-stat-trend">runner-up</div>
          </div>
        )}
        {!topAnswer && (
          <div className="wmd-stat-card">
            <div className="wmd-stat-lbl">Top answer</div>
            <div className="wmd-stat-num">—</div>
            <div className="wmd-stat-trend">no responses yet</div>
          </div>
        )}
        {!answerCounts[1] && topAnswer && (
          <div className="wmd-stat-card">
            <div className="wmd-stat-lbl">Unique answers</div>
            <div className="wmd-stat-num">{answerCounts.length}</div>
            <div className="wmd-stat-trend">distinct values</div>
          </div>
        )}
      </section>

      {totalActive > 0 && (
        <section className="wmd-grid-2">
          <div className="wmd-card" ref={distRef}>
            <div className="wmd-card-head">
              <h2 className="wmd-card-h">Answer distribution</h2>
              <button data-html2canvas-ignore className="wmd-card-link" onClick={() => downloadPng(distRef, `${survey.title}-distribution.png`)}>
                Save PNG
              </button>
            </div>
            <div className="wmd-hbars">
              {answerCounts.map(([value, { total, withComments }], i) => {
                const pct = totalActive > 0 ? (total / totalActive) * 100 : 0
                const commentFrac = total > 0 ? withComments / total : 0
                const color = ANSWER_PALETTE[i % ANSWER_PALETTE.length]
                return (
                  <div className="wmd-hbar" key={value}>
                    <div className="wmd-hbar-head">
                      <span className="wmd-hbar-label">{value}</span>
                      <span className="wmd-hbar-vals">
                        <span className="wmd-hbar-count">{total.toLocaleString()}</span>
                        <span className="wmd-hbar-pct">{Math.round(pct)}%</span>
                      </span>
                    </div>
                    <div className="wmd-hbar-shaft">
                      <div className="wmd-hbar-fill" style={{ width: pct + '%', background: color }} />
                      <div className="wmd-hbar-fill-comment" style={{ width: pct * commentFrac + '%' }} title={`${withComments} with comments`} />
                    </div>
                  </div>
                )
              })}
              <div className="wmd-hbar-legend">
                <span><span className="wmd-leg" style={{ background: '#e66b67' }} /> Answer total</span>
                <span><span className="wmd-leg" style={{ background: 'repeating-linear-gradient(-45deg, rgba(42,26,16,0.4) 0 4px, transparent 4px 8px)' }} /> With written comment ({totalComments} of {totalActive})</span>
              </div>
            </div>
          </div>

          {locationBreakdowns.countries.length > 0 ? (
            <div className="wmd-card" ref={mapRef}>
              <div className="wmd-card-head">
                <h2 className="wmd-card-h">Response locations</h2>
                <button data-html2canvas-ignore className="wmd-card-link" onClick={() => downloadPng(mapRef, `${survey.title}-locations.png`)}>
                  Save PNG
                </button>
              </div>
              <div className="wmd-map">
                <ResponseMap countries={locationBreakdowns.countries} />
                <div className="wmd-map-foot">
                  <strong>{locationBreakdowns.countries.length}</strong> countr{locationBreakdowns.countries.length === 1 ? 'y' : 'ies'}
                  {locationBreakdowns.usRegions.length > 0 && <> · <strong>{locationBreakdowns.usRegions.length}</strong> US states</>}
                </div>
              </div>
            </div>
          ) : (
            <div className="wmd-card">
              <div className="wmd-card-head">
                <h2 className="wmd-card-h">Response locations</h2>
              </div>
              <div className="wmd-card-body">
                <p className="wmd-pagedeck">No location data yet.</p>
              </div>
            </div>
          )}
        </section>
      )}

      {(locationBreakdowns.countries.length > 0 || locationBreakdowns.usRegions.length > 0) && (
        <section className="wmd-grid-2">
          {locationBreakdowns.countries.length > 0 && (
            <div className="wmd-card">
              <div className="wmd-card-head"><h2 className="wmd-card-h">By country</h2></div>
              <RankList items={locationBreakdowns.countries} />
            </div>
          )}
          {locationBreakdowns.usRegions.length > 0 && (
            <div className="wmd-card">
              <div className="wmd-card-head"><h2 className="wmd-card-h">US by region</h2></div>
              <RankList items={locationBreakdowns.usRegions} />
            </div>
          )}
        </section>
      )}

      <section className="wmd-card">
        <div className="wmd-card-head">
          <div>
            <h2 className="wmd-card-h">Responses</h2>
            <span className="wmd-card-meta">Real names and identifiers stay in your account. Hover a row to copy or delete.</span>
          </div>
        </div>
        <div className="wmd-resp-toolbar">
          <div className="wmd-search wmd-search-sm">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              placeholder="Filter responses…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <label className="wmd-resp-toggle">
            <input type="checkbox" checked={commentsOnly} onChange={(e) => setCommentsOnly(e.target.checked)} />
            Comments only
          </label>
          {botCount > 0 && (
            <label className="wmd-resp-toggle">
              <input type="checkbox" checked={hideBots} onChange={(e) => setHideBots(e.target.checked)} />
              Hide bots <span className="wmd-resp-pill">{botCount}</span>
            </label>
          )}
          <div className="wmd-resp-spacer" />
          <button className="wmd-btn-primary wmd-btn-sm" onClick={exportToCSV} disabled={activeResponses.length === 0}>
            Export CSV
          </button>
        </div>

        {filteredResponses.length === 0 ? (
          <div className="wmd-list-empty">
            {responses.length === 0
              ? 'No responses yet. Share your survey link to start collecting feedback.'
              : activeResponses.length === 0
                ? 'All responses were flagged as bots. Uncheck "Hide bots" to see them.'
                : 'No responses match your filter.'}
          </div>
        ) : (
          <>
            <div className="wmd-table">
              <div className="wmd-table-head">
                <div>Date</div>
                <div>Answer</div>
                <div>Response</div>
                <div>Name</div>
                <div>Location</div>
                <div>Device</div>
                <div className="wmd-c-right">·</div>
              </div>
              {filteredResponses.map((r) => {
                const answerIdx = answerCounts.findIndex(([v]) => v === r.answer_value)
                const color = answerIdx >= 0 ? ANSWER_PALETTE[answerIdx % ANSWER_PALETTE.length] : '#a68b7a'
                return (
                  <div className="wmd-table-row" key={r.id}>
                    <div className="wmd-td-date">{formatDate(r.created_at)}</div>
                    <div>
                      <span className="wmd-ans" style={{ background: color, color: '#fff' }}>{r.answer_value}</span>
                    </div>
                    <div className="wmd-td-resp">
                      {r.free_response ? (
                        <>
                          <span>{r.free_response}</span>
                          <button onClick={() => copyResponse(r)} className="wmd-resp-copy">
                            {copiedResponseId === r.id ? 'Copied!' : 'Copy'}
                          </button>
                        </>
                      ) : (
                        <span className="wmd-resp-empty">—</span>
                      )}
                    </div>
                    <div className="wmd-td-name">{r.respondent_name || '—'}</div>
                    <div className="wmd-td-loc">{r.location || '—'}</div>
                    <div className="wmd-td-dev">{parseUserAgent(r.user_agent)}</div>
                    <div className="wmd-c-right">
                      <button
                        onClick={() => deleteResponse(r.id)}
                        disabled={deletingId === r.id}
                        className="wmd-trash"
                        aria-label="Delete response"
                        title="Delete response"
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" /></svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            <footer className="wmd-table-foot">
              Showing {filteredResponses.length} of {activeResponses.length}
            </footer>
          </>
        )}
      </section>
    </AppShell>
  )
}

function RankList({ items }: { items: [string, number][] }) {
  const max = Math.max(1, ...items.map(([, v]) => v))
  return (
    <ul className="wmd-rank">
      {items.map(([name, count]) => (
        <li key={name}>
          <span className="wmd-rank-name">{name}</span>
          <span className="wmd-rank-bar"><span style={{ width: (count / max) * 100 + '%' }} /></span>
          <span className="wmd-rank-val">{count}</span>
        </li>
      ))}
    </ul>
  )
}
