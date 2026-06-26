'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Heart, Phone, Globe, MessageSquare, BookOpen,
  Users, ExternalLink
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const RESOURCES = [
  {
    id: 1, type: 'hotline', title: 'SADAG Mental Health Helpline',
    desc: 'South Africa Depression and Anxiety Group — 24/7 crisis support line for mental health emergencies.',
    phone: '0800 456 789', free: true, country: 'South Africa', icon: Phone, color: '#00E599',
    tags: ['Crisis', '24/7', 'Free'],
  },
  {
    id: 2, type: 'hotline', title: 'Lifeline South Africa',
    desc: 'Crisis counselling and emotional support for people in distress. Trained counsellors available.',
    phone: '0861 322 322', free: true, country: 'South Africa', icon: Phone, color: '#14E5C8',
    tags: ['Crisis', 'Free', 'Counselling'],
  },
  {
    id: 3, type: 'app', title: 'Headspace',
    desc: 'Science-backed meditation and mindfulness app. Proven to reduce workplace stress in 10 days.',
    url: 'https://headspace.com', free: false, icon: Globe, color: '#00D4FF',
    tags: ['Meditation', 'Stress', 'App'],
  },
  {
    id: 4, type: 'app', title: 'Calm',
    desc: 'Sleep stories, breathing exercises, and guided meditations to combat burnout symptoms.',
    url: 'https://calm.com', free: false, icon: Globe, color: '#2E8BFF',
    tags: ['Sleep', 'Anxiety', 'App'],
  },
  {
    id: 5, type: 'therapy', title: 'BetterHelp',
    desc: 'Online therapy with licensed therapists. Start in 48 hours. Sliding scale pricing available.',
    url: 'https://betterhelp.com', free: false, icon: MessageSquare, color: '#5EEAD4',
    tags: ['Therapy', 'Online', 'Licensed'],
  },
  {
    id: 6, type: 'community', title: 'r/Burnout',
    desc: 'Reddit community of 300k+ workers sharing burnout experiences, advice, and support.',
    url: 'https://reddit.com/r/burnout', free: true, icon: Users, color: '#00E599',
    tags: ['Community', 'Free', 'Anonymous'],
  },
  {
    id: 7, type: 'article', title: 'WHO Burnout Recognition Guide',
    desc: 'The World Health Organization\'s official guide to identifying, treating, and preventing burnout.',
    url: 'https://who.int', free: true, icon: BookOpen, color: '#00D4FF',
    tags: ['Research', 'WHO', 'Free'],
  },
  {
    id: 8, type: 'therapy', title: 'CCSA Workplace EAP',
    desc: 'Employee Assistance Programme resources for South African workers. Confidential counselling.',
    url: '#', free: true, country: 'South Africa', icon: MessageSquare, color: '#5EEAD4',
    tags: ['EAP', 'Workplace', 'SA'],
  },
]

const TYPES = ['All', 'hotline', 'app', 'therapy', 'community', 'article']
const TYPE_LABELS: Record<string, string> = {
  hotline: 'Crisis Lines', app: 'Apps', therapy: 'Therapy', community: 'Community', article: 'Articles'
}

export default function ResourcesPage() {
  const [filter, setFilter] = useState('All')

  const filtered = RESOURCES.filter(r => filter === 'All' || r.type === filter)

  return (
    <div className="min-h-screen bg-[#050708] py-12 px-6 relative">
      <div className="absolute inset-0 bg-mesh-soft" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-[#00E599]" />
          </div>
          <h1 className="text-5xl font-black mb-3 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Help is <span className="text-gradient-ember">real.</span>
          </h1>
          <p className="text-zinc-400 mb-10 text-lg max-w-xl">
            Curated crisis lines, apps, therapists, and communities.
            You don&apos;t have to burn alone.
          </p>

          {/* Crisis banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl border border-[#00E599]/30 bg-[#00E599]/5 mb-8 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#00E599]/15 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#00E599]" />
              </div>
              <div>
                <div className="font-bold text-[#00E599]">In crisis right now?</div>
                <div className="text-[#93A29E] text-sm">SADAG 24/7 line: <span className="text-white font-mono">0800 456 789</span></div>
              </div>
            </div>
            <Badge className="bg-[#00E599] text-white border-0 shrink-0 animate-pulse">FREE · 24/7</Badge>
          </motion.div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap mb-8">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                  filter === t
                    ? 'bg-[#00E599]/15 border-[#00E599]/50 text-[#00E599]'
                    : 'bg-[#0A0D0F] border-white/10 text-[#93A29E] hover:text-white'
                }`}
              >
                {t === 'All' ? 'All' : TYPE_LABELS[t]}
              </button>
            ))}
          </div>

          {/* Resources grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="p-5 bg-[#0A0D0F] border border-white/8 rounded-2xl hover:border-opacity-30 transition-all duration-300 card-hover"
                style={{ '--hover-color': r.color } as any}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${r.color}18` }}>
                    <r.icon className="w-5 h-5" style={{ color: r.color }} />
                  </div>
                  {r.free && (
                    <Badge className="bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/20 text-xs">FREE</Badge>
                  )}
                </div>

                <h3 className="font-bold mb-2">{r.title}</h3>
                <p className="text-[#93A29E] text-sm leading-relaxed mb-4">{r.desc}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {r.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[#93A29E] border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>

                {r.phone ? (
                  <a href={`tel:${r.phone}`} className="flex items-center gap-2 text-sm font-semibold" style={{ color: r.color }}>
                    <Phone className="w-4 h-4" /> {r.phone}
                  </a>
                ) : r.url && r.url !== '#' ? (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color: r.color }}>
                    Visit Resource <ExternalLink className="w-3 h-3" />
                  </a>
                ) : null}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
