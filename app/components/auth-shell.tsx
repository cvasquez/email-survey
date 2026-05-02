'use client'

import Image from 'next/image'
import Link from 'next/link'

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="wma-shell">
      <style>{warmAuthCSS}</style>
      <aside className="wma-aside">
        <div className="wma-aside-inner">
          <Link className="wma-logo" href="/">
            <span className="wma-logomark" aria-hidden="true">
              <Image src="/backtalk-icon.svg" alt="" width={28} height={28} />
            </span>
            <span>Backtalk</span>
          </Link>

          <div className="wma-aside-mid">
            <div className="wma-bubble wma-bubble-q">
              <div className="wma-bubble-meta">Saturday Memo · Issue #47</div>
              <div className="wma-bubble-body">How did this issue land?</div>
              <div className="wma-bubble-options">
                <span className="wma-chip wma-chip-on">Loved it</span>
                <span className="wma-chip">It was fine</span>
                <span className="wma-chip">Not for me</span>
              </div>
            </div>
            <div className="wma-bubble wma-bubble-a">
              <div className="wma-bubble-body">
                Long-form was the right call. Keep going.
              </div>
              <div className="wma-bubble-foot">— Jules R., 2 minutes ago</div>
            </div>
            <div className="wma-bubble wma-bubble-stat">
              <div className="wma-bubble-stat-num">709</div>
              <div className="wma-bubble-stat-lbl">replies, and counting</div>
            </div>
          </div>

          <div className="wma-quote">
            <p>
              &ldquo;We replaced our quarterly NPS email with a Backtalk button.
              <br />
              Response rate went from 4% to 38%.&rdquo;
            </p>
            <div className="wma-quote-by">— Maya Chen · The Saturday Memo</div>
          </div>
        </div>
      </aside>

      <main className="wma-main">{children}</main>
    </div>
  )
}

