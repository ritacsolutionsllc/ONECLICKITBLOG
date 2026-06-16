import { siteConfig } from '@/config/site';
import type { Post } from '@/types/content';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.organization.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.organization.logo}`,
    sameAs: [siteConfig.social.linkedin, siteConfig.social.twitter].filter(Boolean),
  };
}

export function articleSchema(post: Post, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image ? [post.image] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: [{ '@type': 'Person', name: post.author.name }],
    publisher: {
      '@type': 'Organization',
      name: siteConfig.organization.legalName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${siteConfig.organization.logo}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}${path}`,
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
