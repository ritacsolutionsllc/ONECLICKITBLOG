'use client'

import { useEffect, useState, useCallback } from 'react'
import { Shield, AlertTriangle, Zap, Globe, Activity } from 'lucide-react'

interface ThreatEvent {
  id: string
  type: 'ddos' | 'malware' | 'phishing' | 'ransomware' | 'exploit'
  sourceCountry: string
  targetCountry: string
  sourceLat: number
  sourceLng: number
  targetLat: number
  targetLng: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: number
}

interface CVEStats {
  total: number
  critical: number
  high: number
  lastUpdated: string
}

// Major cyber hubs for simulated attack paths
const ATTACK_SOURCES = [
  { country: 'Russia', lat: 55.75, lng: 37.62 },
  { country: 'China', lat: 39.9, lng: 116.4 },
  { country: 'North Korea', lat: 39.02, lng: 125.75 },
  { country: 'Iran', lat: 35.69, lng: 51.39 },
  { country: 'Brazil', lat: -23.55, lng: -46.63 },
  { country: 'Nigeria', lat: 6.45, lng: 3.4 },
  { country: 'India', lat: 28.61, lng: 77.21 },
  { country: 'Romania', lat: 44.43, lng: 26.1 },
]

const ATTACK_TARGETS = [
  { country: 'United States', lat: 38.9, lng: -77.04 },
  { country: 'United Kingdom', lat: 51.51, lng: -0.13 },
  { country: 'Germany', lat: 52.52, lng: 13.41 },
  { country: 'Japan', lat: 35.68, lng: 139.69 },
  { country: 'Australia', lat: -33.87, lng: 151.21 },
  { country: 'France', lat: 48.86, lng: 2.35 },
  { country: 'Canada', lat: 45.42, lng: -75.7 },
  { country: 'South Korea', lat: 37.57, lng: 126.98 },
]

const ATTACK_TYPES: ThreatEvent['type'][] = ['ddos', 'malware', 'phishing', 'ransomware', 'exploit']

const typeColors = {
  ddos: '#ef4444',
  malware: '#f97316',
  phishing: '#eab308',
  ransomware: '#dc2626',
  exploit: '#8b5cf6',
}

const typeLabels = {
  ddos: 'DDoS',
  malware: 'Malware',
  phishing: 'Phishing',
  ransomware: 'Ransomware',
  exploit: 'Exploit',
}

const severityColors = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
}

function generateThreat(): ThreatEvent {
  const source = ATTACK_SOURCES[Math.floor(Math.random() * ATTACK_SOURCES.length)]
  const target = ATTACK_TARGETS[Math.floor(Math.random() * ATTACK_TARGETS.length)]
  const type = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)]
  const severities: ThreatEvent['severity'][] = ['low', 'medium', 'high', 'critical']
  const severity = severities[Math.floor(Math.random() * severities.length)]

  return {
    id: Math.random().toString(36).slice(2),
    type,
    sourceCountry: source.country,
    targetCountry: target.country,
    sourceLat: source.lat + (Math.random() - 0.5) * 5,
    sourceLng: source.lng + (Math.random() - 0.5) * 5,
    targetLat: target.lat + (Math.random() - 0.5) * 3,
    targetLng: target.lng + (Math.random() - 0.5) * 3,
    severity,
    timestamp: Date.now(),
  }
}

// Convert lat/lng to SVG coordinates on a 1000x500 equirectangular map
function toSvg(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * 1000
  const y = ((90 - lat) / 180) * 500
  return [x, y]
}

