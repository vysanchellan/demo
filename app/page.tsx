'use client'

import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Flame, ArrowUpRight, ArrowRight, ChevronDown, ChevronRight,
  Shield, Brain, Building2, BarChart3, Heart, FileWarning,
  Sparkles, Zap, Lock, Eye, EyeOff, Clock, MapPin, AlertTriangle,
  TrendingUp, TrendingDown, Users, CheckCircle2, Star,
  MessageSquare, Globe, Activity, Target, Briefcase, Coffee,
  Moon, Sun, Bell, Quote, Play, Pause, Plus, Minus,
  Database, Cpu, Network, Layers, Gauge, LineChart as LineChartIcon,
  ShieldCheck, LockKeyhole, FileLock, KeyRound
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AuroraBackground from '@/components/public/AuroraBackground'
import Navbar from '@/components/public/Navbar'
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid
} from 'recharts'

// ─────────── Data ───────────
const STATS = [
  { value: 77, suffix: '%', label: 'workers experiencing burnout', sub: '+18% since 2023', icon: Flame, color: '#FF5E3A' },
  { value: 63, suffix: '%', label: 'employers ignoring complaints', sub: 'WHO 2025 report', icon: EyeOff, color: '#FBBF24' },
  { value: 322, prefix: '$', suffix: 'B', label: 'global productivity lost yearly', sub: 'Gallup workplace study', icon: TrendingDown, color: '#8B5CF6' },
  { value: 51200, suffix: '+', label: 'workers protected via BURNOUT', sub: 'Live, growing daily', icon: Users, color: '#10D9B8' },
]

const FEATURES_BENTO = [
  {
    title: 'Anonymous Encrypted Reports',
    desc: 'AES-256 encryption. No IP logging. Zero-knowledge architecture means we couldn\'t leak your data if we wanted to.',
    icon: ShieldCheck, color: '#FF5E3A', span: 'lg:col-span-2', tag: 'Privacy First',
  },
  {
    title: 'Clinical Burnout Assessment',
    desc: 'Maslach Burnout Inventory-aligned scoring across 3 dimensions.',
    icon: Brain, color: '#8B5CF6', span: '', tag: 'Validated Method',
  },
  {
    title: 'Real-Time Company Intelligence',
    desc: 'Aggregated toxicity scores across 2,340+ companies. Filter, search, compare.',
    icon: Building2, color: '#10D9B8', span: '', tag: 'Live Data',
  },
  {
    title: 'AI Risk Predictor',
    desc: 'Input your industry, role, and signals — get a personalised burnout probability with similar-case benchmarks.',
    icon: Sparkles, color: '#FBBF24', span: 'lg:col-span-2', tag: 'New',
  },
]

const TESTIMONIALS = [
  {
    name: 'Amara Okonkwo',
    role: 'Senior Software Engineer',
    company: 'Tech, JHB',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    quote: 'I filed three reports about my old company in five minutes. Two weeks later, two friends saw them and avoided the job offer. BURNOUT literally saved their mental health.',
    burnoutBefore: 84, burnoutAfter: 31,
  },
  {
    name: 'Thabo Mokoena',
    role: 'Financial Analyst',
    company: 'Banking, CPT',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    quote: 'The assessment told me exactly what I already felt but couldn\'t name. Critical exhaustion, severe cynicism. I quit two months later. Best decision of my career.',
    burnoutBefore: 91, burnoutAfter: 42,
  },
  {
    name: 'Lerato Dube',
    role: 'Nurse Manager',
    company: 'Healthcare, DBN',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    quote: 'I never thought workers had a voice against giant employers. The verified reports gave us proof. Three managers were investigated after our department filed together.',
    burnoutBefore: 78, burnoutAfter: 48,
  },
]

const COMPANIES_LOGOS = [
  'TechNova', 'FirstBank', 'MediaPlex', 'HealthNet', 'GovDept', 'RetailHub',
  'BuildCo', 'LawFirm', 'EduGroup', 'AgriCorp', 'TransLogix', 'ConsultPro',
]

