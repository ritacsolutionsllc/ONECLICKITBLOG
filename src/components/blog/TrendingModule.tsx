import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import type { TrendItem } from '@/types/sanity'

export function TrendingModule({ trends }: { trends: TrendItem[] }) {
  if (!trends.length) return null

  return (
    <section className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp size={18} className="text-green-500" />
        <h3 className="font-semibold">Trending Now</h3>
      </div>
      <ul className="space-y-3">
        {trends.slice(0, 5).map((trend, i) => (
          <li key={trend.title} className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500 dark:bg-gray-800">
              {i + 1}
            </span>
            <div>
              <span className="text-sm font-medium">{trend.title}</span>
              {trend.category && (
                <Link
                  href={`/category/${trend.category.slug}`}
                  className="ml-2 text-xs text-blue-600 dark:text-blue-400"
                >
                  {trend.category.title}
                </Link>
              )}
              {trend.momentum && (
                <span
                  className={`ml-2 text-xs ${
                    trend.momentum === 'rising'
                      ? 'text-green-600'
                      : trend.momentum === 'declining'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {trend.momentum}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Link
        href="/trend-radar"
        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        View all trends &rarr;
      </Link>
    </section>
  )
}
