import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

interface BuildMetadataInput {
  title?: string;
  description?: string;
  /** Path with leading slash, e.g. "/news/foo". */
  path?: string;
  image?: string | null;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noindex?: boolean;
}

export function buildMetadata(input: BuildMetadataInput = {}): Metadata {
  const title = input.title
    ? `${input.title} | ${siteConfig.name}`
    : `${siteConfig.name} — Newsroom & Field Reports`;
  const description = input.description ?? siteConfig.description;
  const url = input.path ? `${siteConfig.url}${input.path}` : siteConfig.url;
  const image = input.image ?? siteConfig.defaultOgImage;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    robots: input.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: input.type ?? 'website',
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
      authors: input.authors,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
      site: siteConfig.twitter,
    },
  };
}