const warmAuthCSS = `
.wma-shell {
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
  --sans: "DM Sans", "Söhne", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  display: grid;
  grid-template-columns: 0.95fr 1fr;
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
}
.wma-shell a { color: inherit; text-decoration: none; }
.wma-shell button { font-family: inherit; cursor: pointer; border: 0; }

.wma-aside {
  background: var(--ink);
  color: #fff;
  padding: 40px 56px;
  position: relative;
  overflow: hidden;
}
.wma-aside::before {
  content: "";
  position: absolute;
  inset: -30% -10% auto auto;
  width: 70%; height: 90%;
  background: radial-gradient(circle, var(--accent) 0%, transparent 65%);
  opacity: 0.55;
  pointer-events: none;
}
.wma-aside-inner { position: relative; height: 100%; display: flex; flex-direction: column; gap: 32px; }
.wma-logo { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 22px; letter-spacing: -0.02em; color: #fff; }
.wma-logomark { width: 28px; height: 28px; display:inline-flex; align-items: center; }
.wma-logomark img { width: 100%; height: 100%; }

.wma-aside-mid { position: relative; flex: 1; padding-top: 24px; min-height: 360px; }
.wma-bubble {
  position: absolute;
  background: #fff; color: var(--ink);
  border-radius: 22px;
  padding: 20px 22px;
  box-shadow: 0 24px 56px -20px rgba(0,0,0,0.4);
}
.wma-bubble-q { top: 0; left: 0; right: 56px; border-bottom-left-radius: 6px; }
.wma-bubble-meta { font-size: 11px; color: var(--ink-3); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.wma-bubble-body { font-size: 20px; font-weight: 700; letter-spacing: -0.01em; margin-top: 8px; line-height: 1.25; }
.wma-bubble-options { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.wma-chip { padding: 7px 13px; border-radius: 999px; background: #fdf2e9; color: var(--ink); font-size: 12px; font-weight: 600; }
.wma-chip-on { background: var(--accent); color: #fff; }
.wma-bubble-a {
  top: 200px; left: 64px; right: 0;
  background: #1a0e08;
  color: #fff;
  border-bottom-right-radius: 6px;
  border: 1px solid rgba(255,255,255,0.06);
}
.wma-bubble-a .wma-bubble-body { font-size: 16px; font-weight: 500; }
.wma-bubble-foot { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 10px; }
.wma-bubble-stat {
  bottom: 0; left: 0;
  background: var(--accent);
  color: #fff;
  padding: 14px 20px;
  border-radius: 18px;
}
.wma-bubble-stat-num { font-size: 32px; font-weight: 700; line-height: 1; letter-spacing: -0.03em; }
.wma-bubble-stat-lbl { font-size: 12px; font-weight: 500; opacity: 0.9; margin-top: 2px; }

.wma-quote {
  border-top: 1px solid rgba(255,255,255,0.12);
  padding-top: 24px;
}
.wma-quote p { font-size: 17px; line-height: 1.5; font-weight: 500; text-wrap: pretty; }
.wma-quote-by { margin-top: 10px; font-size: 13px; color: rgba(255,255,255,0.55); }

.wma-main {
  display: flex; align-items: center; justify-content: center;
  padding: 56px 48px;
  background: var(--bg);
}
.wma-form {
  width: 100%;
  max-width: 420px;
  display: flex; flex-direction: column;
  gap: 16px;
}
.wma-back { font-size: 13px; color: var(--ink-3); margin-bottom: 4px; align-self: flex-start; }
.wma-back:hover { color: var(--ink); }
.wma-h1 {
  font-size: 44px; font-weight: 700;
  letter-spacing: -0.03em; line-height: 1.05;
  margin-top: 4px;
  color: var(--ink);
}
.wma-deck { font-size: 16px; line-height: 1.5; color: var(--ink-2); margin-bottom: 8px; text-wrap: pretty; }

.wma-divider {
  display: flex; align-items: center; gap: 14px;
  color: var(--ink-3); font-size: 12px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.06em;
  margin: 4px 0;
}
.wma-divider::before, .wma-divider::after { content: ""; flex: 1; border-top: 1px solid var(--line); }

.wma-field { display: flex; flex-direction: column; gap: 6px; }
.wma-label { font-size: 13px; font-weight: 600; color: var(--ink); }
.wma-label-row { display: flex; justify-content: space-between; align-items: baseline; }
.wma-forgot { font-size: 12px; color: var(--accent); font-weight: 600; }
.wma-forgot:hover { text-decoration: underline; text-underline-offset: 2px; }
.wma-field input {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 13px 16px;
  font-size: 15px;
  font-family: inherit;
  color: var(--ink);
  transition: border-color .12s, box-shadow .12s;
}
.wma-field input::placeholder { color: var(--ink-3); }
.wma-field input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 4px rgba(230,107,103,0.12); }
.wma-hint { font-size: 12px; color: var(--ink-3); }

.wma-check {
  display: flex; gap: 10px; align-items: flex-start;
  font-size: 13px; color: var(--ink-2); cursor: pointer;
  margin-top: 4px;
  line-height: 1.4;
}
.wma-check input { accent-color: var(--accent); margin-top: 2px; }

.wma-btn-primary {
  background: var(--accent); color: #fff;
  padding: 16px 22px;
  border-radius: 14px;
  font-size: 16px; font-weight: 700;
  letter-spacing: -0.01em;
  margin-top: 8px;
  box-shadow: 0 12px 24px -12px rgba(230,107,103,0.6);
  transition: background .12s, transform .12s;
}
.wma-btn-primary:hover { background: #c95551; transform: translateY(-1px); }
.wma-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.wma-error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #b8401e; font-size: 13px; padding: 10px 14px; border-radius: 10px; }
.wma-success { background: rgba(47,122,61,0.08); border: 1px solid rgba(47,122,61,0.2); color: #1f5e2e; font-size: 13px; padding: 10px 14px; border-radius: 10px; }

.wma-fineprint { font-size: 12px; color: var(--ink-3); line-height: 1.5; }
.wma-fineprint a { color: var(--ink-2); text-decoration: underline; text-underline-offset: 2px; }
.wma-alt { font-size: 14px; color: var(--ink-2); text-align: center; margin-top: 8px; }
.wma-alt a { color: var(--accent); font-weight: 600; }
.wma-alt a:hover { text-decoration: underline; text-underline-offset: 2px; }

@media (max-width: 900px) {
  .wma-shell { grid-template-columns: 1fr; }
  .wma-aside { padding: 24px; }
  .wma-aside-mid { display: none; }
  .wma-quote { display: none; }
  .wma-main { padding: 28px 20px 48px; }
}
`
