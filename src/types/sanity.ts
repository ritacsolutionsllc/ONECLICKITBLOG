import type { PortableTextBlock } from '@portabletext/types'

// ── Image ────────────────────────────────────────────────
export interface SanityImage {
  asset: {
    _id: string
    url: string
    metadata?: {
      dimensions?: { width: number; height: number }
      lqip?: string
    }
  }
  alt?: string
}

// ── SEO ──────────────────────────────────────────────────
export interface SeoFields {
  metaTitle?: string
  metaDescription?: string
  ogImageUrl?: string
  canonicalUrl?: string
  noIndex?: boolean
}

// ── Author ───────────────────────────────────────────────
export interface Author {
  name: string
  slug: string
  imageUrl?: string
  bio?: string
}

// ── Category ─────────────────────────────────────────────
export interface Category {
  _id: string
  title: string
  slug: string
  description?: string
  icon?: string
}

// ── Post ─────────────────────────────────────────────────
export interface Post {
  _id: string
  _type?: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  mainImage?: SanityImage
  categories?: Category[]
  author?: Author
  body?: PortableTextBlock[]
  featured?: boolean
  status?: 'draft' | 'review' | 'published'
  aiGenerated?: boolean
  seo?: SeoFields
  related?: Post[]
}

// ── Digest ───────────────────────────────────────────────
export interface DigestItem {
  headline: string
  sourceUrl?: string
  source?: { name: string; slug: string }
  summary?: string
  aiTake?: string
  image?: SanityImage
}

export interface Digest {
  _id: string
  title: string
  slug: string
  summary?: string
  publishedAt?: string
  status?: string
  items?: DigestItem[]
  seo?: SeoFields
}

// ── Buyer Guide ──────────────────────────────────────────
export interface Product {
  name: string
  image?: SanityImage
  affiliateUrl?: string
  price?: string
  rating?: number
  pros?: string[]
  cons?: string[]
  verdict?: string
  badge?: string
}

export interface BuyerGuide {
  _id: string
  title: string
  slug: string
  publishedAt?: string
  mainImage?: SanityImage
  author?: Author
  categories?: Category[]
  intro?: PortableTextBlock[]
  products?: Product[]
  verdict?: PortableTextBlock[]
  featured?: boolean
  seo?: SeoFields
}

// ── Trend Radar ──────────────────────────────────────────
export interface TrendItem {
  title: string
  description?: string
  momentum?: 'rising' | 'stable' | 'declining'
  score?: number
  category?: { title: string; slug: string }
  relatedPosts?: { _id: string; _type: string; title: string; slug: string }[]
}

export interface TrendRadar {
  _id: string
  title: string
  slug: string
  description?: string
  publishedAt?: string
  trends?: TrendItem[]
  seo?: SeoFields
}

// ── Site Settings ────────────────────────────────────────
export interface SiteSettings {
  title?: string
  description?: string
  logoUrl?: string
  ogImageUrl?: string
  adsenseId?: string
  enableAds?: boolean
  enableAffiliate?: boolean
  newsletterEndpoint?: string
  socialLinks?: {
    twitter?: string
    github?: string
    linkedin?: string
  }
}

// ── Homepage ─────────────────────────────────────────────
export interface HomepageData {
  featured: Post[]
  latestPosts: Post[]
  latestDigest: {
    _id: string
    title: string
    slug: string
    summary?: string
    publishedAt?: string
    itemCount: number
  } | null
  guides: (Post & { productCount?: number })[]
}

// ── Category page ────────────────────────────────────────
export interface CategoryPageData {
  category: Category | null
  posts: Post[]
}

// ── Slug item for sitemaps ───────────────────────────────
export interface SlugItem {
  slug: string
  _updatedAt: string
}
