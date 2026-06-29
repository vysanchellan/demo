'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Apple, Dog, Cat, Rabbit, Bird, Turtle, Rat, Bone, Flame, Droplets, Beef, Wheat, Info, Sparkles
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer
} from 'recharts'

type SpeciesKey = 'dog' | 'cat' | 'rabbit' | 'bird' | 'reptile' | 'small'

const SPECIES_CFG: Record<SpeciesKey, {
  label: string; icon: any; factor: number; youngLabel: string; maxKg: number; foodLabel: string;
  note: string; macros: { axis: string; value: number }[]
}> = {
  dog: { label: 'Dog', icon: Dog, factor: 1.0, youngLabel: 'Puppy', maxKg: 70, foodLabel: 'Dry food',
    note: 'Based on canine RER/MER energy formulas.', macros: [{ axis: 'Protein', value: 75 }, { axis: 'Fat', value: 60 }, { axis: 'Carbs', value: 50 }, { axis: 'Fibre', value: 55 }, { axis: 'Moisture', value: 60 }] },
  cat: { label: 'Cat', icon: Cat, factor: 0.9, youngLabel: 'Kitten', maxKg: 12, foodLabel: 'Dry food',
    note: 'Cats are obligate carnivores — protein-rich diets only.', macros: [{ axis: 'Protein', value: 90 }, { axis: 'Fat', value: 70 }, { axis: 'Carbs', value: 25 }, { axis: 'Fibre', value: 40 }, { axis: 'Moisture', value: 80 }] },
  rabbit: { label: 'Rabbit', icon: Rabbit, factor: 0.7, youngLabel: 'Kit', maxKg: 8, foodLabel: 'Pellets',
    note: 'Rabbits need unlimited hay + a small portion of pellets and greens.', macros: [{ axis: 'Protein', value: 40 }, { axis: 'Fat', value: 18 }, { axis: 'Carbs', value: 45 }, { axis: 'Fibre', value: 95 }, { axis: 'Moisture', value: 65 }] },
  bird: { label: 'Bird', icon: Bird, factor: 1.3, youngLabel: 'Chick', maxKg: 2, foodLabel: 'Seed / pellets',
    note: 'Birds have fast metabolisms — fresh pellets, seed and veg daily.', macros: [{ axis: 'Protein', value: 65 }, { axis: 'Fat', value: 45 }, { axis: 'Carbs', value: 70 }, { axis: 'Fibre', value: 50 }, { axis: 'Moisture', value: 55 }] },
  reptile: { label: 'Reptile', icon: Turtle, factor: 0.35, youngLabel: 'Juvenile', maxKg: 15, foodLabel: 'Food',
    note: 'Reptiles are ectotherms — feeding frequency varies hugely by species.', macros: [{ axis: 'Protein', value: 70 }, { axis: 'Fat', value: 40 }, { axis: 'Carbs', value: 35 }, { axis: 'Fibre', value: 60 }, { axis: 'Moisture', value: 70 }] },
  small: { label: 'Small pet', icon: Rat, factor: 1.1, youngLabel: 'Young', maxKg: 3, foodLabel: 'Pellets / mix',
    note: 'Hamsters, rats & guinea pigs — small frequent portions plus fresh veg.', macros: [{ axis: 'Protein', value: 60 }, { axis: 'Fat', value: 40 }, { axis: 'Carbs', value: 65 }, { axis: 'Fibre', value: 70 }, { axis: 'Moisture', value: 55 }] },
}

