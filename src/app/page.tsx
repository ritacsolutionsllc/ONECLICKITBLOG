import { sanityFetch } from '@/sanity/fetch'
import { homepageQuery, trendRadarQuery, allPostsQuery, allCategorySlugsQuery } from '@/sanity/lib/queries'
import type { HomepageData, TrendRadar, Post, SlugItem } from '@/types/sanity'
import { FeaturedHero } from '@/components/blog/FeaturedHero'
import { PostCard } from '@/components/blog/PostCard'
import { CategoryStrip } from '@/components/blog/CategoryStrip'
import { TrendingModule } from '@/components/blog/TrendingModule'
import { NewsletterCta } from '@/components/cta/NewsletterCta'
import { LiveStatsTicker } from '@/components/blog/LiveStatsTicker'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Topic } from '@/api/entities'

export default async function HomePage() {
  const [data, radar, allPosts, categorySlugs] = await Promise.all([
    sanityFetch<HomepageData | null>({
      query: homepageQuery,
      tags: ['post', 'guide', 'digest'],
    }),
    sanityFetch<TrendRadar | null>({
      query: trendRadarQuery,
      tags: ['trend'],
    }),
    sanityFetch<Post[]>({
      query: allPostsQuery,
      tags: ['post'],
    }),
    sanityFetch<SlugItem[]>({
      query: allCategorySlugsQuery,
      tags: ['category'],
    }),
  ])

  const featured = data?.featured || []
  const latestPosts = data?.latestPosts || []
  const latestDigest = data?.latestDigest || null
  const guides = data?.guides || []
  const trends = radar?.trends || []
  const posts = allPosts || []

  // Group posts by category for strips
  const categoryMap = new Map<string, { title: string; posts: Post[] }>()
  posts.forEach((post) => {
    post.categories?.forEach((cat) => {
      if (!categoryMap.has(cat.slug)) {
        categoryMap.set(cat.slug, { title: cat.title, posts: [] })
      }
      categoryMap.get(cat.slug)!.posts.push(post)
    })
  })

  // Breaking news
  const breakingNews = posts.filter((p) => (p as any).postType === 'Breaking News').slice(0, 5)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Global Threat Monitor */}
      <LiveStatsTicker />

      {/* Breaking news ticker */}
      {breakingNews.length > 0 && (
        <div className="mb-6 rounded-xl bg-red-600 overflow-hidden">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-800 px-4 py-2.5 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-200 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="text-xs font-black text-white uppercase tracking-wider">Breaking</span>
            </div>
            <div className="px-4 py-2.5 overflow-hidden flex-1">
              <div className="flex gap-6">
                {breakingNews.map((p) => (
                  <Link
                    key={p._id}
                    href={`/post/${p.slug}`}
                    className="whitespace-nowrap text-sm font-medium text-white hover:text-red-200 transition-colors flex-shrink-0"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Hero */}
      {featured.length > 0 && <FeaturedHero posts={featured} />}

      {/* Daily Brief */}
      {latestDigest && (
        <section className="mb-12 rounded-xl bg-gray-50 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
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
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{latestDigest.summary}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {latestDigest.itemCount} stories
                {latestDigest.publishedAt && ` · ${formatDate(latestDigest.publishedAt)}`}
              </p>
            </div>
            <Link
              href={`/digest/${latestDigest.slug}`}
              className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand"
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Latest Stories</h2>
                <Link href="/news" className="text-sm text-blue-600 hover:underline font-medium">
                  View all →
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {latestPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
        <div>
          {trends.length > 0 && <TrendingModule trends={trends} />}
        </div>
      </div>

      {/* Category Strips */}
      {Array.from(categoryMap.entries()).map(([slug, { title, posts: catPosts }]) => (
        catPosts.length >= 2 ? (
          <CategoryStrip
            key={slug}
            category={{ _id: slug, title, slug }}
            posts={catPosts}
          />
        ) : null
      ))}

      {/* Newsletter CTA */}
      <NewsletterCta />
    </div>
  )
}
