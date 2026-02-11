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
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Update Password</h3>

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
