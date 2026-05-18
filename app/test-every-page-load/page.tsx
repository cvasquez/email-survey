import TestLanding from '@/app/components/test-landing'

export const metadata = {
  title: 'Every page load (test env) — AWeber form test',
  description: 'Test-environment landing page for AWeber forms set to appear on every page load.',
}

export default function TestEveryPageLoadPage() {
  return <TestLanding slug="every-page-load" env="test" />
}
