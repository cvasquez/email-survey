'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
    <nav className="bg-[#141414] border-b border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center gap-6">
            <a href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-[#EDEDED] hover:text-white transition-colors">
              <Image src="/backtalk-icon.svg" alt="Backtalk" width={28} height={28} />
              Backtalk
            </a>
            {orgs.length > 1 && (
              <select
                value={currentOrgId || ''}
                onChange={(e) => switchOrg(e.target.value)}
                className="text-sm border border-[#333333] rounded-md px-2 py-1.5 bg-[#1A1A1A] text-[#A1A1A1] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
              >
                {orgs.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a
              href="/dashboard"
              className={`${pathname === '/dashboard' ? 'text-white' : 'text-[#A1A1A1]'} hover:text-white transition-colors`}
            >
              Dashboard
            </a>
            <a
              href="/settings/team"
              className={`${pathname === '/settings/team' ? 'text-white' : 'text-[#A1A1A1]'} hover:text-white transition-colors`}
            >
              Team
            </a>
            <a
              href="/settings/account"
              className={`${pathname === '/settings/account' ? 'text-white' : 'text-[#A1A1A1]'} hover:text-white transition-colors`}
            >
              Account
            </a>
            <button
              onClick={handleLogout}
              className="text-[#666666] hover:text-[#A1A1A1] transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
