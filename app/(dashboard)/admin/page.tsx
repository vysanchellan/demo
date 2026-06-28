'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Lock, AlertTriangle, Trash2, Heart, MessageSquare, PawPrint, Stethoscope, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { formatRelative } from '@/lib/utils'

type Role = 'loading' | 'forbidden' | 'admin'
interface Post { id: string; text: string; mood: string; hearts: number; created_at: string }

const SEED: Post[] = [
  { id: '1', text: 'Biscuit finally learned to sit AND stay today!', mood: 'proud', hearts: 248, created_at: '2026-06-28' },
  { id: '2', text: 'Used the food checker before giving Luna a bit of my dinner — saved a vet trip.', mood: 'happy', hearts: 519, created_at: '2026-06-28' },
  { id: '3', text: 'Adopted a senior rescue beagle this weekend.', mood: 'happy', hearts: 871, created_at: '2026-06-27' },
  { id: '4', text: 'Any tips for a puppy that cries at night?', mood: 'help', hearts: 333, created_at: '2026-06-27' },
]

export default function AdminPage() {
  const [role, setRole] = useState<Role>('loading')
  const [posts, setPosts] = useState<Post[]>(SEED)
  const [search, setSearch] = useState('')
  const [userEmail, setUserEmail] = useState('')

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
          const { data } = await supabase.from('confessions').select('*').order('created_at', { ascending: false }).limit(100)
          if (data && data.length > 0) setPosts(data as Post[])
        }
      } catch { setRole('forbidden') }
    }
    check()
  }, [])

  async function remove(id: string) {
    setPosts(p => p.filter(x => x.id !== id))
    toast.success('Post removed')
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      if (!/^\d+$/.test(id)) await supabase.from('confessions').delete().eq('id', id)
    } catch {}
  }

  const filtered = posts.filter(p => p.text.toLowerCase().includes(search.toLowerCase()))

  if (role === 'loading') return (
    <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 rounded-full border-2 border-[#00E599]/30 border-t-[#00E599] animate-spin" /></div>
  )

  if (role === 'forbidden') return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="absolute inset-0 bg-mesh-soft" />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/30 flex items-center justify-center mx-auto mb-6"><Lock className="w-8 h-8 text-[#FF5A5F]" /></div>
        <h1 className="text-4xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Access Denied</h1>
        <p className="text-zinc-400 leading-relaxed mb-6">This area is for PawPal administrators only.
          {userEmail && <span className="block mt-2 text-xs text-zinc-500">Signed in as <span className="text-zinc-300 font-mono">{userEmail}</span></span>}</p>
        <div className="p-4 rounded-xl bg-[#5EEAD4]/5 border border-[#5EEAD4]/20 mb-6 text-left flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#5EEAD4] mt-0.5 shrink-0" />
          <p className="text-xs text-zinc-400 leading-relaxed">Run <span className="font-mono text-zinc-300">supabase/RUN_THIS_SETUP.sql</span> and promote your account to admin to access this panel.</p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/"><Button className="btn-glass text-white rounded-xl">Home</Button></Link>
          <Link href="/dashboard"><Button className="btn-glass-emerald rounded-xl">Dashboard</Button></Link>
        </div>
      </motion.div>
    </div>
  )

  const stats = [
    { label: 'Community posts', value: posts.length, icon: MessageSquare },
    { label: 'Total hearts', value: posts.reduce((s, p) => s + p.hearts, 0), icon: Heart },
    { label: 'Registered vets', value: 8, icon: Stethoscope },
    { label: 'Active owners', value: '12.4k', icon: Users },
  ]

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Admin Console</h1>
            <Badge className="bg-[#00E599]/15 text-[#00E599] border-[#00E599]/30 font-mono"><Shield className="w-3 h-3 mr-1.5" /> AUTHENTICATED</Badge>
          </div>
          <p className="text-zinc-400 text-sm">Signed in as <span className="font-mono text-zinc-300">{userEmail}</span></p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-2xl p-5 surface-hover">
              <div className="w-9 h-9 rounded-lg bg-[#00E599]/12 border border-[#00E599]/20 flex items-center justify-center mb-3"><s.icon className="w-4 h-4 text-[#00E599]" /></div>
              <div className="text-3xl font-semibold tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
              <div className="text-xs text-zinc-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/8 flex items-center justify-between gap-4">
            <h2 className="font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[#00E599]" /> Community moderation</h2>
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…" className="max-w-xs bg-[#0E1316] border-white/8 h-9 text-sm" />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wider">Post</TableHead>
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wider">Mood</TableHead>
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wider">Hearts</TableHead>
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wider">When</TableHead>
                  <TableHead className="text-zinc-500 text-xs uppercase tracking-wider text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id} className="border-white/5 hover:bg-white/[0.02]">
                    <TableCell className="max-w-md"><span className="text-sm text-zinc-300 line-clamp-1">{p.text}</span></TableCell>
                    <TableCell><Badge className="bg-white/5 text-zinc-400 border-white/10 text-[10px] capitalize">{p.mood}</Badge></TableCell>
                    <TableCell className="font-mono text-sm">{p.hearts}</TableCell>
                    <TableCell className="text-xs text-zinc-500">{(() => { try { return formatRelative(p.created_at) } catch { return p.created_at } })()}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => remove(p.id)} className="h-8 px-2 text-[#FF5A5F] hover:bg-[#FF5A5F]/10 bg-transparent border-0" aria-label="Remove"><Trash2 className="w-4 h-4" /></Button>
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
