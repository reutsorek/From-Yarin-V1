import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}', 'src/**/__tests__/**/*.test.{ts,tsx}'],
    // Unit tests must run without a real project, so the Sanity env module resolves to dummies.
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: 'test',
      NEXT_PUBLIC_SANITY_DATASET: 'test',
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
    },
  },
})
