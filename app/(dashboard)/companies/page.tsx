'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, Building2, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getToxicityLabel } from '@/lib/utils'

const COMPANIES = [
  { id: 1, name: 'TechNova ZA', industry: 'Technology', city: 'Johannesburg', score: 88, reports: 142, verified: true },
  { id: 2, name: 'FirstBank Corp', industry: 'Finance', city: 'Cape Town', score: 72, reports: 89, verified: true },
  { id: 3, name: 'MediaPlex', industry: 'Media', city: 'Johannesburg', score: 65, reports: 54, verified: false },
  { id: 4, name: 'HealthCare SA', industry: 'Healthcare', city: 'Pretoria', score: 51, reports: 38, verified: true },
  { id: 5, name: 'RetailHub', industry: 'Retail', city: 'Durban', score: 44, reports: 27, verified: false },
  { id: 6, name: 'GovDept IT', industry: 'Government', city: 'Pretoria', score: 79, reports: 116, verified: true },
  { id: 7, name: 'LawFirm Associates', industry: 'Legal', city: 'Cape Town', score: 61, reports: 45, verified: false },
  { id: 8, name: 'BuildCo Construction', industry: 'Construction', city: 'Johannesburg', score: 83, reports: 97, verified: true },
]

const SCORE_COLOR = (s: number) => {
  if (s >= 75) return '#FF3B30'
  if (s >= 50) return '#FFB347'
  if (s >= 25) return '#FF6B6B'
  return '#4ECDC4'
}

export default function CompaniesPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const industries = ['All', ...Array.from(new Set(COMPANIES.map(c => c.industry)))]
  const filtered = COMPANIES
    .filter(c => filter === 'All' || c.industry === filter)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.score - a.score)

  return (
    <div className="min-h-screen bg-[#08090B] py-12 px-6 relative">
      <div className="absolute inset-0 bg-mesh-soft" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-black mb-3 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Company <span className="text-gradient-ember">Watchlist</span>
          </h1>
          <p className="text-zinc-400 mb-8">
            Crowd-sourced toxicity scores. Real reports from real employees.
          </p>

          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="pl-10 bg-[#111111] border-white/10 focus:border-[#FF3B30]/50"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {industries.map(ind => (
                <button
                  key={ind}
                  onClick={() => setFilter(ind)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    filter === ind
                      ? 'bg-[#FF3B30]/15 border-[#FF3B30]/50 text-[#FF3B30]'
                      : 'bg-[#111111] border-white/10 text-[#9A9A9A] hover:text-white'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Company grid */}
          <div className="grid gap-4">
            {filtered.map((company, i) => {
              const color = SCORE_COLOR(company.score)
              const label = getToxicityLabel(company.score)
              return (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-5 p-5 bg-[#111111] border border-white/8 rounded-2xl hover:border-[#FF3B30]/30 transition-all duration-300 cursor-pointer group"
                >
                  {/* Rank */}
                  <div className="text-2xl font-black text-[#9A9A9A] w-8 shrink-0" style={{ fontFamily: 'var(--font-display)' }}>
                    {i + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
                    <Building2 className="w-6 h-6" style={{ color }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-base truncate">{company.name}</span>
                      {company.verified && (
                        <Badge className="bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20 text-xs shrink-0">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="text-[#9A9A9A] text-xs flex items-center gap-3">
                      <span>{company.industry}</span>
                      <span>·</span>
                      <span>{company.city}</span>
                      <span>·</span>
                      <span>{company.reports} reports</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-2xl font-black" style={{ color, fontFamily: 'var(--font-display)' }}>
                        {company.score}
                      </div>
                      <div className="text-xs font-semibold" style={{ color }}>{label}</div>
                    </div>
                    <div className="w-24 h-2 bg-[#1A1A1A] rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${company.score}%`, background: color }}
                      />
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9A9A9A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-[#9A9A9A]">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No companies found</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
