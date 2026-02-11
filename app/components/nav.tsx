'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'

type OrgInfo = {
  id: string
  name: string
  role: string
}

export function Nav() {
  const [orgs, setOrgs] = useState<OrgInfo[]>([])
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/organizations')
      .then((r) => r.json())
      .then((data) => {
        if (data.organizations) {
          setOrgs(data.organizations)
          setCurrentOrgId(data.currentOrgId)
        }
      })
      .catch(() => {})
  }, [])

  const switchOrg = async (orgId: string) => {
    await fetch(`/api/organizations/${orgId}`, { method: 'PUT' })
    setCurrentOrgId(orgId)
    router.refresh()
    if (pathname !== '/dashboard') {
      router.push('/dashboard')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-xl font-semibold text-gray-900 hover:text-gray-700">
              Email Survey Tool
            </a>
            {orgs.length > 1 && (
              <select
                value={currentOrgId || ''}
                onChange={(e) => switchOrg(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {orgs.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <a
              href="/dashboard"
              className={`${pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-700'} hover:text-gray-900`}
            >
              Dashboard
            </a>
            <a
              href="/settings/team"
              className={`${pathname === '/settings/team' ? 'text-blue-600' : 'text-gray-700'} hover:text-gray-900`}
            >
              Team
            </a>
            <a
              href="/settings/account"
              className={`${pathname === '/settings/account' ? 'text-blue-600' : 'text-gray-700'} hover:text-gray-900`}
            >
              Account
            </a>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-gray-900"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
