'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Site-wide premium effects:
 *  - Lenis buttery smooth/inertia scrolling
 *  - Top scroll-progress gradient bar
 *  - Soft glow that trails the cursor on dark surfaces
 */
export default function SiteEffects() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const glowRef = useRef<HTMLDivElement>(null)
  const [pointer, setPointer] = useState(false)

  // Lenis smooth scroll
  useEffect(() => {
    let lenis: any
    let raf = 0
    let cancelled = false
    ;(async () => {
      const Lenis = (await import('lenis')).default
      if (cancelled) return
      lenis = new Lenis({ duration: 1.1, easing: (t: number) => 1 - Math.pow(1 - t, 3), smoothWheel: true })
      function loop(time: number) { lenis.raf(time); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
    })()
    return () => { cancelled = true; cancelAnimationFrame(raf); lenis?.destroy?.() }
  }, [])

  // Cursor glow
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    setPointer(true)
    function move(e: MouseEvent) {
      if (!glowRef.current) return
      glowRef.current.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] bg-gradient-to-r from-[#FF7A6B] via-[#FFB84D] to-[#2DD4BF]"
        aria-hidden="true"
      />
      {/* Cursor glow */}
      {pointer && (
        <div
          ref={glowRef}
          className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-[5] mix-blend-screen will-change-transform"
          style={{ background: 'radial-gradient(circle, rgba(255,122,107,0.07) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
      )}
    </>
  )
}
