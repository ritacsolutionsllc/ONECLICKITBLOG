import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/fetch'
import { allPostsQuery, allCategorySlugsQuery } from '@/sanity/lib/queries'
import type { Post, SlugItem } from '@/types/sanity'
import { PostCard } from '@/components/blog/PostCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'All News | OneClickIT News',
  description: 'Browse all tech news, guides, and product updates from OneClickIT News.',
  alternates: { canonical: '/news' },
}

interface PageProps {
  searchParams: Promise<{ category?: string; type?: string }>
}

export default async function AllNewsPage({ searchParams }: PageProps) {
  const { category, type } = await searchParams

  const [posts, categorySlugs] = await Promise.all([
    sanityFetch<Post[]>({
      query: allPostsQuery,
      tags: ['post'],
    }),
    sanityFetch<SlugItem[]>({
      query: allCategorySlugsQuery,
      tags: ['category'],
    }),
  ])

  const allPosts = posts || []

  // Filter by category or type if provided
  const filtered = allPosts.filter((p) => {
    const matchCat = !category || p.categories?.some((c) => c.slug === category)
    const matchType = !type || (p as any).postType === type
    return matchCat && matchType
  })

  const postTypes = Array.from(new Set(allPosts.map((p) => (p as any).postType).filter(Boolean)))

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100">All News</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
          {allPosts.length} stories · Updated every 30 minutes by AI
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/news"
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all
            ${!category && !type
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400'
            }`}
        >
          All
        </Link>
        {postTypes.map((pt) => (
          <Link
            key={pt}
            href={`/news?type=${encodeURIComponent(pt)}`}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all
              ${type === pt
                ? 'bg-blue-600 text-white border-transparent'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400'
              }`}
          >
            {pt}
          </Link>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
        {category ? ` in category` : ''}
        {type ? ` · ${type}` : ''}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <p className="text-lg font-medium">No stories found</p>
          <p className="text-sm mt-1">
            <Link href="/news" className="text-blue-600 hover:underline">Clear filters</Link>
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
