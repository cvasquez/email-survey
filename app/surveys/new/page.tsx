'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/app/components/app-shell'

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          question: question.trim() || undefined,
          answer_options: answerOptions.filter((o) => o.trim()),
          require_name: requireName,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create survey')
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell active="surveys">
      <header className="wmd-pagehead">
        <div>
          <div className="wmd-crumbs">
            <a href="/dashboard">Surveys</a>
            <span className="wmd-crumb-sep">/</span>
            <span style={{ color: 'var(--ink-2)', textTransform: 'none', letterSpacing: 0, fontSize: 13 }}>New</span>
          </div>
          <h1 className="wmd-pageh">Start a new survey.</h1>
          <p className="wmd-pagedeck">Name it, list the answers, drop the links into your next email. That&apos;s the whole job.</p>
        </div>
      </header>

      <section className="wmd-card" style={{ maxWidth: 640 }}>
        <div className="wmd-card-head">
          <h2 className="wmd-card-h">Survey details</h2>
        </div>
        <form onSubmit={handleSubmit} className="wmd-form">
          {error && <div className="wmd-form-error">{error}</div>}

          <div className="wmd-form-row">
            <label className="wmd-form-label" htmlFor="title">Survey title</label>
            <input
              id="title"
              type="text"
              className="wmd-form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Saturday Memo · Issue #47"
            />
            <span className="wmd-form-hint">For your reference. Recipients won&apos;t see this.</span>
          </div>

          <div className="wmd-form-row">
            <label className="wmd-form-label" htmlFor="question">
              Question text <span style={{ fontWeight: 500, color: 'var(--ink-3)' }}>· optional</span>
            </label>
            <input
              id="question"
              type="text"
              className="wmd-form-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., How did this issue land?"
            />
            <span className="wmd-form-hint">Shown to respondents on the follow-up page.</span>
          </div>

          <div className="wmd-form-row">
            <label className="wmd-form-label">Answer options</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {answerOptions.map((option, index) => (
                <div key={index} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="text"
                    className="wmd-form-input"
                    value={option}
                    onChange={(e) => {
                      const updated = [...answerOptions]
                      updated[index] = e.target.value
                      setAnswerOptions(updated)
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                  {answerOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setAnswerOptions(answerOptions.filter((_, i) => i !== index))}
                      className="wmd-row-menu danger"
                      aria-label="Remove option"
                      style={{ flexShrink: 0 }}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setAnswerOptions([...answerOptions, ''])}
              style={{ alignSelf: 'flex-start', marginTop: 4, fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}
            >
              + Add option
            </button>
            <span className="wmd-form-hint">Each option becomes its own click-tracked URL.</span>
          </div>

          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', padding: '4px 0' }}>
            <input
              type="checkbox"
              checked={requireName}
              onChange={(e) => setRequireName(e.target.checked)}
              style={{ accentColor: 'var(--accent)', marginTop: 4, width: 16, height: 16 }}
            />
            <span>
              <span className="wmd-form-label">Require respondent name</span>
              <span className="wmd-form-hint" style={{ display: 'block', marginTop: 2 }}>
                Show a required name field on the follow-up page.
              </span>
            </span>
          </label>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="submit" disabled={loading} className="wmd-btn-primary">
              {loading ? 'Creating…' : 'Create survey'}
            </button>
            <a href="/dashboard" className="wmd-btn-ghost">Cancel</a>
          </div>
        </form>
      </section>
    </AppShell>
  )
}
