import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { urlFor } from '@/sanity/image'
import type { Post } from '@/types/sanity'

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
  'ai-models':       'bg-violet-500',
  'ai':              'bg-violet-500',
  'security':        'bg-red-500',
  'cybersecurity':   'bg-red-500',
  'data-breaches':   'bg-red-500',
  'saas':            'bg-orange-500',
  'cloud':           'bg-sky-500',
  'startups':        'bg-emerald-500',
  'lead-generation': 'bg-blue-500',
  'legal':           'bg-amber-500',
  'pet-tech':        'bg-green-500',
}

const POST_TYPE_STYLES: Record<string, string> = {
  'Breaking News':  'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  'Trend':          'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400',
  'Product Update': 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  'Deep Dive':      'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  'Guide':          'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  'Digest':         'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

function getCategoryColor(slug: string): string {
  if (CATEGORY_COLORS[slug]) return CATEGORY_COLORS[slug]
  const match = Object.keys(CATEGORY_COLORS).find(k => slug?.startsWith(k) || slug?.includes(k))
  return match ? CATEGORY_COLORS[match] : 'bg-blue-500'
}

interface PostCardProps {
  post: Post
  variant?: 'default' | 'compact' | 'featured'
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  const href = `/post/${post.slug}`
  const primaryCategory = post.categories?.[0]
  const accentColor = getCategoryColor(primaryCategory?.slug || '')
  const postType = (post as any).postType as string | undefined

  if (variant === 'compact') {
    return (
      <article className="group flex gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <div className={`w-1 rounded-full flex-shrink-0 ${accentColor}`} />
        <div className="flex-1 min-w-0">
          {primaryCategory && (
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              {primaryCategory.title}
            </span>
          )}
          <h4 className="text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mt-0.5">
            <Link href={href}>{post.title}</Link>
          </h4>
          {post.publishedAt && (
            <time className="text-xs text-gray-400 mt-1 block">{formatDate(post.publishedAt)}</time>
          )}
        </div>
      </article>
    )
  }

  if (variant === 'featured') {
    return (
      <article className="group relative bg-gray-900 dark:bg-gray-800 rounded-2xl overflow-hidden">
        {post.mainImage?.asset && (
          <div className="absolute inset-0">
            <Image
              src={urlFor(post.mainImage).width(800).height(500).url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover opacity-40 transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 p-8 flex flex-col h-full min-h-[320px] justify-end">
          {primaryCategory && (
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-2">
              {primaryCategory.title}
            </span>
          )}
          {postType && (
            <span className={`inline-block mb-3 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${POST_TYPE_STYLES[postType] || 'bg-gray-100 text-gray-700'}`}>
              {postType}
            </span>
          )}
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight group-hover:text-blue-300 transition-colors mb-3">
            <Link href={href}>{post.title}</Link>
          </h2>
          {post.excerpt && (
            <p className="text-gray-300 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
          )}
          {post.publishedAt && (
            <time className="text-gray-400 text-xs">{formatDate(post.publishedAt)}</time>
          )}
        </div>
      </article>
    )
  }

  // Default card
  return (
    <article className="group flex flex-col bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all">
      {/* Category color accent bar */}
      <div className={`h-1 ${accentColor}`} />

      {post.mainImage?.asset ? (
        <Link href={href} className="block">
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={urlFor(post.mainImage).width(600).height(338).url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      ) : (
        <Link href={href} className="block">
          <div className={`aspect-[16/9] ${accentColor} opacity-10`} />
        </Link>
      )}

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2 gap-2">
          {primaryCategory && (
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate">
              {primaryCategory.title}
            </span>
          )}
          {postType && (
            <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${POST_TYPE_STYLES[postType] || 'bg-gray-100 text-gray-600'}`}>
              {postType}
            </span>
          )}
        </div>

        <h3 className="font-bold leading-snug text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3 flex-1">
          <Link href={href}>{post.title}</Link>
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{post.excerpt}</p>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
          {post.author && <span className="font-medium text-gray-500 dark:text-gray-400">{post.author.name}</span>}
        </div>
      </div>
    </article>
  )
}
