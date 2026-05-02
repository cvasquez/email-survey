'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

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
    <div className="min-h-screen flex items-center justify-center bg-[#fff5ec]">
      <div className="max-w-sm w-full px-6">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-semibold text-[#2a1a10]">
            <Image src="/backtalk-icon.svg" alt="Backtalk" width={32} height={32} />
            Backtalk
          </Link>
        </div>

        <div className="bg-[#ffffff] border border-[#e8dfd2] rounded-lg p-8">
          <h1 className="text-xl font-semibold text-[#2a1a10] mb-2 text-center">Reset Password</h1>
          <p className="text-sm text-[#a68b7a] text-center mb-6">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="mb-4 p-3 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] rounded-md text-sm">
              Check your email for a password reset link.
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#e66b67] text-white font-medium rounded-md hover:bg-[#c95551] focus:outline-none focus:ring-2 focus:ring-[#e66b67] focus:ring-offset-2 focus:ring-offset-[#ffffff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm">
            <a href="/login" className="text-[#e66b67] font-medium hover:text-[#c95551]">
              Back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
