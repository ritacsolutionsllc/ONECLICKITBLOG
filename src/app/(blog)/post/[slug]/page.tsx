import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { sanityFetch } from '@/sanity/fetch'
import { postBySlugQuery, guideBySlugQuery, allPostSlugsQuery, allGuideSlugsQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/image'
import type { Post, BuyerGuide, SlugItem, SiteSettings } from '@/types/sanity'
import { PortableTextRenderer } from '@/components/portable-text/PortableTextRenderer'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { ShareBar } from '@/components/blog/ShareBar'
import { AffiliateProductCard } from '@/components/monetization/AffiliateProductCard'
import { AdSlot } from '@/components/monetization/AdSlot'
import { ArticleJsonLd, ProductListJsonLd } from '@/components/seo/JsonLd'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const [posts, guides] = await Promise.all([
    sanityFetch<SlugItem[]>({ query: allPostSlugsQuery, tags: ['post'] }),
    sanityFetch<SlugItem[]>({ query: allGuideSlugsQuery, tags: ['guide'] }),
  ])
  return [...(posts || []), ...(guides || [])].map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await sanityFetch<Post | null>({
    query: postBySlugQuery,
    params: { slug: params.slug },
    tags: ['post'],
  })

  if (!post) {
    const guide = await sanityFetch<BuyerGuide | null>({
      query: guideBySlugQuery,
      params: { slug: params.slug },
      tags: ['guide'],
    })
    if (!guide) return {}
    return {
      title: guide.seo?.metaTitle || guide.title,
      description: guide.seo?.metaDescription || '',
      openGraph: {
        title: guide.seo?.metaTitle || guide.title,
        description: guide.seo?.metaDescription || '',
        images: guide.seo?.ogImageUrl ? [guide.seo.ogImageUrl] : [],
      },
    }
  }

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt || '',
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt || '',
      images: post.seo?.ogImageUrl
        ? [post.seo.ogImageUrl]
        : post.mainImage?.asset
        ? [urlFor(post.mainImage).width(1200).height(630).url()]
        : [],
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  // Try original_post first, then buyer_guide
  const [post, settings] = await Promise.all([
    sanityFetch<Post | null>({
      query: postBySlugQuery,
      params: { slug: params.slug },
      tags: ['post'],
    }),
    sanityFetch<SiteSettings | null>({
      query: siteSettingsQuery,
      tags: ['siteSettings'],
    }),
  ])

  const guide = post
    ? null
    : await sanityFetch<BuyerGuide | null>({
        query: guideBySlugQuery,
        params: { slug: params.slug },
        tags: ['guide'],
      })

  if (!post && !guide) notFound()

  const showAds = settings?.enableAds && settings?.adsenseId

  // Render buyer guide
  if (guide) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-8">
        <ProductListJsonLd
          title={guide.title}
          products={guide.products || []}
          slug={guide.slug}
        />

        {guide.categories?.[0] && (
          <Link
            href={`/category/${guide.categories[0].slug}`}
            className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400"
          >
            {guide.categories[0].title}
          </Link>
        )}
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{guide.title}</h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          {guide.author && <span>By {guide.author.name}</span>}
          {guide.publishedAt && <time>{formatDate(guide.publishedAt)}</time>}
        </div>

        {guide.mainImage?.asset && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl">
            <Image
              src={urlFor(guide.mainImage).width(1200).height(675).url()}
              alt={guide.mainImage.alt || guide.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />
          </div>
        )}

        <div className="mt-2 rounded-md bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          This guide may contain affiliate links. See our{' '}
          <Link href="/affiliate-disclosure" className="underline">
            affiliate disclosure
          </Link>{' '}
          for details.
        </div>

        {showAds && <AdSlot slot="guide-top" adsenseId={settings.adsenseId!} format="horizontal" />}

        {guide.intro && (
          <div className="mt-6">
            <PortableTextRenderer value={guide.intro} />
          </div>
        )}

        {guide.products && guide.products.length > 0 && (
          <div className="mt-8 space-y-6">
            {guide.products.map((product, i) => (
              <AffiliateProductCard key={i} product={product} />
            ))}
          </div>
        )}

        {guide.verdict && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">Our Verdict</h2>
            <PortableTextRenderer value={guide.verdict} />
          </div>
        )}

        <div className="mt-8">
          <ShareBar title={guide.title} slug={guide.slug} />
        </div>
      </article>
    )
  }

  // Render original post
  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <ArticleJsonLd
        title={post!.title}
        description={post!.excerpt}
        publishedAt={post!.publishedAt}
        authorName={post!.author?.name}
        imageUrl={post!.mainImage?.asset ? urlFor(post!.mainImage).width(1200).url() : undefined}
        slug={post!.slug}
      />

      {post!.categories?.[0] && (
        <Link
          href={`/category/${post!.categories[0].slug}`}
          className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400"
        >
          {post!.categories[0].title}
        </Link>
      )}
      <h1 className="mt-2 text-3xl font-bold md:text-4xl">{post!.title}</h1>

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
        {post!.author && <span>By {post!.author.name}</span>}
        {post!.publishedAt && <time>{formatDate(post!.publishedAt)}</time>}
      </div>

      {post!.mainImage?.asset && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl">
          <Image
            src={urlFor(post!.mainImage).width(1200).height(675).url()}
            alt={post!.mainImage.alt || post!.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
            priority
          />
        </div>
      )}

      {post!.body && (
        <div className="mt-8 lg:grid lg:grid-cols-[1fr_200px] lg:gap-8">
          <div>
            <PortableTextRenderer value={post!.body} />
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </aside>
        </div>
      )}

      {showAds && <AdSlot slot="post-bottom" adsenseId={settings.adsenseId!} format="auto" />}

      <div className="mt-8">
        <ShareBar title={post!.title} slug={post!.slug} />
      </div>

      {post!.related && <RelatedPosts posts={post!.related} />}
    </article>
  )
}
