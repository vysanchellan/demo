'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Flame, AlertTriangle, BarChart3, Shield, Users, ArrowRight,
  TrendingUp, Eye, Lock, ChevronDown, Zap, Brain, Heart,
  Building2, FileWarning, Star, CheckCircle2, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const STATS = [
  { value: '77%', label: 'of workers experience burnout', icon: Flame },
  { value: '63%', label: 'say their employer does nothing', icon: Building2 },
  { value: '3.2x', label: 'higher turnover in toxic workplaces', icon: TrendingUp },
  { value: '~$322B', label: 'lost globally per year to burnout', icon: BarChart3 },
]

const FEATURES = [
  {
    icon: FileWarning,
    title: 'Anonymous Reporting',
    desc: 'Submit workplace toxicity reports with full anonymity. No email. No trace. Your story matters.',
    color: '#FF3B30',
  },
  {
    icon: Brain,
    title: 'Burnout Assessment',
    desc: 'Take our science-backed assessment to measure your burnout risk across 3 key dimensions.',
    color: '#FF6B6B',
  },
  {
    icon: Building2,
    title: 'Company Intelligence',
    desc: 'Search any company. See their toxicity score, report history, and risk rating — crowd-sourced truth.',
    color: '#FFB347',
  },
  {
    icon: BarChart3,
    title: 'Industry Analytics',
    desc: 'Real-time heatmaps and trend analysis. Which sectors are burning people out the most?',
    color: '#4ECDC4',
  },
  {
    icon: Heart,
    title: 'Resource Directory',
    desc: 'Curated mental health resources, crisis lines, and therapist directories — free and paid.',
    color: '#9B59B6',
  },
  {
    icon: Shield,
    title: 'Verified Reports',
    desc: "Community verification system. Upvote reports you've witnessed. Build a trusted database.",
    color: '#FF3B30',
  },
]

const REPORT_TYPES = [
  'Chronic Overwork', 'Harassment', 'Gaslighting',
  'Wage Theft', 'Discrimination', 'Retaliation',
  'Micromanagement', 'Unsafe Conditions', 'Nepotism', 'Burnout Culture',
  'Mental Health Neglect', 'Toxic Leadership',
]

const RECENT_REPORTS = [
  { company: 'Tech Corp ****', type: 'Chronic Overwork', severity: 9, time: '2h ago', city: 'Johannesburg' },
  { company: 'Finance Ltd **', type: 'Gaslighting', severity: 8, time: '5h ago', city: 'Cape Town' },
  { company: 'Media Group *', type: 'Harassment', severity: 10, time: '1d ago', city: 'Durban' },
  { company: 'Retail Co ****', type: 'Wage Theft', severity: 7, time: '2d ago', city: 'Pretoria' },
]

