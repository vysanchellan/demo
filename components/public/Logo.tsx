'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: number
  glow?: boolean
  variant?: 'mark' | 'wordmark'
}

/**
 * BURNOUT logo — a crisp, high-contrast ember mark.
 * Solid emerald tile, bold dark flame, hot inner core.
 */
export default function Logo({ className, size = 38, glow = false, variant = 'mark' }: LogoProps) {
  if (variant === 'wordmark') {
    return (
      <div className={cn('flex items-center gap-2.5', className)}>
        <LogoMark size={size} glow={glow} />
        <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          BURN<span className="text-[#00E599]">OUT</span>
        </span>
      </div>
    )
  }
  return <LogoMark size={size} glow={glow} className={className} />
}

function LogoMark({ size = 38, glow = false, className }: { size?: number; glow?: boolean; className?: string }) {
  const id = 'lg' + Math.round(size)
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0',
        glow && 'shadow-[0_6px_28px_rgba(0,229,153,0.45)]',
        className
      )}
      style={{ width: size, height: size, borderRadius: size * 0.28 }}
      aria-label="BURNOUT logo"
    >
      <svg viewBox="0 0 48 48" width={size} height={size} className="relative z-10">
        <defs>
          <linearGradient id={`${id}-tile`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00FFAB" />
            <stop offset="55%" stopColor="#00E599" />
            <stop offset="100%" stopColor="#00B47A" />
          </linearGradient>
          <linearGradient id={`${id}-spark`} x1="24" y1="14" x2="24" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#063626" />
            <stop offset="100%" stopColor="#04130D" />
          </linearGradient>
        </defs>

        {/* Tile */}
        <rect x="0" y="0" width="48" height="48" rx="13.5" fill={`url(#${id}-tile)`} />
        {/* Top sheen */}
        <rect x="0" y="0" width="48" height="22" rx="13.5" fill="#FFFFFF" opacity="0.16" />

        {/* Bold flame in dark negative space */}
        <path
          d="M24 9
             C 27 16, 33 18, 33 26.5
             C 33 33, 28.5 38, 24 38
             C 19.5 38, 15 33.5, 15 27
             C 15 23, 17 21.5, 18.5 19.5
             C 19.2 22, 20.8 23, 22 22.5
             C 23.6 21.8, 22.5 17, 24 9 Z"
          fill={`url(#${id}-spark)`}
        />
        {/* Inner hot core */}
        <path
          d="M24 22
             C 26 25.5, 27.5 27.5, 27.5 30
             C 27.5 33.2, 25.9 35, 24 35
             C 22.1 35, 20.5 33.2, 20.5 30.2
             C 20.5 27.8, 22 25.6, 24 22 Z"
          fill="#00FFAB"
        />

        {/* Crisp border */}
        <rect x="0.6" y="0.6" width="46.8" height="46.8" rx="13" fill="none" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="1.2" />
      </svg>
    </div>
  )
}
