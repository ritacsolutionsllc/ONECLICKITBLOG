import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Disclosure Policy | OneClickIT News',
  description: 'Our publisher disclosure and editorial independence policy, in compliance with FTC guidelines.',
  alternates: { canonical: '/disclosure' },
}

export default function DisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">
        Disclosure Policy
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
        Last updated: May 2026 · In compliance with FTC 16 CFR Part 255
      </p>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Publisher Relationship</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            OneClickIT News is a publication owned and operated by <strong>RITAC Solutions</strong>.
            RITAC Solutions also develops and sells the following software products:
          </p>
          <ul className="mt-3 space-y-1.5 text-gray-700 dark:text-gray-300">
            {[
              { name: 'ModelBench', url: 'https://plushyaibench.com' },
              { name: 'AI Cost Auditor', url: 'https://aicostauditor.com' },
              { name: 'Data Breach Watch', url: 'https://data-breach-watch-4a131d90.base44.app' },
              { name: 'OneClickSurplusFunds', url: 'https://oneclicksurplusfunds.com' },
              { name: 'SettlementClaim', url: 'https://oneclickclassyclaims.com' },
              { name: 'iPawOS', url: 'https://ipawos.com' },
              { name: 'Wingman AI', url: 'https://yourdatingwingman-6a166e9e.base44.app' },
              { name: 'GOT IT LEADS', url: 'https://got-it-leads-6a1275ca.base44.app' },
              { name: 'LeadGeneAI', url: 'https://lead-gene-ai-copy-87c32cc5.base44.app' },
              { name: 'OneClickitLeads', url: 'https://oneclickit.info' },
            ].map((p) => (
              <li key={p.name}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">What This Means for You</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Some articles on OneClickIT News include a <strong>"Tools Worth Knowing"</strong> section
            or contextual callouts that reference RITAC Solutions products. These are clearly labeled
            as <em>"Publisher products"</em> and represent our honest assessment of tools that are
            relevant to the article topic.
          </p>
          <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            These mentions are <strong>not paid advertisements</strong>. No third party pays for placement.
            Products are matched to articles editorially based on relevance — a security article will
            reference Data Breach Watch; an AI cost article will reference AI Cost Auditor — because
            we believe they provide genuine value to readers interested in that topic.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Editorial Independence</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Our news coverage, analysis, and editorial opinions are independent of any commercial
            relationships. RITAC Solutions products are never promoted in our editorial content in
            a way that compromises factual accuracy or journalistic standards. We cover competitor
            products and industry news without bias.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Third-Party Links</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            When we link to third-party sources, products, or services outside the RITAC Solutions
            ecosystem, those links carry no commercial relationship unless explicitly stated. We do
            not currently run affiliate programs or earn referral commissions on third-party links.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">AI-Generated Content</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Some articles on OneClickIT News are drafted with AI assistance and reviewed editorially
            before publication. AI-assisted articles are sourced from real news events and verified
            against primary sources. We strive for factual accuracy, but recommend verifying
            time-sensitive claims against the linked original sources.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Contact</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Questions about our disclosure policy or editorial standards can be directed to RITAC Solutions
            via the contact information on our product pages.
          </p>
        </section>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to OneClickIT News
          </Link>
        </div>
      </div>
    </div>
  )
}
