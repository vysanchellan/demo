'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: number
  glow?: boolean
  variant?: 'mark' | 'wordmark'
}

/**
 * PawPal logo — a crisp, high-contrast paw mark on an emerald tile.
 */
export default function Logo({ className, size = 38, glow = false, variant = 'mark' }: LogoProps) {
  if (variant === 'wordmark') {
    return (
      <div className={cn('flex items-center gap-2.5', className)}>
        <LogoMark size={size} glow={glow} />
        <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Paw<span className="text-[#00E599]">Pal</span>
        </span>
      </div>
    )
  }
  return <LogoMark size={size} glow={glow} className={className} />
}

function LogoMark({ size = 38, glow = false, className }: { size?: number; glow?: boolean; className?: string }) {
  const id = 'pp' + Math.round(size)
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0',
        glow && 'shadow-[0_6px_28px_rgba(0,229,153,0.45)]',
        className
      )}
      style={{ width: size, height: size, borderRadius: size * 0.28 }}
      aria-label="PawPal logo"
    >
      <svg viewBox="0 0 48 48" width={size} height={size} className="relative z-10">
        <defs>
          <linearGradient id={`${id}-tile`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00FFAB" />
            <stop offset="55%" stopColor="#00E599" />
            <stop offset="100%" stopColor="#00B47A" />
          </linearGradient>
        </defs>

        {/* Tile */}
        <rect x="0" y="0" width="48" height="48" rx="13.5" fill={`url(#${id}-tile)`} />
        {/* Top sheen */}
        <rect x="0" y="0" width="48" height="22" rx="13.5" fill="#FFFFFF" opacity="0.16" />

        {/* Paw — dark on emerald */}
        <g fill="#04130D">
          {/* main pad */}
          <path d="M24 38.5c-4.6 0-8.2-2.7-8.2-6.3 0-3 2.7-4.9 4.9-6.6 1.4-1.1 2.2-2.4 3.3-2.4s1.9 1.3 3.3 2.4c2.2 1.7 4.9 3.6 4.9 6.6 0 3.6-3.6 6.3-8.2 6.3z" />
          {/* toe beans */}
          <ellipse cx="14.5" cy="22.5" rx="3.3" ry="4.2" transform="rotate(-18 14.5 22.5)" />
          <ellipse cx="20.5" cy="16" rx="3.3" ry="4.4" />
          <ellipse cx="27.5" cy="16" rx="3.3" ry="4.4" />
          <ellipse cx="33.5" cy="22.5" rx="3.3" ry="4.2" transform="rotate(18 33.5 22.5)" />
        </g>

        {/* Crisp border */}
        <rect x="0.6" y="0.6" width="46.8" height="46.8" rx="13" fill="none" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="1.2" />
      </svg>
    </div>
  )
}
