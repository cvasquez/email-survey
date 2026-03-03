'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

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
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
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
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="max-w-sm w-full px-6">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-semibold text-[#EDEDED]">
            <Image src="/backtalk-icon.svg" alt="Backtalk" width={32} height={32} />
            Backtalk
          </Link>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-lg p-8">
          <h1 className="text-xl font-semibold text-[#EDEDED] mb-2 text-center">Resend Verification</h1>
          <p className="text-sm text-[#666666] text-center mb-6">
            Enter your email and we&apos;ll resend the verification link.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="mb-4 p-3 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] rounded-md text-sm">
              Check your email for a verification link.
            </div>
          ) : (
            <form onSubmit={handleResend} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#141414] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm">
            <a href="/login" className="text-[#3B82F6] font-medium hover:text-[#2563EB]">
              Back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
