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
      <div className="min-h-screen bg-[#060507] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-[#00E5FF]" />
          </div>
          <h1 className="text-3xl font-black mb-4" style={{ fontFamily: 'var(--font-display)' }}>CHECK YOUR EMAIL</h1>
          <p className="text-[#ADA7B5] leading-relaxed">
            We sent a confirmation link to <span className="text-white">{email}</span>.
            Verify to start reporting anonymously.
          </p>
          <Link href="/auth/login">
            <Button className="mt-8 bg-[#FF2D55] hover:bg-[#FF1B47] text-white border-0">
              Back to Sign In
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#060507] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-full opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,59,48,0.08) 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2 mb-10">
          <Flame className="w-8 h-8 text-[#FF2D55]" />
          <span className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
            BURN<span className="text-[#FF2D55]">OUT</span>
          </span>
        </div>

        <div className="p-8 bg-[#0E0C11] border border-white/8 rounded-2xl">
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-display)' }}>CREATE ACCOUNT</h1>
          <p className="text-[#ADA7B5] mb-8 text-sm">Join 50,000+ workers protecting themselves.</p>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Anonymous toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#060507] border border-white/10">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#00E5FF]" />
                <div>
                  <div className="text-sm font-semibold">Stay Anonymous</div>
                  <div className="text-xs text-[#ADA7B5]">Use a random username</div>
                </div>
              </div>
              <Switch
                checked={anonymous}
                onCheckedChange={setAnonymous}
                className="data-[state=checked]:bg-[#00E5FF]"
              />
            </div>

            {!anonymous && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ADA7B5] uppercase tracking-wider">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADA7B5]" />
                  <Input
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="pl-10 bg-[#060507] border-white/10 focus:border-[#FF2D55]/50"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#ADA7B5] uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADA7B5]" />
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 bg-[#060507] border-white/10 focus:border-[#FF2D55]/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#ADA7B5] uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADA7B5]" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="pl-10 pr-10 bg-[#060507] border-white/10 focus:border-[#FF2D55]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ADA7B5] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF2D55] hover:bg-[#FF1B47] text-white border-0 h-12 text-base font-semibold"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-[#ADA7B5]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#FF2D55] hover:text-[#FF6B35] transition-colors">Sign in</Link>
          </p>
        </div>

        <p className="text-center mt-6 text-xs text-[#ADA7B5]">
          <Link href="/" className="hover:text-white transition-colors">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  )
}
