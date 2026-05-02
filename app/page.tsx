import Image from "next/image";

export default function Home() {
  const choices = [
    { label: "Loved it", count: 412, pct: 58 },
    { label: "It was fine", count: 184, pct: 26 },
    { label: "Not for me", count: 113, pct: 16 },
  ];

  return (
    <div className="wm-root">
      <style>{warmCSS}</style>

      <header className="wm-nav">
        <div className="wm-logo">
          <span className="wm-logomark" aria-hidden="true">
            <Image src="/backtalk-icon.svg" alt="" width={28} height={28} />
          </span>
          <span className="wm-logotype">Backtalk</span>
        </div>
        <nav className="wm-navlinks">
          <a href="#how">How</a>
          <a href="#uses">Use cases</a>
          <a href="#features">Features</a>
        </nav>
        <div className="wm-navactions">
          <a className="wm-link" href="/login">Log in</a>
          <a className="wm-btn wm-btn-primary" href="/signup">Get started</a>
        </div>
      </header>

      {/* HERO */}
      <section className="wm-hero">
        <div className="wm-hero-text">
          <span className="wm-tag">
            <span className="wm-tag-dot" />
            Two clicks. Real answers.
          </span>
          <h1 className="wm-headline">
            Talk back to the people who keep
            <span className="wm-h-mark"> opening your emails.</span>
          </h1>
          <p className="wm-deck">
            Backtalk drops survey buttons straight into your newsletter.
            Readers tap an answer, leave a thought, and you finally find out
            what&apos;s going on inside their heads.
          </p>
          <div className="wm-cta-row">
            <a className="wm-btn wm-btn-primary wm-btn-lg" href="/signup">
              Get started — free
            </a>
            <a className="wm-btn wm-btn-ghost wm-btn-lg" href="#how">
              See how it works
            </a>
          </div>
          <div className="wm-trust">
            <span className="wm-trust-dot wm-trust-a" />
            <span className="wm-trust-dot wm-trust-b" />
            <span className="wm-trust-dot wm-trust-c" />
            <span className="wm-trust-text">
              Set up in under a minute. No credit card.
            </span>
          </div>
        </div>

        <div className="wm-hero-art">
          <div className="wm-bubble wm-bubble-sender">
            <div className="wm-bubble-meta">Saturday Memo · Issue #47</div>
            <div className="wm-bubble-body">How did this issue land?</div>
            <div className="wm-bubble-options">
              <span className="wm-chip wm-chip-on">Loved it</span>
              <span className="wm-chip">It was fine</span>
              <span className="wm-chip">Not for me</span>
            </div>
          </div>
          <div className="wm-bubble wm-bubble-reply">
            <div className="wm-bubble-body">
              The long-form essay was the right call — keep it up.
            </div>
            <div className="wm-bubble-foot">— Jules R.</div>
          </div>
          <div className="wm-bubble wm-bubble-stat">
            <div className="wm-bubble-stat-num">709</div>
            <div className="wm-bubble-stat-lbl">replies, and counting</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="wm-how" id="how">
        <div className="wm-section-head">
          <span className="wm-eyebrow">How it works</span>
          <h2 className="wm-h2">Three small things, one big payoff.</h2>
        </div>

        <ol className="wm-steps">
          <li className="wm-step">
            <div className="wm-step-num">1</div>
            <h3 className="wm-step-h">Name it.</h3>
            <p>
              Give your survey a title. We hand you back a stack of links — one
              per answer option you&apos;d like to offer.
            </p>
          </li>
          <li className="wm-step-arrow" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </li>
          <li className="wm-step">
            <div className="wm-step-num">2</div>
            <h3 className="wm-step-h">Paste them in.</h3>
            <p>
              Style the buttons to match your newsletter, or just stick them in
              as plain links. They go anywhere a URL goes.
            </p>
          </li>
          <li className="wm-step-arrow" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </li>
          <li className="wm-step">
            <div className="wm-step-num">3</div>
            <h3 className="wm-step-h">Hear back.</h3>
            <p>
              Readers click. A follow-up page invites a longer thought. You
              watch the responses pile up, sorted, deduped, bot-free.
            </p>
          </li>
        </ol>
      </section>

      {/* EMAIL MOCKUP */}
      <section className="wm-email-section">
        <div className="wm-section-head wm-section-head-c">
          <span className="wm-eyebrow">Inside the inbox</span>
          <h2 className="wm-h2">
            It looks like an email,
            <br /> because it <em>is</em> one.
          </h2>
          <p className="wm-section-deck">
            No iframe, no embed, no &ldquo;click here to take our survey.&rdquo;
            Just the buttons your readers were about to scroll past anyway.
          </p>
        </div>

        <div className="wm-email-wrap">
          <article className="wm-email">
            <header className="wm-email-head">
              <div className="wm-email-from">
                <span className="wm-avatar">M</span>
                <div>
                  <div className="wm-email-name">Maya · Saturday Memo</div>
                  <div className="wm-email-addr">to me · 8:42 AM</div>
                </div>
              </div>
              <div className="wm-email-tag">Newsletter</div>
            </header>
            <div className="wm-email-body">
              <p>Friends —</p>
              <p>
                We tried something different this week: one long essay instead
                of the usual round-up. Before I commit to the new format, I
                want to hear from you.
              </p>
              <p className="wm-email-ask">How did this one land for you?</p>
              <div className="wm-email-buttons">
                <a className="wm-emailbtn wm-emailbtn-yes" href="#">
                  <span className="wm-emoji" aria-hidden="true">●</span> Loved it
                </a>
                <a className="wm-emailbtn" href="#">
                  <span className="wm-emoji" aria-hidden="true">●</span> It was fine
                </a>
                <a className="wm-emailbtn" href="#">
                  <span className="wm-emoji" aria-hidden="true">●</span> Not for me
                </a>
              </div>
              <p>
                Thanks for clicking,
                <br />— M.
              </p>
            </div>
          </article>

          <div className="wm-email-callouts">
            <div className="wm-callout">
              <div className="wm-callout-num">01</div>
              <div>
                <h4>One-click answer</h4>
                <p>Each link is a vote. We log the choice the moment it&apos;s tapped.</p>
              </div>
            </div>
            <div className="wm-callout">
              <div className="wm-callout-num">02</div>
              <div>
                <h4>Optional follow-up</h4>
                <p>
                  The landing page invites a sentence — or a paragraph if
                  they&apos;re feeling chatty.
                </p>
              </div>
            </div>
            <div className="wm-callout">
              <div className="wm-callout-num">03</div>
              <div>
                <h4>Identity, on request</h4>
                <p>Require name or email when you need it. Stay anonymous when you don&apos;t.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="wm-dash-section">
        <div className="wm-section-head">
          <span className="wm-eyebrow">The dashboard</span>
          <h2 className="wm-h2">Watch opinions roll in, in real time.</h2>
        </div>

        <div className="wm-dash">
          <div className="wm-dash-head">
            <div>
              <div className="wm-dash-title">Saturday Memo · Issue #47</div>
              <div className="wm-dash-sub">
                <span className="wm-live">
                  <span className="wm-live-dot" /> Live
                </span>
                <span>709 responses</span>
                <span>38% of opens</span>
              </div>
            </div>
            <div className="wm-dash-actions">
              <span className="wm-tab">Comments</span>
              <span className="wm-tab">Map</span>
              <span className="wm-tab wm-tab-on">Overview</span>
            </div>
          </div>

          <div className="wm-dash-body">
            <div className="wm-dash-bars">
              {choices.map((c, i) => (
                <div key={c.label} className={"wm-bar wm-bar-" + i}>
                  <div className="wm-bar-row">
                    <span className="wm-bar-label">{c.label}</span>
                    <span className="wm-bar-val">
                      {c.count} · {c.pct}%
                    </span>
                  </div>
                  <div className="wm-bar-track">
                    <div className="wm-bar-fill" style={{ width: c.pct + "%" }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="wm-dash-comments">
              <div className="wm-c-head">Latest comments</div>
              <ul className="wm-c-list">
                <li className="wm-c">
                  <span className="wm-c-pill wm-c-pill-yes">Loved it</span>
                  <p>&ldquo;Long form was the right call. Don&apos;t blink.&rdquo;</p>
                  <span className="wm-c-by">Jules R. · 2m ago</span>
                </li>
                <li className="wm-c">
                  <span className="wm-c-pill">It was fine</span>
                  <p>&ldquo;I missed the round-up format. Maybe alternate?&rdquo;</p>
                  <span className="wm-c-by">Anonymous · 4m ago</span>
                </li>
                <li className="wm-c">
                  <span className="wm-c-pill wm-c-pill-yes">Loved it</span>
                  <p>&ldquo;Read it twice. Forwarded to my sister.&rdquo;</p>
                  <span className="wm-c-by">P. Okafor · 7m ago</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="wm-uses" id="uses">
        <div className="wm-section-head">
          <span className="wm-eyebrow">Used by</span>
          <h2 className="wm-h2">Anyone whose readers have an opinion.</h2>
        </div>

        <ul className="wm-usegrid">
          <li className="wm-use wm-use-a">
            <div className="wm-use-label">Newsletters</div>
            <div className="wm-use-q">&ldquo;Did this issue earn its place?&rdquo;</div>
          </li>
          <li className="wm-use wm-use-b">
            <div className="wm-use-label">Product</div>
            <div className="wm-use-q">&ldquo;Did the new feature actually help?&rdquo;</div>
          </li>
          <li className="wm-use wm-use-c">
            <div className="wm-use-label">Support</div>
            <div className="wm-use-q">&ldquo;Did we fix it for you?&rdquo;</div>
          </li>
          <li className="wm-use wm-use-d">
            <div className="wm-use-label">Internal comms</div>
            <div className="wm-use-q">&ldquo;Was the all-hands worth your hour?&rdquo;</div>
          </li>
          <li className="wm-use wm-use-e">
            <div className="wm-use-label">Events</div>
            <div className="wm-use-q">&ldquo;Would you come back next year?&rdquo;</div>
          </li>
          <li className="wm-use wm-use-f">
            <div className="wm-use-label">Course creators</div>
            <div className="wm-use-q">&ldquo;Did this lesson click?&rdquo;</div>
          </li>
        </ul>
      </section>

      {/* FEATURES */}
      <section className="wm-features" id="features">
        <div className="wm-section-head">
          <span className="wm-eyebrow">Under the hood</span>
          <h2 className="wm-h2">Quietly doing the heavy lifting.</h2>
        </div>
        <ul className="wm-featgrid">
          <li className="wm-feat">
            <div className="wm-feat-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z" />
              </svg>
            </div>
            <h3>Bot filtering</h3>
            <p>
              We sniff out email scanners and link pre-fetchers so your tally
              doesn&apos;t get inflated by software pretending to be people.
            </p>
          </li>
          <li className="wm-feat">
            <div className="wm-feat-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12h4l3-8 4 16 3-8h4" />
              </svg>
            </div>
            <h3>Real-time analytics</h3>
            <p>
              Answer counts, geographic heatmaps, comment search, time-of-day
              curves — all updating as your audience clicks.
            </p>
          </li>
          <li className="wm-feat">
            <div className="wm-feat-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="8" r="3" />
                <circle cx="17" cy="10" r="2.5" />
                <path d="M3 19c0-3 3-5 6-5s6 2 6 5" />
                <path d="M14 19c0-2 2-4 4.5-4S22 17 22 19" />
              </svg>
            </div>
            <h3>Team collaboration</h3>
            <p>
              Bring your org along. Share surveys, hand off responses to whoever
              owns them, and export everything to CSV when audit time comes.
            </p>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="wm-cta">
        <div className="wm-cta-card">
          <h2 className="wm-cta-h">Ready to hear back?</h2>
          <p className="wm-cta-p">
            Set up your first survey in under a minute. We&apos;ll handle the rest.
          </p>
          <a className="wm-btn wm-btn-primary wm-btn-lg" href="/signup">
            Get started — free
          </a>
          <div className="wm-cta-foot">
            No credit card · Cancel anytime · Your data is yours
          </div>
        </div>
      </section>

      <footer className="wm-foot">
        <div className="wm-foot-l">
          <span className="wm-logomark wm-logomark-sm" aria-hidden="true">
            <Image src="/backtalk-icon.svg" alt="" width={18} height={18} />
          </span>
          <span>Backtalk</span>
          <span className="wm-foot-c">© {new Date().getFullYear()}</span>
        </div>
        <div className="wm-foot-r">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}

const warmCSS = `
.wm-root {
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
  --shadow-soft: 0 18px 48px -16px rgba(230,107,103,0.18);
  --sans: "DM Sans", "Söhne", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  --display: "DM Sans", "Söhne", -apple-system, sans-serif;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  padding: 0 56px 96px;
  min-height: 100vh;
}
.wm-root::selection, .wm-root *::selection { background: var(--accent); color: #fff; }
.wm-root a { color: inherit; text-decoration: none; }

/* Nav */
.wm-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 0;
  gap: 32px;
}
.wm-logo { display: flex; align-items: center; gap: 10px; }
.wm-logomark { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; }
.wm-logomark img { width: 100%; height: 100%; }
.wm-logotype { font-weight: 700; font-size: 22px; letter-spacing: -0.02em; }
.wm-navlinks { display: flex; gap: 28px; font-size: 14px; color: var(--ink-2); font-weight: 500; }
.wm-navlinks a:hover { color: var(--ink); }
.wm-navactions { display: flex; align-items: center; gap: 18px; }
.wm-link { font-size: 14px; color: var(--ink-2); font-weight: 500; }
.wm-link:hover { color: var(--ink); }

.wm-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 10px 18px; border-radius: 14px;
  font-size: 14px; font-weight: 600; letter-spacing: -0.005em;
  transition: transform .12s ease, background .12s ease, box-shadow .12s ease;
  cursor: pointer;
}
.wm-btn:hover { transform: translateY(-1px); }
.wm-btn-primary { background: var(--accent); color: #fff; box-shadow: 0 8px 20px -8px rgba(230,107,103,0.6); }
.wm-btn-primary:hover { background: #c95551; }
.wm-btn-ghost { background: var(--paper); color: var(--ink); border: 1px solid var(--line); }
.wm-btn-ghost:hover { background: var(--bg-2); }
.wm-btn-lg { padding: 16px 26px; font-size: 16px; border-radius: 18px; }

/* Hero */
.wm-hero {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 72px;
  padding: 64px 0 96px;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
}
.wm-tag {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--accent-soft);
  color: var(--accent);
  padding: 8px 14px; border-radius: 999px;
  font-size: 13px; font-weight: 600;
}
.wm-tag-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }
.wm-headline {
  font-family: var(--display);
  font-weight: 700;
  font-size: 76px;
  line-height: 1.02;
  letter-spacing: -0.035em;
  margin-top: 22px;
  text-wrap: balance;
}
.wm-h-mark { color: var(--accent); }
.wm-deck {
  font-size: 19px; line-height: 1.55;
  color: var(--ink-2);
  max-width: 520px;
  margin-top: 24px;
  text-wrap: pretty;
}
.wm-cta-row { display: flex; gap: 12px; margin-top: 32px; flex-wrap: wrap; }
.wm-trust {
  display: flex; align-items: center; gap: 12px;
  margin-top: 28px;
  color: var(--ink-3);
  font-size: 13px;
}
.wm-trust-dot { width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--bg); margin-left: -10px; }
.wm-trust-dot:first-child { margin-left: 0; }
.wm-trust-a { background: #ffb38a; }
.wm-trust-b { background: #c69f86; }
.wm-trust-c { background: #6b4f3f; }
.wm-trust-text { margin-left: 6px; }

/* Hero art — bubble cluster */
.wm-hero-art {
  position: relative;
  height: 460px;
}
.wm-bubble {
  position: absolute;
  background: var(--paper);
  border-radius: 24px;
  padding: 22px 24px;
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--line);
}
.wm-bubble-sender {
  top: 20px; left: 0; right: 60px;
  border-bottom-left-radius: 8px;
}
.wm-bubble-meta { font-size: 12px; color: var(--ink-3); font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
.wm-bubble-body { font-size: 22px; font-weight: 600; letter-spacing: -0.015em; margin-top: 8px; line-height: 1.25; }
.wm-bubble-options { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.wm-chip {
  padding: 8px 14px;
  border-radius: 999px;
  background: #f6e6d8;
  color: var(--ink);
  font-size: 13px; font-weight: 600;
}
.wm-chip-on { background: var(--accent); color: #fff; }
.wm-bubble-reply {
  top: 200px; right: 0; left: 80px;
  background: var(--ink);
  color: #fff;
  border-bottom-right-radius: 8px;
  border-color: var(--ink);
}
.wm-bubble-reply .wm-bubble-body { font-size: 18px; font-weight: 500; }
.wm-bubble-foot { font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 12px; }
.wm-bubble-stat {
  bottom: 0; left: 30px;
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  padding: 16px 22px;
  border-radius: 20px;
  display: flex; flex-direction: column; gap: 2px;
}
.wm-bubble-stat-num { font-size: 36px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
.wm-bubble-stat-lbl { font-size: 13px; font-weight: 500; opacity: 0.9; }

/* Section heads */
.wm-section-head { padding: 72px 0 36px; max-width: 720px; }
.wm-section-head-c { text-align: center; max-width: none; margin: 0 auto; }
.wm-eyebrow {
  display: inline-block;
  background: var(--accent-soft);
  color: var(--accent);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.02em;
}
.wm-h2 {
  font-family: var(--display);
  font-weight: 700;
  font-size: 52px;
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin-top: 16px;
  text-wrap: balance;
}
.wm-h2 em { font-style: normal; color: var(--accent); }
.wm-section-deck {
  margin-top: 16px; font-size: 18px; line-height: 1.55; color: var(--ink-2);
  max-width: 600px; margin-left: auto; margin-right: auto;
}

/* Sections */
.wm-how, .wm-email-section, .wm-dash-section, .wm-uses, .wm-features, .wm-cta {
  max-width: 1280px; margin: 0 auto;
}

/* Steps */
.wm-steps {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: stretch;
  gap: 0;
  list-style: none;
  padding: 0;
}
.wm-step {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 28px;
  box-shadow: var(--shadow-soft);
}
.wm-step-num {
  width: 36px; height: 36px; border-radius: 12px;
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 16px;
}
.wm-step-h {
  font-family: var(--display);
  font-size: 24px; font-weight: 700; letter-spacing: -0.02em;
  margin-top: 18px;
}
.wm-step p { margin-top: 8px; font-size: 15px; line-height: 1.55; color: var(--ink-2); text-wrap: pretty; }
.wm-step-arrow {
  display: flex; align-items: center; justify-content: center;
  color: var(--accent); padding: 0 16px;
}

/* Email */
.wm-email-section { padding-bottom: 96px; }
.wm-email-wrap {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 48px;
  align-items: start;
}
.wm-email {
  background: var(--paper);
  border-radius: 24px;
  border: 1px solid var(--line);
  box-shadow: 0 30px 80px -30px rgba(42,26,16,0.25);
  overflow: hidden;
}
.wm-email-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 22px; background: #fdf6ee;
  border-bottom: 1px solid var(--line);
}
.wm-email-from { display: flex; gap: 12px; align-items: center; }
.wm-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
}
.wm-email-name { font-weight: 600; font-size: 14px; }
.wm-email-addr { font-size: 12px; color: var(--ink-3); }
.wm-email-tag {
  background: var(--accent-soft); color: var(--accent);
  padding: 4px 10px; border-radius: 999px;
  font-size: 12px; font-weight: 600;
}
.wm-email-body { padding: 28px; font-size: 16px; line-height: 1.6; color: var(--ink); }
.wm-email-body p + p { margin-top: 14px; }
.wm-email-ask { font-size: 18px; font-weight: 600; margin-top: 22px !important; }
.wm-email-buttons { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0 22px; }
.wm-emailbtn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 18px;
  border-radius: 14px;
  background: #fdf2e9; color: var(--ink);
  font-size: 14px; font-weight: 600;
  border: 1px solid var(--line);
  transition: transform .12s, background .12s;
}
.wm-emailbtn:hover { transform: translateY(-1px); background: var(--accent-soft); }
.wm-emailbtn-yes { background: var(--accent); color: #fff; border-color: var(--accent); }
.wm-emailbtn-yes:hover { background: #c95551; }
.wm-emoji { font-size: 8px; opacity: 0.7; }

.wm-email-callouts { display: flex; flex-direction: column; gap: 22px; padding-top: 16px; }
.wm-callout { display: flex; gap: 16px; }
.wm-callout-num {
  flex-shrink: 0;
  width: 40px; height: 40px;
  border-radius: 14px;
  background: var(--accent-soft); color: var(--accent);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px;
}
.wm-callout h4 { font-size: 17px; font-weight: 700; letter-spacing: -0.01em; }
.wm-callout p { margin-top: 4px; font-size: 14px; line-height: 1.55; color: var(--ink-2); }

/* Dashboard */
.wm-dash-section { padding-bottom: 96px; }
.wm-dash {
  background: var(--paper);
  border-radius: 24px;
  border: 1px solid var(--line);
  box-shadow: 0 30px 80px -30px rgba(42,26,16,0.2);
  overflow: hidden;
}
.wm-dash-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 22px 28px;
  border-bottom: 1px solid var(--line);
}
.wm-dash-title { font-size: 20px; font-weight: 700; letter-spacing: -0.015em; }
.wm-dash-sub { display: flex; gap: 16px; margin-top: 6px; font-size: 13px; color: var(--ink-3); }
.wm-live { display: inline-flex; align-items: center; gap: 6px; color: var(--accent); font-weight: 600; }
.wm-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: wmpulse 1.6s infinite; }
@keyframes wmpulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
.wm-dash-actions { display: flex; gap: 6px; background: #fdf2e9; padding: 4px; border-radius: 12px; }
.wm-tab { padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: var(--ink-2); }
.wm-tab-on { background: var(--paper); color: var(--ink); box-shadow: 0 2px 6px rgba(0,0,0,0.05); }

.wm-dash-body { display: grid; grid-template-columns: 1.2fr 1fr; }
.wm-dash-bars { padding: 28px; display: flex; flex-direction: column; gap: 22px; border-right: 1px solid var(--line); }
.wm-bar-row { display: flex; justify-content: space-between; align-items: baseline; }
.wm-bar-label { font-size: 16px; font-weight: 600; }
.wm-bar-val { font-size: 13px; color: var(--ink-3); font-variant-numeric: tabular-nums; }
.wm-bar-track { margin-top: 8px; height: 14px; background: #fdf2e9; border-radius: 99px; overflow: hidden; }
.wm-bar-fill { height: 100%; border-radius: 99px; transition: width .6s ease; }
.wm-bar-0 .wm-bar-fill { background: var(--accent); }
.wm-bar-1 .wm-bar-fill { background: var(--accent-2); }
.wm-bar-2 .wm-bar-fill { background: #c69f86; }

.wm-dash-comments { padding: 24px 28px; }
.wm-c-head { font-size: 13px; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
.wm-c-list { display: flex; flex-direction: column; gap: 16px; margin-top: 14px; list-style: none; padding: 0; }
.wm-c { padding: 14px 16px; border-radius: 14px; background: #fdf6ee; }
.wm-c-pill {
  display: inline-block; padding: 3px 10px; border-radius: 999px;
  background: rgba(42,26,16,0.08); color: var(--ink-2);
  font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
}
.wm-c-pill-yes { background: var(--accent-soft); color: var(--accent); }
.wm-c p { font-size: 14px; line-height: 1.5; margin-top: 8px; }
.wm-c-by { display: block; margin-top: 6px; font-size: 12px; color: var(--ink-3); }

/* Use cases */
.wm-usegrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  list-style: none;
  padding: 0;
}
.wm-use {
  padding: 28px;
  border-radius: 22px;
  background: var(--paper);
  border: 1px solid var(--line);
  min-height: 160px;
  display: flex; flex-direction: column; justify-content: space-between; gap: 18px;
  transition: transform .15s, box-shadow .15s;
}
.wm-use:hover { transform: translateY(-2px); box-shadow: var(--shadow-soft); }
.wm-use-label { font-size: 13px; color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
.wm-use-q { font-family: var(--display); font-size: 22px; font-weight: 700; line-height: 1.2; letter-spacing: -0.02em; text-wrap: balance; }
.wm-use-a { background: var(--accent); color: #fff; border-color: var(--accent); }
.wm-use-a .wm-use-label { color: rgba(255,255,255,0.8); }
.wm-use-d { background: var(--ink); color: #fff; border-color: var(--ink); }
.wm-use-d .wm-use-label { color: var(--accent-2); }

/* Features */
.wm-featgrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  list-style: none;
  padding: 0;
}
.wm-feat {
  padding: 32px;
  border-radius: 24px;
  background: var(--paper);
  border: 1px solid var(--line);
}
.wm-feat-icon {
  width: 48px; height: 48px;
  border-radius: 14px;
  background: var(--accent-soft); color: var(--accent);
  display: flex; align-items: center; justify-content: center;
}
.wm-feat-icon svg { width: 24px; height: 24px; }
.wm-feat h3 { font-family: var(--display); font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin-top: 18px; }
.wm-feat p { margin-top: 8px; font-size: 15px; line-height: 1.55; color: var(--ink-2); text-wrap: pretty; }

/* CTA */
.wm-cta { padding: 72px 0; }
.wm-cta-card {
  text-align: center;
  background: var(--ink);
  color: #fff;
  border-radius: 32px;
  padding: 80px 32px;
  position: relative;
  overflow: hidden;
}
.wm-cta-card::before {
  content: "";
  position: absolute;
  inset: -40% -10% auto auto;
  width: 60%; height: 200%;
  background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
  opacity: 0.55;
}
.wm-cta-card > * { position: relative; }
.wm-cta-h { font-family: var(--display); font-size: 64px; font-weight: 700; letter-spacing: -0.035em; line-height: 1.02; text-wrap: balance; }
.wm-cta-p { margin-top: 16px; font-size: 18px; color: rgba(255,255,255,0.7); }
.wm-cta-card .wm-btn { margin-top: 32px; }
.wm-cta-foot { margin-top: 22px; font-size: 13px; color: rgba(255,255,255,0.5); }

/* Footer */
.wm-foot {
  border-top: 1px solid var(--line);
  margin: 32px auto 0;
  padding-top: 22px;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 13px; color: var(--ink-2);
  max-width: 1280px;
}
.wm-foot-l { display: flex; align-items: center; gap: 10px; }
.wm-logomark-sm { width: 18px; height: 18px; }
.wm-foot-c { color: var(--ink-3); margin-left: 8px; }
.wm-foot-r { display: flex; gap: 24px; }
.wm-foot-r a:hover { color: var(--ink); }

/* Responsive */
@media (max-width: 960px) {
  .wm-root { padding: 0 24px 64px; }
  .wm-hero { grid-template-columns: 1fr; gap: 48px; padding: 32px 0 64px; }
  .wm-hero-art { height: 420px; }
  .wm-headline { font-size: 48px; }
  .wm-h2 { font-size: 36px; }
  .wm-cta-h { font-size: 40px; }
  .wm-steps { grid-template-columns: 1fr; }
  .wm-step-arrow { display: none; }
  .wm-email-wrap { grid-template-columns: 1fr; gap: 32px; }
  .wm-dash-body { grid-template-columns: 1fr; }
  .wm-dash-bars { border-right: none; border-bottom: 1px solid var(--line); }
  .wm-usegrid, .wm-featgrid { grid-template-columns: 1fr; }
  .wm-navlinks { display: none; }
}
`;
