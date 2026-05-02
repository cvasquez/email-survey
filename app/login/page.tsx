'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
    <div className="min-h-screen flex items-center justify-center bg-[#fff5ec]">
      <div className="max-w-sm w-full px-6">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-semibold text-[#2a1a10]">
            <Image src="/backtalk-icon.svg" alt="Backtalk" width={32} height={32} />
            Backtalk
          </Link>
        </div>

        <div className="bg-[#ffffff] border border-[#e8dfd2] rounded-lg p-8">
          <h1 className="text-xl font-semibold text-[#2a1a10] mb-6 text-center">Log In</h1>

          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#6b4f3f] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#fdf6ee] border border-[#e8dfd2] rounded-md text-[#2a1a10] placeholder-[#a68b7a] focus:outline-none focus:ring-1 focus:ring-[#e66b67] focus:border-[#e66b67] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-[#6b4f3f]">
                  Password
                </label>
                <a href="/forgot-password" className="text-sm text-[#e66b67] font-medium hover:text-[#c95551]">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#fdf6ee] border border-[#e8dfd2] rounded-md text-[#2a1a10] placeholder-[#a68b7a] focus:outline-none focus:ring-1 focus:ring-[#e66b67] focus:border-[#e66b67] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#e66b67] text-white font-medium rounded-md hover:bg-[#c95551] focus:outline-none focus:ring-2 focus:ring-[#e66b67] focus:ring-offset-2 focus:ring-offset-[#ffffff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#a68b7a]">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-[#e66b67] font-medium hover:text-[#c95551]">
              Sign up
            </a>
          </p>

          <p className="mt-2 text-center text-sm">
            <a href="/resend-verification" className="text-[#a68b7a] hover:text-[#6b4f3f] transition-colors">
              Resend verification email
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
