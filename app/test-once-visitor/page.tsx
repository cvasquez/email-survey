import TestLanding from '@/app/components/test-landing'

export const metadata = {
  title: 'Once per visitor (test env) — AWeber form test',
  description: 'Test-environment landing page for AWeber forms set to appear once ever per visitor.',
  robots: { index: false, follow: false },
}

export default function TestOnceVisitorPage() {
  return <TestLanding slug="once-visitor" env="test" />
}
