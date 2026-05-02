'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type OrgInfo = { id: string; name: string; role: string }

export function AppShell({ children, active }: { children: React.ReactNode; active?: 'surveys' | 'team' | 'account' }) {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const [orgs, setOrgs] = useState<OrgInfo[]>([])
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null)
  const [user, setUser] = useState<{ email: string | null; name: string | null } | null>(null)

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

    supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      if (u) {
        const meta = (u.user_metadata || {}) as { full_name?: string; name?: string }
        setUser({ email: u.email || null, name: meta.full_name || meta.name || null })
      }
    })
  }, [supabase])

  const switchOrg = async (orgId: string) => {
    await fetch(`/api/organizations/${orgId}`, { method: 'PUT' })
    setCurrentOrgId(orgId)
    router.refresh()
    if (pathname !== '/dashboard') router.push('/dashboard')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = (user?.name || user?.email || 'U').slice(0, 1).toUpperCase()
  const activeKey = active || (pathname?.startsWith('/settings/team') ? 'team' : pathname?.startsWith('/settings/account') ? 'account' : 'surveys')

  return (
    <div className="wmd-shell">
      <style>{warmAppCSS}</style>
      <aside className="wmd-side">
        <div className="wmd-side-top">
          <a href="/dashboard" className="wmd-logo">
            <span className="wmd-logomark" aria-hidden="true">
              <Image src="/backtalk-icon.svg" alt="" width={22} height={22} />
            </span>
            <span>Backtalk</span>
          </a>

          {orgs.length > 1 && (
            <select
              value={currentOrgId || ''}
              onChange={(e) => switchOrg(e.target.value)}
              className="wmd-orgswitch"
            >
              {orgs.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          )}

          <nav className="wmd-nav">
            <a className={'wmd-navitem ' + (activeKey === 'surveys' ? 'on' : '')} href="/dashboard">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <path d="M7 9h10M7 13h7M7 17h4" />
              </svg>
              <span>Surveys</span>
            </a>
            <a className={'wmd-navitem ' + (activeKey === 'team' ? 'on' : '')} href="/settings/team">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="8" r="3" />
                <circle cx="17" cy="10" r="2.5" />
                <path d="M3 19c0-3 3-5 6-5s6 2 6 5" />
              </svg>
              <span>Team</span>
            </a>
            <a className={'wmd-navitem ' + (activeKey === 'account' ? 'on' : '')} href="/settings/account">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
              </svg>
              <span>Account</span>
            </a>
          </nav>
        </div>

        <div className="wmd-side-foot">
          <div className="wmd-user">
            <span className="wmd-avatar">{initials}</span>
            <div className="wmd-user-info">
              <div className="wmd-user-name">{user?.name || (user?.email ? user.email.split('@')[0] : 'You')}</div>
              <div className="wmd-user-mail">{user?.email || ''}</div>
            </div>
            <button onClick={handleLogout} className="wmd-logout" aria-label="Sign out" title="Sign out">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <main className="wmd-main">{children}</main>
    </div>
  )
}

const warmAppCSS = `
.wmd-shell {
  --bg: #fff5ec;
  --bg-2: #ffeadb;
  --paper: #ffffff;
  --ink: #2a1a10;
  --ink-2: #6b4f3f;
  --ink-3: #a68b7a;
  --accent: #e66b67;
  --accent-2: #ff9a87;
  --accent-soft: #fde0db;
  --line: rgba(42,26,16,0.10);
  --line-2: rgba(42,26,16,0.06);
  --shadow-soft: 0 18px 48px -16px rgba(230,107,103,0.18);
  --sans: "DM Sans", "Söhne", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  display: grid;
  grid-template-columns: 248px 1fr;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  min-height: 100vh;
}
.wmd-shell a { color: inherit; text-decoration: none; }
.wmd-shell button { font-family: inherit; cursor: pointer; border: 0; }

/* Sidebar */
.wmd-side {
  background: var(--ink);
  color: rgba(255,255,255,0.82);
  padding: 24px 18px;
  display: flex; flex-direction: column; gap: 24px;
  border-right: 1px solid rgba(255,255,255,0.05);
  position: sticky; top: 0; height: 100vh;
}
.wmd-side-top { display: flex; flex-direction: column; gap: 18px; }
.wmd-logo { display: flex; align-items: center; gap: 10px; padding: 4px 8px; color: #fff; font-weight: 700; font-size: 18px; letter-spacing: -0.02em; }
.wmd-logomark { width: 22px; height: 22px; display:inline-flex; align-items: center; }
.wmd-logomark img { width: 100%; height: 100%; }
.wmd-orgswitch {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  color: #fff;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
}
.wmd-orgswitch:focus { border-color: var(--accent); }
.wmd-nav { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; }
.wmd-navitem {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  color: rgba(255,255,255,0.65);
  font-size: 14px; font-weight: 500;
  transition: background .12s, color .12s;
}
.wmd-navitem:hover { background: rgba(255,255,255,0.05); color: #fff; }
.wmd-navitem.on { background: rgba(230,107,103,0.18); color: #fff; }
.wmd-navitem.on svg { color: var(--accent); }

.wmd-side-foot { margin-top: auto; }
.wmd-user {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 4px 4px;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.wmd-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; flex-shrink: 0; font-size: 13px;
}
.wmd-user-info { flex: 1; min-width: 0; }
.wmd-user-name { font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wmd-user-mail { font-size: 11px; color: rgba(255,255,255,0.5); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wmd-logout {
  width: 28px; height: 28px; border-radius: 8px;
  color: rgba(255,255,255,0.5);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background .12s, color .12s;
}
.wmd-logout:hover { background: rgba(255,255,255,0.05); color: #fff; }

/* Main */
.wmd-main { padding: 32px 40px 64px; min-width: 0; display: flex; flex-direction: column; gap: 24px; }

.wmd-pagehead {
  display: flex; justify-content: space-between; align-items: flex-end;
  gap: 24px;
}
.wmd-crumbs { font-size: 12px; color: var(--ink-3); font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; display: flex; gap: 6px; align-items: center; }
.wmd-crumbs a { color: var(--ink-3); }
.wmd-crumbs a:hover { color: var(--accent); }
.wmd-crumb-sep { opacity: 0.5; }
.wmd-rh-head { display: flex; align-items: center; gap: 14px; margin-top: 4px; flex-wrap: wrap; }
.wmd-pageh { font-size: 36px; font-weight: 700; letter-spacing: -0.025em; line-height: 1.05; margin-top: 8px; }
.wmd-rh-head .wmd-pageh { margin-top: 0; }
.wmd-pagedeck { font-size: 14px; color: var(--ink-2); margin-top: 8px; }
.wmd-livetag {
  background: rgba(230,107,103,0.12); color: var(--accent);
  padding: 5px 11px; border-radius: 999px;
  font-size: 12px; font-weight: 700;
  display: inline-flex; align-items: center; gap: 7px;
  letter-spacing: 0.02em;
}
.wmd-pausedtag {
  background: rgba(166,139,122,0.18); color: var(--ink-2);
  padding: 5px 11px; border-radius: 999px;
  font-size: 12px; font-weight: 700;
  display: inline-flex; align-items: center; gap: 7px;
}
.wmd-livedot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: wmdpulse 1.6s infinite; }
@keyframes wmdpulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
.wmd-pageactions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

.wmd-btn-primary {
  background: var(--accent); color: #fff;
  padding: 11px 18px; border-radius: 12px;
  font-size: 14px; font-weight: 700; letter-spacing: -0.005em;
  box-shadow: 0 8px 16px -8px rgba(230,107,103,0.55);
  transition: background .12s, transform .12s;
}
.wmd-btn-primary:hover { background: #c95551; transform: translateY(-1px); }
.wmd-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.wmd-btn-sm { padding: 9px 14px; font-size: 13px; }
.wmd-btn-ghost {
  background: var(--paper); color: var(--ink);
  border: 1px solid var(--line);
  padding: 11px 16px; border-radius: 12px;
  font-size: 13px; font-weight: 600;
  transition: background .12s, color .12s;
}
.wmd-btn-ghost:hover { background: var(--bg-2); }
.wmd-btn-ghost:disabled { opacity: 0.5; cursor: not-allowed; }
.wmd-btn-warn { color: #b8401e; }
.wmd-btn-warn:hover { background: rgba(184,64,30,0.08); }

/* Stat row */
.wmd-stat-row {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
}
.wmd-stat-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px 20px;
  display: flex; flex-direction: column; gap: 4px;
}
.wmd-stat-card-accent { background: var(--accent); color: #fff; border-color: var(--accent); }
.wmd-stat-card-accent .wmd-stat-lbl, .wmd-stat-card-accent .wmd-stat-trend { color: rgba(255,255,255,0.85); }
.wmd-stat-lbl { font-size: 12px; color: var(--ink-3); font-weight: 600; letter-spacing: 0.02em; text-transform: uppercase; }
.wmd-stat-num { font-size: 32px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; }
.wmd-stat-pct { font-weight: 500; color: var(--ink-2); font-size: 18px; }
.wmd-stat-card-accent .wmd-stat-pct { color: rgba(255,255,255,0.85); }
.wmd-stat-trend { font-size: 12px; color: var(--ink-2); font-weight: 500; }
.wmd-trend-up { color: #2f7a3d; }
.wmd-stat-card-accent .wmd-trend-up { color: #fff; }
.wmd-trend-flat { color: var(--ink-3); }

/* Card base */
.wmd-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 18px;
  overflow: hidden;
}
.wmd-card-head {
  padding: 18px 22px;
  display: flex; justify-content: space-between; align-items: baseline;
  border-bottom: 1px solid var(--line-2);
  gap: 12px;
}
.wmd-card-h { font-size: 16px; font-weight: 700; letter-spacing: -0.01em; }
.wmd-card-meta { font-size: 12px; color: var(--ink-3); }
.wmd-card-link { font-size: 12px; color: var(--accent); font-weight: 600; }
.wmd-card-link:hover { text-decoration: underline; text-underline-offset: 2px; }
.wmd-card-body { padding: 18px 22px; }

/* Survey list */
.wmd-listcard { background: var(--paper); border: 1px solid var(--line); border-radius: 18px; overflow: hidden; }
.wmd-list-toolbar {
  display: flex; gap: 14px; align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid var(--line-2);
  flex-wrap: wrap;
}
.wmd-search {
  display: flex; align-items: center; gap: 8px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 8px 12px;
  flex: 1; max-width: 320px; min-width: 200px;
  color: var(--ink-3);
}
.wmd-search input { background: transparent; border: 0; outline: 0; font: inherit; color: var(--ink); width: 100%; }
.wmd-search input::placeholder { color: var(--ink-3); }
.wmd-search-sm { padding: 6px 10px; max-width: 240px; }

.wmd-filters { display: flex; gap: 6px; flex-wrap: wrap; }
.wmd-pill {
  padding: 7px 13px; border-radius: 99px;
  background: var(--bg-2); color: var(--ink-2);
  font-size: 12px; font-weight: 600;
  display: inline-flex; gap: 6px; align-items: center;
}
.wmd-pill span { color: var(--ink-3); font-weight: 500; }
.wmd-pill.on { background: var(--ink); color: #fff; }
.wmd-pill.on span { color: rgba(255,255,255,0.6); }
.wmd-sort { margin-left: auto; display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--ink-3); }

.wmd-list { display: block; }
.wmd-list-head, .wmd-list-row {
  display: grid;
  grid-template-columns: 2.6fr 0.9fr 0.9fr 1.4fr 1fr 1.1fr;
  align-items: center;
  gap: 14px;
  padding: 12px 22px;
}
.wmd-list-head {
  font-size: 11px; color: var(--ink-3); font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.06em;
  border-bottom: 1px solid var(--line-2);
}
.wmd-list-row {
  border-bottom: 1px solid var(--line-2);
  transition: background .1s;
}
.wmd-list-row:hover { background: var(--bg-2); }
.wmd-list-row:last-child { border-bottom: 0; }
.wmd-c-num { text-align: right; font-variant-numeric: tabular-nums; }
.wmd-c-right { text-align: right; display: flex; justify-content: flex-end; align-items: center; gap: 8px; }

.wmd-row-name { display: flex; align-items: center; gap: 12px; min-width: 0; }
.wmd-row-name a { display: block; min-width: 0; }
.wmd-status {
  width: 10px; height: 10px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.wmd-status-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.wmd-status-live { color: #2fa758; }
.wmd-status-paused { color: #c69f86; }
.wmd-status-draft { color: var(--ink-3); }
.wmd-row-title { font-size: 14px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wmd-row-sub { font-size: 12px; color: var(--ink-3); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wmd-row-big { font-size: 18px; font-weight: 700; letter-spacing: -0.015em; }
.wmd-row-mid { font-size: 14px; color: var(--ink-2); }
.wmd-row-top { font-size: 13px; color: var(--ink-2); }
.wmd-row-time { font-size: 12px; color: var(--ink-3); }
.wmd-row-menu {
  width: 28px; height: 28px; border-radius: 8px;
  color: var(--ink-3);
  display: inline-flex; align-items: center; justify-content: center;
  transition: background .1s;
}
.wmd-row-menu:hover { background: var(--bg-2); color: var(--ink); }
.wmd-row-menu.danger:hover { color: var(--accent); }
.wmd-spark { display: inline-block; vertical-align: middle; }

.wmd-list-foot {
  padding: 14px 22px;
  font-size: 12px; color: var(--ink-3);
  border-top: 1px solid var(--line-2);
  text-align: center;
}
.wmd-list-foot a { color: var(--accent); font-weight: 600; }
.wmd-list-empty {
  padding: 60px 22px;
  text-align: center;
  color: var(--ink-2);
}

/* Survey links */
.wmd-links { padding: 18px 22px; display: flex; flex-direction: column; gap: 8px; }
.wmd-link {
  display: flex; align-items: center; gap: 12px;
  background: var(--bg-2);
  border-radius: 10px;
  padding: 10px 14px;
}
.wmd-link-pill {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
  text-transform: uppercase;
  flex-shrink: 0;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wmd-link-url { flex: 1; min-width: 0; font-family: ui-monospace, Menlo, monospace; font-size: 13px; color: var(--ink); background: transparent; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wmd-link-copy {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: 6px 12px; border-radius: 8px;
  font-size: 12px; font-weight: 600;
  flex-shrink: 0;
}
.wmd-link-copy:hover { background: #fff; }

/* Two-col grid */
.wmd-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

/* Big trend chart */
.wmd-trendcard .wmd-card-head { align-items: center; }
.wmd-trend-tabs { display: inline-flex; gap: 2px; background: var(--bg-2); padding: 3px; border-radius: 10px; }
.wmd-trend-tab {
  padding: 6px 12px; border-radius: 7px;
  font-size: 12px; font-weight: 600;
  color: var(--ink-2);
}
.wmd-trend-tab.on { background: var(--paper); color: var(--ink); box-shadow: 0 1px 2px rgba(42,26,16,0.06); }
.wmd-trendwrap { padding: 16px 22px 18px; }
.wmd-trendsvg { width: 100%; height: 240px; display: block; }
.wmd-trendlegend {
  display: flex; gap: 18px; flex-wrap: wrap;
  margin-top: 8px; padding: 4px 4px 0;
  font-size: 12px; color: var(--ink-3);
}

/* Horizontal answer-distribution bars */
.wmd-hbars { padding: 22px 28px 18px; display: flex; flex-direction: column; gap: 18px; }
.wmd-hbar { display: flex; flex-direction: column; gap: 6px; }
.wmd-hbar-head { display: flex; justify-content: space-between; align-items: baseline; }
.wmd-hbar-label { font-size: 14px; font-weight: 600; color: var(--ink); }
.wmd-hbar-vals { display: inline-flex; gap: 8px; align-items: baseline; }
.wmd-hbar-count { font-size: 18px; font-weight: 700; letter-spacing: -0.01em; color: var(--ink); font-variant-numeric: tabular-nums; }
.wmd-hbar-pct { font-size: 12px; color: var(--ink-3); font-weight: 500; min-width: 36px; text-align: right; }
.wmd-hbar-shaft {
  position: relative;
  height: 18px;
  background: var(--bg-2);
  border-radius: 99px;
  overflow: hidden;
}
.wmd-hbar-fill {
  position: absolute; left: 0; top: 0; bottom: 0;
  border-radius: 99px;
  transition: width .6s ease;
}
.wmd-hbar-fill-comment {
  position: absolute; left: 0; top: 0; bottom: 0;
  border-radius: 99px;
  background: repeating-linear-gradient(
    -45deg,
    rgba(255,255,255,0.55) 0 4px,
    transparent 4px 8px
  );
  pointer-events: none;
  transition: width .6s ease;
}
.wmd-hbar-legend {
  display: flex; gap: 18px; flex-wrap: wrap;
  margin-top: 4px; padding-top: 4px;
  font-size: 11px; color: var(--ink-3);
}
.wmd-leg { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; vertical-align: middle; }
.wmd-leg-w { background: var(--accent); }
.wmd-leg-wo { background: rgba(42,26,16,0.2); }

/* Map */
.wmd-map { padding: 18px 22px; }
.wmd-map-foot { margin-top: 10px; font-size: 12px; color: var(--ink-3); }

/* Rank lists */
.wmd-rank { padding: 12px 0; max-height: 320px; overflow: auto; list-style: none; margin: 0; }
.wmd-rank li {
  display: grid; grid-template-columns: 1fr 110px 36px;
  gap: 12px; align-items: center;
  padding: 8px 22px;
  font-size: 13px;
}
.wmd-rank-name { color: var(--ink); }
.wmd-rank-bar { background: var(--bg-2); height: 6px; border-radius: 99px; overflow: hidden; }
.wmd-rank-bar span { display: block; height: 100%; background: var(--accent); border-radius: 99px; }
.wmd-rank-val { text-align: right; font-variant-numeric: tabular-nums; color: var(--ink-2); font-weight: 600; }

/* Responses table */
.wmd-resp-toolbar {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--line-2);
  flex-wrap: wrap;
}
.wmd-resp-toggle { display: flex; align-items: center; gap: 7px; font-size: 13px; color: var(--ink-2); cursor: pointer; }
.wmd-resp-toggle input { accent-color: var(--accent); }
.wmd-resp-pill { background: var(--bg-2); padding: 1px 8px; border-radius: 99px; font-size: 11px; color: var(--ink-3); font-weight: 600; }
.wmd-resp-spacer { flex: 1; }

.wmd-table { font-size: 13px; }
.wmd-table-head, .wmd-table-row {
  display: grid;
  grid-template-columns: 110px 110px minmax(0, 2.4fr) 1.1fr 1.5fr 70px 40px;
  gap: 14px;
  padding: 12px 22px;
  align-items: start;
}
.wmd-table-head {
  font-size: 11px; color: var(--ink-3); font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.06em;
  border-bottom: 1px solid var(--line-2);
}
.wmd-table-row { border-bottom: 1px solid var(--line-2); transition: background .1s; }
.wmd-table-row:hover { background: var(--bg-2); }
.wmd-table-row:last-child { border-bottom: 0; }
.wmd-td-date { font-size: 12px; color: var(--ink-3); font-variant-numeric: tabular-nums; }
.wmd-ans { padding: 3px 9px; border-radius: 99px; font-size: 11px; font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase; display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wmd-td-resp { font-size: 13px; line-height: 1.5; color: var(--ink); text-wrap: pretty; word-break: break-word; }
.wmd-td-resp .wmd-resp-empty { color: var(--ink-3); }
.wmd-td-name { font-size: 13px; color: var(--ink-2); word-break: break-word; }
.wmd-td-loc { font-size: 12px; color: var(--ink-3); word-break: break-word; }
.wmd-td-dev { font-size: 12px; color: var(--ink-3); font-family: ui-monospace, Menlo, monospace; }
.wmd-trash {
  width: 26px; height: 26px; border-radius: 6px;
  color: var(--ink-3);
  display: inline-flex; align-items: center; justify-content: center;
  transition: background .1s, color .1s;
}
.wmd-trash:hover { background: rgba(230,107,103,0.1); color: var(--accent); }
.wmd-resp-copy {
  font-size: 11px; color: var(--ink-3); margin-left: 6px;
  background: transparent; padding: 2px 6px; border-radius: 6px;
}
.wmd-resp-copy:hover { background: var(--bg-2); color: var(--ink-2); }

.wmd-table-foot { padding: 14px 22px; font-size: 12px; color: var(--ink-3); border-top: 1px solid var(--line-2); text-align: center; }
.wmd-table-foot a { color: var(--accent); font-weight: 600; }

/* Form bits used by settings + new survey */
.wmd-form { display: flex; flex-direction: column; gap: 18px; padding: 22px; }
.wmd-form-row { display: flex; flex-direction: column; gap: 6px; }
.wmd-form-label { font-size: 13px; font-weight: 600; color: var(--ink); }
.wmd-form-hint { font-size: 12px; color: var(--ink-3); }
.wmd-form-input, .wmd-form-textarea {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-family: inherit;
  color: var(--ink);
  transition: border-color .12s, box-shadow .12s;
  width: 100%;
}
.wmd-form-input::placeholder, .wmd-form-textarea::placeholder { color: var(--ink-3); }
.wmd-form-input:focus, .wmd-form-textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 4px rgba(230,107,103,0.12); }
.wmd-form-textarea { resize: vertical; min-height: 100px; }
.wmd-form-error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.18); color: #b8401e; font-size: 13px; padding: 10px 14px; border-radius: 10px; }

/* Responsive */
@media (max-width: 960px) {
  .wmd-shell { grid-template-columns: 1fr; }
  .wmd-side {
    position: static; height: auto;
    flex-direction: row; align-items: center;
    padding: 14px 18px; gap: 14px;
  }
  .wmd-side-top { flex-direction: row; flex: 1; align-items: center; gap: 14px; }
  .wmd-nav { flex-direction: row; gap: 4px; margin-top: 0; }
  .wmd-navitem span:not(.wmd-count) { display: none; }
  .wmd-orgswitch { display: none; }
  .wmd-side-foot { margin-top: 0; }
  .wmd-user { padding: 0; border-top: 0; }
  .wmd-user-info { display: none; }
  .wmd-main { padding: 20px; gap: 18px; }
  .wmd-pagehead { flex-direction: column; align-items: stretch; }
  .wmd-stat-row { grid-template-columns: repeat(2, 1fr); }
  .wmd-grid-2 { grid-template-columns: 1fr; }
  .wmd-list-head, .wmd-list-row {
    grid-template-columns: 1fr auto;
    gap: 8px;
  }
  .wmd-list-head > *:not(:first-child) { display: none; }
  .wmd-list-row > .wmd-c-num:not(.wmd-row-big), .wmd-list-row > .wmd-row-top { display: none; }
  .wmd-table-head, .wmd-table-row {
    grid-template-columns: 1fr auto;
  }
  .wmd-table-head > *:not(:first-child):not(:last-child) { display: none; }
  .wmd-table-row > *:not(.wmd-td-resp):not(:last-child) {
    font-size: 11px; color: var(--ink-3);
  }
}
`
