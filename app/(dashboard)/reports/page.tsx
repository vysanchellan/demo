'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Search, AlertTriangle, ThumbsUp,
  Clock, Building2, MapPin
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { REPORT_TYPE_LABELS, type ReportType } from '@/lib/types'
import { formatRelative } from '@/lib/utils'

const MOCK_REPORTS = [
  { id: 1, company: 'TechNova ZA', industry: 'Technology', city: 'Johannesburg', type: 'overwork' as ReportType, severity: 9, description: 'Expected to work 80+ hour weeks without overtime pay. Mental health completely destroyed. HR ignores all complaints.', upvotes: 234, date: '2026-06-24', verified: true },
  { id: 2, company: 'FirstBank Corp', industry: 'Finance', city: 'Cape Town', type: 'gaslighting' as ReportType, severity: 8, description: 'Management constantly denies documented incidents. When I reported harassment I was told I was "being too sensitive". Transferred me to a different department.', upvotes: 189, date: '2026-06-23', verified: true },
  { id: 3, company: 'MediaPlex', industry: 'Media', city: 'Johannesburg', type: 'harassment' as ReportType, severity: 10, description: 'Senior editor bullying junior staff systematically for 2+ years. 6 people have left in the past year because of this person. Management protects them.', upvotes: 312, date: '2026-06-22', verified: false },
  { id: 4, company: 'GovDept IT', industry: 'Government', city: 'Pretoria', type: 'nepotism' as ReportType, severity: 7, description: 'Director\'s relatives given promotions and preferential treatment regardless of performance. Meritocracy does not exist here.', upvotes: 156, date: '2026-06-21', verified: true },
  { id: 5, company: 'RetailHub', industry: 'Retail', city: 'Durban', type: 'wage_theft' as ReportType, severity: 8, description: 'Overtime routinely not paid. Told it\'s "expected" to stay late. Time cards manipulated. Union reps ignored or terminated.', upvotes: 278, date: '2026-06-20', verified: false },
  { id: 6, company: 'BuildCo Construction', industry: 'Construction', city: 'Johannesburg', type: 'unsafe_conditions' as ReportType, severity: 9, description: 'Safety equipment not provided. Sites inspected but management hides violations. Two injuries in the past 3 months no reporting done.', upvotes: 201, date: '2026-06-19', verified: true },
]

const SEVERITY_COLOR = (s: number) => s >= 9 ? '#00E599' : s >= 7 ? '#5EEAD4' : '#00D4FF'

export default function ReportsPage() {
  const [search, setSearch] = useState('')
  const [upvoted, setUpvoted] = useState<Set<number | string>>(new Set())
  const [reports, setReports] = useState(MOCK_REPORTS)

  // Merge real reports on top of the seed so the feed is always rich
  useEffect(() => {
    async function load() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data, error } = await supabase
          .from('toxicity_reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
        if (error || !data || data.length === 0) return
        const mapped = data.map((d: any) => ({
          id: d.id,
          company: d.company_name,
          industry: d.industry ?? 'Other',
          city: d.city ?? '—',
          type: d.report_type as ReportType,
          severity: d.severity,
          description: d.description,
          upvotes: d.upvotes ?? 0,
          date: d.created_at,
          verified: d.status === 'verified',
        }))
        setReports([...mapped, ...MOCK_REPORTS] as typeof MOCK_REPORTS)
      } catch {}
    }
    load()
  }, [])

  const filtered = reports.filter(r =>
    r.company.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#050708] py-12 px-6 relative">
      <div className="absolute inset-0 bg-mesh-soft" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
                REPORTS FEED
              </h1>
              <p className="text-[#93A29E] text-sm mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse inline-block" />
                {MOCK_REPORTS.length} reports — community verified
              </p>
            </div>
            <Link href="/report">
              <Button className="bg-[#00E599] hover:bg-[#00C885] text-white border-0">
                + File Report
              </Button>
            </Link>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#93A29E]" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search companies, descriptions..."
              className="pl-10 bg-[#0A0D0F] border-white/10 focus:border-[#00E599]/50"
            />
          </div>

          <div className="space-y-5">
            {filtered.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="p-6 bg-[#0A0D0F] border border-white/8 rounded-2xl hover:border-[#00E599]/20 transition-all duration-300"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00E599]/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-[#00E599]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{report.company}</span>
                        {report.verified && (
                          <Badge className="bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/20 text-xs">Verified</Badge>
                        )}
                      </div>
                      <div className="text-[#93A29E] text-xs flex items-center gap-2 mt-0.5">
                        <MapPin className="w-3 h-3" /> {report.city}
                        <span>·</span>
                        <Clock className="w-3 h-3" /> {formatRelative(report.date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className="bg-[#12161A] text-[#93A29E] border-white/10 text-xs hidden sm:inline-flex">
                      {REPORT_TYPE_LABELS[report.type]}
                    </Badge>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border" style={{ borderColor: `${SEVERITY_COLOR(report.severity)}30`, background: `${SEVERITY_COLOR(report.severity)}10` }}>
                      <AlertTriangle className="w-3 h-3" style={{ color: SEVERITY_COLOR(report.severity) }} />
                      <span className="text-sm font-bold" style={{ color: SEVERITY_COLOR(report.severity) }}>
                        {report.severity}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#93A29E] text-sm leading-relaxed mb-5 line-clamp-3">
                  {report.description}
                </p>

                {/* Severity bar */}
                <div className="h-1 bg-[#12161A] rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${report.severity * 10}%`, background: `linear-gradient(90deg, #14E5C8, ${SEVERITY_COLOR(report.severity)})` }}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setUpvoted(prev => {
                      const next = new Set(prev)
                      next.has(report.id) ? next.delete(report.id) : next.add(report.id)
                      return next
                    })}
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-all ${
                      upvoted.has(report.id)
                        ? 'bg-[#00E599]/15 border-[#00E599]/40 text-[#00E599]'
                        : 'border-white/10 text-[#93A29E] hover:text-white hover:border-white/20'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{report.upvotes + (upvoted.has(report.id) ? 1 : 0)}</span>
                  </button>
                  <span className="text-[#93A29E] text-xs">{report.industry}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
