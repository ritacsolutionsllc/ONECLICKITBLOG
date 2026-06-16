import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/fetch'
import { categoryBySlugQuery, allCategorySlugsQuery } from '@/sanity/lib/queries'
import type { CategoryPageData, SlugItem } from '@/types/sanity'
import { PostCard } from '@/components/blog/PostCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const categories = await sanityFetch<SlugItem[]>({
      query: allCategorySlugsQuery,
      tags: ['category'],
    })
    return (categories || []).map((c) => ({ slug: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await sanityFetch<CategoryPageData>({
    query: categoryBySlugQuery,
    params: { slug },
    tags: ['category', 'post'],
  })
  if (!data?.category) return {}
  return {
    title: data.category.title,
    description: data.category.description || `Posts in ${data.category.title}`,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: data.category.title,
      description: data.category.description || `Posts in ${data.category.title}`,
    },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const data = await sanityFetch<CategoryPageData>({
    query: categoryBySlugQuery,
    params: { slug },
    tags: ['category', 'post'],
  })

  if (!data?.category) notFound()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{data.category.title}</h1>
        {data.category.description && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">{data.category.description}</p>
        )}
      </header>

      {data.posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No posts in this category yet.</p>
      )}
    </div>
  )
}
