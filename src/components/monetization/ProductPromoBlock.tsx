import Link from 'next/link'
import { ExternalLink, Wrench } from 'lucide-react'

interface PromoProduct {
  id: string
  name: string
  url: string
  cta: string
  one_liner: string
  highlight_color?: string
}

const PRODUCT_COLORS: Record<string, string> = {
  modelbench:        '#E66A2C',
  'ai-cost-auditor': '#1F8A70',
  'data-breach-watch':'#B23A48',
  surplusfunds:      '#2F7D6A',
  settlementclaim:   '#8A5A2B',
  ipawos:            '#7A8C3F',
  'wingman-ai':      '#3B6BC9',
  'got-it-leads':    '#0E4F8A',
  leadgeneai:        '#6B3FB0',
  oneclickitleads:   '#D17A22',
}

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
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Tools Worth Knowing</span>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {products.map((p) => {
            const color = PRODUCT_COLORS[p.id] || '#3B82F6'
            return (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
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
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="my-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-700 p-4">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2">
          💡 Related Tool
        </p>
        {products.slice(0, 1).map((p) => (
          <p key={p.id} className="text-sm text-gray-700 dark:text-gray-300">
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="font-bold text-blue-700 dark:text-blue-400 hover:underline"
            >
              {p.name}
            </a>
            {' '}— {p.one_liner}{' '}
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
            >
              {p.cta} <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        ))}
      </div>
    )
  }

  // Footer variant (default — shown at bottom of articles)
  return (
    <div className="mt-10 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center gap-2">
        <Wrench className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-bold text-white">Tools Worth Knowing</span>
        <span className="text-xs text-gray-400 ml-1">from the OneClickIT ecosystem</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
        {products.map((p) => {
          const color = PRODUCT_COLORS[p.id] || '#3B82F6'
          return (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
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
    </div>
  )
}
