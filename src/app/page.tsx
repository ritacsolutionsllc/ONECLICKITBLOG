import { sanityFetch } from '@/sanity/fetch'
import { homepageQuery, trendRadarQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import type { HomepageData, TrendRadar, SiteSettings } from '@/types/sanity'
import { FeaturedHero } from '@/components/blog/FeaturedHero'
import { PostCard } from '@/components/blog/PostCard'
import { TrendingModule } from '@/components/blog/TrendingModule'
import { NewsletterCta } from '@/components/cta/NewsletterCta'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function HomePage() {
  const [data, radar, settings] = await Promise.all([
    sanityFetch<HomepageData | null>({
      query: homepageQuery,
      tags: ['post', 'guide', 'digest'],
    }),
    sanityFetch<TrendRadar | null>({
      query: trendRadarQuery,
      tags: ['trend'],
    }),
    sanityFetch<SiteSettings | null>({
      query: siteSettingsQuery,
      tags: ['siteSettings'],
    }),
  ])

  const featured = data?.featured || []
  const latestPosts = data?.latestPosts || []
  const latestDigest = data?.latestDigest || null
  const guides = data?.guides || []
  const trends = radar?.trends || []

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Featured */}
      {featured.length > 0 && <FeaturedHero posts={featured} />}

      {/* Daily Brief */}
      {latestDigest && (
        <section className="mb-12 rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Daily Brief
              </span>
              <h2 className="mt-1 text-xl font-bold">
                <Link href={`/digest/${latestDigest.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                  {latestDigest.title}
                </Link>
              </h2>
              {latestDigest.summary && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {latestDigest.summary}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {latestDigest.itemCount} stories
                {latestDigest.publishedAt && ` · ${formatDate(latestDigest.publishedAt)}`}
              </p>
            </div>
            <Link
              href={`/digest/${latestDigest.slug}`}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Read Brief
            </Link>
          </div>
        </section>
      )}

      {/* Latest Posts + Trending Sidebar */}
      <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          {latestPosts.length > 0 && (
            <section>
              <h2 className="mb-6 text-2xl font-bold">Latest Posts</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {latestPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {trends.length > 0 && <TrendingModule trends={trends} />}
          </div>
        </aside>
      </div>

      {/* Buyer Guides */}
      {guides.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Buyer Guides</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((guide) => (
              <PostCard key={guide._id} post={guide} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <NewsletterCta endpoint={settings?.newsletterEndpoint} />
    </div>
  )
}
