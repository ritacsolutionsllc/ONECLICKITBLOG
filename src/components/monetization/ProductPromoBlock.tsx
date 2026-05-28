import Link from 'next/link'
import { ExternalLink, Wrench } from 'lucide-react'

interface PromoProduct {
  id: string
  name: string
  url: string
  cta: string
  one_liner: string
}

const PRODUCT_COLORS: Record<string, string> = {
  modelbench:          '#E66A2C',
  'ai-cost-auditor':   '#1F8A70',
  'data-breach-watch': '#B23A48',
  surplusfunds:        '#2F7D6A',
  settlementclaim:     '#8A5A2B',
  ipawos:              '#7A8C3F',
  'wingman-ai':        '#3B6BC9',
  'got-it-leads':      '#0E4F8A',
  leadgeneai:          '#6B3FB0',
  oneclickitleads:     '#D17A22',
}

// FTC disclosure text — shown on all promo placements
const FTC_DISCLOSURE = 'Disclosure: The products listed below are built by RITAC Solutions, the publisher of OneClickIT News. This is not paid advertising, but we have a direct business relationship with these products.'

interface ProductPromoBlockProps {
  products: PromoProduct[]
  variant?: 'sidebar' | 'inline' | 'footer'
}

export function ProductPromoBlock({ products, variant = 'footer' }: ProductPromoBlockProps) {
  if (!products || products.length === 0) return null

  if (variant === 'sidebar') {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
          <Wrench className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Tools Worth Knowing
          </span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {products.map((p) => {
            const color = PRODUCT_COLORS[p.id] || '#3B82F6'
            return (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-black text-sm"
                  style={{ backgroundColor: color }}
                >
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{p.one_liner}</p>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1.5 flex items-center gap-1">
                    {p.cta} <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>
            )
          })}
        </div>

        {/* FTC Disclosure */}
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">
            <span className="font-semibold">Disclosure:</span> Products above are published by RITAC Solutions,
            the parent company of OneClickIT News.{' '}
            <Link href="/disclosure" className="underline hover:text-gray-600">Learn more.</Link>
          </p>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="my-6 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
            💡 Related Tool
          </p>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 flex-shrink-0">
            Publisher product
          </span>
        </div>
        {products.slice(0, 1).map((p) => (
          <p key={p.id} className="text-sm text-gray-700 dark:text-gray-300">
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-700 dark:text-blue-400 hover:underline"
            >
              {p.name}
            </a>
            {' '}— {p.one_liner}{' '}
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
            >
              {p.cta} <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        ))}
      </div>
    )
  }

  // Footer variant (default)
  return (
    <div className="mt-10 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold text-white">Tools Worth Knowing</span>
        </div>
        <span className="text-[10px] text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full font-medium">
          Publisher products
        </span>
      </div>

      {/* Product cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
        {products.map((p) => {
          const color = PRODUCT_COLORS[p.id] || '#3B82F6'
          return (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-base shadow-sm"
                style={{ backgroundColor: color }}
              >
                {p.name[0]}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {p.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{p.one_liner}</p>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
                  {p.cta} <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          )
        })}
      </div>

      {/* FTC Disclosure footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
          <span className="font-semibold text-gray-500 dark:text-gray-400">Publisher Disclosure:</span>{' '}
          {FTC_DISCLOSURE}{' '}
          <Link href="/disclosure" className="underline hover:text-gray-600 dark:hover:text-gray-300">
            Full disclosure policy.
          </Link>
        </p>
      </div>
    </div>
  )
}
