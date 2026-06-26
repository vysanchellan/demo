import DashboardSidebar from '@/components/layout/DashboardSidebar'
export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto min-h-screen lg:pl-60">
        {children}
      </main>
    </div>
  )
}
