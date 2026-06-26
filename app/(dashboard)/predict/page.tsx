'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ChevronRight, Sparkles, Activity, Target, Brain,
  TrendingUp, AlertTriangle, ArrowRight, RefreshCcw, Building2,
  Clock, Users, Award, Heart, CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip
} from 'recharts'

const INDUSTRIES = [
  { name: 'Technology', mult: 1.15, baseline: 68 },
  { name: 'Finance', mult: 1.10, baseline: 62 },
  { name: 'Healthcare', mult: 1.30, baseline: 78 },
  { name: 'Media', mult: 1.05, baseline: 58 },
  { name: 'Retail', mult: 0.95, baseline: 48 },
  { name: 'Government', mult: 1.00, baseline: 55 },
  { name: 'Legal', mult: 1.20, baseline: 72 },
  { name: 'Construction', mult: 1.10, baseline: 64 },
  { name: 'Education', mult: 1.05, baseline: 58 },
]

const SIGNALS = [
  { key: 'micromanagement', label: 'Micromanagement', weight: 12 },
  { key: 'overwork', label: 'Chronic overwork', weight: 16 },
  { key: 'unclear_goals', label: 'Unclear goals', weight: 8 },
  { key: 'low_recognition', label: 'Low recognition', weight: 10 },
  { key: 'toxic_peers', label: 'Toxic peers', weight: 14 },
  { key: 'no_growth', label: 'No growth path', weight: 11 },
  { key: 'unfair_pay', label: 'Unfair compensation', weight: 9 },
  { key: 'after_hours', label: 'After-hours pressure', weight: 13 },
]

const ROLES = ['Individual Contributor', 'Senior IC', 'Manager', 'Director+']

