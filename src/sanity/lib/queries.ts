import { groq } from 'next-sanity'

// Shared fragments
const imageFields = `
  asset->{_id, url, metadata { dimensions, lqip }},
  alt
`

const seoFields = `
  seo {
    metaTitle,
    metaDescription,
    "ogImageUrl": ogImage.asset->url,
    canonicalUrl,
    noIndex
  }
`

const authorRef = `
  author->{
    name,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    bio
  }
`

const categoryRef = `
  categories[]->{
    title,
    "slug": slug.current
  }
`

// ── Homepage ──────────────────────────────────────────────
export const homepageQuery = groq`{
  "featured": *[_type in ["original_post", "buyer_guide"] && featured == true] | order(publishedAt desc)[0...3] {
    _id, _type, title, "slug": slug.current, excerpt, publishedAt,
    "mainImage": mainImage { ${imageFields} },
    ${categoryRef}
  },
  "latestPosts": *[_type == "original_post"] | order(publishedAt desc)[0...8] {
    _id, title, "slug": slug.current, excerpt, publishedAt,
    "mainImage": mainImage { ${imageFields} },
    ${categoryRef}
  },
  "latestDigest": *[_type == "news_digest" && status == "published"] | order(publishedAt desc)[0] {
    _id, title, "slug": slug.current, summary, publishedAt,
    "itemCount": count(items)
  },
  "guides": *[_type == "buyer_guide"] | order(publishedAt desc)[0...4] {
    _id, title, "slug": slug.current, publishedAt,
    "mainImage": mainImage { ${imageFields} },
    "productCount": count(products),
    ${categoryRef}
  }
}`

// ── Post by slug ──────────────────────────────────────────
export const postBySlugQuery = groq`*[_type == "original_post" && slug.current == $slug][0] {
  _id, title, "slug": slug.current, excerpt, publishedAt,
  "mainImage": mainImage { ${imageFields} },
  ${authorRef},
  ${categoryRef},
  body,
  ${seoFields},
  "related": *[_type == "original_post" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc)[0...3] {
    _id, title, "slug": slug.current, excerpt, publishedAt,
    "mainImage": mainImage { ${imageFields} }
  }
}`

// ── Buyer guide by slug ───────────────────────────────────
export const guideBySlugQuery = groq`*[_type == "buyer_guide" && slug.current == $slug][0] {
  _id, title, "slug": slug.current, publishedAt,
  "mainImage": mainImage { ${imageFields} },
  ${authorRef},
  ${categoryRef},
  intro,
  products,
  verdict,
  ${seoFields}
}`

// ── Digest by slug ────────────────────────────────────────
export const digestBySlugQuery = groq`*[_type == "news_digest" && slug.current == $slug && status == "published"][0] {
  _id, title, "slug": slug.current, summary, publishedAt, status,
  items[] {
    headline, sourceUrl, summary, aiTake,
    "image": image { ${imageFields} },
    source->{
      name, "slug": slug.current
    }
  },
  ${seoFields}
}`

// ── Category by slug ──────────────────────────────────────
export const categoryBySlugQuery = groq`{
  "category": *[_type == "category" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, description
  },
  "posts": *[_type in ["original_post", "buyer_guide"] && $slug in categories[]->slug.current] | order(publishedAt desc)[0...20] {
    _id, _type, title, "slug": slug.current, excerpt, publishedAt,
    "mainImage": mainImage { ${imageFields} },
    ${categoryRef}
  }
}`

// ── Trend Radar ───────────────────────────────────────────
export const trendRadarQuery = groq`*[_type == "trend_radar"] | order(publishedAt desc)[0] {
  _id, title, "slug": slug.current, description, publishedAt,
  trends[] {
    title, description, momentum,
    category->{ title, "slug": slug.current },
    relatedPosts[]->{
      _id, _type, title, "slug": slug.current
    }
  },
  ${seoFields}
}`

// ── Navigation & Settings ─────────────────────────────────
export const allCategoriesQuery = groq`*[_type == "category"] | order(title asc) {
  _id, title, "slug": slug.current, icon
}`

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  title, description,
  "logoUrl": logo.asset->url,
  "ogImageUrl": ogImage.asset->url,
  adsenseId, enableAds, enableAffiliate,
  newsletterEndpoint,
  socialLinks
}`

// ── Sources (for RSS ingestion) ──────────────────────────
export const activeSourcesQuery = groq`*[_type == "source" && active == true && type == "rss"] {
  _id, name, "slug": slug.current, url,
  category->{ _id }
}`

// ── Sitemap helpers ───────────────────────────────────────
export const allPostSlugsQuery = groq`*[_type == "original_post" && defined(slug.current)] {
  "slug": slug.current, _updatedAt
}`

export const allGuideSlugsQuery = groq`*[_type == "buyer_guide" && defined(slug.current)] {
  "slug": slug.current, _updatedAt
}`

export const allDigestSlugsQuery = groq`*[_type == "news_digest" && defined(slug.current) && status == "published"] {
  "slug": slug.current, _updatedAt
}`

export const allCategorySlugsQuery = groq`*[_type == "category" && defined(slug.current)] {
  "slug": slug.current, _updatedAt
}`
