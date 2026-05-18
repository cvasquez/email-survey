import TestLanding from '@/app/components/test-landing'

export const metadata = {
  title: 'Once per session — AWeber form test',
  description: 'Landing page for testing AWeber forms set to appear once per session.',
  robots: { index: false, follow: false },
}

export default function OnceSessionPage() {
  return <TestLanding slug="once-session" />
}
