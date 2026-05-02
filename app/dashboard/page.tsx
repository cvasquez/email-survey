'use client'

import { useEffect, useMemo, useState } from 'react'
import { formatDate } from '@/lib/utils'
import type { Survey } from '@/types/database'
import { AppShell } from '@/app/components/app-shell'

type SurveyRow = Survey & { response_count: number; comment_count: number }
type FilterKey = 'all' | 'active' | 'inactive'

export default function DashboardPage() {
  const [surveys, setSurveys] = useState<SurveyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterKey, setFilterKey] = useState<FilterKey>('all')

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('/api/surveys')
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Failed to fetch surveys')
        setSurveys(data.surveys)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSurveys()
  }, [])

  const copyLink = (uniqueLinkId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    const link = `${baseUrl}/s/${uniqueLinkId}?answer=YOUR-ANSWER-HERE`
    navigator.clipboard.writeText(link)
    setCopiedId(uniqueLinkId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const deleteSurvey = async (surveyId: string, title: string) => {
    if (!confirm(`Delete "${title}" and all its responses? This cannot be undone.`)) return
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

  const stats = useMemo(() => {
    const totalResponses = surveys.reduce((sum, s) => sum + s.response_count, 0)
    const totalComments = surveys.reduce((sum, s) => sum + s.comment_count, 0)
    const activeSurveys = surveys.filter((s) => s.is_active).length
    const inactiveSurveys = surveys.length - activeSurveys
    const commentRate = totalResponses > 0 ? Math.round((totalComments / totalResponses) * 100) : 0
    return { totalResponses, totalComments, activeSurveys, inactiveSurveys, commentRate, total: surveys.length }
  }, [surveys])

  const counts = useMemo(() => ({
    all: surveys.length,
    active: surveys.filter((s) => s.is_active).length,
    inactive: surveys.filter((s) => !s.is_active).length,
  }), [surveys])

  const filteredSurveys = useMemo(() => {
    let result = surveys
    if (filterKey === 'active') result = result.filter((s) => s.is_active)
    else if (filterKey === 'inactive') result = result.filter((s) => !s.is_active)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((s) => s.title.toLowerCase().includes(q) || s.unique_link_id.toLowerCase().includes(q))
    }
    return result
  }, [surveys, filterKey, search])

  return (
    <AppShell active="surveys">
      <header className="wmd-pagehead">
        <div>
          <div className="wmd-crumbs">Surveys</div>
          <h1 className="wmd-pageh">All your surveys.</h1>
          <p className="wmd-pagedeck">
            {stats.total} survey{stats.total === 1 ? '' : 's'} · {stats.totalResponses.toLocaleString()} response{stats.totalResponses === 1 ? '' : 's'} · {stats.totalComments.toLocaleString()} comment{stats.totalComments === 1 ? '' : 's'}
          </p>
        </div>
        <div className="wmd-pageactions">
          <a className="wmd-btn-primary" href="/surveys/new">+ New survey</a>
        </div>
      </header>

      <section className="wmd-stat-row">
        <div className="wmd-stat-card">
          <div className="wmd-stat-lbl">Total responses</div>
          <div className="wmd-stat-num">{stats.totalResponses.toLocaleString()}</div>
          <div className="wmd-stat-trend">across {stats.total} survey{stats.total === 1 ? '' : 's'}</div>
        </div>
        <div className="wmd-stat-card">
          <div className="wmd-stat-lbl">Comments</div>
          <div className="wmd-stat-num">{stats.totalComments.toLocaleString()} <span className="wmd-stat-pct">· {stats.commentRate}%</span></div>
          <div className="wmd-stat-trend">comment rate</div>
        </div>
        <div className="wmd-stat-card">
          <div className="wmd-stat-lbl">Active surveys</div>
          <div className="wmd-stat-num">{stats.activeSurveys}</div>
          <div className="wmd-stat-trend">{stats.inactiveSurveys} paused</div>
        </div>
        <div className="wmd-stat-card">
          <div className="wmd-stat-lbl">Avg per survey</div>
          <div className="wmd-stat-num">
            {stats.total > 0 ? Math.round(stats.totalResponses / stats.total).toLocaleString() : 0}
          </div>
          <div className="wmd-stat-trend">responses</div>
        </div>
      </section>

      {!loading && !error && surveys.length > 0 && <ResponsesPerSurveyCard surveys={surveys} />}

      <section className="wmd-listcard">
        <div className="wmd-list-toolbar">
          <div className="wmd-search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              placeholder="Search surveys…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="wmd-filters">
            <button className={'wmd-pill ' + (filterKey === 'all' ? 'on' : '')} onClick={() => setFilterKey('all')}>
              All <span>{counts.all}</span>
            </button>
            <button className={'wmd-pill ' + (filterKey === 'active' ? 'on' : '')} onClick={() => setFilterKey('active')}>
              Active <span>{counts.active}</span>
            </button>
            <button className={'wmd-pill ' + (filterKey === 'inactive' ? 'on' : '')} onClick={() => setFilterKey('inactive')}>
              Paused <span>{counts.inactive}</span>
            </button>
          </div>
        </div>

        <div className="wmd-list">
          <div className="wmd-list-head">
            <div>Survey</div>
            <div className="wmd-c-num">Responses</div>
            <div className="wmd-c-num">Comments</div>
            <div>Link</div>
            <div className="wmd-c-num">Created</div>
            <div className="wmd-c-right">Actions</div>
          </div>

          {loading && (
            <div className="wmd-list-empty">Loading surveys…</div>
          )}

          {error && (
            <div className="wmd-list-empty wmd-form-error" style={{ margin: 22 }}>{error}</div>
          )}

          {!loading && !error && filteredSurveys.length === 0 && (
            <div className="wmd-list-empty">
              {surveys.length === 0
                ? <>No surveys yet. <a href="/surveys/new" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create your first one →</a></>
                : 'No surveys match your filter.'}
            </div>
          )}

          {!loading && !error && filteredSurveys.map((survey) => (
            <div className="wmd-list-row" key={survey.id}>
              <div className="wmd-row-name">
                <span className={'wmd-status wmd-status-' + (survey.is_active ? 'live' : 'paused')} title={survey.is_active ? 'Active' : 'Paused'}>
                  <span className="wmd-status-dot" />
                </span>
                <a href={`/surveys/${survey.id}/responses`}>
                  <div className="wmd-row-title">{survey.title}</div>
                  <div className="wmd-row-sub">{survey.is_active ? 'Live' : 'Paused'} · {formatDate(survey.created_at)}</div>
                </a>
              </div>
              <div className="wmd-c-num wmd-row-big">{survey.response_count.toLocaleString()}</div>
              <div className="wmd-c-num wmd-row-mid">{survey.comment_count.toLocaleString()}</div>
              <div className="wmd-row-top" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12 }}>{survey.unique_link_id}</div>
              <div className="wmd-c-num wmd-row-time">{formatDate(survey.created_at)}</div>
              <div className="wmd-c-right">
                <button onClick={() => copyLink(survey.unique_link_id)} className="wmd-row-menu" title="Copy share link">
                  {copiedId === survey.unique_link_id ? (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
                  )}
                </button>
                <a href={`/surveys/${survey.id}/responses`} className="wmd-row-menu" title="View responses">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></svg>
                </a>
                <button
                  onClick={() => deleteSurvey(survey.id, survey.title)}
                  disabled={deletingId === survey.id}
                  className="wmd-row-menu danger"
                  title="Delete survey"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {!loading && !error && filteredSurveys.length > 0 && (
          <footer className="wmd-list-foot">
            Showing {filteredSurveys.length} of {surveys.length}
          </footer>
        )}
      </section>
    </AppShell>
  )
}

function ResponsesPerSurveyCard({ surveys }: { surveys: SurveyRow[] }) {
  const top = useMemo(() => {
    return [...surveys].sort((a, b) => b.response_count - a.response_count).slice(0, 8)
  }, [surveys])
  const max = Math.max(1, ...top.map((s) => s.response_count))

  return (
    <section className="wmd-card">
      <div className="wmd-card-head">
        <div>
          <h2 className="wmd-card-h">Responses across all surveys</h2>
          <div className="wmd-card-meta">Top {top.length} by total responses</div>
        </div>
      </div>
      <div className="wmd-hbars">
        {top.map((s) => {
          const pct = (s.response_count / max) * 100
          const commentPct = s.response_count > 0 ? s.comment_count / s.response_count : 0
          return (
            <div className="wmd-hbar" key={s.id}>
              <div className="wmd-hbar-head">
                <span className="wmd-hbar-label" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{s.title}</span>
                <span className="wmd-hbar-vals">
                  <span className="wmd-hbar-count">{s.response_count.toLocaleString()}</span>
                  <span className="wmd-hbar-pct">{s.comment_count} comm.</span>
                </span>
              </div>
              <div className="wmd-hbar-shaft">
                <div className="wmd-hbar-fill" style={{ width: pct + '%', background: '#e66b67' }} />
                <div className="wmd-hbar-fill-comment" style={{ width: pct * commentPct + '%' }} title="With comment" />
              </div>
            </div>
          )
        })}
        <div className="wmd-hbar-legend">
          <span><span className="wmd-leg" style={{ background: '#e66b67' }} /> Total responses</span>
          <span><span className="wmd-leg" style={{ background: 'repeating-linear-gradient(-45deg, rgba(42,26,16,0.4) 0 4px, transparent 4px 8px)' }} /> With written comment</span>
        </div>
      </div>
    </section>
  )
}
