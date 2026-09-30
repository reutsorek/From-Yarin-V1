'use client'

import * as React from 'react'

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

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

let turnstileLoadPromise: Promise<void> | null = null

/**
 * Loads the Turnstile script at most once, even when several widgets mount at the same time.
 * `next/script`'s own dedup cache marks a shared src as loaded as soon as a second instance
 * mounts, before it has actually finished loading, so a second widget's onReady never fires.
 */
function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.turnstile) return Promise.resolve()

  if (!turnstileLoadPromise) {
    turnstileLoadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`)
      if (existing) {
        existing.addEventListener('load', () => resolve())
        existing.addEventListener('error', reject)
        return
      }

      const script = document.createElement('script')
      script.src = TURNSTILE_SRC
      script.async = true
      script.defer = true
      script.addEventListener('load', () => resolve())
      script.addEventListener('error', reject)
      document.body.appendChild(script)
    })
  }

  return turnstileLoadPromise
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

  React.useEffect(() => {
    let cancelled = false

    loadTurnstileScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => onToken(token),
        'expired-callback': () => onToken(null),
        'error-callback': () => onToken(null),
      })
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- render once per mount, callback identity is not a re-render trigger
  }, [siteKey])

  return <div ref={containerRef} className={className} />
}
