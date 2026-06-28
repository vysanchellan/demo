'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, ArrowRight, PawPrint, Apple, Star, ShieldCheck, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Curated pet photography for the media wall
const COL_A = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=420&h=520&fit=crop',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=420&h=560&fit=crop',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=420&h=520&fit=crop',
]
const COL_B = [
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=420&h=620&fit=crop',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=420&h=520&fit=crop',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=420&h=560&fit=crop',
]
const COL_C = [
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=420&h=560&fit=crop',
  'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=420&h=620&fit=crop',
  'https://images.unsplash.com/photo-1437957146754-f6377debe171?w=420&h=520&fit=crop',
]

function MediaColumn({ images, duration, direction }: { images: string[]; duration: number; direction: 'up' | 'down' }) {
  const loop = [...images, ...images]
  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        className={direction === 'up' ? 'marquee-col-up' : 'marquee-col-down'}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((src, i) => (
          <div key={i} className="relative w-full aspect-[4/5] mb-4 rounded-2xl overflow-hidden border border-white/10">
            <Image src={src} alt="" fill className="object-cover" sizes="200px" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A0A]/40 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HeroPawPal() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden grain">
      {/* Ambient warm aurora */}
      <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
      <div className="absolute top-1/3 -left-40 w-[700px] h-[700px] rounded-full animate-glow-pulse pointer-events-none" aria-hidden="true"
        style={{ background: 'radial-gradient(circle, rgba(255,122,107,0.18) 0%, transparent 65%)' }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" aria-hidden="true"
        style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 65%)' }} />
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        {/* ── Left: editorial ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl mb-7"
          >
            <div className="flex -space-x-2">
              {['photo-1438761681033-6461ffad8d80', 'photo-1500648767791-00dcc994a43e', 'photo-1494790108377-be9c29b29330'].map((p, i) => (
                <div key={i} className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-[#0C0A0A]">
                  <Image src={`https://images.unsplash.com/${p}?w=48&h=48&fit=crop`} alt="" fill className="object-cover" sizes="24px" />
                </div>
              ))}
            </div>
            <span className="text-xs text-zinc-200 font-medium">Loved by 120,000+ pet parents</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[0.98] tracking-[-0.035em] mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="block text-gradient-soft">The whole world of</span>
            <span className="block">
              <span style={{ fontFamily: 'var(--font-serif)' }} className="italic font-normal text-[#FF7A6B]">pet care</span>
              <span className="text-gradient-soft">, in one app.</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}
            className="text-lg text-zinc-300 max-w-lg leading-relaxed mb-9"
          >
            Smart nutrition plans, instant food-safety checks, health tracking, and trusted vets near you —
            everything your dog, cat or critter needs to live longer and happier.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 mb-10"
          >
            <Link href="/auth/signup">
              <Button size="lg" className="btn-glass-emerald text-base px-7 py-6 gap-2 group rounded-2xl">
                <PawPrint className="w-5 h-5" /> Add Your Pet
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/nutrition">
              <Button size="lg" className="btn-glass text-white text-base px-7 py-6 gap-2 group rounded-2xl">
                <Apple className="w-5 h-5" /> Try the Planner
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Inline trust stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <div>
              <div className="text-2xl font-semibold tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>120k+</div>
              <div className="text-xs text-zinc-500">pet parents</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-2xl font-semibold tabular-nums flex items-center gap-1" style={{ fontFamily: 'var(--font-display)' }}>
                4.9 <Star className="w-4 h-4 text-[#FFB84D] fill-[#FFB84D]" />
              </div>
              <div className="text-xs text-zinc-500">avg. rating</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-2xl font-semibold tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>18k+</div>
              <div className="text-xs text-zinc-500">pets tracked</div>
            </div>
          </motion.div>
        </div>

        {/* ── Right: media wall ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 1 }}
          className="relative hidden lg:block"
        >
          <div className="relative h-[560px] flex gap-4 mask-fade-y [transform:perspective(1400px)_rotateY(-8deg)_rotateX(2deg)]">
            <MediaColumn images={COL_A} duration={32} direction="up" />
            <MediaColumn images={COL_B} duration={40} direction="down" />
            <MediaColumn images={COL_C} duration={36} direction="up" />
          </div>

          {/* Floating glass stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="absolute -left-6 top-16 glass-card rounded-2xl p-3.5 pr-5 flex items-center gap-3 shadow-2xl"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FF7A6B]/15 border border-[#FF7A6B]/25 flex items-center justify-center">
              <Apple className="w-4.5 h-4.5 text-[#FF7A6B]" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">Biscuit&rsquo;s plan</div>
              <div className="text-[11px] text-zinc-400">742 kcal · 2 meals</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            className="absolute -right-4 bottom-20 glass-card rounded-2xl p-3.5 pr-5 flex items-center gap-3 shadow-2xl"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/25 flex items-center justify-center">
              <MapPin className="w-4.5 h-4.5 text-[#2DD4BF]" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">Vet 1.2km away</div>
              <div className="text-[11px] text-zinc-400">Open now · ★ 4.9</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.15 }}
            className="absolute left-1/2 -translate-x-1/2 -bottom-4 glass-card rounded-full px-4 py-2 flex items-center gap-2 shadow-2xl"
          >
            <ShieldCheck className="w-4 h-4 text-[#FF7A6B]" />
            <span className="text-xs font-medium">Chocolate? <span className="text-[#FF5A5F]">Toxic</span> — checked</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-500"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowRight className="w-4 h-4 rotate-90" />
        </motion.div>
      </motion.div>
    </section>
  )
}
