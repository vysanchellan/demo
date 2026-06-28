'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Apple, GraduationCap, Heart, Scissors, Syringe, Bug, Brain, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const GUIDES = [
  { title: 'Puppy & Kitten Basics', desc: 'Everything for the first 12 weeks — feeding, vaccines, socialisation and sleep.', icon: Heart, tag: 'New Owners', read: '8 min' },
  { title: 'Reading a Pet Food Label', desc: 'Decode ingredients, guaranteed analysis and marketing buzzwords.', icon: Apple, tag: 'Nutrition', read: '6 min' },
  { title: 'Positive Reinforcement Training', desc: 'The science-backed way to teach any pet, gently and effectively.', icon: GraduationCap, tag: 'Training', read: '10 min' },
  { title: 'Grooming at Home', desc: 'Brushing, bathing, nails and ears — a stress-free routine.', icon: Scissors, tag: 'Care', read: '7 min' },
  { title: 'Vaccination Schedules', desc: 'Core vs non-core vaccines and when each is due.', icon: Syringe, tag: 'Health', read: '5 min' },
  { title: 'Fleas, Ticks & Worms', desc: 'Year-round parasite prevention that actually works.', icon: Bug, tag: 'Health', read: '6 min' },
  { title: 'Understanding Pet Body Language', desc: 'What that tail, those ears and those eyes are really saying.', icon: Brain, tag: 'Behaviour', read: '9 min' },
  { title: 'Senior Pet Care', desc: 'Helping older companions stay comfortable, mobile and happy.', icon: Heart, tag: 'Care', read: '8 min' },
]

const TAGS = ['All', 'New Owners', 'Nutrition', 'Training', 'Health', 'Care', 'Behaviour']

export default function ResourcesPage() {
  const [filter, setFilter] = useState('All')
  const filtered = GUIDES.filter(g => filter === 'All' || g.tag === filter)

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative p-6 lg:p-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge className="mb-4 bg-[#00E599]/10 text-[#00E599] border-[#00E599]/30 font-mono text-[10px]"><BookOpen className="w-3 h-3 mr-1.5" /> CARE GUIDES</Badge>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Care <span className="text-[#00E599]">Guides</span>
          </h1>
          <p className="text-zinc-400 max-w-xl">Vet-reviewed, plain-English guides for every stage of your pet&rsquo;s life.</p>
        </motion.div>

        <div className="flex gap-2 flex-wrap mb-8">
          {TAGS.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-all ${filter === t ? 'bg-[#00E599]/15 border-[#00E599]/40 text-[#00E599]' : 'bg-[#0A0D0F] border-white/10 text-zinc-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((g, i) => (
            <motion.div key={g.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5 surface-hover group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00E599]/12 border border-[#00E599]/20 flex items-center justify-center"><g.icon className="w-5 h-5 text-[#00E599]" /></div>
                <Badge className="bg-white/5 text-zinc-400 border-white/10 text-[10px]">{g.tag}</Badge>
              </div>
              <h3 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{g.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">{g.desc}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">{g.read} read</span>
                <span className="flex items-center gap-1 text-[#00E599] opacity-0 group-hover:opacity-100 transition-opacity">Read <ArrowUpRight className="w-3 h-3" /></span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
