'use client'

import { defaultLocale, DIRECTIONS } from '@/i18n/routing'

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang={defaultLocale} dir={DIRECTIONS[defaultLocale]}>
      <body className="flex min-h-screen items-center justify-center">
        <main className="px-6 text-center">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <button onClick={reset} className="mt-6 underline">
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