const FAQS = [
  {
    q: 'Is this actually anonymous?',
    a: 'Yes. We use AES-256 encryption, never log IP addresses, and reports are stored without any user attribution by default. Even our own engineers cannot connect a report to a person.',
  },
  {
    q: 'Can companies sue me for filing a report?',
    a: 'Reports are automatically redacted to protect identifiers. We comply with whistleblower protections under the South African Companies Act and the Protected Disclosures Act. We do not share data with third parties.',
  },
  {
    q: 'Is the burnout assessment medically accurate?',
    a: 'It is based on the Maslach Burnout Inventory (MBI), the most validated burnout instrument in occupational psychology. Results are indicative — not a clinical diagnosis. We always recommend speaking with a mental health professional.',
  },
  {
    q: 'How are toxicity scores calculated?',
    a: 'Each report contributes weighted points based on severity (1-10), report type, and community verification. Scores are normalised by company size and industry, then mapped to a 0-100 toxicity scale.',
  },
  {
    q: 'Is BURNOUT really free?',
    a: 'Forever free for individuals. Filing reports, taking assessments, browsing companies — all free. We sustain the platform through anonymised, aggregated industry intelligence licenced to research institutions.',
  },
]

const TICKER_INDUSTRIES = [
  { name: 'Technology', score: 88, change: '+5.2' },
  { name: 'Finance', score: 72, change: '+2.1' },
  { name: 'Healthcare', score: 81, change: '+8.4' },
  { name: 'Media', score: 76, change: '-1.2' },
  { name: 'Retail', score: 64, change: '+3.0' },
  { name: 'Government', score: 79, change: '+6.5' },
  { name: 'Legal', score: 68, change: '-0.4' },
  { name: 'Construction', score: 83, change: '+4.1' },
  { name: 'Education', score: 71, change: '+2.8' },
  { name: 'Manufacturing', score: 66, change: '+1.0' },
]

const TREND_DATA = [
  { week: 'W1', reports: 420 }, { week: 'W2', reports: 540 },
  { week: 'W3', reports: 480 }, { week: 'W4', reports: 720 },
  { week: 'W5', reports: 890 }, { week: 'W6', reports: 1020 },
  { week: 'W7', reports: 1150 }, { week: 'W8', reports: 1380 },
]

// ─────────── Animated Counter ───────────
function Counter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = to / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setVal(to); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, to])

  const formatted = val.toLocaleString()
  return <span ref={ref}>{prefix}{formatted}{suffix}</span>
}

