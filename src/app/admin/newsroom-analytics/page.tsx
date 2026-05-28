'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  TrendingUp, TrendingDown, Minus, AlertCircle, AlertTriangle, Info,
  Users, Eye, FileText, Mail, Share2, Clock, Zap, RefreshCw,
  CheckCircle, XCircle, ChevronRight, Activity, BarChart2, ArrowUpRight
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
interface DashboardData {
  kpis: { live_readers_now: number; top_article_now: any; articles_published_today: number; newsletter_signups_today: number; social_clicks_today: number; review_queue_open: number }
  top10_now: any[]
  rising: any[]
  recent_24h: any[]
  traffic_sources: Record<string, number>
  views_by_category: any[]
  top_converting: any[]
  top_social: any[]
  recirculation: any[]
  search_winners: any[]
  alerts: any[]
  pipeline: any
  underperforming_categories: any[]
  recent_activity: any[]
  generated_at: string
}

// ── Helpers ────────────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  ai: '#2563EB', cybersecurity: '#DC2626', cloud: '#0891B2', saas: '#7C3AED',
  startups: '#F59E0B', 'enterprise-it': '#10B981', automation: '#F97316', explainers: '#6366F1',
}

function TrendBadge({ trend, pct }: { trend: string; pct: number }) {
  if (trend === 'up') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold">
      <TrendingUp className="w-3 h-3" /> +{pct}%
    </span>
  )
  if (trend === 'down') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-xs font-bold">
      <TrendingDown className="w-3 h-3" /> {pct}%
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 text-xs font-bold">
      <Minus className="w-3 h-3" /> —
    </span>
  )
}

function AlertBadge({ severity }: { severity: string }) {
  if (severity === 'critical') return <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
  if (severity === 'warning') return <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
  return <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
}

