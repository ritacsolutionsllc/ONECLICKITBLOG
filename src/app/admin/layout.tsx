import type { ReactNode } from 'react'
import Link from 'next/link'
import { BarChart2, FileText, Settings, Activity, Users } from 'lucide-react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col py-6">
        <div className="px-4 mb-8">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Admin</p>
          <p className="text-sm font-black text-white mt-1">OneClickIT News</p>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {[
            { href: '/admin/newsroom-analytics', icon: Activity, label: 'Newsroom Analytics' },
            { href: '/admin/content', icon: FileText, label: 'Content' },
            { href: '/admin/pipeline', icon: BarChart2, label: 'Pipeline' },
            { href: '/admin/users', icon: Users, label: 'Users' },
            { href: '/admin/settings', icon: Settings, label: 'Settings' },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 pt-4 border-t border-gray-800">
          <Link href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">← Back to site</Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
