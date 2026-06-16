import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/fetch'
import { digestBySlugQuery, allDigestSlugsQuery } from '@/sanity/lib/queries'
import type { Digest, SlugItem } from '@/types/sanity'
import { DigestItemCard } from '@/components/blog/DigestItemCard'
import { ArticleJsonLd } from '@/components/seo/JsonLd'
import { formatDate } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const digests = await sanityFetch<SlugItem[]>({
      query: allDigestSlugsQuery,
      tags: ['digest'],
    })
    return (digests || []).map((d) => ({ slug: d.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const digest = await sanityFetch<Digest | null>({
    query: digestBySlugQuery,
    params: { slug },
    tags: ['digest'],
  })
  if (!digest) return {}
  return {
    title: digest.seo?.metaTitle || digest.title,
    description: digest.seo?.metaDescription || digest.summary || '',
    alternates: { canonical: `/digest/${slug}` },
    openGraph: {
      title: digest.seo?.metaTitle || digest.title,
      description: digest.seo?.metaDescription || digest.summary || '',
    },
  }
}

export default async function DigestPage({ params }: PageProps) {
  const { slug } = await params
  const digest = await sanityFetch<Digest | null>({
    query: digestBySlugQuery,
    params: { slug },
    tags: ['digest'],
  })

  if (!digest) notFound()

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <ArticleJsonLd
        title={digest.title}
        description={digest.summary}
        publishedAt={digest.publishedAt}
        slug={digest.slug}
        type="NewsArticle"
      />

      <span className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
        Daily Brief
      </span>
      <h1 className="mt-2 text-3xl font-bold md:text-4xl">{digest.title}</h1>

      {digest.publishedAt && (
        <time className="mt-2 block text-sm text-gray-500">
          {formatDate(digest.publishedAt)}
        </time>
      )}

      {digest.summary && (
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{digest.summary}</p>
      )}

      {digest.items && digest.items.length > 0 && (
        <div className="mt-8">
          {digest.items.map((item, i) => (
            <DigestItemCard key={i} item={item} />
          ))}
        </div>
      )}
    </article>
  )
}
