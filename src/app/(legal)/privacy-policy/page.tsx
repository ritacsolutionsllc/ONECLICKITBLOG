import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: April 2026</p>
      <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-400">
        <p>
          {SITE_NAME} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the
          oneclickit.today website. This page informs you of our policies regarding the
          collection, use, and disclosure of personal data when you use our site.
        </p>
        <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
        <p>
          We may collect information you provide directly, such as your email address
          when subscribing to our newsletter. We also use analytics and advertising
          services that may collect usage data automatically.
        </p>
        <h2 className="text-xl font-semibold text-foreground">Cookies and Tracking</h2>
        <p>
          We use cookies for analytics (e.g., Google Analytics) and advertising
          (e.g., Google AdSense). You can control cookie preferences through your
          browser settings.
        </p>
        <h2 className="text-xl font-semibold text-foreground">Third-Party Services</h2>
        <p>
          Our site may contain links to third-party websites and services. We are not
          responsible for their privacy practices.
        </p>
        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p>
          If you have questions about this privacy policy, please contact us through
          our website.
        </p>
      </div>
    </div>
  )
}
