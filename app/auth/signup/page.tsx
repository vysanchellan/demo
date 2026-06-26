'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Flame, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [anonymous, setAnonymous] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { toast.error('Email and password required'); return }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: anonymous ? `Anonymous_${Math.random().toString(36).slice(2, 7)}` : displayName },
        },
      })
      if (error) { toast.error(error.message); return }
      setDone(true)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-[#4ECDC4]" />
          </div>
          <h1 className="text-3xl font-black mb-4" style={{ fontFamily: 'var(--font-display)' }}>CHECK YOUR EMAIL</h1>
          <p className="text-[#9A9A9A] leading-relaxed">
            We sent a confirmation link to <span className="text-white">{email}</span>.
            Verify to start reporting anonymously.
          </p>
          <Link href="/auth/login">
            <Button className="mt-8 bg-[#FF3B30] hover:bg-[#E0342A] text-white border-0">
              Back to Sign In
            </Button>
          </Link>
        </motion.div>
      </div>
    )
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
        <div className="flex items-center justify-center gap-2 mb-10">
          <Flame className="w-8 h-8 text-[#FF3B30]" />
          <span className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
            BURN<span className="text-[#FF3B30]">OUT</span>
          </span>
        </div>

        <div className="p-8 bg-[#111111] border border-white/8 rounded-2xl">
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-display)' }}>CREATE ACCOUNT</h1>
          <p className="text-[#9A9A9A] mb-8 text-sm">Join 50,000+ workers protecting themselves.</p>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Anonymous toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0A] border border-white/10">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#4ECDC4]" />
                <div>
                  <div className="text-sm font-semibold">Stay Anonymous</div>
                  <div className="text-xs text-[#9A9A9A]">Use a random username</div>
                </div>
              </div>
              <Switch
                checked={anonymous}
                onCheckedChange={setAnonymous}
                className="data-[state=checked]:bg-[#4ECDC4]"
              />
            </div>

            {!anonymous && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" />
                  <Input
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="pl-10 bg-[#0A0A0A] border-white/10 focus:border-[#FF3B30]/50"
                  />
                </div>
              </div>
            )}

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
                  placeholder="Min. 8 characters"
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
              className="w-full bg-[#FF3B30] hover:bg-[#E0342A] text-white border-0 h-12 text-base font-semibold"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-[#9A9A9A]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#FF3B30] hover:text-[#FF6B6B] transition-colors">Sign in</Link>
          </p>
        </div>

        <p className="text-center mt-6 text-xs text-[#9A9A9A]">
          <Link href="/" className="hover:text-white transition-colors">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  )
}
