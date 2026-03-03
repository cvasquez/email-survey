'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Nav } from '@/app/components/nav'

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
        setMessage({ type: 'success', text: 'Password updated successfully.' })
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
    <div className="min-h-screen bg-[#0A0A0A]">
      <Nav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-[#EDEDED]">Account Settings</h2>

        <div className="bg-[#141414] border border-[#262626] rounded-lg p-6">
          <h3 className="text-base font-semibold mb-4 text-[#EDEDED]">Update Password</h3>

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-[#A1A1A1] mb-1">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-md px-3 py-2 text-sm text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-[#A1A1A1] mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-md px-3 py-2 text-sm text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === 'success'
                    ? 'bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]'
                    : 'bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#3B82F6] text-white text-sm rounded-md hover:bg-[#2563EB] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
