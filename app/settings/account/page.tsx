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
    <div className="min-h-screen bg-[#fff5ec]">
      <Nav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-[#2a1a10]">Account Settings</h2>

        <div className="bg-[#ffffff] border border-[#e8dfd2] rounded-lg p-6">
          <h3 className="text-base font-semibold mb-4 text-[#2a1a10]">Update Password</h3>

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-[#6b4f3f] mb-1">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#fdf6ee] border border-[#e8dfd2] rounded-md px-3 py-2 text-sm text-[#2a1a10] placeholder-[#a68b7a] focus:outline-none focus:ring-1 focus:ring-[#e66b67] focus:border-[#e66b67] transition-colors"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-[#6b4f3f] mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#fdf6ee] border border-[#e8dfd2] rounded-md px-3 py-2 text-sm text-[#2a1a10] placeholder-[#a68b7a] focus:outline-none focus:ring-1 focus:ring-[#e66b67] focus:border-[#e66b67] transition-colors"
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
              className="px-4 py-2 bg-[#e66b67] text-white text-sm rounded-md hover:bg-[#c95551] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
