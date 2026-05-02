'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/app/components/nav'
import { formatDate } from '@/lib/utils'

type Member = {
  id: string
  user_id: string
  email: string
  role: string
  created_at: string
}

type Invite = {
  id: string
  email: string
  role: string
  created_at: string
}

type OrgInfo = {
  id: string
  name: string
  role: string
}

export default function TeamSettingsPage() {
  const router = useRouter()
  const [org, setOrg] = useState<OrgInfo | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteMessage, setInviteMessage] = useState<string | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  const isOwner = org?.role === 'owner'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch org info
      const orgsRes = await fetch('/api/organizations')
      const orgsData = await orgsRes.json()

      if (!orgsRes.ok) throw new Error(orgsData.error)

      const currentOrg = orgsData.organizations?.find(
        (o: OrgInfo) => o.id === orgsData.currentOrgId
      )
      if (currentOrg) {
        setOrg(currentOrg)
        setOrgName(currentOrg.name)
      }

      // Fetch members
      if (orgsData.currentOrgId) {
        const membersRes = await fetch(
          `/api/organizations/${orgsData.currentOrgId}/members`
        )
        const membersData = await membersRes.json()

        if (membersRes.ok) {
          setMembers(membersData.members || [])
          setInvites(membersData.invites || [])
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!org || !inviteEmail.trim()) return

    setInviting(true)
    setInviteMessage(null)

    try {
      const res = await fetch(`/api/organizations/${org.id}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      if (data.status === 'added') {
        setInviteMessage(`${data.email} has been added to the team.`)
      } else {
        setInviteMessage(
          `Invite sent to ${data.email}. They'll get access when they sign up.`
        )
      }
      setInviteEmail('')
      fetchData()
    } catch (err: any) {
      setInviteMessage(err.message)
    } finally {
      setInviting(false)
    }
  }

  const handleRemoveMember = async (userId: string, email: string) => {
    if (!org) return
    if (!confirm(`Remove ${email} from the team?`)) return

    setRemovingId(userId)
    try {
      const res = await fetch(
        `/api/organizations/${org.id}/members?userId=${userId}`,
        { method: 'DELETE' }
      )
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      fetchData()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setRemovingId(null)
    }
  }

  const handleRevokeInvite = async (inviteId: string) => {
    if (!org) return

    setRevokingId(inviteId)
    try {
      const res = await fetch(
        `/api/organizations/${org.id}/invites?id=${inviteId}`,
        { method: 'DELETE' }
      )
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      fetchData()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setRevokingId(null)
    }
  }

  const handleRenameOrg = async () => {
    if (!org || !orgName.trim()) return

    try {
      const res = await fetch(`/api/organizations/${org.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName.trim() }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setOrg({ ...org, name: orgName.trim() })
      setEditingName(false)
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#fff5ec]">
      <Nav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-[#2a1a10]">Team Settings</h2>

        {loading && (
          <div className="text-center py-12">
            <p className="text-[#6b4f3f]">Loading...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && org && (
          <>
            {/* Organization Name */}
            <div className="bg-[#ffffff] border border-[#e8dfd2] rounded-lg p-6 mb-6">
              <h3 className="text-base font-semibold mb-3 text-[#2a1a10]">Organization</h3>
              {editingName ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="flex-1 bg-[#fdf6ee] border border-[#e8dfd2] rounded-md px-3 py-2 text-sm text-[#2a1a10] placeholder-[#a68b7a] focus:outline-none focus:ring-1 focus:ring-[#e66b67] focus:border-[#e66b67] transition-colors"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameOrg()
                      if (e.key === 'Escape') {
                        setOrgName(org.name)
                        setEditingName(false)
                      }
                    }}
                  />
                  <button
                    onClick={handleRenameOrg}
                    className="px-3 py-2 bg-[#e66b67] text-white text-sm rounded-md hover:bg-[#c95551] transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setOrgName(org.name)
                      setEditingName(false)
                    }}
                    className="px-3 py-2 text-[#6b4f3f] text-sm hover:text-[#2a1a10] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-[#2a1a10]">{org.name}</span>
                  {isOwner && (
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-sm text-[#e66b67] hover:text-[#c95551] transition-colors"
                    >
                      Rename
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Members */}
            <div className="bg-[#ffffff] border border-[#e8dfd2] rounded-lg p-6 mb-6">
              <h3 className="text-base font-semibold mb-3 text-[#2a1a10]">
                Members ({members.length})
              </h3>
              <div className="divide-y divide-[#e8dfd2]">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <span className="text-sm text-[#2a1a10]">
                        {member.email}
                      </span>
                      <span className="ml-2 text-xs text-[#a68b7a] capitalize">
                        {member.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-[#a68b7a]">
                        {formatDate(member.created_at)}
                      </span>
                      {isOwner && members.length > 1 && (
                        <button
                          onClick={() =>
                            handleRemoveMember(member.user_id, member.email)
                          }
                          disabled={removingId === member.user_id}
                          className="text-[#EF4444] hover:text-[#DC2626] disabled:opacity-50 transition-colors"
                        >
                          {removingId === member.user_id
                            ? 'Removing...'
                            : 'Remove'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Invites */}
            {invites.length > 0 && (
              <div className="bg-[#ffffff] border border-[#e8dfd2] rounded-lg p-6 mb-6">
                <h3 className="text-base font-semibold mb-3 text-[#2a1a10]">
                  Pending Invites ({invites.length})
                </h3>
                <div className="divide-y divide-[#e8dfd2]">
                  {invites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <span className="text-sm text-[#2a1a10]">
                          {invite.email}
                        </span>
                        <span className="ml-2 text-xs text-[#EAB308] bg-[#EAB308]/10 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-[#a68b7a]">
                          {formatDate(invite.created_at)}
                        </span>
                        {isOwner && (
                          <button
                            onClick={() => handleRevokeInvite(invite.id)}
                            disabled={revokingId === invite.id}
                            className="text-[#EF4444] hover:text-[#DC2626] disabled:opacity-50 transition-colors"
                          >
                            {revokingId === invite.id
                              ? 'Revoking...'
                              : 'Revoke'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invite Form */}
            {isOwner && (
              <div className="bg-[#ffffff] border border-[#e8dfd2] rounded-lg p-6 mb-6">
                <h3 className="text-base font-semibold mb-3 text-[#2a1a10]">Invite Member</h3>
                <form onSubmit={handleInvite} className="flex items-center gap-3">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="flex-1 bg-[#fdf6ee] border border-[#e8dfd2] rounded-md px-3 py-2 text-sm text-[#2a1a10] placeholder-[#a68b7a] focus:outline-none focus:ring-1 focus:ring-[#e66b67] focus:border-[#e66b67] transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    disabled={inviting}
                    className="px-4 py-2 bg-[#e66b67] text-white text-sm rounded-md hover:bg-[#c95551] disabled:opacity-50 transition-colors"
                  >
                    {inviting ? 'Inviting...' : 'Invite'}
                  </button>
                </form>
                {inviteMessage && (
                  <p className="mt-3 text-sm text-[#6b4f3f]">{inviteMessage}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
