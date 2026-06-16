import type { Category } from '@/types/content';

export const CATEGORIES: Category[] = [
  {
    id: 'company-news',
    slug: 'company-news',
    name: 'Company News',
    description: 'Updates from inside OneClickIT — releases, hires, and milestones.',
  },
  {
    id: 'ai-automation',
    slug: 'ai-automation',
    name: 'AI & Automation',
    description: 'Practical AI for SMBs: workflows, agents, and ROI.',
  },
  {
    id: 'managed-it',
    slug: 'managed-it',
    name: 'Managed IT',
    description: 'Operational guides, monitoring, and infrastructure playbooks.',
  },
  {
    id: 'cybersecurity',
    slug: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Threat intel, hardening checklists, and incident response.',
  },
  {
    id: 'local-business',
    slug: 'local-business-tech',
    name: 'Local Business Tech',
    description: 'Technology decisions for businesses serving real communities.',
  },
  {
    id: 'product-updates',
    slug: 'product-updates',
    name: 'Product Updates',
    description: 'What shipped, what changed, what is coming next.',
  },
  {
    id: 'partner-spotlights',
    slug: 'partner-spotlights',
    name: 'Partner Spotlights',
    description: 'Deep dives on the projects and partners we ship with.',
  },
  {
    id: 'case-studies',
    slug: 'case-studies',
    name: 'Case Studies',
    description: 'Customer outcomes — what we built and what changed.',
  },
];

export const HOMEPAGE_TOPIC_BLOCKS = [
  'ai-automation',
  'cybersecurity',
  'managed-it',
  'case-studies',
] as const;
