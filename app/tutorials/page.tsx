import Image from "next/image";
import Link from "next/link";

export default function TutorialsPage() {
  const tips = [
    {
      num: "01",
      title: "Ask one question. Just one.",
      body: "A one-click survey lives or dies on cognitive load. If your reader has to scan three questions and pick a path, you've already lost half of them. Pick the single thing you most want to know this week and ask only that.",
      example: '"How did this issue land for you?"',
    },
    {
      num: "02",
      title: "Put it where the eye is already going.",
      body: "The end of the email is where readers either click reply or close the tab. That's the moment your buttons should appear — right after the part of the email they were already reacting to. Don't bury it under a footer.",
      example: "Below the sign-off, above the unsubscribe link.",
    },
    {
      num: "03",
      title: "Use three options, not five.",
      body: "Two feels binary and a little hostile. Five turns into a Likert scale your readers will skip. Three options — positive, neutral, negative — covers the spectrum without making anyone think.",
      example: '"Loved it" · "It was fine" · "Not for me"',
    },
    {
      num: "04",
      title: "Write the options in the reader's voice.",
      body: "\"Strongly agree\" is something a survey says. \"Yep, send more like this\" is something a person says. Buttons that sound human get clicked. Buttons that sound like a form get scrolled past.",
      example: '"Yes, more please" beats "Highly satisfied."',
    },
    {
      num: "05",
      title: "Make the prompt specific to this email.",
      body: "\"How are we doing?\" is forgettable. \"Did this week's long-form essay earn its place?\" is a real question, about a real thing your reader just read. Specificity is what turns a poll into a conversation.",
      example: '"Was the recipe section worth keeping?"',
    },
    {
      num: "06",
      title: "Don't promise what the comment box can deliver.",
      body: "The follow-up page invites a longer thought, but most people will give you a sentence and move on. Treat any comment as a gift, not an entitlement. Don't tell readers \"please explain your answer\" — let the curious ones type, let the rest just vote.",
      example: "Leave the comment field optional, always.",
    },
    {
      num: "07",
      title: "Stay anonymous unless you need a name.",
      body: "Requiring an email address before they can answer is a great way to halve your response rate. Ask for identity only when you're going to act on it — replying personally, segmenting the list, following up with a customer.",
      example: "Default to anonymous. Ask for a name only when it matters.",
    },
    {
      num: "08",
      title: "Send the same survey twice — once at the top, once at the bottom.",
      body: "Different readers stop at different places. The same three buttons, placed early and again at the end, can lift response rates noticeably without feeling pushy. Backtalk dedupes by subscriber, so the second click won't double-count.",
      example: "Top of the email AND under the sign-off.",
    },
    {
      num: "09",
      title: "Read the comments before you read the tally.",
      body: "The bar chart will tell you what people felt. The comments will tell you why. If you skip to the numbers, you'll optimize for a vibe and miss the actual lesson hiding in the third comment down.",
      example: "Open the Comments tab first. Every time.",
    },
    {
      num: "10",
      title: "Close the loop in the next issue.",
      body: "Nothing earns future clicks like proof that the last clicks were heard. Mention the results, name a change you're making, and thank the people who weighed in. Readers will start treating your survey buttons like a real channel — because they are one.",
      example: '"You voted, we listened: the round-up is back."',
    },
  ];

  const dos = [
    "Ask a question that's specific to this email.",
    "Write button labels in the voice of your reader.",
    "Place the survey where attention naturally lands.",
    "Treat comments as the prize, not the votes.",
    "Reply to the people who took the time to write back.",
  ];

  const donts = [
    "Don't ask more than one question at a time.",
    "Don't require a name or email to register a vote.",
    "Don't use jargon like \"NPS\" or \"CSAT\" in the prompt.",
    "Don't bury the buttons under three paragraphs of preamble.",
    "Don't go silent after the survey closes — say what you learned.",
  ];

  return (
    <div className="wm-root">
      <style>{warmCSS}</style>

      <header className="wm-nav">
        <Link className="wm-logo" href="/">
          <span className="wm-logomark" aria-hidden="true">
            <Image src="/backtalk-icon.svg" alt="" width={28} height={28} />
          </span>
          <span className="wm-logotype">Backtalk</span>
        </Link>
        <nav className="wm-navlinks">
          <Link href="/#how">How</Link>
          <Link href="/#uses">Use cases</Link>
          <Link href="/#features">Features</Link>
          <Link href="/tutorials" className="wm-navlink-on">Tutorials</Link>
        </nav>
        <div className="wm-navactions">
          <a className="wm-link" href="/login">Log in</a>
          <a className="wm-btn wm-btn-primary" href="/signup">Get started</a>
        </div>
      </header>

      {/* HERO */}
      <section className="wm-hero-narrow">
        <span className="wm-tag">
          <span className="wm-tag-dot" />
          A short, opinionated guide
        </span>
        <h1 className="wm-headline">
          Ten small things that make
          <span className="wm-h-mark"> email surveys actually work.</span>
        </h1>
        <p className="wm-deck">
          Backtalk surveys live inside your newsletter, not on a separate
          landing page. That changes how you should write them. Here&apos;s
          what we&apos;ve learned from watching thousands of campaigns —
          condensed into ten tips you can apply before sending your next
          issue.
        </p>
      </section>

      {/* TIPS */}
      <section className="wm-tips">
        <ol className="wm-tip-list">
          {tips.map((tip) => (
            <li className="wm-tip" key={tip.num}>
              <div className="wm-tip-num">{tip.num}</div>
              <div className="wm-tip-body">
                <h3 className="wm-tip-h">{tip.title}</h3>
                <p className="wm-tip-p">{tip.body}</p>
                <div className="wm-tip-ex">
                  <span className="wm-tip-ex-label">Try this</span>
                  <span className="wm-tip-ex-text">{tip.example}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* DO / DON'T */}
      <section className="wm-dodont-section">
        <div className="wm-section-head wm-section-head-c">
          <span className="wm-eyebrow">The short version</span>
          <h2 className="wm-h2">
            If you remember nothing else,
            <br /> remember these.
          </h2>
        </div>

        <div className="wm-dodont">
          <div className="wm-dd wm-dd-do">
            <div className="wm-dd-head">
              <span className="wm-dd-mark wm-dd-mark-yes">✓</span>
              <h3>Do</h3>
            </div>
            <ul>
              {dos.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div className="wm-dd wm-dd-dont">
            <div className="wm-dd-head">
              <span className="wm-dd-mark wm-dd-mark-no">×</span>
              <h3>Don&apos;t</h3>
            </div>
            <ul>
              {donts.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TEMPLATE */}
      <section className="wm-template-section">
        <div className="wm-section-head">
          <span className="wm-eyebrow">A worked example</span>
          <h2 className="wm-h2">Here&apos;s the whole thing, end to end.</h2>
          <p className="wm-section-deck-l">
            A real survey, written the way we&apos;d write it. Steal it,
            tweak it, send it.
          </p>
        </div>

        <div className="wm-template">
          <div className="wm-template-row">
            <span className="wm-template-label">Subject line</span>
            <span className="wm-template-val">
              Did this week&apos;s essay land?
            </span>
          </div>
          <div className="wm-template-row">
            <span className="wm-template-label">Prompt in the email</span>
            <span className="wm-template-val">
              We tried a single long-form piece instead of the usual round-up.
              Before I commit to the new format — one click, and you&apos;re
              done.
            </span>
          </div>
          <div className="wm-template-row">
            <span className="wm-template-label">Buttons</span>
            <div className="wm-template-buttons">
              <span className="wm-emailbtn wm-emailbtn-yes">
                <span className="wm-emoji" aria-hidden="true">●</span> Keep going
              </span>
              <span className="wm-emailbtn">
                <span className="wm-emoji" aria-hidden="true">●</span> Mix it in
              </span>
              <span className="wm-emailbtn">
                <span className="wm-emoji" aria-hidden="true">●</span> Bring back the round-up
              </span>
            </div>
          </div>
          <div className="wm-template-row">
            <span className="wm-template-label">Follow-up page</span>
            <span className="wm-template-val">
              &ldquo;Thanks. Want to say more? (Optional)&rdquo; — name field
              hidden, comment box open, submit button labelled &ldquo;Send it
              over.&rdquo;
            </span>
          </div>
          <div className="wm-template-row">
            <span className="wm-template-label">Next issue</span>
            <span className="wm-template-val">
              &ldquo;542 of you voted last week. The long-form essay won by a
              mile — so it&apos;s staying. Thank you.&rdquo;
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="wm-cta">
        <div className="wm-cta-card">
          <h2 className="wm-cta-h">Ready to try one?</h2>
          <p className="wm-cta-p">
            Build your first survey in under a minute. Paste the links into
            your next issue. Watch what comes back.
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
          <Link href="/">Home</Link>
          <Link href="/tutorials">Tutorials</Link>
          <Link href="/login">Log in</Link>
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
.wm-navlink-on { color: var(--accent) !important; }
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
.wm-btn-lg { padding: 16px 26px; font-size: 16px; border-radius: 18px; }

/* Hero (narrow, centred) */
.wm-hero-narrow {
  max-width: 820px;
  margin: 0 auto;
  padding: 80px 0 56px;
  text-align: center;
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
  font-size: 64px;
  line-height: 1.05;
  letter-spacing: -0.035em;
  margin-top: 22px;
  text-wrap: balance;
}
.wm-h-mark { color: var(--accent); }
.wm-deck {
  font-size: 19px; line-height: 1.6;
  color: var(--ink-2);
  max-width: 640px;
  margin: 24px auto 0;
  text-wrap: pretty;
}

/* Section heads */
.wm-section-head { padding: 72px 0 36px; max-width: 720px; margin: 0 auto; }
.wm-section-head-c { text-align: center; max-width: 720px; }
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
  font-size: 48px;
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin-top: 16px;
  text-wrap: balance;
}
.wm-section-deck-l {
  margin-top: 16px; font-size: 18px; line-height: 1.55; color: var(--ink-2);
  max-width: 600px;
}

/* Sections */
.wm-tips, .wm-dodont-section, .wm-template-section, .wm-cta {
  max-width: 1080px; margin: 0 auto;
}

/* Tips */
.wm-tip-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.wm-tip {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  gap: 22px;
  align-items: flex-start;
  transition: transform .15s, box-shadow .15s;
}
.wm-tip:hover { transform: translateY(-2px); box-shadow: var(--shadow-soft); }
.wm-tip-num {
  flex-shrink: 0;
  width: 48px; height: 48px;
  border-radius: 14px;
  background: var(--accent-soft); color: var(--accent);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px; letter-spacing: 0.02em;
}
.wm-tip-body { flex: 1; min-width: 0; }
.wm-tip-h {
  font-family: var(--display);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  text-wrap: balance;
}
.wm-tip-p {
  margin-top: 12px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--ink-2);
  text-wrap: pretty;
}
.wm-tip-ex {
  margin-top: 18px;
  padding: 14px 16px;
  background: #fdf6ee;
  border-radius: 14px;
  border-left: 3px solid var(--accent);
}
.wm-tip-ex-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}
.wm-tip-ex-text {
  display: block;
  margin-top: 4px;
  font-size: 14px;
  color: var(--ink);
  font-weight: 500;
  line-height: 1.45;
}

/* Do / Don't */
.wm-dodont {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.wm-dd {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 32px;
}
.wm-dd-do { border-color: var(--accent-soft); background: linear-gradient(180deg, #fff 0%, #fff8f3 100%); }
.wm-dd-dont { background: var(--ink); color: #fff; border-color: var(--ink); }
.wm-dd-head { display: flex; align-items: center; gap: 12px; }
.wm-dd-head h3 {
  font-family: var(--display);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.wm-dd-mark {
  width: 32px; height: 32px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 18px;
}
.wm-dd-mark-yes { background: var(--accent); color: #fff; }
.wm-dd-mark-no { background: rgba(255,255,255,0.12); color: var(--accent-2); }
.wm-dd ul {
  list-style: none;
  padding: 0;
  margin: 24px 0 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.wm-dd li {
  font-size: 15px;
  line-height: 1.5;
  padding-left: 22px;
  position: relative;
}
.wm-dd-do li { color: var(--ink); }
.wm-dd-dont li { color: rgba(255,255,255,0.85); }
.wm-dd li::before {
  content: "";
  position: absolute;
  left: 0; top: 9px;
  width: 8px; height: 8px;
  border-radius: 50%;
}
.wm-dd-do li::before { background: var(--accent); }
.wm-dd-dont li::before { background: var(--accent-2); }

/* Template */
.wm-template {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 24px;
  overflow: hidden;
}
.wm-template-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
  padding: 24px 28px;
  align-items: flex-start;
}
.wm-template-row + .wm-template-row { border-top: 1px solid var(--line); }
.wm-template-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
  padding-top: 3px;
}
.wm-template-val {
  font-size: 16px;
  line-height: 1.55;
  color: var(--ink);
  text-wrap: pretty;
}
.wm-template-buttons { display: flex; flex-wrap: wrap; gap: 10px; }
.wm-emailbtn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 18px;
  border-radius: 14px;
  background: #fdf2e9; color: var(--ink);
  font-size: 14px; font-weight: 600;
  border: 1px solid var(--line);
}
.wm-emailbtn-yes { background: var(--accent); color: #fff; border-color: var(--accent); }
.wm-emoji { font-size: 8px; opacity: 0.7; }

/* CTA */
.wm-cta { padding: 96px 0 32px; }
.wm-cta-card {
  text-align: center;
  background: var(--ink);
  color: #fff;
  border-radius: 32px;
  padding: 72px 32px;
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
.wm-cta-h { font-family: var(--display); font-size: 56px; font-weight: 700; letter-spacing: -0.035em; line-height: 1.02; text-wrap: balance; }
.wm-cta-p { margin-top: 16px; font-size: 18px; color: rgba(255,255,255,0.7); max-width: 520px; margin-left: auto; margin-right: auto; }
.wm-cta-card .wm-btn { margin-top: 32px; }
.wm-cta-foot { margin-top: 22px; font-size: 13px; color: rgba(255,255,255,0.5); }

/* Footer */
.wm-foot {
  border-top: 1px solid var(--line);
  margin: 32px auto 0;
  padding-top: 22px;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 13px; color: var(--ink-2);
  max-width: 1080px;
}
.wm-foot-l { display: flex; align-items: center; gap: 10px; }
.wm-logomark-sm { width: 18px; height: 18px; }
.wm-foot-c { color: var(--ink-3); margin-left: 8px; }
.wm-foot-r { display: flex; gap: 24px; }
.wm-foot-r a:hover { color: var(--ink); }

/* Responsive */
@media (max-width: 960px) {
  .wm-root { padding: 0 24px 64px; }
  .wm-hero-narrow { padding: 40px 0 32px; }
  .wm-headline { font-size: 40px; }
  .wm-h2 { font-size: 32px; }
  .wm-cta-h { font-size: 36px; }
  .wm-tip-list { grid-template-columns: 1fr; }
  .wm-dodont { grid-template-columns: 1fr; }
  .wm-template-row { grid-template-columns: 1fr; gap: 8px; }
  .wm-navlinks { display: none; }
}
`;
