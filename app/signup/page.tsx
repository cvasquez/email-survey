'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AuthShell } from '@/app/components/auth-shell'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [updates, setUpdates] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { product_updates: updates },
        },
      })
      if (error) throw error
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <form className="wma-form" onSubmit={handleSignup}>
        <Link className="wma-back" href="/">← Back to home</Link>
        <h1 className="wma-h1">Start a conversation.</h1>
        <p className="wma-deck">
          Free for your first 1,000 responses a month. No credit card, no
          question-builder rabbit holes.
        </p>

        {error && <div className="wma-error">{error}</div>}

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

        <label className="wma-field">
          <span className="wma-label">Password</span>
          <input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            autoComplete="new-password"
            required
          />
          <span className="wma-hint">Use 6+ characters. Numbers and symbols welcome but not required.</span>
        </label>

        <label className="wma-check">
          <input
            type="checkbox"
            checked={updates}
            onChange={(e) => setUpdates(e.target.checked)}
          />
          <span>Send me product updates. Roughly once a month, never on weekends.</span>
        </label>

        <button type="submit" className="wma-btn-primary" disabled={loading}>
          {loading ? 'Creating account…' : 'Create my account →'}
        </button>

        <p className="wma-fineprint">
          By signing up you agree to our <a href="#">Terms</a> and{' '}
          <a href="#">Privacy Policy</a>.
        </p>
        <p className="wma-alt">
          Already have an account? <a href="/login">Sign in.</a>
        </p>
      </form>
    </AuthShell>
  )
}
