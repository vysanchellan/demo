'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Reports', href: '/reports' },
  { label: 'Companies', href: '/companies' },
  { label: 'Assessment', href: '/assessment' },
  { label: 'Resources', href: '/resources' },
  { label: 'Risk Predictor', href: '/predict' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-6xl rounded-2xl transition-all duration-500',
          scrolled
            ? 'glass-strong border border-white/8 shadow-2xl shadow-black/40'
            : 'border border-white/[0.04] bg-[#0F1012]/30 backdrop-blur-md'
        )}
        aria-label="Primary"
      >
        <div className="flex items-center justify-between px-4 py-2.5">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="BURNOUT home">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5E3A] to-[#FF8A65] flex items-center justify-center shadow-[0_4px_20px_rgba(255,94,58,0.4)] group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
              <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-lg font-black tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              BURN<span className="text-[#FF5E3A]">OUT</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] text-zinc-400 font-mono">
              v2.0
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors group rounded-lg"
              >
                <span className="relative z-10 flex items-center gap-1">
                  {item.label}
                  {item.label === 'Risk Predictor' && (
                    <Sparkles className="w-3 h-3 text-[#FF5E3A]" />
                  )}
                </span>
                <span className="absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#FF5E3A] to-[#FF8A65] hover:from-[#EA4520] hover:to-[#FF5E3A] text-white border-0 shadow-[0_4px_20px_rgba(255,94,58,0.3)] gap-1.5"
              >
                Report Now <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-[#0F1012] border-l border-white/8 lg:hidden p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-black text-xl" style={{ fontFamily: 'var(--font-display)' }}>
                  Menu
                </span>
                <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center" aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {NAV.map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-xl text-zinc-300 hover:bg-white/5 transition-colors">
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                  </Link>
                ))}
                <div className="h-px bg-white/5 my-4" />
                <Link href="/auth/login" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-zinc-300 hover:bg-white/5">
                  Sign In
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
