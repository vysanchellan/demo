'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FileWarning, Building2, Brain, Users, Sparkles,
  AlertTriangle, ArrowUpRight, Clock, Shield, Activity
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const AREA_DATA = [
  { month: 'Jan', reports: 320 }, { month: 'Feb', reports: 410 },
  { month: 'Mar', reports: 390 }, { month: 'Apr', reports: 520 },
  { month: 'May', reports: 680 }, { month: 'Jun', reports: 750 },
  { month: 'Jul', reports: 820 }, { month: 'Aug', reports: 940 },
]

const INDUSTRY_DATA = [
  { name: 'Tech', reports: 340 },
  { name: 'Finance', reports: 280 },
  { name: 'Healthcare', reports: 220 },
  { name: 'Retail', reports: 190 },
  { name: 'Education', reports: 160 },
  { name: 'Media', reports: 140 },
]

const PIE_DATA = [
  { name: 'Overwork', value: 28 },
  { name: 'Harassment', value: 22 },
  { name: 'Gaslighting', value: 18 },
  { name: 'Discrimination', value: 14 },
  { name: 'Other', value: 18 },
]
const PIE_COLORS = ['#FF2D55', '#FF6B35', '#B026FF', '#00E5FF', '#FFC83D']

const RECENT = [
  { company: 'TechCorp ZA', type: 'Overwork', severity: 9, time: '2h ago' },
  { company: 'FinBank Ltd', type: 'Gaslighting', severity: 8, time: '4h ago' },
  { company: 'MediaHouse', type: 'Harassment', severity: 10, time: '6h ago' },
  { company: 'RetailCo', type: 'Wage Theft', severity: 7, time: '1d ago' },
  { company: 'HealthNet', type: 'Retaliation', severity: 8, time: '1d ago' },
]

const STATS = [
  { label: 'Total Reports', value: '14,891', change: '+23%', icon: FileWarning, color: '#FF2D55' },
  { label: 'Companies Flagged', value: '2,340', change: '+12%', icon: Building2, color: '#FF6B35' },
  { label: 'Users Protected', value: '51,200', change: '+31%', icon: Users, color: '#00E5FF' },
  { label: 'Avg Severity', value: '7.4/10', change: '+0.3', icon: AlertTriangle, color: '#B026FF' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function init() {
      const { createClient } = await import('@/lib/supabase/client')
      const { isUserAdmin } = await import('@/lib/auth')
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      if (data.user && (await isUserAdmin(data.user))) {
        // Admins are routed straight to the admin console
        router.replace('/admin')
        return
      }
      setChecking(false)
    }
    init()
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#FF2D55]/30 border-t-[#FF2D55] animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Loading your dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-black tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Dashboard
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              {user?.email ? `Welcome back, ${user.email.split('@')[0]}` : 'Platform Overview'}
            </p>
          </div>
          <Link href="/report">
            <Button className="bg-gradient-to-r from-[#FF2D55] to-[#FF6B35] hover:from-[#FF1B47] text-white border-0 shadow-[0_4px_20px_rgba(255,45,85,0.4)]">
              <FileWarning className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </Link>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="p-5 glass-card rounded-2xl surface-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}1F` }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <Badge className="bg-transparent border-0 text-[#00E5FF] text-xs">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {stat.change}
                </Badge>
              </div>
              <div className="text-2xl font-black mb-0.5 tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
                {stat.value}
              </div>
              <div className="text-zinc-400 text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-2 p-5 glass-card rounded-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Reports Trend</h2>
              <Badge className="bg-[#FF2D55]/10 text-[#FF2D55] border-[#FF2D55]/20 text-xs">2026</Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={AREA_DATA}>
                <defs>
                  <linearGradient id="reportsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF2D55" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF2D55" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#ADA7B5', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#ADA7B5', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#18141C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                  labelStyle={{ color: '#F7F5F8' }} itemStyle={{ color: '#FF2D55' }}
                />
                <Area type="monotone" dataKey="reports" stroke="#FF2D55" fill="url(#reportsGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="p-5 glass-card rounded-2xl"
          >
            <h2 className="font-bold text-sm uppercase tracking-wider text-zinc-400 mb-6">Report Types</h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                  {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#18141C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                  formatter={(value: any, name: any) => [value + '%', name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {PIE_DATA.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-zinc-400">{item.name}</span>
                  </div>
                  <span className="font-semibold tabular-nums">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Industry + Recent */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="p-5 glass-card rounded-2xl"
          >
            <h2 className="font-bold text-sm uppercase tracking-wider text-zinc-400 mb-6">By Industry</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={INDUSTRY_DATA} layout="vertical">
                <XAxis type="number" tick={{ fill: '#ADA7B5', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#ADA7B5', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ background: '#18141C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                  formatter={(value: any) => [value, 'Reports']}
                />
                <Bar dataKey="reports" fill="#FF2D55" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="lg:col-span-2 p-5 glass-card rounded-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Recent Reports</h2>
              <Link href="/reports">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white text-xs">
                  View All <ArrowUpRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {RECENT.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FF2D55]/10 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4 text-[#FF2D55]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{r.company}</div>
                      <div className="text-zinc-400 text-xs flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />{r.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[#18141C] text-zinc-400 border-white/10 text-xs hidden sm:inline-flex">{r.type}</Badge>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold tabular-nums" style={{ color: r.severity >= 9 ? '#FF2D55' : r.severity >= 7 ? '#FF6B35' : '#00E5FF' }}>
                        {r.severity}
                      </span>
                      <span className="text-zinc-500 text-xs">/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
