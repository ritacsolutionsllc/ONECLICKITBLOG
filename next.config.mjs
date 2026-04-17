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
  async redirects() {
    return [
      // Redirect old domain to new canonical domain (preserves SEO)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'oneclickit.today' }],
        destination: 'https://oneclickittoday.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.oneclickit.today' }],
        destination: 'https://oneclickittoday.com/:path*',
        permanent: true,
      },
      // Force www → apex on new domain
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.oneclickittoday.com' }],
        destination: 'https://oneclickittoday.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
