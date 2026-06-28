'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, ShieldAlert, ShieldX, Search, Phone, Sparkles, Dog, Cat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

type Level = 'safe' | 'caution' | 'toxic'
interface FoodItem { names: string[]; level: Level; note: string }

const DB: FoodItem[] = [
  { names: ['chocolate', 'cocoa', 'cacao'], level: 'toxic', note: 'Contains theobromine — toxic to dogs and cats. Can cause seizures and heart failure. Call a vet immediately.' },
  { names: ['grape', 'grapes', 'raisin', 'raisins', 'sultana'], level: 'toxic', note: 'Can cause sudden kidney failure in dogs even in small amounts. Treat as an emergency.' },
  { names: ['onion', 'onions', 'garlic', 'leek', 'chive', 'shallot'], level: 'toxic', note: 'Allium family — damages red blood cells causing anaemia. Cats are especially sensitive.' },
  { names: ['xylitol', 'sugar free gum', 'sweetener'], level: 'toxic', note: 'Even tiny amounts cause a dangerous insulin spike and liver failure in dogs. Emergency.' },
  { names: ['macadamia', 'macadamia nuts'], level: 'toxic', note: 'Causes weakness, tremors and hyperthermia in dogs.' },
  { names: ['alcohol', 'beer', 'wine', 'spirits'], level: 'toxic', note: 'Highly toxic — even small amounts affect the nervous system. Never give to pets.' },
  { names: ['caffeine', 'coffee', 'tea', 'energy drink'], level: 'toxic', note: 'Stimulant toxic to pets — causes restlessness, racing heart, tremors.' },
  { names: ['lily', 'lilies'], level: 'toxic', note: 'Extremely toxic to cats — even pollen can cause fatal kidney failure. Keep away entirely.' },
  { names: ['avocado'], level: 'toxic', note: 'Contains persin; the pit is also a choking/obstruction hazard.' },
  { names: ['cooked bone', 'cooked bones', 'chicken bone'], level: 'toxic', note: 'Cooked bones splinter and can puncture the gut. Never feed cooked bones.' },
  { names: ['dairy', 'milk', 'cheese', 'ice cream'], level: 'caution', note: 'Most adult pets are lactose intolerant — small amounts may cause upset stomach.' },
  { names: ['bread', 'dough', 'raw dough'], level: 'caution', note: 'Raw yeast dough can expand and ferment in the stomach — dangerous. Baked bread in tiny amounts is usually fine.' },
  { names: ['salt', 'salty', 'chips', 'crisps'], level: 'caution', note: 'Too much salt causes dehydration and sodium poisoning. Avoid salty human snacks.' },
  { names: ['ham', 'bacon', 'fatty', 'fat trimmings'], level: 'caution', note: 'High fat can trigger pancreatitis. Offer only rarely and in tiny amounts.' },
  { names: ['tomato', 'tomatoes'], level: 'caution', note: 'Ripe flesh is okay in moderation; green parts and stems are mildly toxic.' },
  { names: ['chicken', 'cooked chicken', 'turkey'], level: 'safe', note: 'Plain, cooked, boneless and unseasoned chicken is a great lean protein.' },
  { names: ['carrot', 'carrots'], level: 'safe', note: 'Crunchy, low-calorie, good for teeth. Safe raw or cooked.' },
  { names: ['apple', 'apples'], level: 'safe', note: 'Safe in slices (remove seeds and core). A sweet, fibre-rich treat.' },
  { names: ['pumpkin'], level: 'safe', note: 'Plain cooked pumpkin aids digestion and is rich in fibre.' },
  { names: ['rice', 'white rice'], level: 'safe', note: 'Plain cooked rice is gentle on upset stomachs.' },
  { names: ['blueberry', 'blueberries'], level: 'safe', note: 'Antioxidant-rich and a perfect bite-sized treat.' },
  { names: ['banana', 'bananas'], level: 'safe', note: 'Safe in moderation — high in sugar so keep portions small.' },
  { names: ['peanut butter'], level: 'safe', note: 'Safe if it is XYLITOL-FREE. Always check the label first.' },
]

