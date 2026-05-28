import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { PostCard } from '@/components/blog/PostCard'
import type { Post, Category } from '@/types/sanity'

const CATEGORY_COLORS: Record<string, { bar: string; text: string; badge: string }> = {
  'ai-models':       { bar: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400', badge: 'bg-violet-50 dark:bg-violet-950/40' },
  'ai':              { bar: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400', badge: 'bg-violet-50 dark:bg-violet-950/40' },
  'security':        { bar: 'bg-red-500',    text: 'text-red-600 dark:text-red-400',       badge: 'bg-red-50 dark:bg-red-950/40' },
  'cybersecurity':   { bar: 'bg-red-500',    text: 'text-red-600 dark:text-red-400',       badge: 'bg-red-50 dark:bg-red-950/40' },
  'data-breaches':   { bar: 'bg-red-500',    text: 'text-red-600 dark:text-red-400',       badge: 'bg-red-50 dark:bg-red-950/40' },
  'saas':            { bar: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', badge: 'bg-orange-50 dark:bg-orange-950/40' },
  'cloud':           { bar: 'bg-sky-500',    text: 'text-sky-600 dark:text-sky-400',       badge: 'bg-sky-50 dark:bg-sky-950/40' },
  'startups':        { bar: 'bg-emerald-500',text: 'text-emerald-600 dark:text-emerald-400',badge: 'bg-emerald-50 dark:bg-emerald-950/40' },
  'lead-generation': { bar: 'bg-blue-500',   text: 'text-blue-600 dark:text-blue-400',     badge: 'bg-blue-50 dark:bg-blue-950/40' },
  'legal':           { bar: 'bg-amber-500',  text: 'text-amber-600 dark:text-amber-400',   badge: 'bg-amber-50 dark:bg-amber-950/40' },
  'pet-tech':        { bar: 'bg-green-500',  text: 'text-green-600 dark:text-green-400',   badge: 'bg-green-50 dark:bg-green-950/40' },
}

function getCategoryColors(slug: string) {
  if (CATEGORY_COLORS[slug]) return CATEGORY_COLORS[slug]
  const match = Object.keys(CATEGORY_COLORS).find(k => slug?.startsWith(k) || slug?.includes(k))
  return match ? CATEGORY_COLORS[match] : { bar: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', badge: 'bg-blue-50 dark:bg-blue-950/40' }
}

interface CategoryStripProps {
  category: Category
  posts: Post[]
}

export function CategoryStrip({ category, posts }: CategoryStripProps) {
  const colors = getCategoryColors(category.slug)
  if (posts.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-6 rounded-full ${colors.bar}`} />
          <h2 className="text-xl font-black text-gray-900 dark:text-gray-100">{category.title}</h2>
          {posts.length > 0 && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge} ${colors.text}`}>
              {posts.length} stories
            </span>
          )}
        </div>
        <Link
          href={`/category/${category.slug}`}
          className={`flex items-center gap-1 text-sm font-semibold ${colors.text} hover:underline`}
        >
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {posts.slice(0, 4).map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  )
}
