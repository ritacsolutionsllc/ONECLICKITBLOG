import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/types/sanity'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenu } from './MobileMenu'

export function Header({ categories }: { categories: Category[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/icon.svg"
              alt="OneClickIT"
              width={36}
              height={36}
              className="dark:brightness-150"
              priority
            />
            <span className="text-lg font-bold">
              <span className="text-brand dark:text-gray-100">OneClick</span>
              <span className="text-brand dark:text-gray-100">IT</span>
              <span className="text-brand-accent">.</span>
              <span className="text-brand-accent">blog</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="text-sm text-gray-600 transition-colors hover:text-brand-accent dark:text-gray-400 dark:hover:text-brand-light"
              >
                {cat.title}
              </Link>
            ))}
            <span className="h-4 w-px bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
            <Link
              href="/trend-radar"
              className="text-sm text-gray-600 transition-colors hover:text-brand-accent dark:text-gray-400 dark:hover:text-brand-light"
            >
              Trends
            </Link>
            <Link
              href="/threat-map"
              className="flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
              </span>
              Threat Map
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile nav */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <MobileMenu categories={categories} />
          </div>
        </div>
      </div>
    </header>
  )
}
