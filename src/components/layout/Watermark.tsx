export function Watermark() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 520 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-[600px] opacity-[0.03] dark:opacity-[0.04]"
      >
        {/* Screen body */}
        <g transform="translate(0, 2)">
          <rect x="2" y="4" width="44" height="32" rx="3" stroke="currentColor" strokeWidth="3" fill="none"/>
          <line x1="10" y1="14" x2="30" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="10" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="10" y1="26" x2="26" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="24" y1="36" x2="24" y2="44" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <line x1="14" y1="44" x2="34" y2="44" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M34 28 L42 36 L38 37 L41 43 L39 44 L36 38 L33 41 Z" fill="currentColor"/>
          <circle cx="8" cy="32" r="2" fill="currentColor"/>
        </g>
        {/* Text */}
        <text x="58" y="38" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="32" fill="currentColor">
          OneClickIT.blog
        </text>
      </svg>
    </div>
  )
}
