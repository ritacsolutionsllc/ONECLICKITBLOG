'use client'

import { useEffect, useRef } from 'react'

interface AdSlotProps {
  slot: string
  adsenseId: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

export function AdSlot({ slot, adsenseId, format = 'auto', className = '' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch {
      // AdSense not loaded
    }
  }, [])

  return (
    <div ref={containerRef} className={`ad-container my-6 text-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
