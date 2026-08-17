import { defaultLocale, DIRECTIONS } from '@/i18n/routing'
import './globals.css'

/**
 * Reached only for URLs the locale middleware could not match, so there is no
 * request locale to read. It renders its own shell because the root layout has none.
 */
export default function RootNotFound() {
  return (
    <html lang={defaultLocale} dir={DIRECTIONS[defaultLocale]}>
      <body className="bg-background text-foreground flex min-h-screen items-center justify-center">
        <main className="px-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">404</h1>
          <p className="text-muted-foreground mt-3">This page does not exist.</p>
          <a href={`/${defaultLocale}`} className="text-primary-ink mt-6 inline-block underline">
            Back to home
          </a>
        </main>
      </body>
    </html>
  )
}