function CountUpNumber({ target }: { target: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let current = 0
    const step = target / 60
    const timer = setInterval(() => {
      current += step
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, 16)
    return () => clearInterval(timer)
  }, [started, target])

  return <span ref={ref}>{count}</span>
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const [activeReport, setActiveReport] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReport(p => (p + 1) % RECENT_REPORTS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-x-hidden">

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-xl bg-[#0A0A0A]/80"
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-[#FF3B30] rounded-lg opacity-20 animate-pulse" />
            <Flame className="w-8 h-8 text-[#FF3B30] relative z-10" />
          </div>
          <span className="text-xl font-black tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            BURN<span className="text-[#FF3B30]">OUT</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-[#9A9A9A]">
          {[
            { label: 'Reports', href: '/reports' },
            { label: 'Companies', href: '/companies' },
            { label: 'Assessment', href: '/assessment' },
            { label: 'Resources', href: '/resources' },
          ].map(item => (
            <Link key={item.label} href={item.href} className="hover:text-white transition-colors duration-200">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="text-[#9A9A9A] hover:text-white">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="bg-[#FF3B30] hover:bg-[#E0342A] text-white border-0">
              Report Now
            </Button>
          </Link>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,59,48,0.1) 0%, transparent 70%)' }}
        />
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,179,71,0.06) 0%, transparent 70%)' }} />

        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF3B30]/20 to-transparent animate-scan pointer-events-none" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF3B30]/30 bg-[#FF3B30]/10 text-[#FF3B30] text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse" />
            <span>14,891 reports filed this month</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-7xl md:text-9xl font-black leading-none mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            YOUR JOB IS
            <br />
            <span className="gradient-text">KILLING YOU.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl md:text-2xl text-[#9A9A9A] max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            The platform that names toxic workplaces, measures burnout,
            and gives workers the intelligence they need to protect themselves.
            <span className="text-white"> Anonymously.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-[#FF3B30] hover:bg-[#E0342A] text-white border-0 text-lg px-8 py-6 glow-red-sm transition-all duration-300 hover:scale-105"
              >
                <FileWarning className="w-5 h-5 mr-2" />
                File a Report — Anonymously
              </Button>
            </Link>
            <Link href="/assessment">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 text-lg px-8 py-6 transition-all duration-300"
              >
                <Brain className="w-5 h-5 mr-2" />
                Check Your Burnout Score
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="inline-flex items-center gap-3 text-sm text-[#9A9A9A] border border-white/8 rounded-full px-5 py-2.5 bg-white/[0.03]"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse shrink-0" />
            <span>Live:</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={activeReport}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-white"
              >
                {RECENT_REPORTS[activeReport].company} — {RECENT_REPORTS[activeReport].type} — {RECENT_REPORTS[activeReport].city}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#9A9A9A] text-xs"
        >
          <span>Scroll to explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="py-24 border-y border-white/5 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-[#FF3B30] mx-auto mb-4" />
                <div className="text-5xl font-black mb-2 gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                  {stat.value}
                </div>
                <p className="text-[#9A9A9A] text-sm leading-relaxed">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="py-6 overflow-hidden border-b border-white/5">
        <div className="animate-marquee">
          {[...REPORT_TYPES, ...REPORT_TYPES].map((type, i) => (
            <span key={i} className="mx-4 px-4 py-2 rounded-full border border-white/10 text-[#9A9A9A] text-sm whitespace-nowrap">
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Badge className="mb-6 bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/30">
            Platform Features
          </Badge>
          <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            TOOLS FOR THE <span className="gradient-text">EXHAUSTED.</span>
          </h2>
          <p className="text-[#9A9A9A] text-xl max-w-2xl mx-auto">
            Everything you need to document, understand, and escape workplace toxicity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group p-6 bg-[#111111] border border-white/8 rounded-2xl card-hover cursor-pointer"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${feature.color}18` }}
              >
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-[#9A9A9A] text-sm leading-relaxed">{feature.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: feature.color }}>
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Burnout Score Preview ── */}
      <section className="py-24 px-6 bg-[#0D0D0D] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-6 bg-[#FFB347]/10 text-[#FFB347] border-[#FFB347]/30">
                Burnout Assessment
              </Badge>
              <h2 className="text-5xl font-black mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                ARE YOU ON THE
                <br />
                <span className="text-[#FF3B30]">EDGE?</span>
              </h2>
              <p className="text-[#9A9A9A] text-lg mb-8 leading-relaxed">
                Our Maslach Burnout Inventory-inspired assessment measures your exhaustion,
                cynicism, and professional efficacy across 22 questions.
                Takes 3 minutes. Could save your career — or your life.
              </p>
              <div className="space-y-3 mb-8">
                {['Emotional Exhaustion Score', 'Depersonalisation / Cynicism Score', 'Personal Efficacy Score'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-[#9A9A9A]">
                    <CheckCircle2 className="w-5 h-5 text-[#4ECDC4] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/assessment">
                <Button className="bg-[#FF3B30] hover:bg-[#E0342A] text-white border-0">
                  Take Free Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 rounded-full border-2 border-[#FF3B30]/20 animate-pulse" />
                <div className="absolute inset-4 rounded-full border border-[#FF3B30]/10" />
                <div className="absolute inset-8 rounded-full bg-[#111111] border border-white/10 flex flex-col items-center justify-center glow-red">
                  <span className="text-6xl font-black gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                    <CountUpNumber target={73} />
                  </span>
                  <span className="text-[#FF6B6B] text-sm font-semibold mt-1">WARNING</span>
                  <span className="text-[#9A9A9A] text-xs mt-1">Burnout Risk</span>
                </div>
                {[0, 120, 240].map((deg, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      background: ['#FF3B30', '#FFB347', '#4ECDC4'][i],
                      top: `calc(50% - 6px + ${Math.sin((deg * Math.PI) / 180) * 130}px)`,
                      left: `calc(50% - 6px + ${Math.cos((deg * Math.PI) / 180) * 130}px)`,
                    }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Recent Reports Feed ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <Badge className="mb-4 bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/30">
              <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse mr-2 inline-block" />
              Live Activity
            </Badge>
            <h2 className="text-4xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
              RECENT REPORTS
            </h2>
          </div>
          <Link href="/reports">
            <Button variant="outline" className="border-white/20 text-[#9A9A9A] hover:text-white">
              View All
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        <div className="space-y-4">
          {RECENT_REPORTS.map((report, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-5 bg-[#111111] border border-white/8 rounded-xl hover:border-[#FF3B30]/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#FF3B30]/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#FF3B30]" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{report.company}</div>
                  <div className="text-[#9A9A9A] text-xs mt-0.5">{report.city} · {report.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-[#1A1A1A] text-[#9A9A9A] border-white/10 hidden sm:inline-flex">{report.type}</Badge>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#FF3B30]">{report.severity}/10</span>
                  <div className="w-16 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF3B30]"
                      style={{ width: `${report.severity * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl border border-[#FF3B30]/20 bg-gradient-to-b from-[#FF3B30]/10 to-transparent relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          <div className="relative z-10">
            <Zap className="w-12 h-12 text-[#FF3B30] mx-auto mb-6 animate-float" />
            <h2 className="text-5xl font-black mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              SILENCE IS WHAT
              <br />
              <span className="gradient-text">THEY COUNT ON.</span>
            </h2>
            <p className="text-[#9A9A9A] text-lg mb-8 max-w-xl mx-auto">
              Every anonymous report you file makes the next hire safer.
              Every burnout score shared starts a conversation. Break the silence.
            </p>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-[#FF3B30] hover:bg-[#E0342A] text-white border-0 text-lg px-10 py-6 glow-red transition-all duration-300 hover:scale-105"
              >
                Join BURNOUT — Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#FF3B30]" />
            <span className="font-black text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              BURN<span className="text-[#FF3B30]">OUT</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#9A9A9A]">
            {['Privacy', 'Terms', 'Reports', 'Companies', 'Resources', 'Dashboard'].map(item => (
              <Link key={item} href="#" className="hover:text-white transition-colors">{item}</Link>
            ))}
          </div>
          <p className="text-[#9A9A9A] text-xs">
            &copy; 2026 BURNOUT Platform. All reports are anonymous.
          </p>
        </div>
      </footer>
    </div>
  )
}
