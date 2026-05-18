import TestLanding from '@/app/components/test-landing'

export const metadata = {
  title: 'Once per day — AWeber form test',
  description: 'Landing page for testing AWeber forms set to appear at most once per day.',
  robots: { index: false, follow: false },
}

export default function OnceOneDayPage() {
  return <TestLanding slug="once-1-day" />
}