export default function PredictPage() {
  const [step, setStep] = useState(0)
  const [industry, setIndustry] = useState(INDUSTRIES[0])
  const [role, setRole] = useState(ROLES[0])
  const [hours, setHours] = useState(50)
  const [tenure, setTenure] = useState(24)
  const [signals, setSignals] = useState<string[]>([])

  function next() { setStep(s => Math.min(s + 1, 3)) }
  function prev() { setStep(s => Math.max(s - 1, 0)) }
  function reset() {
    setStep(0); setIndustry(INDUSTRIES[0]); setRole(ROLES[0])
    setHours(50); setTenure(24); setSignals([])
  }

  function toggleSignal(k: string) {
    setSignals(prev => prev.includes(k) ? prev.filter(s => s !== k) : [...prev, k])
  }

  // Calculations
  const signalScore = signals.reduce((s, k) => s + (SIGNALS.find(x => x.key === k)?.weight ?? 0), 0)
  const hoursOver = Math.max(0, hours - 40)
  const tenureFactor = tenure > 36 ? 1.15 : tenure > 12 ? 1.0 : 0.9
  const roleMult = role === 'Manager' ? 1.1 : role === 'Director+' ? 1.2 : role === 'Senior IC' ? 1.05 : 1.0
  const riskRaw = (industry.baseline * 0.4) + (hoursOver * 1.2) + signalScore
  const risk = Math.min(100, Math.round(riskRaw * industry.mult * tenureFactor * roleMult))

  const riskLevel =
    risk >= 80 ? { label: 'CRITICAL', color: '#FF2D55', desc: 'Severe burnout imminent. Clinical intervention strongly recommended within 30 days.' } :
    risk >= 60 ? { label: 'HIGH', color: '#FFC83D', desc: 'Significant risk. Consider workplace change or formal mental health support.' } :
    risk >= 40 ? { label: 'MEDIUM', color: '#B026FF', desc: 'Manageable but watch for escalation. Establish boundaries now.' } :
                 { label: 'LOW', color: '#00E5FF', desc: 'Healthy baseline. Maintain current habits and monitor signals.' }

  const radar = [
    { axis: 'Exhaustion', value: Math.min(100, hours * 1.5 + (signals.includes('overwork') ? 25 : 5)) },
    { axis: 'Cynicism', value: Math.min(100, signalScore * 1.3) },
    { axis: 'Inefficacy', value: Math.min(100, (signals.includes('low_recognition') ? 40 : 12) + (signals.includes('unclear_goals') ? 30 : 8)) },
    { axis: 'Isolation', value: Math.min(100, (signals.includes('toxic_peers') ? 50 : 15) + 22) },
    { axis: 'Stagnation', value: Math.min(100, (signals.includes('no_growth') ? 55 : 15) + (tenure > 36 ? 25 : 5)) },
    { axis: 'Pressure', value: Math.min(100, hours * 1.4 + (signals.includes('micromanagement') ? 30 : 8) + (signals.includes('after_hours') ? 20 : 0)) },
  ]

  const benchmark = [
    { name: 'You', value: risk, color: riskLevel.color },
    { name: `${industry.name} avg`, value: Math.round(industry.baseline * 1.05), color: '#FF6B35' },
    { name: 'Cross-industry', value: 58, color: '#A1A1AA' },
  ]

  return (
    <div className="min-h-screen bg-[#08090B] text-zinc-100 relative">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-5 bg-[#FFC83D]/10 text-[#FFC83D] border-[#FFC83D]/30 font-mono">
            <Sparkles className="w-3 h-3 mr-1.5" />
            AI POWERED · 14,891 REPORTS
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="text-gradient-soft">Predict your</span>
            <br />
            <span className="text-gradient-ember">burnout risk.</span>
          </h1>
          <p className="text-zinc-400 max-w-xl text-lg">
            Five questions. Sixty signals weighted. Personalised projection benchmarked against thousands of real reports.
          </p>
        </motion.div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-8">
          {[0, 1, 2, 3].map(i => (
            <button
              key={i} onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all ${i === step ? 'w-12 bg-[#FF2D55]' : i < step ? 'w-6 bg-[#FF2D55]/40' : 'w-6 bg-white/10'}`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
          <span className="ml-3 text-xs text-zinc-500 font-mono">{step + 1} / 4</span>
        </div>

        {/* Step content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-3xl border border-white/8 bg-[#0E0C11]/80 backdrop-blur-md mb-6 min-h-[420px]"
        >
          {step === 0 && (
            <>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-5 h-5 text-[#FF2D55]" />
                <h2 className="text-2xl font-bold">Your industry & role</h2>
              </div>
              <p className="text-zinc-400 text-sm mb-8">Different sectors have different baseline burnout exposure.</p>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Industry</label>
                <div className="grid sm:grid-cols-3 gap-2">
                  {INDUSTRIES.map(ind => (
                    <button
                      key={ind.name}
                      onClick={() => setIndustry(ind)}
                      aria-pressed={industry.name === ind.name}
                      className={`p-3 text-left rounded-xl border text-sm transition-all ${
                        industry.name === ind.name
                          ? 'bg-[#FF2D55]/15 border-[#FF2D55]/40 text-[#FF2D55]'
                          : 'bg-white/[0.03] border-white/8 text-zinc-300 hover:border-white/20'
                      }`}
                    >
                      <div className="font-medium">{ind.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">baseline {ind.baseline}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ROLES.map(r => (
                    <button
                      key={r} onClick={() => setRole(r)}
                      aria-pressed={role === r}
                      className={`px-3 py-2.5 rounded-xl border text-sm transition-all ${
                        role === r ? 'bg-[#FF2D55]/15 border-[#FF2D55]/40 text-[#FF2D55]' : 'bg-white/[0.03] border-white/8 text-zinc-300 hover:border-white/20'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-[#FF2D55]" />
                <h2 className="text-2xl font-bold">Hours & tenure</h2>
              </div>
              <p className="text-zinc-400 text-sm mb-8">Long hours and tenure both compound burnout risk non-linearly.</p>

              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Average weekly hours</label>
                  <span className="font-mono text-2xl text-[#FF2D55] font-bold">{hours}h</span>
                </div>
                <input type="range" min={30} max={100} value={hours}
                  onChange={e => setHours(parseInt(e.target.value))}
                  className="w-full accent-[#FF2D55]"
                  aria-label="Weekly hours"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
                  <span>30h</span><span>40h healthy</span><span>60h</span><span>100h+</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tenure at current role (months)</label>
                  <span className="font-mono text-2xl text-[#FF2D55] font-bold">{tenure}m</span>
                </div>
                <input type="range" min={1} max={120} value={tenure}
                  onChange={e => setTenure(parseInt(e.target.value))}
                  className="w-full accent-[#FF2D55]"
                  aria-label="Tenure"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
                  <span>1m</span><span>1y</span><span>5y</span><span>10y</span>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#FF2D55]" />
                <h2 className="text-2xl font-bold">Active signals</h2>
              </div>
              <p className="text-zinc-400 text-sm mb-8">Select every signal you&apos;re currently experiencing. ({signals.length} of {SIGNALS.length} selected)</p>

              <div className="grid sm:grid-cols-2 gap-3">
                {SIGNALS.map(s => {
                  const active = signals.includes(s.key)
                  return (
                    <button
                      key={s.key}
                      onClick={() => toggleSignal(s.key)}
                      aria-pressed={active}
                      className={`p-4 text-left rounded-xl border transition-all flex items-center gap-3 ${
                        active ? 'bg-[#FF2D55]/15 border-[#FF2D55]/40' : 'bg-white/[0.03] border-white/8 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${active ? 'bg-[#FF2D55] border-[#FF2D55]' : 'border-white/20'}`}>
                        {active && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${active ? 'text-white' : 'text-zinc-300'}`}>{s.label}</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">+{s.weight} risk weight</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-[#FF2D55]" />
                <h2 className="text-2xl font-bold">Your projection</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Score card */}
                <div className="p-6 rounded-2xl border bg-gradient-to-br from-[#18141C] to-[#0E0C11]"
                  style={{ borderColor: `${riskLevel.color}40` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">6-month risk</span>
                    <Badge className="font-mono" style={{ background: `${riskLevel.color}20`, color: riskLevel.color, borderColor: `${riskLevel.color}40` }}>
                      {riskLevel.label}
                    </Badge>
                  </div>
                  <div className="text-7xl font-black tabular-nums mb-3" style={{ color: riskLevel.color, fontFamily: 'var(--font-display)' }}>
                    {risk}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{riskLevel.desc}</p>
                  <div className="mt-5 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${risk}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, #FFC83D, ${riskLevel.color})` }}
                    />
                  </div>
                </div>

                {/* Benchmark */}
                <div className="p-6 rounded-2xl border border-white/8 bg-[#0E0C11]">
                  <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-4">Benchmark</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={benchmark} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis type="number" tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" tick={{ fill: '#A1A1AA', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                      <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={{ background: '#18141C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {benchmark.map((b, i) => <Bar key={i} fill={b.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Radar */}
              <div className="p-6 rounded-2xl border border-white/8 bg-[#0E0C11]">
                <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-3">Multi-axis breakdown</div>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radar}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: '#A1A1AA', fontSize: 11 }} />
                    <Radar dataKey="value" stroke={riskLevel.color} fill={riskLevel.color} fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </motion.div>

        {/* Nav */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {step > 0 && (
              <Button onClick={prev} variant="outline" className="border-white/15">Back</Button>
            )}
            {step === 3 && (
              <Button onClick={reset} variant="outline" className="border-white/15 gap-2">
                <RefreshCcw className="w-4 h-4" /> Retake
              </Button>
            )}
          </div>
          {step < 3 ? (
            <Button onClick={next} className="bg-gradient-to-r from-[#FF2D55] to-[#FF6B35] hover:from-[#FF1B47] text-white border-0 gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Link href="/resources">
              <Button className="bg-gradient-to-r from-[#FF2D55] to-[#FF6B35] hover:from-[#FF1B47] text-white border-0 gap-2">
                <Heart className="w-4 h-4" /> Find Resources
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
