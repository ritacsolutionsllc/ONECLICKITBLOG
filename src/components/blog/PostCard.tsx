import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { urlFor } from '@/sanity/image'
import type { Post } from '@/types/sanity'

export function PostCard({ post }: { post: Post }) {
  const href = `/post/${post.slug}`

  return (
    <article className="group">
      <Link href={href} className="block">
        {post.mainImage?.asset && (
          <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <Image
              src={urlFor(post.mainImage).width(600).height(338).url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        {post.categories?.[0] && (
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {post.categories[0].title}
          </span>
        )}
        <h3 className="mt-1 font-semibold leading-snug text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {post.excerpt}
          </p>
        )}
        {post.publishedAt && (
          <time className="mt-2 block text-xs text-gray-500">
            {formatDate(post.publishedAt)}
          </time>
        )}
      </Link>
    </article>
  )
}
