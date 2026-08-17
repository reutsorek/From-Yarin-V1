import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { imageHosts } from './src/config/imageHosts.mjs'
import { fetchRedirects } from './src/sanity/lib/fetchRedirects'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: imageHosts.map((hostname: string) => ({
      protocol: 'https' as const,
      hostname,
    })),
  },
  redirects: fetchRedirects,
  logging: {
    fetches: { fullUrl: process.env.NODE_ENV === 'development' },
  },
}

export default withNextIntl(nextConfig)
