'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Shield, AlertTriangle, CheckCircle2,
  FileWarning, Activity,
  Eye, Trash2, Search, Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { toast } from 'sonner'

interface ReportRow {
  id: string
  company_name: string
  report_type: string
  severity: number
  status: 'pending' | 'reviewed' | 'verified'
  created_at: string
  upvotes: number
}

type Role = 'loading' | 'forbidden' | 'admin'

const MOCK_REPORTS: ReportRow[] = [
  { id: '1', company_name: 'TechNova ZA', report_type: 'overwork', severity: 9, status: 'pending', created_at: '2026-06-24', upvotes: 14 },
  { id: '2', company_name: 'FirstBank Corp', report_type: 'gaslighting', severity: 8, status: 'pending', created_at: '2026-06-23', upvotes: 8 },
  { id: '3', company_name: 'MediaPlex', report_type: 'harassment', severity: 10, status: 'reviewed', created_at: '2026-06-22', upvotes: 31 },
  { id: '4', company_name: 'GovDept IT', report_type: 'nepotism', severity: 7, status: 'verified', created_at: '2026-06-21', upvotes: 22 },
  { id: '5', company_name: 'RetailHub', report_type: 'wage_theft', severity: 8, status: 'pending', created_at: '2026-06-20', upvotes: 18 },
  { id: '6', company_name: 'BuildCo', report_type: 'unsafe_conditions', severity: 9, status: 'verified', created_at: '2026-06-19', upvotes: 27 },
]