function fmt(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return `${Math.round(diff)}s ago`
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`
  return `${Math.round(diff / 86400)}d ago`
}

// ── KPI Card ───────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color = '#2563EB', pulse }: any) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-start gap-4 hover:border-gray-600 transition-all">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '22' }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-black text-white mt-0.5 flex items-center gap-2">
          {value}
          {pulse && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>}
        </p>
        {sub && <p className="text-xs text-gray-500 mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  )
}

// ── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ title, sub, badge }: { title: string; sub?: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-base font-bold text-white">{title}</h2>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
      {badge && <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full font-medium">{badge}</span>}
    </div>
  )
}

// ── Bar Chart ───────────────────────────────────────────────────────────────
function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-20 flex-shrink-0 capitalize">{d.label}</span>
          <div className="flex-1 h-5 bg-gray-800 rounded overflow-hidden">
            <div
              className="h-full rounded transition-all duration-500"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color }}
            />
          </div>
          <span className="text-xs font-semibold text-white w-12 text-right">{fmt(d.value)}</span>
        </div>
      ))}
    </div>
  )
}

// ── Pipeline Status ─────────────────────────────────────────────────────────
function PipelineBadge({ run }: { run: any }) {
  if (!run) return <span className="text-xs text-gray-600">No data</span>
  const ok = run.status === 'success' || run.status === 'partial'
  return (
    <div className="flex items-center gap-2">
      {ok ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
      <div>
        <p className={`text-xs font-semibold ${ok ? 'text-emerald-400' : 'text-red-400'}`}>{run.status?.toUpperCase()}</p>
        <p className="text-[11px] text-gray-500">{run.records_processed} records · {timeAgo(run.started_at)}</p>
      </div>
    </div>
  )
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
export default function NewsroomDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [filter, setFilter] = useState({ dateRange: 'today', category: 'all', status: 'all' })

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/newsroomDashboard', { method: 'GET' })
      const json = await res.json()
      if (json.success) {
        setData(json)
        setLastRefresh(new Date())
      }
    } catch (e) {
      console.error('Dashboard fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 4 * 60 * 1000) // refresh every 4 min
    return () => clearInterval(interval)
  }, [fetchData])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-400">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading newsroom dashboard…</span>
      </div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-red-400 text-sm">Failed to load dashboard data.</p>
    </div>
  )

  const { kpis, top10_now, rising, recent_24h, traffic_sources, views_by_category,
    top_converting, top_social, recirculation, search_winners, alerts,
    pipeline, underperforming_categories, recent_activity } = data

  const criticalAlerts = alerts.filter(a => a.severity === 'critical')
  const warningAlerts = alerts.filter(a => a.severity === 'warning')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-white">Newsroom Analytics</span>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">Admin Only</span>
            </div>
            {criticalAlerts.length > 0 && (
              <span className="flex items-center gap-1.5 text-xs bg-red-900/50 text-red-400 border border-red-800 px-2.5 py-1 rounded-full font-semibold">
                <AlertCircle className="w-3.5 h-3.5" /> {criticalAlerts.length} critical
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && <p className="text-xs text-gray-500">Updated {timeAgo(lastRefresh.toISOString())}</p>}
            <button onClick={fetchData} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-all">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            {/* Filters */}
            <select value={filter.dateRange} onChange={e => setFilter(f => ({...f, dateRange: e.target.value}))} className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg">
              <option value="today">Today</option>
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7d</option>
              <option value="30d">Last 30d</option>
            </select>
            <select value={filter.category} onChange={e => setFilter(f => ({...f, category: e.target.value}))} className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg">
              <option value="all">All Categories</option>
              <option value="ai">AI</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="cloud">Cloud</option>
              <option value="saas">SaaS</option>
              <option value="startups">Startups</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">

        {/* ── Section 1: KPI Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard icon={Users} label="Live Readers Now" value={fmt(kpis.live_readers_now)} sub="Across all articles" color="#10B981" pulse />
          <KpiCard icon={Eye} label="Top Article Now" value={fmt(kpis.top_article_now?.live_readers || 0)} sub={kpis.top_article_now?.title?.slice(0,30) + '…'} color="#2563EB" />
          <KpiCard icon={FileText} label="Published Today" value={kpis.articles_published_today} sub="Articles live" color="#7C3AED" />
          <KpiCard icon={Mail} label="Newsletter Signups" value={fmt(kpis.newsletter_signups_today)} sub="From articles today" color="#F59E0B" />
          <KpiCard icon={Share2} label="Social Clicks" value={fmt(kpis.social_clicks_today)} sub="X, LinkedIn, Facebook" color="#0891B2" />
          <KpiCard icon={AlertCircle} label="Review Queue" value={kpis.review_queue_open} sub={kpis.review_queue_open > 0 ? `${criticalAlerts.length} critical` : 'All clear'} color={kpis.review_queue_open > 0 ? '#DC2626' : '#10B981'} />
        </div>

        {/* ── Section 2: Top 10 + Rising ──────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Top 10 */}
          <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
            <SectionHeader title="Top 10 Articles Right Now" sub="Sorted by live readers" badge={`${fmt(kpis.live_readers_now)} total live`} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] text-gray-500 uppercase tracking-wide border-b border-gray-800">
                    <th className="pb-2 text-left font-medium w-6">#</th>
                    <th className="pb-2 text-left font-medium">Article</th>
                    <th className="pb-2 text-right font-medium">Live</th>
                    <th className="pb-2 text-right font-medium">30m</th>
                    <th className="pb-2 text-right font-medium">Trend</th>
                    <th className="pb-2 text-right font-medium">Featured</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {top10_now.map((a, i) => (
                    <tr key={a.id} className="hover:bg-gray-800/30 transition-colors group cursor-pointer">
                      <td className="py-2.5 pr-2 text-gray-600 font-mono text-xs">{i + 1}</td>
                      <td className="py-2.5">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[a.category_slug] || '#6B7280' }} />
                          <div>
                            <p className="text-white text-xs font-medium leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors max-w-xs">{a.title}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{a.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="text-emerald-400 font-bold text-sm">{fmt(a.live_readers)}</span>
                      </td>
                      <td className="py-2.5 text-right text-gray-300 text-xs">{fmt(a.views_30m)}</td>
                      <td className="py-2.5 text-right"><TrendBadge trend={a.trend} pct={a.trend_pct} /></td>
                      <td className="py-2.5 text-right text-xs">{a.is_featured ? <span className="text-blue-400">★</span> : <span className="text-gray-700">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rising */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <SectionHeader title="Rising Now" sub="Biggest 30-min growth" />
            <div className="space-y-3">
              {rising.length === 0 && <p className="text-gray-600 text-xs">No rising articles in this window.</p>}
              {rising.map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/40 hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">{a.title}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{a.category}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-emerald-400 font-bold">{fmt(a.live_readers)} live</span>
                      <span className="text-xs text-gray-500">{fmt(a.views_30m)} / 30m</span>
                    </div>
                  </div>
                  <TrendBadge trend="up" pct={a.trend_pct} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 3: Traffic + Category ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <SectionHeader title="Traffic by Source" sub="Visits attributed by channel today" />
            <BarChart data={[
              { label: 'Search', value: traffic_sources.search || 0, color: '#2563EB' },
              { label: 'Social', value: traffic_sources.social || 0, color: '#7C3AED' },
              { label: 'Direct', value: traffic_sources.direct || 0, color: '#0891B2' },
              { label: 'Homepage', value: traffic_sources.homepage || 0, color: '#F59E0B' },
              { label: 'Newsletter', value: traffic_sources.newsletter || 0, color: '#F97316' },
              { label: 'Referral', value: traffic_sources.referral || 0, color: '#10B981' },
            ]} />
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <SectionHeader title="Views by Category Today" />
            <BarChart data={views_by_category.map(c => ({ label: c.slug, value: c.views, color: c.color || CATEGORY_COLORS[c.slug] || '#6B7280' }))} />
            {underperforming_categories.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-xs text-amber-400 font-semibold mb-2">⚠ Underperforming categories</p>
                <div className="flex flex-wrap gap-1.5">
                  {underperforming_categories.map(c => (
                    <span key={c.slug} className="text-[10px] bg-amber-900/30 text-amber-400 border border-amber-800/50 px-2 py-0.5 rounded-full">{c.slug}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Section 4: Converting + Recirculation ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <SectionHeader title="Top Converting Articles" sub="Newsletter signups today" />
            <div className="space-y-2.5">
              {top_converting.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-800/40 cursor-pointer transition-colors">
                  <span className="text-xs text-gray-600 font-mono w-4 flex-shrink-0">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-medium line-clamp-1">{a.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{fmt(a.pageviews_today)} views</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-amber-400">{a.newsletter_signups}</p>
                    <p className="text-[10px] text-gray-500">{a.conversion_rate}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <SectionHeader title="Top Social Pickup" sub="Clicks from X, LinkedIn, Facebook" />
            <div className="space-y-2.5">
              {top_social.map((a, i) => (
                <div key={a.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-800/40 cursor-pointer transition-colors">
                  <span className="text-xs text-gray-600 font-mono w-4 flex-shrink-0 mt-0.5">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-medium line-clamp-2">{a.title}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] text-gray-500">𝕏 {fmt(a.x)}</span>
                      <span className="text-[10px] text-gray-500">in {fmt(a.linkedin)}</span>
                      <span className="text-[10px] text-gray-500">fb {fmt(a.facebook)}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-purple-400 flex-shrink-0">{fmt(a.total)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <SectionHeader title="Recirculation Leaders" sub="Articles driving internal clicks" />
            <div className="space-y-2.5">
              {recirculation.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-800/40 cursor-pointer transition-colors">
                  <span className="text-xs text-gray-600 font-mono w-4 flex-shrink-0">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-medium line-clamp-1">{a.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{a.recirc_rate}% recirc rate · {a.has_related_links ? '✓ links' : '⚠ no links'}</p>
                  </div>
                  <span className="text-sm font-bold text-sky-400 flex-shrink-0">{fmt(a.recirc_clicks)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 5: Editorial Alerts ─────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <SectionHeader
            title="Editorial Alerts"
            sub="Action required items across content and workflow"
            badge={`${alerts.length} open · ${criticalAlerts.length} critical`}
          />
          {alerts.length === 0 ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">All clear — no open alerts.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {alerts.map((alert, i) => (
                <div key={i} className={`flex items-start gap-2.5 p-3 rounded-lg border ${
                  alert.severity === 'critical' ? 'bg-red-950/30 border-red-900/50' :
                  alert.severity === 'warning' ? 'bg-amber-950/30 border-amber-900/50' :
                  'bg-blue-950/20 border-blue-900/30'
                }`}>
                  <AlertBadge severity={alert.severity} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${
                      alert.severity === 'critical' ? 'text-red-400' :
                      alert.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
                    }`}>{alert.type?.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-xs text-gray-300 mt-0.5 leading-snug">{alert.message}</p>
                    {alert.article_title && (
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">→ {alert.article_title}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Section 6: Pipeline Health ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <SectionHeader title="Automation Pipeline Health" sub="Last run status per workflow" />
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <div>
                  <p className="text-xs font-semibold text-gray-300">Source Intake</p>
                  <p className="text-[10px] text-gray-500">RSS crawl + story candidate ingestion</p>
                </div>
                <PipelineBadge run={pipeline.latest_intake} />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <div>
                  <p className="text-xs font-semibold text-gray-300">Draft Generation</p>
                  <p className="text-[10px] text-gray-500">Story cluster → article draft</p>
                </div>
                <PipelineBadge run={pipeline.latest_draft_gen} />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-xs font-semibold text-gray-300">Publishing Workflow</p>
                  <p className="text-[10px] text-gray-500">Schedule → publish + distribute</p>
                </div>
                <PipelineBadge run={pipeline.latest_publish} />
              </div>
              <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Story candidates pending</p>
                  <p className="text-sm font-bold text-blue-400 mt-0.5">{pipeline.story_candidates_pending}</p>
                </div>
                {pipeline.next_scheduled_publish && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Next publish</p>
                    <p className="text-xs font-semibold text-white mt-0.5">{pipeline.next_scheduled_publish.title?.slice(0,30)}…</p>
                    <p className="text-[10px] text-gray-500">{pipeline.next_scheduled_publish.planned_publish_date}</p>
                  </div>
                )}
              </div>
              {pipeline.recent_failures?.length > 0 && (
                <div className="pt-3 border-t border-gray-800">
                  <p className="text-xs text-amber-400 font-semibold mb-2">⚠ Recent errors</p>
                  {pipeline.recent_failures.map((f: any, i: number) => (
                    <p key={i} className="text-[10px] text-gray-500 line-clamp-1">{f.log_summary?.slice(0,80)}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <SectionHeader title="Recent Activity Log" sub="Last 10 system events" />
            <div className="space-y-2">
              {recent_activity.map((event, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-800/50 last:border-0">
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    event.status === 'success' ? 'bg-emerald-500' :
                    event.status === 'partial' ? 'bg-amber-400' :
                    event.status === 'error' ? 'bg-red-500' :
                    event.type === 'review' ? 'bg-blue-400' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 capitalize line-clamp-1">{event.label}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">{timeAgo(event.time || '')}</p>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0 ${
                    event.status === 'success' ? 'bg-emerald-900/40 text-emerald-400' :
                    event.status === 'partial' ? 'bg-amber-900/40 text-amber-400' :
                    event.status === 'error' ? 'bg-red-900/40 text-red-400' : 'bg-gray-800 text-gray-400'
                  }`}>{event.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 7: Search Winners + 24h Performance ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <SectionHeader title="Search Winners" sub="Top articles by search traffic today" />
            <div className="space-y-2.5">
              {search_winners.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-800/40 cursor-pointer transition-colors">
                  <span className="text-xs text-gray-600 font-mono w-4">{i+1}</span>
                  <p className="flex-1 text-xs text-white font-medium line-clamp-1">{a.title}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold text-blue-400">{fmt(a.search_clicks)}</span>
                    <TrendBadge trend={a.trend} pct={a.trend_pct} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <SectionHeader title="Recent Published Performance" sub="Last 24h articles" />
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[10px] text-gray-600 uppercase tracking-wide border-b border-gray-800">
                    <th className="pb-2 text-left font-medium">Article</th>
                    <th className="pb-2 text-right font-medium">Views</th>
                    <th className="pb-2 text-right font-medium">Recirc%</th>
                    <th className="pb-2 text-right font-medium">NL%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {recent_24h.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-800/30 cursor-pointer">
                      <td className="py-2.5 pr-2 max-w-[180px]">
                        <p className="line-clamp-1 text-white">{a.title}</p>
                        <p className="text-[10px] text-gray-600">{a.category}</p>
                      </td>
                      <td className="py-2.5 text-right text-white font-semibold">{fmt(a.pageviews)}</td>
                      <td className="py-2.5 text-right">
                        <span className={a.recirculation_rate > 15 ? 'text-emerald-400' : a.recirculation_rate > 5 ? 'text-gray-300' : 'text-amber-400'}>
                          {a.recirculation_rate}%
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={a.newsletter_rate > 0.5 ? 'text-emerald-400' : 'text-gray-400'}>
                          {a.newsletter_rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-4">
          <p className="text-[11px] text-gray-700">
            Newsroom Analytics · OneClickIT · Auto-refreshes every 4 minutes · Admin only · 
            {data.generated_at && ` Generated ${timeAgo(data.generated_at)}`}
          </p>
        </div>

      </div>
    </div>
  )
}
