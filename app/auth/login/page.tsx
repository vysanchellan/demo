'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Flame, Mail, Lock, Eye, EyeOff, ArrowRight, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill all fields'); return }
    setLoading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { toast.error(error.message); return }
      toast.success('Welcome back.')
      window.location.href = '/dashboard'
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,59,48,0.08) 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <Flame className="w-8 h-8 text-[#FF3B30]" />
          <span className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
            BURN<span className="text-[#FF3B30]">OUT</span>
          </span>
        </div>

        <div className="p-8 bg-[#111111] border border-white/8 rounded-2xl">
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-display)' }}>SIGN IN</h1>
          <p className="text-[#9A9A9A] mb-8 text-sm">Access your reports and burnout data.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" />
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 bg-[#0A0A0A] border-white/10 focus:border-[#FF3B30]/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-[#0A0A0A] border-white/10 focus:border-[#FF3B30]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF3B30] hover:bg-[#E0342A] text-white border-0 h-12 text-base font-semibold transition-all duration-300"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/8 flex items-center justify-between text-sm">
            <Link href="/auth/forgot-password" className="text-[#9A9A9A] hover:text-[#FF3B30] transition-colors">
              Forgot password?
            </Link>
            <Link href="/auth/signup" className="text-[#FF3B30] hover:text-[#FF6B6B] transition-colors font-medium">
              Create account
            </Link>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-[#FF3B30]/5 border border-[#FF3B30]/20">
          <AlertTriangle className="w-4 h-4 text-[#FF3B30] mt-0.5 shrink-0" />
          <p className="text-xs text-[#9A9A9A] leading-relaxed">
            Reports are anonymous by default. Your identity is never shared with employers.
            We use zero-knowledge encryption on all submissions.
          </p>
        </div>

        <p className="text-center mt-6 text-xs text-[#9A9A9A]">
          <Link href="/" className="hover:text-white transition-colors">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  )
}
