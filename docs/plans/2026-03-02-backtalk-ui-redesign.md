# Backtalk UI Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebrand "Email Survey Tool" to "Backtalk" with a dark-first UI, new homepage, and consistent design system across all pages.

**Architecture:** Pure CSS/Tailwind reskin — no structural or API changes. Each page gets its Tailwind classes updated to dark theme tokens. The homepage is a complete rewrite. The public survey form stays light-themed.

**Tech Stack:** Next.js 15, Tailwind CSS, Inter font (Google Fonts), Recharts, react-simple-maps

---

### Task 1: Foundation — globals.css, layout.tsx, tailwind.config.ts

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `tailwind.config.ts`

**Step 1: Update `app/globals.css`**

Replace the entire file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --bg-page: #0A0A0A;
  --bg-surface: #141414;
  --bg-elevated: #1A1A1A;
  --border-subtle: #262626;
  --border-emphasis: #333333;
  --text-primary: #EDEDED;
  --text-secondary: #A1A1A1;
  --text-muted: #666666;
  --accent: #3B82F6;
  --accent-hover: #2563EB;
  --success: #22C55E;
  --error: #EF4444;
  --warning: #EAB308;
}

body {
  color: var(--text-primary);
  background: var(--bg-page);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

**Step 2: Update `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Backtalk",
  description: "One-click email surveys. Hear what your audience thinks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
```

**Step 3: Update `tailwind.config.ts`**

No changes needed — existing `var(--background)` and `var(--foreground)` mappings aren't used in component code. The CSS variables in globals.css handle the tokens.

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 5: Commit**

```
feat: add dark theme foundation with Inter font and Backtalk branding
```

---

### Task 2: Navigation component

**Files:**
- Modify: `app/components/nav.tsx`

**Step 1: Restyle the Nav component**

Replace the return JSX in `app/components/nav.tsx`. Keep all the existing state, hooks, and handler logic exactly the same. Only change the JSX returned:

```tsx
  return (
    <nav className="bg-[#141414] border-b border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center gap-6">
            <a href="/dashboard" className="text-lg font-semibold text-[#EDEDED] hover:text-white transition-colors">
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
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat: restyle navigation with dark theme and Backtalk branding
```

---

### Task 3: Homepage — complete rewrite

**Files:**
- Modify: `app/page.tsx`

**Step 1: Rewrite the homepage**

Replace the entire file with a new marketing page:

```tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Nav */}
      <nav className="border-b border-[#262626]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-semibold text-[#EDEDED]">Backtalk</span>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="px-4 py-2 text-sm text-[#A1A1A1] hover:text-white transition-colors"
            >
              Log In
            </a>
            <a
              href="/signup"
              className="px-4 py-2 text-sm bg-[#3B82F6] text-white rounded-md hover:bg-[#2563EB] transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
          Your emails deserve<br />a conversation.
        </h1>
        <p className="text-lg text-[#A1A1A1] max-w-xl mx-auto mb-10 leading-relaxed">
          Backtalk lets your audience respond to emails with one click.
          Create a survey, drop links in your email, and hear what people actually think.
        </p>
        <a
          href="/signup"
          className="inline-block px-8 py-3 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB] transition-colors"
        >
          Get Started Free
        </a>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold text-white text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Create a survey',
              description: 'Give it a title. That\'s it. No forms to configure, no questions to write.',
            },
            {
              step: '2',
              title: 'Add links to your email',
              description: 'Each link carries an answer value. "Satisfied", "Not satisfied" — whatever you want to ask.',
            },
            {
              step: '3',
              title: 'See what people think',
              description: 'Responses stream in as people click. View analytics, filter by answer, export to CSV.',
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center text-sm font-semibold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-[#A1A1A1] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Bot filtering',
              description: 'Automatic detection of email scanners and bots so your data stays clean.',
            },
            {
              title: 'Real-time analytics',
              description: 'Answer breakdowns, geographic heatmaps, and comment filtering — all live.',
            },
            {
              title: 'Team collaboration',
              description: 'Invite your team. Share surveys across your organization.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-[#141414] border border-[#262626] rounded-lg p-6"
            >
              <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-[#A1A1A1] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to hear back?</h2>
        <p className="text-[#A1A1A1] mb-8">Start collecting feedback from your email audience today.</p>
        <a
          href="/signup"
          className="inline-block px-8 py-3 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB] transition-colors"
        >
          Get Started Free
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#262626]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm text-[#666666]">Backtalk</span>
          <span className="text-sm text-[#666666]">&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat: build new Backtalk homepage with dark theme
```

---

### Task 4: Auth pages — Login

**Files:**
- Modify: `app/login/page.tsx`

**Step 1: Restyle the login page**

Keep all existing state, hooks, and handler logic. Replace only the return JSX:

```tsx
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="max-w-sm w-full px-6">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-semibold text-[#EDEDED]">Backtalk</a>
        </div>
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-8">
          <h1 className="text-xl font-semibold mb-6 text-center text-[#EDEDED]">Log In</h1>

          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#A1A1A1] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-md text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-[#A1A1A1]">
                  Password
                </label>
                <a href="/forgot-password" className="text-sm text-[#3B82F6] hover:text-[#2563EB] transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-md text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#141414] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#A1A1A1]">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-[#3B82F6] font-medium hover:text-[#2563EB]">
              Sign up
            </a>
          </p>

          <p className="mt-2 text-center text-sm">
            <a href="/resend-verification" className="text-[#666666] hover:text-[#A1A1A1] transition-colors">
              Resend verification email
            </a>
          </p>
        </div>
      </div>
    </div>
  )
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat: restyle login page with dark theme
```

---

### Task 5: Auth pages — Signup

**Files:**
- Modify: `app/signup/page.tsx`

**Step 1: Restyle the signup page**

Keep all existing logic. Replace only the return JSX:

```tsx
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="max-w-sm w-full px-6">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-semibold text-[#EDEDED]">Backtalk</a>
        </div>
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-8">
          <h1 className="text-xl font-semibold mb-6 text-center text-[#EDEDED]">Sign Up</h1>

          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#A1A1A1] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-md text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#A1A1A1] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-md text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
              />
              <p className="mt-1 text-xs text-[#666666]">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#141414] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#A1A1A1]">
            Already have an account?{' '}
            <a href="/login" className="text-[#3B82F6] font-medium hover:text-[#2563EB]">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat: restyle signup page with dark theme
```

---

### Task 6: Auth pages — Forgot Password & Resend Verification

**Files:**
- Modify: `app/forgot-password/page.tsx`
- Modify: `app/resend-verification/page.tsx`

**Step 1: Restyle forgot password page**

Keep all existing logic. Replace only the return JSX:

```tsx
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="max-w-sm w-full px-6">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-semibold text-[#EDEDED]">Backtalk</a>
        </div>
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-8">
          <h1 className="text-xl font-semibold mb-2 text-center text-[#EDEDED]">Reset Password</h1>
          <p className="text-sm text-[#666666] text-center mb-6">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="mb-4 p-3 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] rounded-md text-sm">
              Check your email for a password reset link.
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#A1A1A1] mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-md text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#141414] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm">
            <a href="/login" className="text-[#3B82F6] font-medium hover:text-[#2563EB]">
              Back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
```

**Step 2: Restyle resend verification page**

Keep all existing logic. Replace only the return JSX:

```tsx
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="max-w-sm w-full px-6">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-semibold text-[#EDEDED]">Backtalk</a>
        </div>
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-8">
          <h1 className="text-xl font-semibold mb-2 text-center text-[#EDEDED]">Resend Verification</h1>
          <p className="text-sm text-[#666666] text-center mb-6">
            Enter your email and we&apos;ll resend the verification link.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="mb-4 p-3 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] rounded-md text-sm">
              Check your email for a verification link.
            </div>
          ) : (
            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#A1A1A1] mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-md text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#141414] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm">
            <a href="/login" className="text-[#3B82F6] font-medium hover:text-[#2563EB]">
              Back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```
feat: restyle forgot password and resend verification pages with dark theme
```

---

### Task 7: Dashboard page

**Files:**
- Modify: `app/dashboard/page.tsx`

**Step 1: Restyle the dashboard page**

Keep all existing state, hooks, and handler logic (lines 1-65 stay exactly the same). Replace only the return JSX (starting from `return (`):

```tsx
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#EDEDED]">Surveys</h2>
          <a
            href="/surveys/new"
            className="px-4 py-2 bg-[#3B82F6] text-white text-sm font-medium rounded-md hover:bg-[#2563EB] transition-colors"
          >
            + New Survey
          </a>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-[#A1A1A1]">Loading surveys...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md">
            {error}
          </div>
        )}

        {!loading && !error && surveys.length === 0 && (
          <div className="text-center py-12 bg-[#141414] border border-[#262626] rounded-lg">
            <p className="text-[#A1A1A1] mb-4">No surveys yet. Create your first survey!</p>
            <a
              href="/surveys/new"
              className="inline-block px-6 py-2 bg-[#3B82F6] text-white text-sm rounded-md hover:bg-[#2563EB] transition-colors"
            >
              Create Survey
            </a>
          </div>
        )}

        {!loading && !error && surveys.length > 0 && (
          <div className="space-y-3 md:hidden">
            {surveys.map((survey) => (
              <div key={survey.id} className="bg-[#141414] border border-[#262626] rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <a href={`/surveys/${survey.id}/responses`} className="font-medium text-[#EDEDED] hover:text-white">{survey.title}</a>
                    <div className="text-xs text-[#666666] mt-0.5">{survey.unique_link_id}</div>
                  </div>
                  {survey.is_active ? (
                    <span className="px-2 text-xs leading-5 font-medium rounded-full bg-[#22C55E]/10 text-[#22C55E]">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 text-xs leading-5 font-medium rounded-full bg-[#666666]/10 text-[#666666]">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-[#A1A1A1] mb-3">
                  <span>{survey.response_count} responses</span>
                  <span>{formatDate(survey.created_at)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={() => copyLink(survey.unique_link_id)}
                    className="text-[#3B82F6] hover:text-[#2563EB] transition-colors"
                  >
                    {copiedId === survey.unique_link_id ? 'Copied!' : 'Copy Link'}
                  </button>
                  <a
                    href={`/surveys/${survey.id}/responses`}
                    className="text-[#A1A1A1] hover:text-white transition-colors"
                  >
                    View
                  </a>
                  <button
                    onClick={() => deleteSurvey(survey.id, survey.title)}
                    disabled={deletingId === survey.id}
                    className="text-[#EF4444] hover:text-[#DC2626] disabled:opacity-50 transition-colors"
                  >
                    {deletingId === survey.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && surveys.length > 0 && (
          <div className="hidden md:block bg-[#141414] border border-[#262626] rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[#262626]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#666666] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#666666] uppercase tracking-wider">
                    Responses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#666666] uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#666666] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#666666] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {surveys.map((survey) => (
                  <tr key={survey.id} className="border-b border-[#262626] last:border-b-0 hover:bg-[#1A1A1A] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={`/surveys/${survey.id}/responses`} className="text-sm font-medium text-[#EDEDED] hover:text-white">{survey.title}</a>
                      <div className="text-xs text-[#666666] mt-1">
                        {survey.unique_link_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#EDEDED] font-medium">
                      {survey.response_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#A1A1A1]">
                      {formatDate(survey.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {survey.is_active ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-[#22C55E]/10 text-[#22C55E]">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-[#666666]/10 text-[#666666]">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-4">
                      <button
                        onClick={() => copyLink(survey.unique_link_id)}
                        className="text-[#3B82F6] hover:text-[#2563EB] transition-colors"
                      >
                        {copiedId === survey.unique_link_id ? 'Copied!' : 'Copy Link'}
                      </button>
                      <a
                        href={`/surveys/${survey.id}/responses`}
                        className="text-[#A1A1A1] hover:text-white transition-colors"
                      >
                        View
                      </a>
                      <button
                        onClick={() => deleteSurvey(survey.id, survey.title)}
                        disabled={deletingId === survey.id}
                        className="text-[#EF4444] hover:text-[#DC2626] disabled:opacity-50 transition-colors"
                      >
                        {deletingId === survey.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat: restyle dashboard with dark theme
```

---

### Task 8: Create Survey page

**Files:**
- Modify: `app/surveys/new/page.tsx`

**Step 1: Restyle the create survey page**

Keep all existing logic. Replace only the return JSX:

```tsx
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Nav />

      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-6 text-[#EDEDED]">Create New Survey</h2>

          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#A1A1A1] mb-2">
                Survey Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Product Feedback Survey"
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-md text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
              />
              <p className="mt-1 text-sm text-[#666666]">
                Give your survey a descriptive title for your own reference
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="requireName"
                  type="checkbox"
                  checked={requireName}
                  onChange={(e) => setRequireName(e.target.checked)}
                  className="h-4 w-4 rounded border-[#333333] bg-[#1A1A1A] text-[#3B82F6] focus:ring-[#3B82F6] focus:ring-offset-0"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="requireName" className="font-medium text-[#EDEDED]">
                  Require respondent name
                </label>
                <p className="text-sm text-[#666666]">
                  When enabled, respondents must provide their name along with their response
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#3B82F6] text-white font-medium text-sm rounded-md hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#141414] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating...' : 'Create Survey'}
              </button>
              <a
                href="/dashboard"
                className="px-6 py-2 text-sm text-[#A1A1A1] border border-[#333333] rounded-md hover:text-[#EDEDED] hover:border-[#444] transition-colors"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat: restyle create survey page with dark theme
```

---

### Task 9: Chart and Map components

**Files:**
- Modify: `app/components/answer-distribution-chart.tsx`
- Modify: `app/components/response-map.tsx`

**Step 1: Restyle the chart tooltip and component**

In `app/components/answer-distribution-chart.tsx`, update the `CustomTooltip` return JSX:

```tsx
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const withComments = payload.find((p: any) => p.dataKey === 'withComments')?.value || 0
  const withoutComments = payload.find((p: any) => p.dataKey === 'withoutComments')?.value || 0
  const total = (withComments as number) + (withoutComments as number)
  return (
    <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg shadow-sm px-3 py-2 text-sm">
      <p className="font-medium text-[#EDEDED] mb-1">{label}</p>
      <p className="text-[#A1A1A1]">{total} responses</p>
      <p className="text-[#3B82F6]">{withComments} with comments</p>
    </div>
  )
}
```

In the `BarChart`, update the `CartesianGrid` stroke and axes:

```tsx
  return (
    <ResponsiveContainer width="100%" height={Math.max(180, answerCounts.length * 50)}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#262626" />
        <XAxis type="number" fontSize={12} tickLine={false} stroke="#666666" tick={{ fill: '#A1A1A1' }} />
        <YAxis type="category" dataKey="name" width={120} fontSize={12} tickLine={false} stroke="#666666" tick={{ fill: '#A1A1A1' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend fontSize={12} wrapperStyle={{ color: '#A1A1A1' }} />
        <Bar dataKey="withComments" stackId="a" fill="#3B82F6" name="With Comments" radius={[0, 0, 0, 0]} />
        <Bar dataKey="withoutComments" stackId="a" fill="#1E3A5F" name="Without Comments" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
```

**Step 2: Restyle the map component**

In `app/components/response-map.tsx`, update colors:

Change the `getColor` function:
```tsx
  function getColor(geoName: string): string {
    const count = countryData.get(geoName) || 0
    if (count === 0) return '#1A1A1A'
    const intensity = Math.max(0.3, count / maxCount)
    return `rgba(59, 130, 246, ${intensity})`
  }
```

Update the `Geography` component's `stroke` and hover styles:
- `stroke="#262626"`
- hover fill for no-responses: `#262626` (instead of `#e5e7eb`)

Update the tooltip div classes:
```tsx
      {tooltip && (
        <div className="absolute top-2 right-2 bg-[#1A1A1A] border border-[#262626] rounded-lg shadow-sm px-3 py-2 text-sm pointer-events-none">
          <p className="font-medium text-[#EDEDED]">{tooltip.name}</p>
          <p className="text-[#A1A1A1]">{tooltip.count} {tooltip.count === 1 ? 'response' : 'responses'}</p>
        </div>
      )}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```
feat: restyle chart and map components with dark theme
```

---

### Task 10: Responses page

**Files:**
- Modify: `app/surveys/[id]/responses/page.tsx`

**Step 1: Restyle the responses page**

Keep all existing logic (lines 1-267 — everything above the first `if (loading)` check). Replace the entire render output starting from `if (loading)`:

**Loading state:**
```tsx
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <p className="text-[#A1A1A1]">Loading responses...</p>
      </div>
    )
  }
```

**Error state:**
```tsx
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="max-w-md w-full px-6">
          <div className="bg-[#141414] border border-[#262626] rounded-lg p-8">
            <h1 className="text-xl font-semibold mb-4 text-[#EF4444]">Error</h1>
            <p className="text-[#A1A1A1] mb-4">{error}</p>
            <a
              href="/dashboard"
              className="inline-block px-4 py-2 bg-[#3B82F6] text-white text-sm rounded-md hover:bg-[#2563EB] transition-colors"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }
```

**Main return — apply these class replacements throughout the existing JSX structure (do NOT change any logic, just swap Tailwind classes):**

- Outer: `bg-gray-50` → `bg-[#0A0A0A]`
- Page headings: `font-bold` → `font-semibold text-[#EDEDED]`
- Header action buttons: `bg-gray-100 text-gray-700 hover:bg-gray-200` → `bg-[#1A1A1A] text-[#A1A1A1] border border-[#262626] hover:text-[#EDEDED] hover:border-[#333]`
- Delete survey button: `text-red-600 hover:text-red-800 hover:bg-red-50` → `text-[#EF4444] hover:text-[#DC2626] hover:bg-[#EF4444]/10`
- Stats cards: `bg-white rounded-lg shadow-sm` → `bg-[#141414] border border-[#262626] rounded-lg`
- Stats text: `text-gray-600` → `text-[#A1A1A1]`, `text-gray-900` → `text-[#EDEDED]`, `text-gray-500` → `text-[#666666]`, `text-gray-400` → `text-[#666666]`
- Visualization cards: same as stats cards
- Chart/map header text: `text-gray-600` → `text-[#A1A1A1]`
- Save PNG buttons: `text-gray-400 hover:text-gray-600` → `text-[#666666] hover:text-[#A1A1A1]`
- Location breakdown cards: same as stats cards
- Location text: `text-gray-900` → `text-[#EDEDED]`, `text-gray-500` → `text-[#666666]`
- Filter input: `border-gray-300 focus:ring-blue-500` → `bg-[#1A1A1A] border-[#262626] text-[#EDEDED] placeholder-[#666666] focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6]`
- Checkbox labels: `text-gray-700` → `text-[#A1A1A1]`
- Checkboxes: `border-gray-300 text-blue-600 focus:ring-blue-500` → `border-[#333333] bg-[#1A1A1A] text-[#3B82F6] focus:ring-[#3B82F6]`
- Export CSV button: `bg-green-600 hover:bg-green-700` → `bg-[#3B82F6] hover:bg-[#2563EB]`
- Empty state: `bg-white rounded-lg shadow` → `bg-[#141414] border border-[#262626] rounded-lg`, `text-gray-700` → `text-[#A1A1A1]`
- Mobile cards: `bg-white rounded-lg shadow-sm` → `bg-[#141414] border border-[#262626] rounded-lg`
- Mobile card text: `text-gray-900` → `text-[#EDEDED]`, `text-gray-500` → `text-[#666666]`, `text-gray-400` → `text-[#666666]`
- Delete buttons: `text-red-600` → `text-[#EF4444]`
- Copy buttons: `text-gray-400 hover:text-gray-600` → `text-[#666666] hover:text-[#A1A1A1]`
- Desktop table: `bg-white shadow-md` → `bg-[#141414] border border-[#262626]`
- Table head: `bg-gray-50` → remove (already on dark surface), header text: `text-gray-600` → `text-[#666666]`
- Table rows: `divide-gray-200` → `divide-[#262626]`, `hover:bg-gray-50` → `hover:bg-[#1A1A1A]`
- Table cell text: keep same mapping as above
- Delete emoji button hover: `hover:text-red-900` → `hover:text-[#DC2626]`

Also update the `downloadPng` call to use dark background: change `backgroundColor: '#ffffff'` → `backgroundColor: '#141414'`

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat: restyle responses dashboard with dark theme
```

---

### Task 11: Public survey form (stays light)

**Files:**
- Modify: `app/s/[surveyId]/page.tsx`

**Step 1: Restyle the public survey form**

This page stays light-themed. Keep all existing logic. Only update the JSX to add consistent styling and Backtalk branding at the bottom. Key changes:

- Keep white/light backgrounds
- Update the blue accent to match brand `#3B82F6`
- Add a subtle "Powered by Backtalk" footer
- Ensure consistent card styling

Replace the main form return (the last return block, starting with `const displayAnswer`):

```tsx
  const displayAnswer = formatAnswerValue(answerValue)

  return (
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center bg-white pt-8 sm:pt-0 sm:py-12 px-4">
      <div className="max-w-2xl w-full">

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Tell me about your answer: {displayAnswer}
              </label>
              <textarea
                value={freeResponse}
                onChange={(e) => setFreeResponse(e.target.value)}
                rows={6}
                placeholder="Share your thoughts here... (optional)"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent resize-y text-gray-900"
              />
              <p className="mt-2 text-sm text-gray-500">Your initial response has been recorded. You can optionally provide more details above.</p>
            </div>

            {survey.require_name && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-gray-900"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-[#3B82F6] text-white font-medium rounded-lg hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Updating...' : 'Add More Details'}
            </button>
          </form>
      </div>

      <div className="mt-12 mb-6">
        <span className="text-xs text-gray-400">Powered by Backtalk</span>
      </div>
    </div>
  )
```

Also update loading, error, closed, and success states to use "Backtalk" branding colors:
- Loading: Keep `bg-white`, change `text-slate-700` → `text-gray-500`
- Error card: Keep light theme, change `text-red-600` → `text-[#EF4444]`
- Survey closed card: Keep light theme
- Success: Keep light theme, add Backtalk footer

For the success state, add the same footer after the closing card div:
```tsx
      <div className="mt-12 mb-6">
        <span className="text-xs text-gray-400">Powered by Backtalk</span>
      </div>
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat: polish public survey form with Backtalk branding
```

---

### Task 12: Settings pages

**Files:**
- Modify: `app/settings/account/page.tsx`
- Modify: `app/settings/team/page.tsx`

**Step 1: Restyle account settings**

Keep all existing logic. Replace only the return JSX:

```tsx
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Nav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-[#EDEDED]">Account Settings</h2>

        <div className="bg-[#141414] border border-[#262626] rounded-lg p-6">
          <h3 className="text-base font-semibold mb-4 text-[#EDEDED]">Update Password</h3>

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-[#A1A1A1] mb-1">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-md px-3 py-2 text-sm text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-[#A1A1A1] mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-md px-3 py-2 text-sm text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === 'success'
                    ? 'bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]'
                    : 'bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#3B82F6] text-white text-sm rounded-md hover:bg-[#2563EB] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
```

**Step 2: Restyle team settings**

Keep all existing logic. Replace only the return JSX:

```tsx
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Nav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-[#EDEDED]">Team Settings</h2>

        {loading && (
          <div className="text-center py-12">
            <p className="text-[#A1A1A1]">Loading...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md mb-6">
            {error}
          </div>
        )}

        {!loading && !error && org && (
          <>
            {/* Organization Name */}
            <div className="bg-[#141414] border border-[#262626] rounded-lg p-6 mb-6">
              <h3 className="text-base font-semibold mb-3 text-[#EDEDED]">Organization</h3>
              {editingName ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="flex-1 bg-[#1A1A1A] border border-[#262626] rounded-md px-3 py-2 text-sm text-[#EDEDED] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
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
                    className="px-3 py-2 bg-[#3B82F6] text-white text-sm rounded-md hover:bg-[#2563EB] transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setOrgName(org.name)
                      setEditingName(false)
                    }}
                    className="px-3 py-2 text-[#A1A1A1] text-sm hover:text-[#EDEDED] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-[#EDEDED]">{org.name}</span>
                  {isOwner && (
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-sm text-[#3B82F6] hover:text-[#2563EB] transition-colors"
                    >
                      Rename
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Members */}
            <div className="bg-[#141414] border border-[#262626] rounded-lg p-6 mb-6">
              <h3 className="text-base font-semibold mb-3 text-[#EDEDED]">
                Members ({members.length})
              </h3>
              <div className="divide-y divide-[#262626]">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <span className="text-sm text-[#EDEDED]">
                        {member.email}
                      </span>
                      <span className="ml-2 text-xs text-[#666666] capitalize">
                        {member.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-[#666666]">
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
              <div className="bg-[#141414] border border-[#262626] rounded-lg p-6 mb-6">
                <h3 className="text-base font-semibold mb-3 text-[#EDEDED]">
                  Pending Invites ({invites.length})
                </h3>
                <div className="divide-y divide-[#262626]">
                  {invites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <span className="text-sm text-[#EDEDED]">
                          {invite.email}
                        </span>
                        <span className="ml-2 text-xs text-[#EAB308] bg-[#EAB308]/10 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-[#666666]">
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
              <div className="bg-[#141414] border border-[#262626] rounded-lg p-6">
                <h3 className="text-base font-semibold mb-3 text-[#EDEDED]">Invite Member</h3>
                <form onSubmit={handleInvite} className="flex items-center gap-3">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="flex-1 bg-[#1A1A1A] border border-[#262626] rounded-md px-3 py-2 text-sm text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    disabled={inviting}
                    className="px-4 py-2 bg-[#3B82F6] text-white text-sm rounded-md hover:bg-[#2563EB] disabled:opacity-50 transition-colors"
                  >
                    {inviting ? 'Inviting...' : 'Invite'}
                  </button>
                </form>
                {inviteMessage && (
                  <p className="mt-3 text-sm text-[#A1A1A1]">{inviteMessage}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```
feat: restyle settings pages with dark theme
```

---

### Task 13: Final build verification

**Step 1: Full build**

Run: `npm run build`
Expected: Build succeeds with zero errors.

**Step 2: Lint**

Run: `npm run lint`
Expected: No lint errors.

**Step 3: Visual spot-check**

Run: `npm run dev`
Manually verify in browser:
- Homepage loads with dark theme and Backtalk branding
- Login/signup pages show dark cards
- Dashboard shows dark table/cards
- Responses page shows dark charts and tables
- Public survey form at `/s/[id]` stays light
- Settings pages show dark forms
- Nav shows "Backtalk" in all authenticated pages

**Step 4: Final commit (if any fixes needed)**

```
fix: address any remaining styling issues from UI redesign
```
