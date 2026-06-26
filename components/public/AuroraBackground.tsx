'use client'
import { motion } from 'framer-motion'

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-mesh" />

      {/* Morphing blobs */}
      <motion.div
        className="absolute top-[5%] left-[15%] w-[640px] h-[640px] animate-blob"
        style={{ background: 'radial-gradient(circle, rgba(0,229,153,0.22) 0%, transparent 65%)' }}
        animate={{ x: [0, 90, -50, 0], y: [0, -50, 70, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[2%] right-[18%] w-[560px] h-[560px] animate-blob"
        style={{ background: 'radial-gradient(circle, rgba(46,139,255,0.18) 0%, transparent 65%)' }}
        animate={{ x: [0, -70, 50, 0], y: [0, 50, -70, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[40%] right-[5%] w-[420px] h-[420px] animate-blob"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 65%)' }}
        animate={{ x: [0, -90, 0], y: [0, 70, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[20%] left-[40%] w-[380px] h-[380px] animate-blob"
        style={{ background: 'radial-gradient(circle, rgba(20,229,200,0.14) 0%, transparent 65%)' }}
        animate={{ x: [0, 60, -40, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Rotating conic ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.08] animate-rotate-slow"
        style={{ background: 'conic-gradient(from 0deg, transparent, #00E599, transparent, #2E8BFF, transparent, #14E5C8, transparent)' }}
      />

      <div className="absolute inset-0 bg-grid opacity-50" />
    </div>
  )
}
