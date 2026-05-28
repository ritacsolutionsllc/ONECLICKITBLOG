'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Category } from '@/types/sanity'

// Category accent colors — extend as needed
const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'ai-models':          { bg: 'bg-violet-50 dark:bg-violet-950/40',  text: 'text-violet-700 dark:text-violet-300', dot: 'bg-violet-500' },
  'ai':                 { bg: 'bg-violet-50 dark:bg-violet-950/40',  text: 'text-violet-700 dark:text-violet-300', dot: 'bg-violet-500' },
  'security':           { bg: 'bg-red-50 dark:bg-red-950/40',        text: 'text-red-700 dark:text-red-300',       dot: 'bg-red-500' },
  'cybersecurity':      { bg: 'bg-red-50 dark:bg-red-950/40',        text: 'text-red-700 dark:text-red-300',       dot: 'bg-red-500' },
  'data-breaches':      { bg: 'bg-red-50 dark:bg-red-950/40',        text: 'text-red-700 dark:text-red-300',       dot: 'bg-red-500' },
  'saas':               { bg: 'bg-orange-50 dark:bg-orange-950/40',  text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500' },
  'cloud':              { bg: 'bg-sky-50 dark:bg-sky-950/40',        text: 'text-sky-700 dark:text-sky-300',       dot: 'bg-sky-500' },
  'startups':           { bg: 'bg-emerald-50 dark:bg-emerald-950/40',text: 'text-emerald-700 dark:text-emerald-300',dot: 'bg-emerald-500' },
  'lead-generation':    { bg: 'bg-blue-50 dark:bg-blue-950/40',      text: 'text-blue-700 dark:text-blue-300',     dot: 'bg-blue-500' },
  'legal':              { bg: 'bg-amber-50 dark:bg-amber-950/40',    text: 'text-amber-700 dark:text-amber-300',   dot: 'bg-amber-500' },
  'pet-tech':           { bg: 'bg-green-50 dark:bg-green-950/40',    text: 'text-green-700 dark:text-green-300',   dot: 'bg-green-500' },
}

function getCategoryColors(slug: string) {
  // Try exact match, then prefix match
  if (CATEGORY_COLORS[slug]) return CATEGORY_COLORS[slug]
  const prefix = Object.keys(CATEGORY_COLORS).find(k => slug.startsWith(k) || slug.includes(k))
  return prefix ? CATEGORY_COLORS[prefix] : { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', dot: 'bg-gray-400' }
}

interface CategoryNavProps {
  categories: Category[]
  className?: string
}

export function CategoryNav({ categories, className = '' }: CategoryNavProps) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Category navigation"
      className={`border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none">
          {/* All */}
          <Link
            href="/"
            className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all
              ${pathname === '/'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-400'
              }`}
          >
            All
          </Link>

          {categories.map((cat) => {
            const colors = getCategoryColors(cat.slug)
            const isActive = pathname === `/category/${cat.slug}`
            return (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all
                  ${isActive
                    ? `${colors.bg} ${colors.text} border-transparent`
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
                {cat.title}
              </Link>
            )
          })}

          {/* Static extras */}
          <Link
            href="/trend-radar"
            className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all
              ${pathname === '/trend-radar'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
          >
            📡 Trends
          </Link>
          <Link
            href="/threat-map"
            className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all
              ${pathname === '/threat-map'
                ? 'bg-red-600 text-white border-transparent'
                : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900 hover:bg-red-100'
              }`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            Threat Map
          </Link>
        </div>
      </div>
    </nav>
  )
}
