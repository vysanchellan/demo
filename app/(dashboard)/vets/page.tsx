'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, Stethoscope, Star, MapPin, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const VETS = [
  { id: 1, name: 'Greenpaw Veterinary Clinic', city: 'Johannesburg', rating: 4.9, reviews: 412, specialty: 'General & Surgery', open: true, emergency: false },
  { id: 2, name: 'CityVet Animal Hospital', city: 'Cape Town', rating: 4.8, reviews: 389, specialty: 'General Practice', open: true, emergency: true },
  { id: 3, name: 'Whiskers & Tails Clinic', city: 'Durban', rating: 4.7, reviews: 254, specialty: 'Feline Specialist', open: false, emergency: false },
  { id: 4, name: 'Companion Care Vets', city: 'Pretoria', rating: 4.9, reviews: 338, specialty: 'Dental & Wellness', open: true, emergency: false },
  { id: 5, name: 'Northside Animal Hospital', city: 'Johannesburg', rating: 4.6, reviews: 197, specialty: 'Exotics & Birds', open: true, emergency: false },
  { id: 6, name: 'Emergency Vet 24/7', city: 'Cape Town', rating: 4.8, reviews: 526, specialty: 'Emergency & Critical', open: true, emergency: true },
  { id: 7, name: 'Riverside Pet Health', city: 'Durban', rating: 4.5, reviews: 143, specialty: 'General Practice', open: false, emergency: false },
  { id: 8, name: 'Paws & Claws Veterinary', city: 'Pretoria', rating: 4.7, reviews: 281, specialty: 'Orthopaedics', open: true, emergency: false },
]

export default function VetsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const cities = ['All', ...Array.from(new Set(VETS.map(v => v.city)))]
  const filtered = VETS
    .filter(v => filter === 'All' || v.city === filter)
    .filter(v => v.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.rating - a.rating)

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative p-6 lg:p-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Vet <span className="text-[#FF7A6B]">Directory</span>
          </h1>
          <p className="text-zinc-400">Top-rated veterinary clinics, reviewed by pet owners.</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clinics…" className="pl-10 bg-[#161213] border-white/10 focus:border-[#FF7A6B]/40" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {cities.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${filter === c ? 'bg-[#FF7A6B]/15 border-[#FF7A6B]/40 text-[#FF7A6B]' : 'bg-[#161213] border-white/10 text-zinc-400 hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5 surface-hover">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#FF7A6B]/12 border border-[#FF7A6B]/20 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5 text-[#FF7A6B]" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm leading-tight">{v.name}</div>
                    <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5"><MapPin className="w-3 h-3" /> {v.city}</div>
                  </div>
                </div>
                {v.emergency
                  ? <Badge className="bg-[#FFB84D]/15 text-[#FFB84D] border-[#FFB84D]/30 text-[10px]">24/7</Badge>
                  : <Badge className={`text-[10px] ${v.open ? 'bg-[#FF7A6B]/15 text-[#FF7A6B] border-[#FF7A6B]/30' : 'bg-white/5 text-zinc-500 border-white/10'}`}>{v.open ? 'Open' : 'Closed'}</Badge>}
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400 mb-4">
                <span className="flex items-center gap-1 text-[#FFB84D]"><Star className="w-3.5 h-3.5 fill-[#FFB84D]" /> {v.rating}</span>
                <span className="text-zinc-600">·</span>
                <span>{v.reviews} reviews</span>
                <span className="text-zinc-600">·</span>
                <span>{v.specialty}</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => toast.success(`Booking request sent to ${v.name}`, { description: 'They’ll confirm your appointment by email.' })} className="btn-glass-emerald flex-1 h-9 rounded-lg text-xs">Book visit</Button>
                <Link href="/vet-finder" className="flex-1"><Button className="btn-glass w-full text-white h-9 rounded-lg text-xs gap-1">View on map <ChevronRight className="w-3 h-3" /></Button></Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
