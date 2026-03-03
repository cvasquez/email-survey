'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

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
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="max-w-sm w-full px-6">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-semibold text-[#EDEDED]">Backtalk</Link>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-lg p-8">
          <h1 className="text-xl font-semibold text-[#EDEDED] mb-6 text-center">Log In</h1>

          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#A1A1A1] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-md text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-[#A1A1A1]">
                  Password
                </label>
                <a href="/forgot-password" className="text-sm text-[#3B82F6] font-medium hover:text-[#2563EB]">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-md text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#141414] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#666666]">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-[#3B82F6] font-medium hover:text-[#2563EB]">
              Sign up
            </a>
          </p>

          <p className="mt-2 text-center text-sm">
            <a href="/resend-verification" className="text-[#666666] hover:text-[#A1A1A1] transition-colors">
              Resend verification email
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
