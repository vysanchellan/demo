'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import Navbar from '@/components/public/Navbar'

/**
 * Chrome follows the navigation you used, and the choice is REMEMBERED so it
 * never flips mid-session:
 *   - Click a link in the landing top-nav  → remembers 'site'  → marketing navbar
 *   - Click a link in the profile sidebar  → remembers 'app'   → sidebar
 *   - Account-only routes always force 'app'.
 * Signed-out users always get the marketing navbar (they can't be "in" a profile).
 */
const ACCOUNT = ['/dashboard', '/pets', '/add-pet', '/settings', '/admin']

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAccount = ACCOUNT.some(r => pathname === r || pathname.startsWith(r + '/'))
  const [signedIn, setSignedIn] = useState(false)
  const [mode, setMode] = useState<'app' | 'site'>(isAccount ? 'app' : 'site')

  useEffect(() => {
    let active = true
    // Resolve remembered chrome mode
    if (isAccount) {
      try { localStorage.setItem('pp_chrome', 'app') } catch {}
      setMode('app')
    } else {
      try { setMode(localStorage.getItem('pp_chrome') === 'app' ? 'app' : 'site') } catch { setMode('site') }
    }
    // Resolve auth (sidebar only ever shows when signed in)
    ;(async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        if (active) setSignedIn(!!data.user)
      } catch { if (active) setSignedIn(false) }
    })()
    return () => { active = false }
  }, [pathname, isAccount])

  if (signedIn && mode === 'app') {
    return (
      <div className="flex min-h-screen bg-[#0C0A0A] text-zinc-100">
        <DashboardSidebar />
        <main className="flex-1 min-h-screen lg:pl-60">{children}</main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0C0A0A] text-zinc-100">
      <Navbar />
      <main className="min-h-screen pt-20">{children}</main>
    </div>
  )
}