export default function AdminPage() {
  const [role, setRole] = useState<Role>('loading')
  const [reports, setReports] = useState<ReportRow[]>(MOCK_REPORTS)
  const [search, setSearch] = useState('')
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    async function check() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const { isUserAdmin } = await import('@/lib/auth')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setRole('forbidden'); return }
        setUserEmail(user.email ?? '')
        const admin = await isUserAdmin(user)
        setRole(admin ? 'admin' : 'forbidden')
        if (admin) {
          const { data } = await supabase
            .from('toxicity_reports')
            .select('id, company_name, report_type, severity, status, created_at, upvotes')
            .order('created_at', { ascending: false })
            .limit(100)
          if (data && data.length > 0) setReports(data as ReportRow[])
        }
      } catch {
        setRole('forbidden')
      }
    }
    check()
  }, [])

  async function updateStatus(id: string, status: ReportRow['status']) {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    toast.success(`Report marked as ${status}`)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      if (!String(id).match(/^\d+$/)) await supabase.from('toxicity_reports').update({ status }).eq('id', id)
    } catch {}
  }

  async function deleteReport(id: string) {
    setReports(prev => prev.filter(r => r.id !== id))
    toast.success('Report deleted')
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      if (!String(id).match(/^\d+$/)) await supabase.from('toxicity_reports').delete().eq('id', id)
    } catch {}
  }

  const filtered = reports.filter(r => r.company_name.toLowerCase().includes(search.toLowerCase()))
  const pending = reports.filter(r => r.status === 'pending').length
  const verified = reports.filter(r => r.status === 'verified').length

  if (role === 'loading') {
    return (
      <div className="min-h-screen bg-[#050708] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#00E599]/30 border-t-[#00E599] animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Verifying access…</p>
        </div>
      </div>
    )
  }

  if (role === 'forbidden') {
    return (
      <div className="min-h-screen bg-[#050708] flex items-center justify-center px-6 relative">
        <div className="absolute inset-0 bg-mesh-soft" />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-md text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#EF4444]" />
          </div>
          <h1 className="text-4xl font-black mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            ACCESS DENIED
          </h1>
          <p className="text-zinc-400 leading-relaxed mb-6">
            This area is restricted to platform administrators.
            {userEmail && <span className="block mt-2 text-xs text-zinc-500">Signed in as <span className="text-zinc-300 font-mono">{userEmail}</span></span>}
          </p>
          <div className="p-4 rounded-xl bg-[#5EEAD4]/5 border border-[#5EEAD4]/20 mb-6 text-left">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-[#5EEAD4] mt-0.5 shrink-0" />
              <p className="text-xs text-zinc-400 leading-relaxed">
                To seed an admin user, run the SQL script at <span className="font-mono text-zinc-300">supabase/RUN_THIS_SETUP.sql</span> in your Supabase SQL editor.
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/"><Button variant="outline" className="border-white/15">Home</Button></Link>
            <Link href="/dashboard">
              <Button className="bg-[#00E599] hover:bg-[#00C885] text-white border-0">Dashboard</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050708] relative">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
                ADMIN CONTROL
              </h1>
              <Badge className="bg-[#00E599]/15 text-[#00E599] border-[#00E599]/30 font-mono">
                <Shield className="w-3 h-3 mr-1.5" />
                AUTHENTICATED
              </Badge>
            </div>
            <p className="text-zinc-400 text-sm flex items-center gap-2">
              Signed in as <span className="font-mono text-zinc-300">{userEmail}</span>
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Reports', value: reports.length, icon: FileWarning, color: '#00E599' },
            { label: 'Pending Review', value: pending, icon: AlertTriangle, color: '#5EEAD4' },
            { label: 'Verified', value: verified, icon: CheckCircle2, color: '#00D4FF' },
            { label: 'Avg Severity', value: (reports.reduce((s, r) => s + r.severity, 0) / reports.length).toFixed(1), icon: Activity, color: '#2E8BFF' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl border border-white/8 bg-[#0A0D0F] surface-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-3xl font-black tabular-nums mb-0.5" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>
                {s.value}
              </div>
              <div className="text-xs text-zinc-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Reports table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/8 bg-[#0A0D0F] overflow-hidden"
        >
          <div className="p-5 border-b border-white/8 flex items-center justify-between gap-4">
            <h2 className="font-bold flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-[#00E599]" />
              Report Moderation Queue
            </h2>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search company…"
                className="pl-10 bg-[#12161A] border-white/8 h-9 text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wider">Company</TableHead>
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wider">Type</TableHead>
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wider">Severity</TableHead>
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wider">Upvotes</TableHead>
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id} className="border-white/5 hover:bg-white/[0.02]">
                    <TableCell className="font-medium">{r.company_name}</TableCell>
                    <TableCell className="text-zinc-400 text-sm capitalize">{r.report_type.replace('_', ' ')}</TableCell>
                    <TableCell>
                      <Badge
                        className="font-mono"
                        style={{
                          background: r.severity >= 9 ? 'rgba(255,94,58,0.15)' : r.severity >= 7 ? 'rgba(251,191,36,0.15)' : 'rgba(16,217,184,0.15)',
                          color: r.severity >= 9 ? '#00E599' : r.severity >= 7 ? '#5EEAD4' : '#00D4FF',
                          borderColor: r.severity >= 9 ? 'rgba(255,94,58,0.3)' : r.severity >= 7 ? 'rgba(251,191,36,0.3)' : 'rgba(16,217,184,0.3)',
                        }}
                      >
                        {r.severity}/10
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="font-mono uppercase text-[10px]"
                        style={{
                          background: r.status === 'verified' ? 'rgba(16,217,184,0.15)' : r.status === 'reviewed' ? 'rgba(139,92,246,0.15)' : 'rgba(251,191,36,0.15)',
                          color: r.status === 'verified' ? '#00D4FF' : r.status === 'reviewed' ? '#2E8BFF' : '#5EEAD4',
                          borderColor: r.status === 'verified' ? 'rgba(16,217,184,0.3)' : r.status === 'reviewed' ? 'rgba(139,92,246,0.3)' : 'rgba(251,191,36,0.3)',
                        }}
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{r.upvotes}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status !== 'verified' && (
                          <Button
                            size="sm" variant="ghost"
                            onClick={() => updateStatus(r.id, 'verified')}
                            className="h-8 px-2 text-[#00D4FF] hover:text-[#00D4FF] hover:bg-[#00D4FF]/10"
                            aria-label="Verify report"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                        )}
                        {r.status !== 'reviewed' && (
                          <Button
                            size="sm" variant="ghost"
                            onClick={() => updateStatus(r.id, 'reviewed')}
                            className="h-8 px-2 text-[#2E8BFF] hover:text-[#2E8BFF] hover:bg-[#2E8BFF]/10"
                            aria-label="Mark reviewed"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm" variant="ghost"
                          onClick={() => deleteReport(r.id)}
                          className="h-8 px-2 text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                          aria-label="Delete report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
