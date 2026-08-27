'use client'

import * as React from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
        },
      ) => string
      reset: (widgetId?: string) => void
    }
  }
}

export interface TurnstileWidgetProps {
  siteKey: string
  onToken: (token: string | null) => void
  className?: string
}

/**
 * Renders the Cloudflare Turnstile challenge and reports the verification token up to the
 * form. The token is verified again server-side before any submission is accepted.
 */
export function TurnstileWidget({ siteKey, onToken, className }: TurnstileWidgetProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const widgetIdRef = React.useRef<string | undefined>(undefined)
  const [scriptReady, setScriptReady] = React.useState(false)

  React.useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.turnstile) return

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token) => onToken(token),
      'expired-callback': () => onToken(null),
      'error-callback': () => onToken(null),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- render once per mount, callback identity is not a re-render trigger
  }, [scriptReady, siteKey])

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} className={className} />
    </>
  )
}
