'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Heart, MessageCircle, Sparkles, Flame, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Confession {
  id: number
  text: string
  mood: string
  hearts: number
  time: string
  liked?: boolean
}

const MOODS = [
  { key: 'drained', label: 'Drained', color: '#FFC83D' },
  { key: 'angry', label: 'Angry', color: '#FF5A5F' },
  { key: 'numb', label: 'Numb', color: '#93A29E' },
  { key: 'hopeful', label: 'Hopeful', color: '#00E599' },
]

const SEED: Confession[] = [
  { id: 1, text: 'My manager scheduled a "quick sync" at 6pm on a Friday to tell me I "lack urgency". I have worked every weekend this month.', mood: 'angry', hearts: 248, time: '12m ago' },
  { id: 2, text: 'I cried in the bathroom today and then smiled in the next stand-up. Nobody noticed. That is the part that scares me.', mood: 'numb', hearts: 519, time: '38m ago' },
  { id: 3, text: 'Handed in my notice this morning after reading three reports about my company here. Best decision in two years. Thank you all.', mood: 'hopeful', hearts: 871, time: '1h ago' },
  { id: 4, text: 'They call it "passion" when they want free overtime and "unprofessional" when I ask about my contract.', mood: 'drained', hearts: 333, time: '2h ago' },
  { id: 5, text: 'Took my burnout score here. 84. I thought I was just lazy. Turns out I was running on empty for a year.', mood: 'drained', hearts: 402, time: '3h ago' },
  { id: 6, text: "My 'work family' didn't message once while I was on sick leave. The silence said everything.", mood: 'numb', hearts: 287, time: '5h ago' },
]

export default function WallPage() {
  const [posts, setPosts] = useState<Confession[]>(SEED)
  const [draft, setDraft] = useState('')
  const [mood, setMood] = useState('drained')

  function post() {
    if (draft.trim().length < 10) { toast.error('Say a little more — at least 10 characters.'); return }
    setPosts(p => [{ id: Date.now(), text: draft.trim(), mood, hearts: 0, time: 'just now' }, ...p])
    setDraft('')
    toast.success('Posted anonymously', { description: 'No name. No trace. Just your voice.' })
  }

  function like(id: number) {
    setPosts(p => p.map(c => c.id === id ? { ...c, liked: !c.liked, hearts: c.hearts + (c.liked ? -1 : 1) } : c))
  }

  const moodOf = (k: string) => MOODS.find(m => m.key === k) ?? MOODS[0]

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative p-6 lg:p-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge className="mb-4 btn-glass-emerald border-0 font-mono text-[10px]">
            <Sparkles className="w-3 h-3 mr-1.5" /> NEW
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            The <span className="text-[#00E599]">Wall</span>
          </h1>
          <p className="text-zinc-400 max-w-xl">
            An anonymous wall of workplace confessions. No names, no judgement — just workers telling the truth out loud.
          </p>
        </motion.div>

        {/* Composer */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 mb-6">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Get it off your chest. Anonymously."
            rows={3}
            maxLength={280}
            className="w-full bg-transparent text-sm leading-relaxed resize-none focus:outline-none placeholder:text-zinc-600"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              {MOODS.map(m => (
                <button
                  key={m.key}
                  onClick={() => setMood(m.key)}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-all ${mood === m.key ? 'border-transparent' : 'border-white/10 text-zinc-400 hover:text-white'}`}
                  style={mood === m.key ? { background: `${m.color}1F`, color: m.color, borderColor: `${m.color}40` } : {}}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-600 font-mono">{draft.length}/280</span>
              <Button onClick={post} className="btn-glass-emerald gap-1.5 h-9 rounded-xl text-sm">
                <Send className="w-3.5 h-3.5" /> Post
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00E599]" />
          Every post is anonymous and encrypted. Be kind.
        </div>

        {/* Feed */}
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {posts.map((c, i) => {
              const m = moodOf(c.mood)
              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className="glass-card rounded-2xl p-5 surface-hover"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center">
                      <Flame className="w-3.5 h-3.5 text-zinc-500" />
                    </div>
                    <span className="text-xs text-zinc-500">Anonymous</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="text-xs text-zinc-600">{c.time}</span>
                    <Badge className="ml-auto text-[10px]" style={{ background: `${m.color}18`, color: m.color, borderColor: `${m.color}33` }}>
                      {m.label}
                    </Badge>
                  </div>
                  <p className="text-[15px] leading-relaxed text-zinc-200 mb-4">{c.text}</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => like(c.id)} className={`flex items-center gap-1.5 text-xs transition-colors ${c.liked ? 'text-[#FF5A5F]' : 'text-zinc-500 hover:text-zinc-300'}`}>
                      <Heart className={`w-4 h-4 ${c.liked ? 'fill-[#FF5A5F]' : ''}`} /> {c.hearts}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                      <MessageCircle className="w-4 h-4" /> Reply
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
