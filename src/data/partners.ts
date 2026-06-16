import type { Partner } from '@/types/partners';

export const partners: Partner[] = [
  {
    slug: 'oneclickit-today',
    name: 'OneClickIT Today',
    url: 'https://oneclickit.today',
    shortDescription:
      'Editorial newsroom and field reports for managed IT, cybersecurity, and AI automation.',
    status: 'internal-product',
    services: ['web-platforms', 'ai-automation'],
    industry: 'Media / B2B Tech',
    logo: '/partners/oneclickit.svg',
    featured: true,
    relatedPostSlugs: ['launching-the-newsroom'],
    cta: { label: 'Read the newsroom', href: '/news' },
    startedAt: '2025-01',
  },
  {
    slug: 'ocit-security',
    name: 'OCIT Security',
    url: 'https://ocitsecurity.com',
    shortDescription:
      'Threat-aware security operations for SMBs — monitoring, response, and hardening.',
    status: 'internal-product',
    services: ['cybersecurity', 'managed-it'],
    industry: 'Cybersecurity',
    logo: '/partners/ocit-security.svg',
    featured: true,
    cta: { label: 'See services', href: 'https://ocitsecurity.com' },
    startedAt: '2024-08',
  },
  {
    slug: 'threat-map',
    name: 'Live Threat Map',
    shortDescription:
      'Real-time visualization of global attack telemetry, tuned for SMB-relevant signal.',
    status: 'active',
    services: ['cybersecurity', 'data-analytics'],
    industry: 'Cybersecurity',
    logo: '/partners/threat-map.svg',
    cta: { label: 'Open the map', href: '/threat-map' },
    startedAt: '2025-03',
  },
  {
    slug: 'trend-radar',
    name: 'Trend Radar',
    shortDescription:
      'Weekly AI/IT signal scan — what is breaking out, what is fading.',
    status: 'active',
    services: ['ai-automation', 'data-analytics'],
    industry: 'Research',
    logo: '/partners/trend-radar.svg',
    cta: { label: 'View radar', href: '/trend-radar' },
    startedAt: '2025-04',
  },
  {
    slug: 'ritac-solutions',
    name: 'Ritac Solutions LLC',
    shortDescription:
      'Parent consultancy delivering managed IT and custom platform engineering.',
    status: 'strategic-partner',
    services: ['managed-it', 'cloud-infrastructure'],
    industry: 'Professional Services',
    logo: '/partners/ritac.svg',
  },
];
