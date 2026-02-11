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
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Team Settings</h2>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-700">Loading...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && !error && org && (
          <>
            {/* Organization Name */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">Organization</h3>
              {editingName ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setOrgName(org.name)
                      setEditingName(false)
                    }}
                    className="px-3 py-2 text-gray-600 text-sm hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-gray-900">{org.name}</span>
                  {isOwner && (
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Rename
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Members */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Members ({members.length})
              </h3>
              <div className="divide-y divide-gray-100">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <span className="text-sm text-gray-900">
                        {member.email}
                      </span>
                      <span className="ml-2 text-xs text-gray-500 capitalize">
                        {member.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">
                        {formatDate(member.created_at)}
                      </span>
                      {isOwner && members.length > 1 && (
                        <button
                          onClick={() =>
                            handleRemoveMember(member.user_id, member.email)
                          }
                          disabled={removingId === member.user_id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
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
              <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Pending Invites ({invites.length})
                </h3>
                <div className="divide-y divide-gray-100">
                  {invites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <span className="text-sm text-gray-900">
                          {invite.email}
                        </span>
                        <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-500">
                          {formatDate(invite.created_at)}
                        </span>
                        {isOwner && (
                          <button
                            onClick={() => handleRevokeInvite(invite.id)}
                            disabled={revokingId === invite.id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
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
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Invite Member</h3>
                <form onSubmit={handleInvite} className="flex items-center gap-3">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={inviting}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {inviting ? 'Inviting...' : 'Invite'}
                  </button>
                </form>
                {inviteMessage && (
                  <p className="mt-3 text-sm text-gray-700">{inviteMessage}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
