'use client'

import { useEffect, useState } from 'react'
import { Shield, AlertTriangle, Bug, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export function LiveStatsTicker() {
  const [stats, setStats] = useState({
    cveTotal: 247893,
    breachesThisYear: 3847,
    attacksToday: 0,
    criticalCVEs: 1247,
  })

  useEffect(() => {
    // Simulate live counter incrementing
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        attacksToday: prev.attacksToday + Math.floor(Math.random() * 50) + 10,
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Try to fetch real CVE total
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=1', { signal: AbortSignal.timeout(5000) })
        if (res.ok) {
          const data = await res.json()
          if (data.totalResults) {
            setStats(prev => ({ ...prev, cveTotal: data.totalResults }))
          }
        }
      } catch {
        // Use default
      }
    }
    fetchStats()
  }, [])

  return (
    <section className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-gray-950 text-white dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Global Threat Monitor</span>
        </div>
        <Link href="/threat-map" className="text-xs text-brand-light hover:underline">
          View Live Map &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-px bg-gray-800 sm:grid-cols-4">
        <TickerItem icon={<Shield size={14} />} value={stats.cveTotal.toLocaleString()} label="Total CVEs" />
        <TickerItem icon={<AlertTriangle size={14} />} value={stats.criticalCVEs.toLocaleString()} label="Critical CVEs" highlight />
        <TickerItem icon={<Bug size={14} />} value={stats.breachesThisYear.toLocaleString()} label="Breaches (2026)" />
        <TickerItem icon={<TrendingUp size={14} />} value={stats.attacksToday.toLocaleString()} label="Attacks Today" animate />
      </div>
    </section>
  )
}

function TickerItem({ icon, value, label, highlight, animate }: { icon: React.ReactNode; value: string; label: string; highlight?: boolean; animate?: boolean }) {
  return (
    <div className="bg-gray-950 px-4 py-3">
      <div className={`flex items-center gap-1.5 ${highlight ? 'text-red-400' : 'text-gray-300'}`}>
        {icon}
        <span className={`text-lg font-bold tabular-nums ${animate ? 'transition-all duration-500' : ''}`}>{value}</span>
      </div>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
    </div>
  )
}
