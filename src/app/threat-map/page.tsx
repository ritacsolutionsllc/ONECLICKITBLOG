import type { Metadata } from 'next'
import { ThreatMapClient } from '@/components/threat-map/ThreatMapClient'

export const metadata: Metadata = {
  title: 'Cyber Threat Map',
  description: 'Live interactive map of global cyber threats, attack patterns, and security incidents.',
  alternates: { canonical: '/threat-map' },
  openGraph: {
    title: 'Cyber Threat Map | OneClickIT',
    description: 'Live interactive map of global cyber threats, attack patterns, and security incidents.',
  },
}

export default function ThreatMapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Cyber Threat Map</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Live global view of cyber attacks, vulnerabilities, and threat intelligence.
        </p>
      </header>
      <ThreatMapClient />
    </div>
  )
}