export default function NutritionPage() {
  const [species, setSpecies] = useState<SpeciesKey>('dog')
  const [weight, setWeight] = useState(12)
  const [activity, setActivity] = useState(1.6)
  const [lifeStage, setLifeStage] = useState<'puppy' | 'adult' | 'senior'>('adult')
  const [bodyCondition, setBodyCondition] = useState(3)

  const cfg = SPECIES_CFG[species]
  const rer = 70 * Math.pow(weight, 0.75)
  const stageFactor = lifeStage === 'puppy' ? 2.0 : lifeStage === 'senior' ? 1.1 : 1.0
  const bcFactor = bodyCondition >= 4 ? 0.85 : bodyCondition <= 2 ? 1.15 : 1.0
  const mer = Math.round(rer * activity * stageFactor * cfg.factor * bcFactor)

  const dryG = Math.round(mer / 3.5)
  const wetG = Math.round(mer / 1.2)
  const meals = lifeStage === 'puppy' ? 3 : 2
  const waterMl = Math.round(weight * 55)

  const macros = cfg.macros

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative p-6 lg:p-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge className="mb-4 bg-[#FF7A6B]/10 text-[#FF7A6B] border-[#FF7A6B]/30 font-mono text-[10px]">
            <Sparkles className="w-3 h-3 mr-1.5" /> VET-BACKED
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Nutrition <span className="text-[#FF7A6B]">Planner</span>
          </h1>
          <p className="text-zinc-400 max-w-xl">Precise daily calories, portions and feeding schedule — calculated with the energy formulas vets use.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6 space-y-6">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Species</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(SPECIES_CFG) as SpeciesKey[]).map(k => {
                  const Icon = SPECIES_CFG[k].icon
                  return (
                    <button key={k} onClick={() => { setSpecies(k); setWeight(w => Math.min(w, SPECIES_CFG[k].maxKg)) }} aria-pressed={species === k}
                      className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-xs transition-all ${species === k ? 'bg-[#FF7A6B]/15 border-[#FF7A6B]/40 text-[#FF7A6B]' : 'bg-white/[0.03] border-white/8 text-zinc-400 hover:border-white/20'}`}>
                      <Icon className="w-4 h-4" /> {SPECIES_CFG[k].label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Weight</label>
                <span className="font-mono text-sm text-[#FF7A6B] font-semibold">{weight} kg</span>
              </div>
              <input type="range" min={0.5} max={cfg.maxKg} step={cfg.maxKg <= 3 ? 0.1 : 0.5} value={Math.min(weight, cfg.maxKg)} onChange={e => setWeight(+e.target.value)} className="w-full accent-[#FF7A6B]" aria-label="Weight" />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Life stage</label>
              <div className="grid grid-cols-3 gap-2">
                {(['puppy', 'adult', 'senior'] as const).map(s => (
                  <button key={s} onClick={() => setLifeStage(s)} aria-pressed={lifeStage === s}
                    className={`px-2 py-2 rounded-xl border text-xs capitalize transition-all ${lifeStage === s ? 'bg-[#FF7A6B]/15 border-[#FF7A6B]/40 text-[#FF7A6B]' : 'bg-white/[0.03] border-white/8 text-zinc-400 hover:border-white/20'}`}>
                    {s === 'puppy' ? cfg.youngLabel : s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Activity level</label>
              <div className="grid grid-cols-3 gap-2">
                {([['Low', 1.3], ['Normal', 1.6], ['High', 2.0]] as const).map(([label, f]) => (
                  <button key={label} onClick={() => setActivity(f)} aria-pressed={activity === f}
                    className={`px-2 py-2 rounded-xl border text-xs transition-all ${activity === f ? 'bg-[#FF7A6B]/15 border-[#FF7A6B]/40 text-[#FF7A6B]' : 'bg-white/[0.03] border-white/8 text-zinc-400 hover:border-white/20'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Body condition</label>
                <span className="font-mono text-xs text-zinc-400">{['Underweight', 'Lean', 'Ideal', 'Heavy', 'Obese'][bodyCondition - 1]}</span>
              </div>
              <input type="range" min={1} max={5} value={bodyCondition} onChange={e => setBodyCondition(+e.target.value)} className="w-full accent-[#FF7A6B]" aria-label="Body condition" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="glass-card rounded-2xl p-6" style={{ borderColor: 'rgba(255,122,107,0.3)' }}>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                <Flame className="w-3.5 h-3.5 text-[#FF7A6B]" /> Daily energy target
              </div>
              <div className="flex items-end gap-2">
                <span className="text-6xl font-semibold tabular-nums text-[#FF7A6B]" style={{ fontFamily: 'var(--font-display)' }}>{mer}</span>
                <span className="text-zinc-500 mb-2">kcal / day</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Bone, label: cfg.foodLabel, v: `${dryG}g`, sub: `≈ ${(dryG / 110).toFixed(1)} cups` },
                { icon: Beef, label: 'Or wet/fresh', v: `${wetG}g`, sub: 'per day' },
                { icon: Wheat, label: 'Meals', v: `${meals}×`, sub: `≈ ${Math.round(dryG / meals)}g each` },
                { icon: Droplets, label: 'Water', v: `${waterMl}ml`, sub: 'min daily' },
              ].map(s => (
                <div key={s.label} className="glass-card rounded-2xl p-4">
                  <s.icon className="w-4 h-4 text-[#FF7A6B] mb-2" />
                  <div className="text-2xl font-semibold tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>{s.v}</div>
                  <div className="text-[11px] text-zinc-500">{s.label} · {s.sub}</div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-2xl p-5">
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">Ideal macro profile</div>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={macros}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: '#A79F9C', fontSize: 11 }} />
                  <Radar dataKey="value" stroke="#FF7A6B" fill="#FF7A6B" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="glass-card rounded-xl p-4 mt-6 flex items-start gap-3">
          <Info className="w-4 h-4 text-[#FFB84D] mt-0.5 shrink-0" />
          <p className="text-xs text-zinc-400 leading-relaxed">
            {cfg.note} Calculated using RER (70 × weight^0.75) and MER multipliers for life stage, activity and body condition.
            This is guidance — confirm with your vet for prescription or medical diets, especially for exotic species.
          </p>
        </div>
      </div>
    </div>
  )
}
