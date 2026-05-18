'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

const PROD_SRC =
  'https://clickpop.optin.com/content.js?account=cafe8afa-5d70-4100-a8c8-feb3d8115a49'
const TEST_SRC =
  'https://cdn.optintest.com/content.js?account=8c3f3496-5006-4148-ab84-37066775e2df'

export default function PopupScript() {
  const pathname = usePathname()
  const isTest = pathname?.startsWith('/test-') ?? false
  const src = isTest ? TEST_SRC : PROD_SRC

  return <Script key={src} src={src} strategy="afterInteractive" />
}
