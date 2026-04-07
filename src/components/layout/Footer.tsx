import Link from 'next/link'
import Image from 'next/image'
import { SITE_NAME } from '@/lib/constants'
import type { SiteSettings } from '@/types/sanity'

export function Footer({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="relative z-10 border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Image
                src="/images/icon.svg"
                alt=""
                width={28}
                height={28}
                className="dark:brightness-150"
              />
              <h3 className="font-bold">{settings?.title || SITE_NAME}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {settings?.description || 'Tech news, buyer guides, and trend analysis delivered daily.'}
            </p>
          </div>

          {/* Content */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase text-gray-500">Content</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/digest" className="text-gray-600 hover:text-foreground dark:text-gray-400">Daily Brief Archive</Link></li>
              <li><Link href="/trend-radar" className="text-gray-600 hover:text-foreground dark:text-gray-400">Trend Radar</Link></li>
              <li><Link href="/threat-map" className="text-gray-600 hover:text-foreground dark:text-gray-400">Cyber Threat Map</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase text-gray-500">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-foreground dark:text-gray-400">About</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-600 hover:text-foreground dark:text-gray-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-foreground dark:text-gray-400">Terms</Link></li>
              <li><Link href="/affiliate-disclosure" className="text-gray-600 hover:text-foreground dark:text-gray-400">Affiliate Disclosure</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase text-gray-500">Connect</h4>
            <div className="flex flex-wrap gap-3">
              {settings?.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-foreground dark:text-gray-400">Twitter</a>
              )}
              {settings?.socialLinks?.github && (
                <a href={settings.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-foreground dark:text-gray-400">GitHub</a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-foreground dark:text-gray-400">LinkedIn</a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-500 dark:border-gray-800">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
