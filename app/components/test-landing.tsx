'use client'

import Link from 'next/link'

export type TargetingRule = {
  label: string
  description: string
  accent: string
}

const RULES: Record<string, TargetingRule> = {
  'once-visitor': {
    label: 'Once per visitor',
    description: 'This form should appear only once, ever, per visitor.',
    accent: '#3B82F6',
  },
  'once-session': {
    label: 'Once per session',
    description:
      'This form should appear once per browsing session. Close the tab and return to see it again.',
    accent: '#22C55E',
  },
  'once-1-day': {
    label: 'Once per day',
    description:
      'This form should appear at most once every 24 hours per visitor.',
    accent: '#EAB308',
  },
  'every-page-load': {
    label: 'Every page load',
    description: 'This form should appear on every page load. No throttling.',
    accent: '#EF4444',
  },
}

export type Env = 'production' | 'test'

const SLUGS: (keyof typeof RULES)[] = [
  'once-visitor',
  'once-session',
  'once-1-day',
  'every-page-load',
]

function pathFor(slug: string, env: Env) {
  return env === 'test' ? `/test-${slug}` : `/${slug}`
}

export default function TestLanding({
  slug,
  env = 'production',
}: {
  slug: keyof typeof RULES
  env?: Env
}) {
  const rule = RULES[slug]

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        color: '#EDEDED',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '64px 24px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            background: '#141414',
            border: `1px solid ${rule.accent}`,
            borderRadius: 999,
            fontSize: 12,
            color: rule.accent,
            marginBottom: 32,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: rule.accent,
            }}
          />
          AWeber form test · {rule.label} · {env === 'test' ? 'test env' : 'prod env'}
        </div>

        <h1
          style={{
            fontSize: 56,
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Better email,
          <br />
          fewer guesses.
        </h1>

        <p
          style={{
            fontSize: 18,
            color: '#A1A1A1',
            marginTop: 20,
            maxWidth: 560,
            lineHeight: 1.5,
          }}
        >
          Backtalk turns one-click email surveys into real audience signal — so
          you can stop guessing what your readers want and start shipping what
          they actually open.
        </p>

        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <button
            type="button"
            style={{
              padding: '12px 20px',
              background: '#EDEDED',
              border: 'none',
              borderRadius: 6,
              color: '#0A0A0A',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Get started
          </button>
          <button
            type="button"
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: '1px solid #333333',
              borderRadius: 6,
              color: '#EDEDED',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            See a demo
          </button>
        </div>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginTop: 72,
          }}
        >
          {[
            {
              title: 'One-click responses',
              body: 'Recipients answer with a single click from their inbox.',
            },
            {
              title: 'AWeber-native',
              body: 'Drop a tracked link into any AWeber broadcast.',
            },
            {
              title: 'Real signal',
              body: 'Bot detection separates real engagement from noise.',
            },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                background: '#141414',
                border: '1px solid #262626',
                borderRadius: 8,
                padding: 20,
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  margin: 0,
                  color: '#EDEDED',
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: '#A1A1A1',
                  margin: '8px 0 0',
                  lineHeight: 1.5,
                }}
              >
                {f.body}
              </p>
            </div>
          ))}
        </section>

        <section
          style={{
            marginTop: 72,
            padding: 24,
            background: '#141414',
            border: '1px solid #262626',
            borderRadius: 8,
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              margin: 0,
              color: '#666666',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Testing rule
          </h2>
          <p
            style={{
              fontSize: 14,
              color: '#A1A1A1',
              margin: '12px 0 20px',
              lineHeight: 1.5,
            }}
          >
            {rule.description}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              fontSize: 12,
            }}
          >
            <Link
              href={pathFor(slug, env === 'test' ? 'production' : 'test')}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid #333333',
                color: '#EDEDED',
                background: 'transparent',
                textDecoration: 'none',
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              }}
            >
              ↔ switch to {env === 'test' ? 'prod' : 'test'}
            </Link>
            {SLUGS.map((s) => {
              const path = pathFor(s, env)
              const active = s === slug
              return (
                <Link
                  key={s}
                  href={path}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: `1px solid ${
                      active ? RULES[s].accent : '#262626'
                    }`,
                    color: active ? RULES[s].accent : '#A1A1A1',
                    background: active ? '#0A0A0A' : 'transparent',
                    textDecoration: 'none',
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  }}
                >
                  {path}
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
