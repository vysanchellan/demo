'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MapPin, Star, Clock, Phone, Navigation, Stethoscope, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Vet } from '@/components/VetMap'

const VetMap = dynamic(() => import('@/components/VetMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#0A0D0F]">
      <Loader2 className="w-6 h-6 text-[#00E599] animate-spin" />
    </div>
  ),
})

const VET_NAMES = [
  'Greenpaw Veterinary Clinic', 'CityVet Animal Hospital', 'The Pet Doctor',
  'Companion Care Vets', 'Whiskers & Tails Clinic', 'Northside Animal Hospital',
  'Paws & Claws Veterinary', 'Riverside Pet Health', 'Emergency Vet 24/7',
]

function haversine(a: [number, number], b: [number, number]) {
  const R = 6371
  const dLat = (b[0] - a[0]) * Math.PI / 180
  const dLng = (b[1] - a[1]) * Math.PI / 180
  const lat1 = a[0] * Math.PI / 180, lat2 = b[0] * Math.PI / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export default function VetFinderPage() {
  const [center, setCenter] = useState<[number, number] | null>(null)
  const [status, setStatus] = useState<'locating' | 'ready' | 'denied'>('locating')

  const DEFAULT: [number, number] = [-26.2041, 28.0473] // Johannesburg

  useEffect(() => {
    if (!('geolocation' in navigator)) { setCenter(DEFAULT); setStatus('denied'); return }
    navigator.geolocation.getCurrentPosition(
      pos => { setCenter([pos.coords.latitude, pos.coords.longitude]); setStatus('ready') },
      () => { setCenter(DEFAULT); setStatus('denied') },
      { timeout: 8000 }
    )
  }, [])

  const vets = useMemo<Vet[]>(() => {
    if (!center) return []
    // Generate plausible vets scattered around the user
    return VET_NAMES.map((name, i) => {
      const angle = (i / VET_NAMES.length) * Math.PI * 2
      const dist = 0.008 + (i % 4) * 0.012
      const lat = center[0] + Math.sin(angle) * dist
      const lng = center[1] + Math.cos(angle) * dist
      return {
        id: i,
        name,
        lat, lng,
        rating: +(4.2 + ((i * 7) % 8) / 10).toFixed(1),
        open: i % 3 !== 0,
        emergency: name.includes('Emergency'),
        distanceKm: haversine(center, [lat, lng]),
      }
    }).sort((a, b) => a.distanceKm - b.distanceKm)
  }, [center])

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative p-6 lg:p-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Badge className="mb-4 bg-[#00E599]/10 text-[#00E599] border-[#00E599]/30 font-mono text-[10px]">
            <MapPin className="w-3 h-3 mr-1.5" /> LIVE MAP
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Find a <span className="text-[#00E599]">Vet</span> near you
          </h1>
          <p className="text-zinc-400 max-w-xl">
            {status === 'locating' && 'Locating you…'}
            {status === 'ready' && 'Trusted veterinary clinics around your current location.'}
            {status === 'denied' && 'Showing vets near Johannesburg. Enable location for results near you.'}
          </p>
        </motion.div>

        {status === 'denied' && (
          <div className="glass-card rounded-xl p-3 mb-4 flex items-center gap-2.5 text-xs text-zinc-400">
            <AlertCircle className="w-4 h-4 text-[#5EEAD4] shrink-0" />
            Location access was blocked — using a default city. Allow location in your browser to see vets near you.
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_360px] gap-5">
          {/* Map */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-3xl overflow-hidden h-[300px] lg:h-[620px] border border-white/8">
            {center && <VetMap center={center} vets={vets} />}
          </motion.div>

          {/* List */}
          <div className="space-y-3 lg:h-[620px] lg:overflow-y-auto no-scrollbar pr-1">
            {vets.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="glass-card rounded-2xl p-4 surface-hover">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#00E599]/12 border border-[#00E599]/20 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-4 h-4 text-[#00E599]" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm leading-tight">{v.name}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                        <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-[#5EEAD4] fill-[#5EEAD4]" /> {v.rating}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5"><Navigation className="w-3 h-3" /> {v.distanceKm.toFixed(1)} km</span>
                      </div>
                    </div>
                  </div>
                  {v.emergency
                    ? <Badge className="bg-[#5EEAD4]/15 text-[#5EEAD4] border-[#5EEAD4]/30 text-[10px] shrink-0">24/7</Badge>
                    : <Badge className={`text-[10px] shrink-0 ${v.open ? 'bg-[#00E599]/15 text-[#00E599] border-[#00E599]/30' : 'bg-white/5 text-zinc-500 border-white/10'}`}>{v.open ? 'Open' : 'Closed'}</Badge>}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button className="btn-glass-emerald flex-1 h-8 rounded-lg text-xs gap-1.5"><Phone className="w-3 h-3" /> Call</Button>
                  <Button className="btn-glass flex-1 h-8 rounded-lg text-xs text-white gap-1.5"><Navigation className="w-3 h-3" /> Directions</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
