'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Circle, Home, Syringe, GraduationCap, Heart, Trophy, PawPrint, Dog, Cat } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const WEEKS = [
  { week: 1, title: 'Settling in', icon: Home, steps: ['Set up a cosy bed, food & water station', 'Pick a vet and book the first wellness visit', 'Pet-proof the home (cables, plants, small objects)', 'Keep introductions calm and quiet'] },
  { week: 2, title: 'Health & nutrition', icon: Syringe, steps: ['Start the vaccination schedule with your vet', 'Set up a feeding plan in the Nutrition Planner', 'Begin a gentle daily routine', 'Note weight as a baseline'] },
  { week: 3, title: 'Training & bonding', icon: GraduationCap, steps: ['Teach their name + one basic cue', 'Reward-based toilet / litter training', 'Short daily play and socialisation', 'Introduce safe chew toys'] },
  { week: 4, title: 'Routine & joy', icon: Heart, steps: ['Lock in a consistent daily schedule', 'Book microchip + registration if not done', 'Take the Pet Wellness Check', 'Celebrate one happy, healthy month!'] },
]

export default function CarePlanPage() {
  const [done, setDone] = useState<Set<string>>(new Set())
  const [kind, setKind] = useState<'puppy' | 'kitten'>('puppy')

  const total = WEEKS.reduce((s, w) => s + w.steps.length, 0)
  const pct = Math.round((done.size / total) * 100)

  function toggle(id: string) {
    setDone(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else { next.add(id); toast.success('Nice — one step closer! 🐾') }
      return next
    })
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative p-6 lg:p-8 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge className="mb-4 bg-[#FF7A6B]/10 text-[#FF7A6B] border-[#FF7A6B]/30 font-mono text-[10px]"><PawPrint className="w-3 h-3 mr-1.5" /> ROADMAP</Badge>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            New Pet <span className="text-[#FF7A6B]">Care Plan</span>
          </h1>
          <p className="text-zinc-400 max-w-xl">A gentle, week-by-week guide for your new arrival&rsquo;s first month.</p>
        </motion.div>

        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex gap-2">
            {([['puppy', 'Puppy', Dog], ['kitten', 'Kitten', Cat]] as const).map(([k, label, Icon]) => (
              <button key={k} onClick={() => setKind(k)} aria-pressed={kind === k}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${kind === k ? 'bg-[#FF7A6B]/15 border-[#FF7A6B]/40 text-[#FF7A6B]' : 'bg-white/[0.03] border-white/8 text-zinc-400 hover:border-white/20'}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
          <div className="glass-card rounded-xl px-4 py-2.5 flex items-center gap-3">
            <span className="text-xs text-zinc-400 uppercase tracking-wider">Progress</span>
            <span className="text-2xl font-semibold tabular-nums text-[#FF7A6B]" style={{ fontFamily: 'var(--font-display)' }}>{pct}%</span>
            <div className="w-24 h-1.5 bg-white/[0.06] rounded-full overflow-hidden"><motion.div animate={{ width: `${pct}%` }} className="h-full bg-[#FF7A6B]" /></div>
          </div>
        </div>

        <div className="space-y-5">
          {WEEKS.map((wk, wi) => {
            const weekDone = wk.steps.filter((_, si) => done.has(`${wk.week}-${si}`)).length
            const allDone = weekDone === wk.steps.length
            return (
              <motion.div key={wk.week} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: wi * 0.08 }} className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: allDone ? 'rgba(255,122,107,0.15)' : 'rgba(255,255,255,0.04)', borderColor: allDone ? 'rgba(255,122,107,0.4)' : 'rgba(255,255,255,0.08)' }}>
                    {allDone ? <Trophy className="w-5 h-5 text-[#FF7A6B]" /> : <wk.icon className="w-5 h-5 text-zinc-300" />}
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
                      <button key={id} onClick={() => toggle(id)} className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${isDone ? 'bg-[#FF7A6B]/[0.07]' : 'hover:bg-white/[0.03]'}`}>
                        {isDone ? <div className="w-5 h-5 rounded-md bg-[#FF7A6B] flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 text-[#2A0E0A]" /></div> : <Circle className="w-5 h-5 text-zinc-600 shrink-0" />}
                        <span className={`text-sm ${isDone ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{step}</span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
