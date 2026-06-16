import { groq } from 'next-sanity'

/** Fetch all active RSS/API sources with their category */
export const activeSourcesQuery = groq`*[_type == "source" && active == true] {
  _id,
  name,
  "slug": slug.current,
  url,
  type,
  active,
  category->{
    _id,
    title,
    "slug": slug.current
  }
}`

/** Check if items with these hashes already exist in recent digests */
export const existingHashesQuery = groq`*[_type == "news_digest" && publishedAt > $since] {
  "hashes": items[].sourceUrl
}.hashes[]`

/** Get today's draft digest if one exists */
export const todayDraftDigestQuery = groq`*[
  _type == "news_digest"
  && status == "draft"
  && publishedAt > $dayStart
  && publishedAt < $dayEnd
][0] {
  _id,
  title,
  items
}`

/** Fetch recent digest item headlines for trend analysis */
export const recentDigestHeadlinesQuery = groq`*[_type == "news_digest" && publishedAt > $since] {
  "items": items[] {
    headline,
    summary,
    "category": source->category->title
  }
}.items[]`

/** Fetch all active categories */
export const allActiveCategoriesQuery = groq`*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current
}`
