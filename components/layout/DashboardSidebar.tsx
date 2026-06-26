'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileWarning, Building2, Brain,
  Heart, BarChart3, Settings, LogOut, Menu, X, ChevronRight,
  Sparkles, Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Logo from '@/components/public/Logo'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/report', icon: FileWarning, label: 'New Report' },
  { href: '/reports', icon: BarChart3, label: 'All Reports' },
  { href: '/companies', icon: Building2, label: 'Companies' },
  { href: '/assessment', icon: Brain, label: 'Burnout Test' },
  { href: '/predict', icon: Sparkles, label: 'Risk Predictor' },
  { href: '/resources', icon: Heart, label: 'Resources' },
]

async function handleSignOut() {
  const { createClient } = await import('@/lib/supabase/client')
  const supabase = createClient()
  await supabase.auth.signOut()
  window.location.href = '/auth/login'
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function check() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (data?.role === 'admin') setIsAdmin(true)
      } catch {}
    }
    check()
  }, [])

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-[#0F1012] border border-white/10 flex items-center justify-center"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-full z-40 flex flex-col bg-[#0B0C0E] border-r border-white/5 overflow-hidden',
          'hidden lg:flex',
          mobileOpen && '!flex'
        )}
        aria-label="Dashboard navigation"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={36} glow />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-lg font-black whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                BURN<span className="text-[#FF5E3A]">OUT</span>
              </motion.span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0 hidden lg:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight className={cn('w-4 h-4 text-zinc-400 transition-transform', collapsed && 'rotate-180')} />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest px-3 py-2">Main</p>
          )}
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                  active
                    ? 'bg-[#FF5E3A]/12 text-[#FF5E3A] border border-[#FF5E3A]/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className={cn('w-5 h-5 shrink-0', active && 'text-[#FF5E3A]')} />
                {!collapsed && <span className="whitespace-nowrap font-medium">{item.label}</span>}
                {active && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF5E3A]" />
                )}
              </Link>
            )
          })}

          {isAdmin && (
            <>
              {!collapsed && (
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest px-3 py-2 mt-4">Admin</p>
              )}
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                  pathname === '/admin'
                    ? 'bg-[#FF5E3A]/12 text-[#FF5E3A] border border-[#FF5E3A]/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Shield className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="font-medium">Admin Panel</span>}
              </Link>
            </>
          )}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200">
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">Settings</span>}
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-[#FF5E3A] hover:bg-[#FF5E3A]/5 transition-all duration-200"
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}
