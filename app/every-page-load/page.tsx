import TestLanding from '@/app/components/test-landing'

export const metadata = {
  title: 'Every page load — AWeber form test',
  description: 'Landing page for testing AWeber forms set to appear on every page load.',
}

export default function EveryPageLoadPage() {
  return <TestLanding slug="every-page-load" />
}