const STYLE: Record<Level, { color: string; icon: any; label: string }> = {
  safe: { color: '#FF7A6B', icon: ShieldCheck, label: 'SAFE' },
  caution: { color: '#FFB84D', icon: ShieldAlert, label: 'IN MODERATION' },
  toxic: { color: '#FF5A5F', icon: ShieldX, label: 'DO NOT FEED' },
}

const QUICK = ['Chocolate', 'Grapes', 'Chicken', 'Onion', 'Peanut butter', 'Xylitol', 'Carrot', 'Lily']

export default function FoodSafetyPage() {
  const [query, setQuery] = useState('')

  const result = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    const hit = DB.find(item => item.names.some(n => q.includes(n) || n.includes(q)))
    return hit ?? 'unknown'
  }, [query])

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative p-6 lg:p-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge className="mb-4 bg-[#FF7A6B]/10 text-[#FF7A6B] border-[#FF7A6B]/30 font-mono text-[10px]">
            <Sparkles className="w-3 h-3 mr-1.5" /> LIFESAVER
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Food Safety <span className="text-[#FF7A6B]">Checker</span>
          </h1>
          <p className="text-zinc-400 max-w-xl">Can your pet eat that? Type any food, plant or household item to check instantly.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 mb-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="e.g. chocolate, grapes, chicken…" autoFocus
              className="pl-12 h-14 text-lg bg-[#100D0E] border-white/8 focus:border-[#FF7A6B]/40 rounded-xl"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {QUICK.map(q => (
              <button key={q} onClick={() => setQuery(q)} className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-zinc-400 hover:text-white hover:border-white/25 transition-all">
                {q}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {result && result !== 'unknown' && (
            <motion.div key={query} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card rounded-2xl p-6" style={{ borderColor: `${STYLE[result.level].color}45` }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${STYLE[result.level].color}1A`, border: `1px solid ${STYLE[result.level].color}40` }}>
                  {(() => { const I = STYLE[result.level].icon; return <I className="w-7 h-7" style={{ color: STYLE[result.level].color }} /> })()}
                </div>
                <div>
                  <Badge className="font-mono mb-1" style={{ background: `${STYLE[result.level].color}1A`, color: STYLE[result.level].color, borderColor: `${STYLE[result.level].color}40` }}>
                    {STYLE[result.level].label}
                  </Badge>
                  <div className="text-xl font-semibold capitalize" style={{ fontFamily: 'var(--font-display)' }}>{query.trim()}</div>
                </div>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{result.note}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-zinc-500">
                <Dog className="w-3.5 h-3.5" /> Dogs <Cat className="w-3.5 h-3.5 ml-1" /> Cats
              </div>
              {result.level === 'toxic' && (
                <div className="mt-5 p-4 rounded-xl bg-[#FF5A5F]/8 border border-[#FF5A5F]/25 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-[#FF5A5F]"><Phone className="w-4 h-4" /> Suspected poisoning?</div>
                  <span className="font-mono text-sm text-white">Vet emergency: 0800 PET HELP</span>
                </div>
              )}
            </motion.div>
          )}
          {result === 'unknown' && (
            <motion.div key="unknown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="glass-card rounded-2xl p-8 text-center text-zinc-400">
              <ShieldAlert className="w-10 h-10 mx-auto mb-3 text-[#FFB84D] opacity-60" />
              <p className="text-sm">We don&rsquo;t have <span className="text-white capitalize">&ldquo;{query.trim()}&rdquo;</span> in our database yet.</p>
              <p className="text-xs text-zinc-500 mt-1">When in doubt, don&rsquo;t feed it — and ask your vet.</p>
            </motion.div>
          )}
          {!result && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-10 text-center text-zinc-500 min-h-[180px] flex flex-col items-center justify-center">
              <ShieldCheck className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">Type a food above to check if it&rsquo;s safe for your pet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
