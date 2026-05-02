'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AppShell } from '@/app/components/app-shell'

export default function AccountSettingsPage() {
  const supabase = createClient()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    setSaving(true)

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Password updated.' })
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell active="account">
      <header className="wmd-pagehead">
        <div>
          <div className="wmd-crumbs">Account</div>
          <h1 className="wmd-pageh">Account settings.</h1>
          <p className="wmd-pagedeck">Update your password and manage how you sign in.</p>
        </div>
      </header>

      <section className="wmd-card" style={{ maxWidth: 560 }}>
        <div className="wmd-card-head">
          <h2 className="wmd-card-h">Update password</h2>
          <span className="wmd-card-meta">Use 6+ characters. We&apos;ll sign you out of other devices after.</span>
        </div>
        <form onSubmit={handleUpdatePassword} className="wmd-form">
          <div className="wmd-form-row">
            <label className="wmd-form-label" htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              className="wmd-form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="wmd-form-row">
            <label className="wmd-form-label" htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password"
              type="password"
              className="wmd-form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {message && (
            <div
              className="wmd-form-error"
              style={
                message.type === 'success'
                  ? { background: 'rgba(47,122,61,0.08)', borderColor: 'rgba(47,122,61,0.2)', color: '#1f5e2e' }
                  : undefined
              }
            >
              {message.text}
            </div>
          )}

          <button type="submit" disabled={saving} className="wmd-btn-primary" style={{ alignSelf: 'flex-start' }}>
            {saving ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </section>
    </AppShell>
  )
}
