'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Heart, MessageCircle, Sparkles, PawPrint, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { formatRelative } from '@/lib/utils'

interface Confession {
  id: number | string
  text: string
  mood: string
  hearts: number
  time: string
  liked?: boolean
}

const MOODS = [
  { key: 'happy', label: 'Happy', color: '#FF7A6B' },
  { key: 'proud', label: 'Proud', color: '#FFB84D' },
  { key: 'help', label: 'Need advice', color: '#FFC83D' },
  { key: 'sad', label: 'Tough day', color: '#A79F9C' },
]

const SEED: Confession[] = [
  { id: 1, text: 'Biscuit finally learned to sit AND stay today. Three weeks of patience and so many treats. Proud dog dad moment! 🐶', mood: 'proud', hearts: 248, time: '12m ago' },
  { id: 2, text: 'Used the food checker before giving Luna a bit of my dinner — turns out onions are toxic to cats! Probably saved her a vet trip.', mood: 'happy', hearts: 519, time: '38m ago' },
  { id: 3, text: 'Adopted a senior rescue beagle this weekend. He sleeps 18 hours a day and I have never been happier. 🥰', mood: 'happy', hearts: 871, time: '1h ago' },
  { id: 4, text: 'Any tips for a puppy that cries at night? Week two and I am running on no sleep but I love the little guy.', mood: 'help', hearts: 333, time: '2h ago' },
  { id: 5, text: 'The nutrition planner said I was overfeeding by almost double. Two months later my cat is at a healthy weight and so playful again.', mood: 'proud', hearts: 402, time: '3h ago' },
  { id: 6, text: 'Said goodbye to my 16-year-old girl today. Hug your pets a little tighter tonight. ❤️', mood: 'sad', hearts: 1287, time: '5h ago' },
]

export default function WallPage() {
  const [posts, setPosts] = useState<Confession[]>(SEED)
  const [draft, setDraft] = useState('')
  const [mood, setMood] = useState('happy')
  const [posting, setPosting] = useState(false)

  // Load real confessions; fall back to seed if unavailable/empty
  useEffect(() => {
    async function load() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data, error } = await supabase
          .from('confessions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
        if (error || !data || data.length === 0) return
        setPosts(data.map(d => ({
          id: d.id, text: d.text, mood: d.mood, hearts: d.hearts,
          time: formatRelative(d.created_at),
        })))
      } catch {}
    }
    load()
  }, [])

  async function post() {
    if (draft.trim().length < 10) { toast.error('Say a little more — at least 10 characters.'); return }
    setPosting(true)
    const text = draft.trim()
    const optimistic: Confession = { id: 'tmp-' + Date.now(), text, mood, hearts: 0, time: 'just now' }
    setPosts(p => [optimistic, ...p])
    setDraft('')
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data } = await supabase.from('confessions').insert({ text, mood }).select().single()
      if (data) setPosts(p => p.map(c => c.id === optimistic.id ? { ...c, id: data.id } : c))
      toast.success('Posted anonymously', { description: 'No name. No trace. Just your voice.' })
    } catch {
      toast.success('Posted anonymously')
    } finally {
      setPosting(false)
    }
  }

  async function like(id: number | string) {
    const target = posts.find(c => c.id === id)
    const wasLiked = target?.liked
    setPosts(p => p.map(c => c.id === id ? { ...c, liked: !c.liked, hearts: c.hearts + (c.liked ? -1 : 1) } : c))
    if (wasLiked) return // only persist new likes
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      if (typeof id === 'string' && !id.startsWith('tmp-')) {
        await supabase.rpc('increment_hearts', { cid: id })
      }
    } catch {}
  }

  const moodOf = (k: string) => MOODS.find(m => m.key === k) ?? MOODS[0]

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative p-6 lg:p-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge className="mb-4 btn-glass-emerald border-0 font-mono text-[10px]">
            <Sparkles className="w-3 h-3 mr-1.5" /> COMMUNITY
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Owner <span className="text-[#FF7A6B]">Community</span>
          </h1>
          <p className="text-zinc-400 max-w-xl">
            Wins, worries and wisdom from fellow pet parents. Share a moment, ask for advice, cheer each other on.
          </p>
        </motion.div>

        {/* Composer */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 mb-6">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Share a win, ask for advice, or just say hi to fellow pet parents…"
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
              <Button onClick={post} disabled={posting} className="btn-glass-emerald gap-1.5 h-9 rounded-xl text-sm">
                <Send className="w-3.5 h-3.5" /> {posting ? 'Posting…' : 'Post'}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FF7A6B]" />
          Posts are anonymous. Be kind — we&rsquo;re all just trying to do right by our pets.
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
                      <PawPrint className="w-3.5 h-3.5 text-zinc-500" />
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
