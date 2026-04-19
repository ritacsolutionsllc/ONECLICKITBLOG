import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms of Service',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: April 2026</p>
      <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-400">
        <p>
          By accessing {SITE_NAME} (oneclickit.today), you agree to be bound by these
          terms of service.
        </p>
        <h2 className="text-xl font-semibold text-foreground">Use of Content</h2>
        <p>
          All content on this site is for informational purposes only. You may not
          reproduce, distribute, or create derivative works without our written consent.
        </p>
        <h2 className="text-xl font-semibold text-foreground">Disclaimer</h2>
        <p>
          Content is provided &quot;as is&quot; without warranties of any kind. We do
          not guarantee the accuracy, completeness, or usefulness of any information
          on this site.
        </p>
        <h2 className="text-xl font-semibold text-foreground">Limitation of Liability</h2>
        <p>
          {SITE_NAME} shall not be liable for any damages arising from the use of
          this site or any linked third-party content.
        </p>
      </div>
    </div>
  )
}
