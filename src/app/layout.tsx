import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ConsentBanner } from '@/components/layout/ConsentBanner'
import { Watermark } from '@/components/layout/Watermark'
import { sanityFetch } from '@/sanity/fetch'
import { allCategoriesQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import type { Category, SiteSettings } from '@/types/sanity'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Tech news, buyer guides, and trend analysis delivered daily.',
  icons: {
    icon: '/images/icon.svg',
    apple: '/images/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: 'Tech news, buyer guides, and trend analysis delivered daily.',
    images: [{ url: '/images/logo.svg', width: 520, height: 60 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [categories, settings] = await Promise.all([
    sanityFetch<Category[]>({ query: allCategoriesQuery, tags: ['category'] }),
    sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: ['siteSettings'] }),
  ])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-accent focus:px-4 focus:py-2 focus:text-white">
            Skip to content
          </a>
          <Watermark />
          <Header categories={categories || []} />
          <main id="main-content" className="relative z-10 min-h-screen">{children}</main>
          <Footer settings={settings} />
          <ConsentBanner />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
