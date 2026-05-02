'use client'

import { useEffect, useState } from 'react'
import { AppShell } from '@/app/components/app-shell'
import { formatDate } from '@/lib/utils'

type Member = { id: string; user_id: string; email: string; role: string; created_at: string }
type Invite = { id: string; email: string; role: string; created_at: string }
type OrgInfo = { id: string; name: string; role: string }

export default function TeamSettingsPage() {
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
      const orgsRes = await fetch('/api/organizations')
      const orgsData = await orgsRes.json()
      if (!orgsRes.ok) throw new Error(orgsData.error)

      const currentOrg = orgsData.organizations?.find((o: OrgInfo) => o.id === orgsData.currentOrgId)
      if (currentOrg) {
        setOrg(currentOrg)
        setOrgName(currentOrg.name)
      }

      if (orgsData.currentOrgId) {
        const membersRes = await fetch(`/api/organizations/${orgsData.currentOrgId}/members`)
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
        setInviteMessage(`Invite sent to ${data.email}. They'll get access when they sign up.`)
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
      const res = await fetch(`/api/organizations/${org.id}/members?userId=${userId}`, { method: 'DELETE' })
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
      const res = await fetch(`/api/organizations/${org.id}/invites?id=${inviteId}`, { method: 'DELETE' })
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
    <AppShell active="team">
      <header className="wmd-pagehead">
        <div>
          <div className="wmd-crumbs">Team</div>
          <h1 className="wmd-pageh">Your team.</h1>
          <p className="wmd-pagedeck">Bring people in. Surveys and responses are shared across the org.</p>
        </div>
      </header>

      {loading && <div className="wmd-list-empty wmd-card">Loading…</div>}
      {error && <div className="wmd-form-error">{error}</div>}

      {!loading && !error && org && (
        <>
          <section className="wmd-card" style={{ maxWidth: 720 }}>
            <div className="wmd-card-head">
              <h2 className="wmd-card-h">Organization</h2>
            </div>
            <div className="wmd-card-body">
              {editingName ? (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    className="wmd-form-input"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameOrg()
                      if (e.key === 'Escape') { setOrgName(org.name); setEditingName(false) }
                    }}
                  />
                  <button onClick={handleRenameOrg} className="wmd-btn-primary wmd-btn-sm">Save</button>
                  <button onClick={() => { setOrgName(org.name); setEditingName(false) }} className="wmd-btn-ghost wmd-btn-sm">Cancel</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{org.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                    {org.role}
                  </span>
                  {isOwner && (
                    <button onClick={() => setEditingName(true)} className="wmd-btn-ghost wmd-btn-sm" style={{ marginLeft: 'auto' }}>
                      Rename
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="wmd-card" style={{ maxWidth: 720 }}>
            <div className="wmd-card-head">
              <h2 className="wmd-card-h">Members</h2>
              <span className="wmd-card-meta">{members.length} member{members.length === 1 ? '' : 's'}</span>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {members.map((member) => (
                <li
                  key={member.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 22px', borderBottom: '1px solid var(--line-2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', color: '#fff',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14,
                    }}>
                      {member.email.slice(0, 1).toUpperCase()}
                    </span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{member.email}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)', textTransform: 'capitalize', marginTop: 2 }}>
                        {member.role} · joined {formatDate(member.created_at)}
                      </div>
                    </div>
                  </div>
                  {isOwner && members.length > 1 && (
                    <button
                      onClick={() => handleRemoveMember(member.user_id, member.email)}
                      disabled={removingId === member.user_id}
                      className="wmd-btn-ghost wmd-btn-sm wmd-btn-warn"
                    >
                      {removingId === member.user_id ? 'Removing…' : 'Remove'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {invites.length > 0 && (
            <section className="wmd-card" style={{ maxWidth: 720 }}>
              <div className="wmd-card-head">
                <h2 className="wmd-card-h">Pending invites</h2>
                <span className="wmd-card-meta">{invites.length} pending</span>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {invites.map((invite) => (
                  <li
                    key={invite.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 22px', borderBottom: '1px solid var(--line-2)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{invite.email}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
                        Sent {formatDate(invite.created_at)}
                      </div>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => handleRevokeInvite(invite.id)}
                        disabled={revokingId === invite.id}
                        className="wmd-btn-ghost wmd-btn-sm wmd-btn-warn"
                      >
                        {revokingId === invite.id ? 'Revoking…' : 'Revoke'}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {isOwner && (
            <section className="wmd-card" style={{ maxWidth: 720 }}>
              <div className="wmd-card-head">
                <h2 className="wmd-card-h">Invite a teammate</h2>
                <span className="wmd-card-meta">They&apos;ll get access on their next sign-in.</span>
              </div>
              <form onSubmit={handleInvite} className="wmd-form" style={{ paddingBottom: 16 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <div className="wmd-form-row" style={{ flex: 1 }}>
                    <label className="wmd-form-label" htmlFor="invite-email">Email</label>
                    <input
                      id="invite-email"
                      type="email"
                      className="wmd-form-input"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <button type="submit" disabled={inviting} className="wmd-btn-primary">
                    {inviting ? 'Sending…' : 'Send invite'}
                  </button>
                </div>
                {inviteMessage && (
                  <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>{inviteMessage}</p>
                )}
              </form>
            </section>
          )}
        </>
      )}
    </AppShell>
  )
}
