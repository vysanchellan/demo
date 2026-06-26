'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Flame, FileWarning, Building2, TrendingUp, Brain, Users,
  AlertTriangle, ArrowUpRight, BarChart3, Clock
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
const PIE_COLORS = ['#FF3B30', '#FF6B6B', '#FFB347', '#4ECDC4', '#9B59B6']

const RECENT = [
  { company: 'TechCorp ZA', type: 'Overwork', severity: 9, time: '2h ago' },
  { company: 'FinBank Ltd', type: 'Gaslighting', severity: 8, time: '4h ago' },
  { company: 'MediaHouse', type: 'Harassment', severity: 10, time: '6h ago' },
  { company: 'RetailCo', type: 'Wage Theft', severity: 7, time: '1d ago' },
  { company: 'HealthNet', type: 'Retaliation', severity: 8, time: '1d ago' },
]

const STATS = [
  { label: 'Total Reports', value: '14,891', change: '+23%', icon: FileWarning, color: '#FF3B30' },
  { label: 'Companies Flagged', value: '2,340', change: '+12%', icon: Building2, color: '#FFB347' },
  { label: 'Users Protected', value: '51,200', change: '+31%', icon: Users, color: '#4ECDC4' },
  { label: 'Avg Severity', value: '7.4/10', change: '+0.3', icon: AlertTriangle, color: '#FF6B6B' },
]

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null)

  useEffect(() => {
    async function getUser() {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-4xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
            DASHBOARD
          </h1>
          <p className="text-[#9A9A9A] text-sm mt-1">
            {user?.email ? `Welcome back, ${user.email.split('@')[0]}` : 'Platform Overview'}
          </p>
        </div>
        <Link href="/report">
          <Button className="bg-[#FF3B30] hover:bg-[#E0342A] text-white border-0">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 bg-[#111111] border border-white/8 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}18` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <Badge className="bg-transparent border-0 text-[#4ECDC4] text-xs">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {stat.change}
              </Badge>
            </div>
            <div className="text-2xl font-black mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
              {stat.value}
            </div>
            <div className="text-[#9A9A9A] text-xs">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Reports trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-5 bg-[#111111] border border-white/8 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-sm uppercase tracking-wider text-[#9A9A9A]">Reports Trend</h2>
            <Badge className="bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/20 text-xs">2026</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={AREA_DATA}>
              <defs>
                <linearGradient id="reportsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF3B30" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#9A9A9A', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9A9A9A', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#F5F5F5' }}
                itemStyle={{ color: '#FF3B30' }}
              />
              <Area type="monotone" dataKey="reports" stroke="#FF3B30" fill="url(#reportsGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Report types pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 bg-[#111111] border border-white/8 rounded-2xl"
        >
          <h2 className="font-bold text-sm uppercase tracking-wider text-[#9A9A9A] mb-6">Report Types</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                formatter={(value: any, name: any) => [value + '%', name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {PIE_DATA.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-[#9A9A9A]">{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Industry bar + Recent reports */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Industry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-5 bg-[#111111] border border-white/8 rounded-2xl"
        >
          <h2 className="font-bold text-sm uppercase tracking-wider text-[#9A9A9A] mb-6">By Industry</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={INDUSTRY_DATA} layout="vertical">
              <XAxis type="number" tick={{ fill: '#9A9A9A', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#9A9A9A', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip
                contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                formatter={(value: any, name: any) => [value, 'Reports']}
              />
              <Bar dataKey="reports" fill="#FF3B30" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 p-5 bg-[#111111] border border-white/8 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-sm uppercase tracking-wider text-[#9A9A9A]">Recent Reports</h2>
            <Link href="/reports">
              <Button variant="ghost" size="sm" className="text-[#9A9A9A] hover:text-white text-xs">
                View All <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF3B30]/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-[#FF3B30]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{r.company}</div>
                    <div className="text-[#9A9A9A] text-xs flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />{r.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-[#1A1A1A] text-[#9A9A9A] border-white/10 text-xs hidden sm:inline-flex">{r.type}</Badge>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold" style={{ color: r.severity >= 9 ? '#FF3B30' : r.severity >= 7 ? '#FFB347' : '#4ECDC4' }}>
                      {r.severity}
                    </span>
                    <span className="text-[#9A9A9A] text-xs">/10</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
