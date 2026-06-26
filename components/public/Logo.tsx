'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: number
  glow?: boolean
  variant?: 'mark' | 'wordmark'
}

/**
 * BURNOUT custom logo — abstract ember mark.
 * A layered diamond/flame shape with depth, gradient fill, and inner highlight.
 */
export default function Logo({ className, size = 36, glow = false, variant = 'mark' }: LogoProps) {
  if (variant === 'wordmark') {
    return (
      <div className={cn('flex items-center gap-2.5', className)}>
        <LogoMark size={size} glow={glow} />
        <span
          className="text-lg font-black tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          BURN<span className="text-[#FF5E3A]">OUT</span>
        </span>
      </div>
    )
  }
  return <LogoMark size={size} glow={glow} className={className} />
}

function LogoMark({ size = 36, glow = false, className }: { size?: number; glow?: boolean; className?: string }) {
  const id = 'logo-' + Math.random().toString(36).slice(2, 7)
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-xl shrink-0',
        glow && 'shadow-[0_8px_30px_rgba(0,229,153,0.5)]',
        className
      )}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #00E599 0%, #14E5C8 55%, #5EEAD4 100%)',
      }}
      aria-label="BURNOUT logo"
    >
      {/* Inner highlight gradient overlay */}
      <span
        className="absolute inset-0 rounded-xl opacity-60"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.45) 0%, transparent 55%)',
        }}
        aria-hidden="true"
      />
      {/* Bottom shadow tint */}
      <span
        className="absolute inset-0 rounded-xl opacity-45"
        style={{
          background: 'linear-gradient(180deg, transparent 50%, rgba(176,18,70,0.6) 100%)',
        }}
        aria-hidden="true"
      />
      {/* Custom mark SVG */}
      <svg
        viewBox="0 0 32 32"
        width={size * 0.65}
        height={size * 0.65}
        fill="none"
        className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
      >
        <defs>
          <linearGradient id={`${id}-a`} x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        {/* Outer abstract flame — sharper, more geometric than lucide flame */}
        <path
          d="M16 3
             L21.5 11
             L19 14.5
             L23 18
             L20 22
             L23 27
             L16 29.5
             L9 27
             L12 22
             L9 18
             L13 14.5
             L10.5 11 Z"
          fill={`url(#${id}-a)`}
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        {/* Inner core diamond */}
        <path
          d="M16 11
             L18.5 16
             L16 22
             L13.5 16 Z"
          fill="#00E599"
          fillOpacity="0.9"
        />
      </svg>
      {/* Glass highlight ring */}
      <span
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.2)',
        }}
        aria-hidden="true"
      />
    </div>
  )
}
