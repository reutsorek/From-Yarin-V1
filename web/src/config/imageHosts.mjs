/**
 * One allowlist read by both next.config.ts and app code, so the two cannot drift.
 */
export const imageHosts = ['cdn.sanity.io']

export const remotePatterns = imageHosts.map((hostname) => ({
  protocol: 'https',
  hostname,
}))
