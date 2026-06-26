import DashboardSidebar from '@/components/layout/DashboardSidebar'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#08090B] text-zinc-100">
      <DashboardSidebar />
      <main className="flex-1 min-h-screen lg:pl-60">
        {children}
      </main>
    </div>
  )
}
