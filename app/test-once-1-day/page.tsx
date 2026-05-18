import TestLanding from '@/app/components/test-landing'

export const metadata = {
  title: 'Once per day (test env) — AWeber form test',
  description: 'Test-environment landing page for AWeber forms set to appear at most once per day.',
}

export default function TestOnceOneDayPage() {
  return <TestLanding slug="once-1-day" env="test" />
}
