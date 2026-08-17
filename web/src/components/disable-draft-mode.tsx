'use client'

import { useVisualEditingEnvironment } from 'next-sanity/hooks'

export function DisableDraftMode() {
  const environment = useVisualEditingEnvironment()

  // Inside the Presentation tool the Studio owns the toggle, so the button would
  // only get in the way.
  if (environment !== 'standalone') return null

  return (
    // A route handler needs a full navigation, so next/link is wrong here.
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      href="/api/draft-mode/disable"
      className="bg-foreground text-background fixed end-4 bottom-4 z-50 rounded-full px-4 py-2 text-sm shadow-lg"
    >
      Disable draft mode
    </a>
  )
}