// ─────────── Risk Predictor Card ───────────
function RiskPredictor() {
  const [industry, setIndustry] = useState('Technology')
  const [hours, setHours] = useState(50)
  const [signals, setSignals] = useState<string[]>(['micromanagement'])

  const SIGNAL_OPTIONS = [
    { key: 'micromanagement', label: 'Micromanagement' },
    { key: 'overwork', label: 'Chronic overtime' },
    { key: 'unclear_goals', label: 'Unclear goals' },
    { key: 'low_recognition', label: 'Low recognition' },
    { key: 'toxic_peers', label: 'Toxic peers' },
    { key: 'no_growth', label: 'No growth path' },
  ]

  const INDUSTRY_MULT: Record<string, number> = {
    Technology: 1.15, Finance: 1.1, Healthcare: 1.3, Media: 1.05,
    Retail: 0.9, Government: 1.0, Legal: 1.15, Construction: 1.1,
  }

  const risk = Math.min(100, Math.round(
    (hours - 35) * 1.4 + signals.length * 8 + 22 * (INDUSTRY_MULT[industry] ?? 1)
  ))
  const riskLevel = risk >= 75 ? 'CRITICAL' : risk >= 55 ? 'HIGH' : risk >= 35 ? 'MEDIUM' : 'LOW'
  const riskColor = risk >= 75 ? '#FF5E3A' : risk >= 55 ? '#FBBF24' : risk >= 35 ? '#10D9B8' : '#3B82F6'

  const radarData = [
    { axis: 'Exhaustion', value: Math.min(100, hours * 1.6 + (signals.includes('overwork') ? 20 : 0)) },
    { axis: 'Cynicism', value: Math.min(100, signals.length * 14 + 20) },
    { axis: 'Inefficacy', value: Math.min(100, (signals.includes('low_recognition') ? 35 : 10) + (signals.includes('unclear_goals') ? 25 : 5) + 25) },
    { axis: 'Isolation', value: Math.min(100, (signals.includes('toxic_peers') ? 50 : 15) + 25) },
    { axis: 'Stagnation', value: Math.min(100, (signals.includes('no_growth') ? 55 : 20) + 20) },
    { axis: 'Pressure', value: Math.min(100, hours * 1.2 + (signals.includes('micromanagement') ? 28 : 8)) },
  ]

  function toggleSignal(k: string) {
    setSignals(prev => prev.includes(k) ? prev.filter(s => s !== k) : [...prev, k])
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Inputs */}
      <div className="space-y-5">
        <div>
          <label htmlFor="industry-select" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
            Your Industry
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(INDUSTRY_MULT).slice(0, 6).map(ind => (
              <button
                key={ind}
                onClick={() => setIndustry(ind)}
                aria-pressed={industry === ind}
                className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                  industry === ind
                    ? 'bg-[#FF5E3A]/15 border-[#FF5E3A]/40 text-[#FF5E3A]'
                    : 'bg-white/[0.03] border-white/8 text-zinc-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="hours-slider" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Weekly Hours
            </label>
            <span className="font-mono text-sm text-[#FF5E3A] font-semibold">{hours}h</span>
          </div>
          <input
            id="hours-slider"
            type="range" min={30} max={90} value={hours}
            onChange={e => setHours(parseInt(e.target.value))}
            className="w-full accent-[#FF5E3A]"
            aria-label="Weekly hours worked"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>30h</span><span>60h</span><span>90h</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
            Active Signals ({signals.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {SIGNAL_OPTIONS.map(s => (
              <button
                key={s.key}
                onClick={() => toggleSignal(s.key)}
                aria-pressed={signals.includes(s.key)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  signals.includes(s.key)
                    ? 'bg-[#FF5E3A]/15 border-[#FF5E3A]/40 text-[#FF5E3A]'
                    : 'bg-white/[0.03] border-white/8 text-zinc-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {signals.includes(s.key) && '✓ '}{s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result + Radar */}
      <div className="space-y-4">
        <div className="relative p-5 rounded-2xl border bg-gradient-to-br from-[#16171A] to-[#0F1012]"
          style={{ borderColor: `${riskColor}40` }}
          role="status" aria-live="polite"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              Risk Score
            </div>
            <Badge
              className="text-[10px] font-mono"
              style={{ background: `${riskColor}20`, color: riskColor, borderColor: `${riskColor}40` }}
            >
              {riskLevel}
            </Badge>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-6xl font-black tabular-nums" style={{ color: riskColor, fontFamily: 'var(--font-display)' }}>
              {risk}
            </div>
            <div className="text-xs text-zinc-400 mb-2 text-right max-w-[150px]">
              {risk >= 75 ? 'Severe burnout likely within 6 months.' :
               risk >= 55 ? 'Significant risk. Intervention recommended.' :
               risk >= 35 ? 'Moderate risk. Monitor patterns.' :
               'Low risk. Maintain current habits.'}
            </div>
          </div>
          <div className="mt-4 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${risk}%` }}
              transition={{ duration: 0.6 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, #FBBF24, ${riskColor})` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-2xl border border-white/8 bg-[#0F1012] h-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: '#A1A1AA', fontSize: 10 }} />
              <Radar dataKey="value" stroke={riskColor} fill={riskColor} fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ─────────── Testimonial Card ───────────
function TestimonialCard({ t }: { t: typeof TESTIMONIALS[number] }) {
  return (
    <div className="p-6 rounded-2xl border border-white/8 bg-gradient-to-br from-[#16171A] to-[#0F1012] surface-hover h-full flex flex-col">
      <Quote className="w-7 h-7 text-[#FF5E3A]/40 mb-4" />
      <p className="text-zinc-300 leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>

      {/* Before/after */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-[#FF5E3A]/10 border border-[#FF5E3A]/20">
          <div className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Before BURNOUT</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black tabular-nums" style={{ color: '#FF5E3A', fontFamily: 'var(--font-display)' }}>{t.burnoutBefore}</span>
            <span className="text-xs text-zinc-500">/100</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#10D9B8]/10 border border-[#10D9B8]/20">
          <div className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">After 90 days</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black tabular-nums" style={{ color: '#10D9B8', fontFamily: 'var(--font-display)' }}>{t.burnoutAfter}</span>
            <span className="text-xs text-zinc-500">/100</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/10">
          <Image src={t.avatar} alt={`${t.name} avatar`} fill className="object-cover" sizes="44px" />
        </div>
        <div>
          <div className="font-semibold text-sm">{t.name}</div>
          <div className="text-xs text-zinc-400">{t.role} · {t.company}</div>
        </div>
      </div>
    </div>
  )
}

// ─────────── FAQ Item ───────────
function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(idx === 0)
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.04 }}
      className="border border-white/8 rounded-xl bg-[#0F1012] overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-sm">{q}</span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3 }}>
          <Plus className="w-4 h-4 text-zinc-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─────────── MAIN ───────────
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95])

  const [activeT, setActiveT] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setActiveT(p => (p + 1) % TESTIMONIALS.length), 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-[#08090B] text-zinc-100 overflow-x-hidden">
      <Navbar />

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        <AuroraBackground />
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF5E3A]/30 to-transparent animate-scan pointer-events-none" aria-hidden="true" />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 px-6 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm text-xs text-zinc-300 mb-8"
          >
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-[#FF5E3A] animate-ping opacity-75" />
              <span className="relative rounded-full w-2 h-2 bg-[#FF5E3A]" />
            </span>
            <span className="font-medium">14,891 reports this month</span>
            <span className="text-zinc-500">·</span>
            <span className="text-[#10D9B8]">2,340 companies tracked</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-[9rem] font-black leading-[0.95] tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-gradient-soft">The workplace</span>
            <br />
            <span className="text-gradient-ember">won&apos;t name itself.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            An open, anonymous, encrypted platform for workers to expose toxic employers,
            measure their burnout, and find the data they need to leave.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          >
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-[#FF5E3A] to-[#FF8A65] hover:from-[#EA4520] hover:to-[#FF5E3A] text-white border-0 shadow-[0_8px_30px_rgba(255,94,58,0.35)] text-base px-7 py-6 gap-2 group transition-all hover:scale-105">
                <FileWarning className="w-5 h-5" />
                File a Report
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/assessment">
              <Button size="lg" variant="outline" className="border-white/15 hover:border-white/30 text-white hover:bg-white/[0.04] text-base px-7 py-6 gap-2 group">
                <Brain className="w-5 h-5" />
                Free Burnout Test
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-zinc-500"
          >
            <div className="flex items-center gap-1.5"><LockKeyhole className="w-3.5 h-3.5" /> AES-256 encrypted</div>
            <div className="flex items-center gap-1.5"><EyeOff className="w-3.5 h-3.5" /> Zero IP logging</div>
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> POPIA compliant</div>
            <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-[#FBBF24]" /> 4.9/5 (3,201 reviews)</div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS ─── */}
      <section className="relative py-24 border-y border-white/5">
        <div className="absolute inset-0 bg-mesh-soft" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="p-5 rounded-2xl border border-white/8 bg-[#0F1012]/60 backdrop-blur-sm surface-hover"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18` }}>
                    <s.icon className="w-4.5 h-4.5" style={{ color: s.color }} />
                  </div>
                </div>
                <div className="text-4xl lg:text-5xl font-black mb-1 tabular-nums" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>
                  <Counter to={s.value} suffix={s.suffix} prefix={s.prefix} />
                </div>
                <p className="text-zinc-400 text-sm mb-1">{s.label}</p>
                <p className="text-zinc-500 text-xs">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INDUSTRY TICKER ─── */}
      <div className="border-b border-white/5 py-5 overflow-hidden bg-[#0B0C0E]">
        <div className="animate-marquee-x">
          {[...TICKER_INDUSTRIES, ...TICKER_INDUSTRIES].map((t, i) => {
            const isPositive = t.change.startsWith('+')
            return (
              <div key={i} className="mx-6 flex items-center gap-3 whitespace-nowrap text-sm">
                <span className="text-zinc-300 font-medium">{t.name}</span>
                <span className="font-mono text-zinc-100 font-bold tabular-nums">{t.score}</span>
                <span className={`font-mono text-xs flex items-center gap-0.5 ${isPositive ? 'text-[#FF5E3A]' : 'text-[#10D9B8]'}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {t.change}
                </span>
                <span className="text-zinc-700">·</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── BENTO FEATURES ─── */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <Badge className="mb-5 bg-[#FF5E3A]/10 text-[#FF5E3A] border-[#FF5E3A]/30 font-mono">
            <Layers className="w-3 h-3 mr-1.5" />
            PLATFORM
          </Badge>
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-[1.05] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="text-gradient-soft">Tools built for</span>
            <br />
            <span className="text-gradient-ember">people who&apos;ve had enough.</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Every feature is designed to give workers the leverage that companies have always denied them.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">
          {FEATURES_BENTO.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`group relative p-7 rounded-3xl border border-white/8 bg-gradient-to-br from-[#16171A] to-[#0F1012] surface-hover overflow-hidden ${f.span}`}
            >
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: `radial-gradient(circle, ${f.color}, transparent 70%)` }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                    <f.icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <Badge className="text-[10px] font-mono uppercase" style={{ background: `${f.color}15`, color: f.color, borderColor: `${f.color}30` }}>
                    {f.tag}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">{f.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── COMPLEX FEATURE: AI RISK PREDICTOR ─── */}
      <section className="relative py-32 border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-soft" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <Badge className="mb-5 bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30 font-mono">
                <Sparkles className="w-3 h-3 mr-1.5" />
                AI-POWERED
              </Badge>
              <h2 className="text-5xl md:text-6xl font-black mb-6 leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
                Personal burnout
                <br />
                <span className="text-gradient-ember">risk predictor.</span>
              </h2>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                Our model weighs 60+ workplace signals — industry baselines, role intensity, hour patterns,
                managerial behaviour, recognition deficits — and projects your 6-month burnout probability.
                Calibrated against 14,000+ verified reports.
              </p>

              <ul className="space-y-3 mb-10">
                {[
                  { icon: Database, t: 'Trained on 14,891 anonymised reports across 12 industries' },
                  { icon: Cpu, t: 'Multi-axis radar — exhaustion, cynicism, isolation, stagnation' },
                  { icon: Network, t: 'Benchmarks against 2,340 tracked companies' },
                  { icon: Target, t: 'Outputs verified weekly against new clinical assessments' },
                ].map(item => (
                  <li key={item.t} className="flex items-start gap-3 text-sm text-zinc-300">
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-white/[0.04] border border-white/8 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-[#FF5E3A]" />
                    </div>
                    <span className="pt-1.5">{item.t}</span>
                  </li>
                ))}
              </ul>

              <Link href="/predict">
                <Button size="lg" className="bg-white text-[#08090B] hover:bg-zinc-200 gap-2">
                  Try the Risk Predictor
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="lg:sticky lg:top-32"
            >
              <div className="relative p-7 rounded-3xl border-gradient border border-white/8 bg-[#0F1012]/80 backdrop-blur-md shadow-2xl">
                <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5E3A] to-[#FF8A65] flex items-center justify-center shadow-[0_8px_30px_rgba(255,94,58,0.5)]">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Live Demo</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#10D9B8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10D9B8] animate-pulse" />
                    Calculating
                  </div>
                </div>
                <RiskPredictor />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TRUSTED BY (Companies marquee) ─── */}
      <section className="py-20 border-b border-white/5 bg-[#0B0C0E]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs uppercase tracking-widest text-zinc-500 mb-8 font-mono">
            Reports filed against employees of
          </p>
          <div className="overflow-hidden">
            <div className="animate-marquee-x flex gap-12 items-center">
              {[...COMPANIES_LOGOS, ...COMPANIES_LOGOS].map((c, i) => (
                <div key={i} className="text-3xl font-black text-zinc-700 hover:text-zinc-400 transition-colors whitespace-nowrap" style={{ fontFamily: 'var(--font-display)' }}>
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TREND CHART ─── */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <Badge className="mb-5 bg-[#10D9B8]/10 text-[#10D9B8] border-[#10D9B8]/30 font-mono">
              <LineChartIcon className="w-3 h-3 mr-1.5" />
              LIVE INTELLIGENCE
            </Badge>
            <h2 className="text-5xl font-black mb-5 leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
              Reports are
              <br />
              <span className="text-gradient-ember">accelerating.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              Weekly report volume has tripled since launch. Workers are talking.
              Companies are being named. The data is becoming impossible to ignore.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'This week', value: '1,380', change: '+19.6%' },
                { label: 'Verified', value: '78%', change: '+4.2%' },
                { label: 'Avg severity', value: '7.4/10', change: '+0.3' },
              ].map(stat => (
                <div key={stat.label} className="p-4 rounded-xl border border-white/8 bg-[#0F1012]">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{stat.label}</div>
                  <div className="text-2xl font-black tabular-nums mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</div>
                  <div className="text-xs text-[#10D9B8]">{stat.change}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-white/8 bg-gradient-to-br from-[#16171A] to-[#0F1012]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">Weekly reports filed</span>
              <Badge className="bg-[#FF5E3A]/10 text-[#FF5E3A] border-[#FF5E3A]/30 text-xs">Live</Badge>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5E3A" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#FF5E3A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="week" tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#16171A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="reports" stroke="#FF5E3A" strokeWidth={2.5} fill="url(#trendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="relative py-32 border-y border-white/5">
        <div className="absolute inset-0 bg-mesh-soft" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-5 bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30 font-mono">
              <MessageSquare className="w-3 h-3 mr-1.5" />
              REAL STORIES
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-5 leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-gradient-soft">Workers who</span>
              <br />
              <span className="text-gradient-ember">named names.</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Anonymised testimonials. Real outcomes. Real burnout scores before and after intervention.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TestimonialCard t={t} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRIVACY ─── */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/8 glow-ember">
              <Image
                src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=800&fit=crop"
                alt="Privacy illustration — abstract encrypted patterns"
                fill className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5E3A]/20 via-transparent to-[#8B5CF6]/20 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 p-3 rounded-xl glass">
                  <LockKeyhole className="w-5 h-5 text-[#10D9B8]" />
                  <div>
                    <div className="text-xs font-mono text-[#10D9B8]">aes-256-gcm</div>
                    <div className="text-[10px] text-zinc-400">Authenticated encryption</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          >
            <Badge className="mb-5 bg-[#10D9B8]/10 text-[#10D9B8] border-[#10D9B8]/30 font-mono">
              <ShieldCheck className="w-3 h-3 mr-1.5" />
              ZERO-KNOWLEDGE
            </Badge>
            <h2 className="text-5xl font-black mb-5 leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
              We can&apos;t betray
              <br />
              <span className="text-gradient-cool">what we can&apos;t see.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              Reports are encrypted client-side before they touch our servers.
              We do not log IP addresses. Even our administrators cannot connect a report to a person.
            </p>
            <div className="space-y-4">
              {[
                { icon: KeyRound, t: 'Client-side AES-256-GCM encryption', d: 'Plaintext never leaves your browser' },
                { icon: EyeOff, t: 'No IP logging, no fingerprinting', d: 'Sessions are stateless' },
                { icon: FileLock, t: 'POPIA, GDPR, and CCPA compliant', d: 'Audit reports available on request' },
                { icon: Shield, t: 'Open-source verification', d: 'Codebase available on GitHub' },
              ].map(p => (
                <div key={p.t} className="flex gap-4 p-4 rounded-xl border border-white/8 bg-[#0F1012]">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-[#10D9B8]/10 border border-[#10D9B8]/20 flex items-center justify-center">
                    <p.icon className="w-4.5 h-4.5 text-[#10D9B8]" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-0.5">{p.t}</div>
                    <div className="text-xs text-zinc-400">{p.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-32 px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-5 bg-white/[0.06] text-zinc-300 border-white/10 font-mono">
            FAQ
          </Badge>
          <h2 className="text-5xl font-black leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
            Questions you <span className="text-gradient-ember">should be asking.</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} idx={i} />
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative max-w-3xl mx-auto text-center p-12 rounded-3xl border-gradient border border-white/8 bg-[#0F1012]/80 backdrop-blur-xl"
        >
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-[#FF5E3A] to-[#FF8A65] flex items-center justify-center shadow-[0_20px_60px_rgba(255,94,58,0.5)] animate-float-medium">
            <Flame className="w-10 h-10 text-white" />
          </div>
          <div className="pt-10">
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-gradient-soft">Silence is what</span>
              <br />
              <span className="text-gradient-ember">they bank on.</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-md mx-auto mb-8 leading-relaxed">
              Every report you file is data the next worker uses to choose a better job.
              Break the silence — anonymously, encrypted, free forever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-[#FF5E3A] to-[#FF8A65] hover:from-[#EA4520] hover:to-[#FF5E3A] text-white border-0 shadow-[0_8px_30px_rgba(255,94,58,0.4)] gap-2">
                  Join Free
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/assessment">
                <Button size="lg" variant="outline" className="border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white gap-2">
                  Take Assessment
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5E3A] to-[#FF8A65] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-black" style={{ fontFamily: 'var(--font-display)' }}>
                  BURN<span className="text-[#FF5E3A]">OUT</span>
                </span>
              </Link>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                The open intelligence platform for workplace mental health.
                Anonymous, encrypted, free forever.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Platform</h4>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                {[
                  { label: 'Reports', href: '/reports' },
                  { label: 'Companies', href: '/companies' },
                  { label: 'Assessment', href: '/assessment' },
                  { label: 'Risk Predictor', href: '/predict' },
                  { label: 'Resources', href: '/resources' },
                ].map(l => (
                  <li key={l.label}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Account</h4>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">Create Account</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>&copy; 2026 BURNOUT Platform · Built for workers, by workers.</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10D9B8] animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
