'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AuthShell } from '@/app/components/auth-shell'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <form className="wma-form" onSubmit={handleLogin}>
        <Link className="wma-back" href="/">← Back to home</Link>
        <h1 className="wma-h1">Welcome back.</h1>
        <p className="wma-deck">Pick up where you left off — your readers are waiting to be heard from.</p>

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
          <span className="wma-label-row">
            <span className="wma-label">Password</span>
            <a href="/forgot-password" className="wma-forgot">Forgot password?</a>
          </span>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit" className="wma-btn-primary" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in →'}
        </button>

        <p className="wma-alt">
          New here? <a href="/signup">Create an account.</a>
        </p>
        <p className="wma-alt" style={{ marginTop: 0 }}>
          <a href="/resend-verification" style={{ color: 'var(--ink-3)', fontWeight: 500 }}>
            Resend verification email
          </a>
        </p>
      </form>
    </AuthShell>
  )
}
