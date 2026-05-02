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
    <nav className="bg-[#ffffff] border-b border-[#e8dfd2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center gap-6">
            <a href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-[#2a1a10] hover:text-[#e66b67] transition-colors">
              <Image src="/backtalk-icon.svg" alt="Backtalk" width={28} height={28} />
              Backtalk
            </a>
            {orgs.length > 1 && (
              <select
                value={currentOrgId || ''}
                onChange={(e) => switchOrg(e.target.value)}
                className="text-sm border border-[#d6c8b6] rounded-md px-2 py-1.5 bg-[#fdf6ee] text-[#6b4f3f] focus:outline-none focus:ring-1 focus:ring-[#e66b67] focus:border-[#e66b67]"
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
              className={`${pathname === '/dashboard' ? 'text-[#e66b67] font-semibold' : 'text-[#6b4f3f]'} hover:text-[#e66b67] transition-colors`}
            >
              Dashboard
            </a>
            <a
              href="/settings/team"
              className={`${pathname === '/settings/team' ? 'text-[#e66b67] font-semibold' : 'text-[#6b4f3f]'} hover:text-[#e66b67] transition-colors`}
            >
              Team
            </a>
            <a
              href="/settings/account"
              className={`${pathname === '/settings/account' ? 'text-[#e66b67] font-semibold' : 'text-[#6b4f3f]'} hover:text-[#e66b67] transition-colors`}
            >
              Account
            </a>
            <button
              onClick={handleLogout}
              className="text-[#a68b7a] hover:text-[#6b4f3f] transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
