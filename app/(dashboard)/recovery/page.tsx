'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles, Check, Circle, Sun, Moon, Wind, Coffee, Heart,
  Footprints, Phone, Calendar, Trophy, Flame
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const WEEKS = [
  {
    week: 1, title: 'Stop the bleed', icon: Wind,
    steps: [
      'Set one hard boundary: no work messages after 7pm',
      'Take your full lunch break, away from your desk, every day',
      'Tell one trusted person how you actually feel',
      'Sleep 7+ hours for three nights this week',
    ],
  },
  {
    week: 2, title: 'Reclaim energy', icon: Coffee,
    steps: [
      'Walk outside 15 minutes daily — no phone',
      'Decline one non-essential meeting',
      'Write down three things that drained you, and one that helped',
      'Do one thing purely for joy, no productivity attached',
    ],
  },
  {
    week: 3, title: 'Rebuild perspective', icon: Sun,
    steps: [
      'Take your burnout assessment again and compare',
      'List what you would change about your role',
      'Research two companies on the watchlist',
      'Book a conversation with a therapist or counsellor',
    ],
  },
  {
    week: 4, title: 'Decide your move', icon: Footprints,
    steps: [
      'Update your CV — even if you stay',
      'Have the boundary conversation with your manager',
      'Set a 90-day checkpoint to reassess',
      'Celebrate one month of putting yourself first',
    ],
  },
]

const MOODS = [
  { key: 'rough', label: 'Rough', icon: Moon, color: '#FF5A5F' },
  { key: 'meh', label: 'Meh', icon: Wind, color: '#FFC83D' },
  { key: 'okay', label: 'Okay', icon: Coffee, color: '#93A29E' },
  { key: 'good', label: 'Good', icon: Sun, color: '#00E599' },
]

export default function RecoveryPage() {
  const [done, setDone] = useState<Set<string>>(new Set())
  const [mood, setMood] = useState<string | null>(null)
  const [streak] = useState(4)

  const total = WEEKS.reduce((s, w) => s + w.steps.length, 0)
  const completed = done.size
  const pct = Math.round((completed / total) * 100)

  function toggle(id: string) {
    setDone(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else { next.add(id); toast.success('One step closer.', { description: 'Recovery is built one choice at a time.' }) }
      return next
    })
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative p-6 lg:p-8 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge className="mb-4 btn-glass-emerald border-0 font-mono text-[10px]">
            <Sparkles className="w-3 h-3 mr-1.5" /> NEW
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Recovery <span className="text-[#00E599]">Roadmap</span>
          </h1>
          <p className="text-zinc-400 max-w-xl">
            A gentle 4-week plan to climb out of burnout — one small, doable step at a time.
          </p>
        </motion.div>

        {/* Top row: progress + mood + streak */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-400 mb-2">Progress</div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-semibold tabular-nums text-[#00E599]" style={{ fontFamily: 'var(--font-display)' }}>{pct}%</span>
              <span className="text-zinc-500 text-xs mb-1.5">{completed}/{total} steps</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div animate={{ width: `${pct}%` }} className="h-full bg-[#00E599] rounded-full" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-400 mb-2">Today&apos;s check-in</div>
            <div className="flex items-center gap-2">
              {MOODS.map(m => (
                <button
                  key={m.key}
                  onClick={() => { setMood(m.key); toast.success(`Logged: ${m.label}`) }}
                  title={m.label}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${mood === m.key ? '' : 'border-white/10 text-zinc-500 hover:text-white'}`}
                  style={mood === m.key ? { background: `${m.color}1F`, color: m.color, borderColor: `${m.color}40` } : {}}
                >
                  <m.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-400 mb-2">Streak</div>
            <div className="flex items-center gap-2">
              <Flame className="w-7 h-7 text-[#00E599]" />
              <span className="text-4xl font-semibold tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>{streak}</span>
              <span className="text-zinc-500 text-xs mb-1.5">days</span>
            </div>
          </motion.div>
        </div>

        {/* Weeks */}
        <div className="space-y-5">
          {WEEKS.map((wk, wi) => {
            const weekDone = wk.steps.filter((_, si) => done.has(`${wk.week}-${si}`)).length
            const allDone = weekDone === wk.steps.length
            return (
              <motion.div
                key={wk.week}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: wi * 0.08 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: allDone ? 'rgba(0,229,153,0.15)' : 'rgba(255,255,255,0.04)', borderColor: allDone ? 'rgba(0,229,153,0.4)' : 'rgba(255,255,255,0.08)' }}>
                    {allDone ? <Trophy className="w-5 h-5 text-[#00E599]" /> : <wk.icon className="w-5 h-5 text-zinc-300" />}
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Week {wk.week}</div>
                    <div className="font-semibold text-lg" style={{ fontFamily: 'var(--font-display)' }}>{wk.title}</div>
                  </div>
                  <span className="ml-auto text-xs text-zinc-500 font-mono">{weekDone}/{wk.steps.length}</span>
                </div>
                <div className="space-y-2">
                  {wk.steps.map((step, si) => {
                    const id = `${wk.week}-${si}`
                    const isDone = done.has(id)
                    return (
                      <button
                        key={id}
                        onClick={() => toggle(id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${isDone ? 'bg-[#00E599]/[0.07]' : 'hover:bg-white/[0.03]'}`}
                      >
                        {isDone
                          ? <div className="w-5 h-5 rounded-md bg-[#00E599] flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 text-[#04130D]" /></div>
                          : <Circle className="w-5 h-5 text-zinc-600 shrink-0" />}
                        <span className={`text-sm ${isDone ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{step}</span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Crisis footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-5 mt-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center shrink-0">
            <Phone className="w-4.5 h-4.5 text-[#00E599]" />
          </div>
          <div>
            <div className="font-semibold text-sm">Need to talk to someone now?</div>
            <div className="text-xs text-zinc-400">SADAG 24/7 helpline: <span className="font-mono text-[#00E599]">0800 456 789</span></div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
