'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthShell } from '@/app/components/auth-shell'

export default function ResendVerificationPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email })
      if (error) throw error
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <form className="wma-form" onSubmit={handleResend}>
        <a className="wma-back" href="/login">← Back to sign in</a>
        <h1 className="wma-h1">Resend verification.</h1>
        <p className="wma-deck">
          Didn&apos;t catch the first one? We&apos;ll fire off another verification link.
        </p>

        {error && <div className="wma-error">{error}</div>}
        {success && (
          <div className="wma-success">
            Verification email sent. (Give it a minute, then check spam if needed.)
          </div>
        )}

        {!success && (
          <>
            <label className="wma-field">
              <span className="wma-label">Email</span>
              <input
                type="email"
                placeholder="you@yourdomain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <button type="submit" className="wma-btn-primary" disabled={loading}>
              {loading ? 'Sending…' : 'Resend verification →'}
            </button>
          </>
        )}

        <p className="wma-alt">
          Already verified? <a href="/login">Sign in.</a>
        </p>
      </form>
    </AuthShell>
  )
}
