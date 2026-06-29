'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import Navbar from '@/components/public/Navbar'

/**
 * Chrome chooser.
 *  - Public tool pages (nutrition, food-safety, wellness, vets, vet-finder,
 *    community, guides, care-plan) ALWAYS use the marketing navbar — visitors
 *    should never feel like they've entered an "account" by clicking a tool.
 *  - Account pages (dashboard, pets, add-pet, settings, admin) use the app
 *    sidebar when signed in.
 */
const ACCOUNT_ROUTES = ['/dashboard', '/pets', '/add-pet', '/settings', '/admin']

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAccount = ACCOUNT_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'))
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    let active = true
    async function check() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        if (active) setSignedIn(!!data.user)
      } catch {
        if (active) setSignedIn(false)
      }
    }
    check()
    return () => { active = false }
  }, [pathname])

  // Account pages, signed in → app sidebar
  if (isAccount && signedIn) {
    return (
      <div className="flex min-h-screen bg-[#0C0A0A] text-zinc-100">
        <DashboardSidebar />
        <main className="flex-1 min-h-screen lg:pl-60">{children}</main>
      </div>
    )
  }

  // Everything else → public marketing chrome
  return (
    <div className="min-h-screen bg-[#0C0A0A] text-zinc-100">
      <Navbar />
      <main className="min-h-screen pt-20">{children}</main>
    </div>
  )
}
