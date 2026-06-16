export type PartnerStatus =
  | 'active'
  | 'in-development'
  | 'client-project'
  | 'internal-product'
  | 'strategic-partner';

export type ServiceArea =
  | 'managed-it'
  | 'cybersecurity'
  | 'ai-automation'
  | 'web-platforms'
  | 'cloud-infrastructure'
  | 'data-analytics';

export interface Partner {
  slug: string;
  name: string;
  url?: string;
  shortDescription: string;
  longDescription?: string;
  status: PartnerStatus;
  services: ServiceArea[];
  industry: string;
  /** Path under /public, e.g. /partners/acme.svg */
  logo: string;
  cover?: string;
  cta?: { label: string; href: string };
  featured?: boolean;
  /** Slugs of related blog posts for cross-linking. */
  relatedPostSlugs?: string[];
  /** ISO YYYY-MM */
  startedAt?: string;
}
