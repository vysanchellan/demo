'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Flame, LayoutDashboard, FileWarning, Building2, Brain,
  Heart, BarChart3, Settings, LogOut, Menu, X, ChevronRight,
  Users, Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/report', icon: FileWarning, label: 'New Report' },
  { href: '/reports', icon: BarChart3, label: 'All Reports' },
  { href: '/companies', icon: Building2, label: 'Companies' },
  { href: '/assessment', icon: Brain, label: 'Burnout Test' },
  { href: '/resources', icon: Heart, label: 'Resources' },
]

const ADMIN_ITEMS = [
  { href: '/admin', icon: Shield, label: 'Admin Panel' },
  { href: '/admin/users', icon: Users, label: 'Users' },
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

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-[#111111] border border-white/10 flex items-center justify-center"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-full z-40 flex flex-col bg-[#0D0D0D] border-r border-white/5 overflow-hidden',
          'hidden lg:flex',
          mobileOpen && '!flex'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 shrink-0 relative">
              <div className="absolute inset-0 bg-[#FF3B30] rounded-lg opacity-20 animate-pulse" />
              <Flame className="w-8 h-8 text-[#FF3B30] relative z-10" />
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-black whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                BURN<span className="text-[#FF3B30]">OUT</span>
              </motion.span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0 hidden lg:flex"
          >
            <ChevronRight className={cn('w-4 h-4 text-[#9A9A9A] transition-transform', collapsed && 'rotate-180')} />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors lg:hidden"
          >
            <X className="w-4 h-4 text-[#9A9A9A]" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="text-[10px] font-semibold text-[#9A9A9A] uppercase tracking-widest px-3 py-2">
              Main
            </p>
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
                    ? 'bg-[#FF3B30]/15 text-[#FF3B30] border border-[#FF3B30]/20'
                    : 'text-[#9A9A9A] hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className={cn('w-5 h-5 shrink-0', active && 'text-[#FF3B30]')} />
                {!collapsed && (
                  <span className="whitespace-nowrap font-medium">{item.label}</span>
                )}
                {active && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
                )}
              </Link>
            )
          })}

          {!collapsed && (
            <p className="text-[10px] font-semibold text-[#9A9A9A] uppercase tracking-widest px-3 py-2 mt-4">
              Admin
            </p>
          )}
          {ADMIN_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#9A9A9A] hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="whitespace-nowrap font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#9A9A9A] hover:text-white hover:bg-white/5 transition-all duration-200">
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">Settings</span>}
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#9A9A9A] hover:text-[#FF3B30] hover:bg-[#FF3B30]/5 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}
