'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import Navbar from '@/components/public/Navbar'

/**
 * Auth-aware chrome.
 *  - Signed in  → app sidebar (the "account" experience)
 *  - Signed out → public top navbar (consistent with the marketing site)
 * This stops logged-out visitors from seeing an account shell when they
 * browse public tools (Reports, Companies, Red Flags, The Wall, etc.).
 */
export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [status, setStatus] = useState<'loading' | 'in' | 'out'>('loading')

  useEffect(() => {
    let active = true
    async function check() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        if (active) setStatus(data.user ? 'in' : 'out')
      } catch {
        if (active) setStatus('out')
      }
    }
    check()
    return () => { active = false }
  }, [pathname])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0C0A0A] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#FF7A6B]/30 border-t-[#FF7A6B] animate-spin" />
      </div>
    )
  }

  if (status === 'in') {
    return (
      <div className="flex min-h-screen bg-[#0C0A0A] text-zinc-100">
        <DashboardSidebar />
        <main className="flex-1 min-h-screen lg:pl-60">{children}</main>
      </div>
    )
  }

  // Signed out — marketing chrome
  return (
    <div className="min-h-screen bg-[#0C0A0A] text-zinc-100">
      <Navbar />
      <main className="min-h-screen pt-20">{children}</main>
    </div>
  )
}
