import TestLanding from '@/app/components/test-landing'

export const metadata = {
  title: 'Once per session (test env) — AWeber form test',
  description: 'Test-environment landing page for AWeber forms set to appear once per session.',
}

export default function TestOnceSessionPage() {
  return <TestLanding slug="once-session" env="test" />
}
