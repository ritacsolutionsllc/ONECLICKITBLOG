/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Canonical domain is oneclickit.today — redirect alternate domain
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'oneclickittoday.com' }],
        destination: 'https://oneclickit.today/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.oneclickittoday.com' }],
        destination: 'https://oneclickit.today/:path*',
        permanent: true,
      },
      // Force www → apex on canonical domain
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.oneclickit.today' }],
        destination: 'https://oneclickit.today/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
