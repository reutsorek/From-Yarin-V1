import type { ReactNode } from 'react'
import './globals.css'

/**
 * The real html and body tags live in [locale]/layout.tsx, which is where the
 * locale and direction are known.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