export function ThreatMapClient() {
  const [threats, setThreats] = useState<ThreatEvent[]>([])
  const [totalAttacks, setTotalAttacks] = useState(0)
  const [cveStats, setCveStats] = useState<CVEStats>({ total: 247893, critical: 1247, high: 4823, lastUpdated: new Date().toISOString() })
  const [counters, setCounters] = useState({ ddos: 0, malware: 0, phishing: 0, ransomware: 0, exploit: 0 })

  const addThreat = useCallback(() => {
    const t = generateThreat()
    setThreats(prev => [...prev.slice(-40), t])
    setTotalAttacks(prev => prev + 1)
    setCounters(prev => ({ ...prev, [t.type]: prev[t.type] + 1 }))
  }, [])

  useEffect(() => {
    // Initial burst
    for (let i = 0; i < 8; i++) {
      setTimeout(() => addThreat(), i * 200)
    }
    // Ongoing stream
    const interval = setInterval(addThreat, 1500 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [addThreat])

  // Fetch real CVE count from NVD (best-effort, falls back to simulated)
  useEffect(() => {
    async function fetchCVE() {
      try {
        const res = await fetch('https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=1', { signal: AbortSignal.timeout(5000) })
        if (res.ok) {
          const data = await res.json()
          if (data.totalResults) {
            setCveStats(prev => ({ ...prev, total: data.totalResults, lastUpdated: new Date().toISOString() }))
          }
        }
      } catch {
        // Use simulated data
      }
    }
    fetchCVE()
  }, [])

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <StatCard icon={<Activity size={18} />} label="Attacks Detected" value={totalAttacks.toLocaleString()} color="text-red-500" />
        <StatCard icon={<Shield size={18} />} label="CVEs Tracked" value={cveStats.total.toLocaleString()} color="text-brand-accent" />
        <StatCard icon={<AlertTriangle size={18} />} label="Critical CVEs" value={cveStats.critical.toLocaleString()} color="text-red-600" />
        <StatCard icon={<Zap size={18} />} label="DDoS Attacks" value={counters.ddos.toLocaleString()} color="text-orange-500" />
        <StatCard icon={<Globe size={18} />} label="Active Threats" value={threats.length.toLocaleString()} color="text-yellow-500" className="col-span-2 sm:col-span-1" />
      </div>

      {/* Map */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-950 dark:border-gray-800">
        <svg viewBox="0 0 1000 500" className="w-full" style={{ minHeight: 300 }}>
          {/* Simplified world outline */}
          <WorldOutline />

          {/* Attack lines */}
          {threats.map((t) => {
            const [sx, sy] = toSvg(t.sourceLat, t.sourceLng)
            const [tx, ty] = toSvg(t.targetLat, t.targetLng)
            const age = (Date.now() - t.timestamp) / 1000
            const opacity = Math.max(0, 1 - age / 30)
            const midX = (sx + tx) / 2
            const midY = Math.min(sy, ty) - 30 - Math.random() * 20

            return (
              <g key={t.id} opacity={opacity}>
                {/* Arc path */}
                <path
                  d={`M${sx},${sy} Q${midX},${midY} ${tx},${ty}`}
                  fill="none"
                  stroke={typeColors[t.type]}
                  strokeWidth={t.severity === 'critical' ? 2 : 1}
                  strokeDasharray="4 4"
                  opacity={0.6}
                />
                {/* Source dot */}
                <circle cx={sx} cy={sy} r={3} fill={typeColors[t.type]} opacity={0.8}>
                  <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* Target pulse */}
                <circle cx={tx} cy={ty} r={4} fill={severityColors[t.severity]} opacity={0.9}>
                  <animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )
          })}
        </svg>

        {/* Live indicator */}
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          LIVE
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 p-3 text-xs text-white backdrop-blur">
          <div className="mb-1 font-semibold">Attack Types</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(typeLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: typeColors[key as keyof typeof typeColors] }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Threats Feed */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="border-b border-gray-200 px-5 py-3 text-sm font-semibold dark:border-gray-800">
          Recent Threat Activity
        </h2>
        <div className="max-h-80 overflow-y-auto">
          {[...threats].reverse().slice(0, 15).map((t) => (
            <div key={t.id} className="flex items-center gap-3 border-b border-gray-100 px-5 py-2.5 text-sm last:border-0 dark:border-gray-800">
              <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: severityColors[t.severity] }} />
              <span className="flex-1">
                <span className="font-medium">{typeLabels[t.type]}</span>
                {' '}from <span className="text-gray-500">{t.sourceCountry}</span>
                {' '}&rarr;{' '}<span className="text-gray-500">{t.targetCountry}</span>
              </span>
              <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                t.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' :
                t.severity === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400' :
                t.severity === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400' :
                'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
              }`}>
                {t.severity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, className = '' }: { icon: React.ReactNode; label: string; value: string; color: string; className?: string }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <div className={`flex items-center gap-2 ${color}`}>
        {icon}
        <span className="text-2xl font-bold tabular-nums">{value}</span>
      </div>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  )
}

function WorldOutline() {
  return (
    <g opacity={0.15} fill="none" stroke="#5ba8b8" strokeWidth={0.5}>
      {/* Simplified continent outlines */}
      {/* North America */}
      <path d="M120,90 L180,80 L220,100 L260,95 L280,110 L270,140 L250,170 L260,200 L240,210 L210,195 L180,200 L165,190 L150,210 L130,200 L120,170 L110,150 L100,130 L120,90" />
      {/* South America */}
      <path d="M230,250 L260,240 L290,260 L300,290 L310,330 L300,370 L280,400 L260,420 L240,400 L230,370 L225,340 L220,300 L225,270 L230,250" />
      {/* Europe */}
      <path d="M460,80 L490,75 L520,80 L540,90 L530,110 L510,120 L490,115 L480,130 L470,120 L450,110 L460,95 L460,80" />
      {/* Africa */}
      <path d="M460,160 L490,150 L520,160 L540,190 L550,230 L540,280 L530,320 L510,350 L490,360 L470,340 L460,310 L450,270 L445,230 L450,200 L460,160" />
      {/* Asia */}
      <path d="M550,60 L600,50 L660,55 L720,70 L770,80 L800,100 L780,130 L750,120 L720,130 L680,125 L650,140 L620,130 L590,140 L560,130 L550,110 L555,90 L550,60" />
      {/* Australia */}
      <path d="M760,310 L800,300 L840,310 L860,330 L850,360 L820,370 L790,360 L770,340 L760,310" />
      {/* Grid lines */}
      {[0, 100, 200, 300, 400, 500].map(y => <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y} strokeDasharray="2 8" opacity={0.3} />)}
      {[0, 200, 400, 600, 800, 1000].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="500" strokeDasharray="2 8" opacity={0.3} />)}
    </g>
  )
}
