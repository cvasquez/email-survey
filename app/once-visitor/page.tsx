import TestLanding from '@/app/components/test-landing'

export const metadata = {
  title: 'Once per visitor — AWeber form test',
  description: 'Landing page for testing AWeber forms set to appear once ever per visitor.',
}

export default function OnceVisitorPage() {
  return <TestLanding slug="once-visitor" />
}
