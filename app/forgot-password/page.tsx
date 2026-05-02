'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthShell } from '@/app/components/auth-shell'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/confirm?next=/settings/account`,
      })
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
      <form className="wma-form" onSubmit={handleReset}>
        <a className="wma-back" href="/login">← Back to sign in</a>
        <h1 className="wma-h1">Reset your password.</h1>
        <p className="wma-deck">
          Enter your email and we&apos;ll send you a link. The whole flow takes about 30 seconds.
        </p>

        {error && <div className="wma-error">{error}</div>}
        {success && (
          <div className="wma-success">
            Check your email for a reset link. (If it&apos;s not in your inbox, check spam.)
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
              {loading ? 'Sending…' : 'Send reset link →'}
            </button>
          </>
        )}

        <p className="wma-alt">
          Remembered it? <a href="/login">Sign in.</a>
        </p>
      </form>
    </AuthShell>
  )
}
