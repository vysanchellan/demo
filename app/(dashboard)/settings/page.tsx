'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Bell, Shield, Palette, CreditCard, Trash2,
  Check, Camera, Mail, Globe, Moon, Lock, Eye, EyeOff,
  Smartphone, Key, LogOut, Sparkles, BadgeCheck, Flame, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'privacy', label: 'Privacy & Security', icon: Shield },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'account', label: 'Account', icon: CreditCard },
]

const ACCENTS = [
  { name: 'Scarlet', color: '#FF2D55' },
  { name: 'Molten', color: '#FF6B35' },
  { name: 'Violet', color: '#B026FF' },
  { name: 'Cyan', color: '#00E5FF' },
  { name: 'Gold', color: '#FFC83D' },
  { name: 'Magenta', color: '#FF1B8D' },
]

export default function SettingsPage() {
  const [tab, setTab] = useState('profile')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('Anonymous Worker')
  const [bio, setBio] = useState('')
  const [accent, setAccent] = useState('#FF2D55')

  // Toggles
  const [toggles, setToggles] = useState({
    emailReports: true,
    emailDigest: false,
    pushNew: true,
    pushReplies: true,
    anonymous: true,
    twoFactor: false,
    publicProfile: false,
    dataSharing: false,
    reduceMotion: false,
    highContrast: false,
  })

  useEffect(() => {
    async function load() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        if (data.user) {
          setEmail(data.user.email ?? '')
          setDisplayName(data.user.user_metadata?.display_name ?? 'Anonymous Worker')
        }
      } catch {}
    }
    load()
  }, [])

  function set(key: keyof typeof toggles, val: boolean) {
    setToggles(p => ({ ...p, [key]: val }))
    toast.success('Preference updated')
  }

  function save() {
    toast.success('Settings saved', { description: 'Your changes have been applied (demo mode).' })
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-4xl font-black tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
            <Badge className="bg-[#FFC83D]/10 text-[#FFC83D] border-[#FFC83D]/30 font-mono text-[10px]">DEMO MODE</Badge>
          </div>
          <p className="text-zinc-400 text-sm">Manage your account, privacy, and preferences.</p>
        </motion.div>

        <div className="grid lg:grid-cols-[220px_1fr] gap-6">
          {/* Tab nav */}
          <div className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all ${
                  tab === t.key
                    ? 'bg-[#FF2D55]/12 text-[#FF2D55] border border-[#FF2D55]/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <t.icon className="w-4 h-4 shrink-0" />
                <span className="font-medium">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* ─── PROFILE ─── */}
              {tab === 'profile' && (
                <>
                  <Card title="Profile" desc="This information may appear on your verified reports.">
                    {/* Avatar */}
                    <div className="flex items-center gap-5 mb-6">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF2D55] via-[#FF6B35] to-[#FFC83D] flex items-center justify-center text-2xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
                          {displayName.slice(0, 2).toUpperCase()}
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-[#18141C] border border-white/10 flex items-center justify-center hover:bg-[#1C1722]" aria-label="Change avatar">
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{displayName}</span>
                          <BadgeCheck className="w-4 h-4 text-[#00E5FF]" />
                        </div>
                        <p className="text-zinc-400 text-xs mt-0.5">Member since June 2026 · 7 reports filed</p>
                      </div>
                    </div>

                    <Field label="Display Name">
                      <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="bg-[#0A0810] border-white/10 focus:border-[#FF2D55]/50" />
                    </Field>
                    <Field label="Email">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input value={email} disabled className="pl-10 bg-[#0A0810] border-white/10 opacity-60" />
                      </div>
                    </Field>
                    <Field label="Bio (optional)">
                      <textarea
                        value={bio} onChange={e => setBio(e.target.value)}
                        placeholder="Tell us about your work situation…" rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-[#0A0810] border border-white/10 text-sm focus:outline-none focus:border-[#FF2D55]/50 resize-none"
                      />
                    </Field>
                  </Card>
                  <SaveBar onSave={save} />
                </>
              )}

              {/* ─── NOTIFICATIONS ─── */}
              {tab === 'notifications' && (
                <>
                  <Card title="Email Notifications" desc="Choose what lands in your inbox.">
                    <ToggleRow icon={Mail} label="Report status updates" desc="When your report is verified or reviewed" checked={toggles.emailReports} onChange={v => set('emailReports', v)} />
                    <ToggleRow icon={Globe} label="Weekly digest" desc="Top toxic companies and trends each week" checked={toggles.emailDigest} onChange={v => set('emailDigest', v)} />
                  </Card>
                  <Card title="Push Notifications" desc="Real-time alerts on your devices.">
                    <ToggleRow icon={Bell} label="New reports near you" desc="Reports filed in your industry or city" checked={toggles.pushNew} onChange={v => set('pushNew', v)} />
                    <ToggleRow icon={Smartphone} label="Replies & verifications" desc="When someone interacts with your reports" checked={toggles.pushReplies} onChange={v => set('pushReplies', v)} />
                  </Card>
                </>
              )}

              {/* ─── PRIVACY ─── */}
              {tab === 'privacy' && (
                <>
                  <Card title="Privacy" desc="You are protected by zero-knowledge encryption.">
                    <ToggleRow icon={EyeOff} label="Anonymous mode" desc="Hide your identity on all reports" checked={toggles.anonymous} onChange={v => set('anonymous', v)} />
                    <ToggleRow icon={Eye} label="Public profile" desc="Let others see your verified contributions" checked={toggles.publicProfile} onChange={v => set('publicProfile', v)} />
                    <ToggleRow icon={Globe} label="Anonymous data sharing" desc="Contribute to aggregated research (no PII)" checked={toggles.dataSharing} onChange={v => set('dataSharing', v)} />
                  </Card>
                  <Card title="Security" desc="Protect your account.">
                    <ToggleRow icon={Key} label="Two-factor authentication" desc="Require a code on every login" checked={toggles.twoFactor} onChange={v => set('twoFactor', v)} />
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center"><Lock className="w-4 h-4 text-zinc-400" /></div>
                        <div>
                          <div className="text-sm font-medium">Change password</div>
                          <div className="text-xs text-zinc-400">Last changed 3 months ago</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-white/15" onClick={() => toast.info('Password reset email sent (demo)')}>Update</Button>
                    </div>
                  </Card>
                  <div className="p-4 rounded-xl bg-[#00E5FF]/5 border border-[#00E5FF]/20 flex items-start gap-3">
                    <Shield className="w-4 h-4 text-[#00E5FF] mt-0.5 shrink-0" />
                    <p className="text-xs text-zinc-400 leading-relaxed">Your reports are encrypted with AES-256-GCM client-side. We never log your IP address. Even our administrators cannot connect a report to your identity.</p>
                  </div>
                </>
              )}

              {/* ─── APPEARANCE ─── */}
              {tab === 'appearance' && (
                <>
                  <Card title="Accent Color" desc="Personalise your BURNOUT experience.">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {ACCENTS.map(a => (
                        <button
                          key={a.color}
                          onClick={() => { setAccent(a.color); toast.success(`Accent set to ${a.name}`) }}
                          className={`group relative aspect-square rounded-2xl border-2 transition-all ${accent === a.color ? 'scale-105' : 'border-transparent hover:scale-105'}`}
                          style={{ background: a.color, borderColor: accent === a.color ? '#fff' : 'transparent' }}
                          aria-label={a.name}
                        >
                          {accent === a.color && <Check className="w-5 h-5 text-white absolute inset-0 m-auto" />}
                        </button>
                      ))}
                    </div>
                  </Card>
                  <Card title="Display" desc="Adjust for comfort and accessibility.">
                    <ToggleRow icon={Moon} label="Dark mode" desc="Always on — BURNOUT is dark by design" checked disabled onChange={() => {}} />
                    <ToggleRow icon={Zap} label="Reduce motion" desc="Minimise animations and transitions" checked={toggles.reduceMotion} onChange={v => set('reduceMotion', v)} />
                    <ToggleRow icon={Eye} label="High contrast" desc="Increase text and border contrast" checked={toggles.highContrast} onChange={v => set('highContrast', v)} />
                  </Card>
                </>
              )}

              {/* ─── ACCOUNT ─── */}
              {tab === 'account' && (
                <>
                  <Card title="Plan" desc="You're on the free plan — forever.">
                    <div className="p-5 rounded-2xl border-gradient border border-white/8 bg-gradient-to-br from-[#18141C] to-[#0E0C11]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF2D55] to-[#FF6B35] flex items-center justify-center">
                            <Flame className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-bold flex items-center gap-2">Free Forever <Sparkles className="w-3.5 h-3.5 text-[#FFC83D]" /></div>
                            <div className="text-xs text-zinc-400">Unlimited reports, assessments & intelligence</div>
                          </div>
                        </div>
                        <Badge className="bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20">ACTIVE</Badge>
                      </div>
                    </div>
                  </Card>
                  <Card title="Sessions" desc="Devices currently signed in.">
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-zinc-400" />
                        <div>
                          <div className="text-sm font-medium">This device · Chrome</div>
                          <div className="text-xs text-zinc-400">Johannesburg, ZA · Active now</div>
                        </div>
                      </div>
                      <Badge className="bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20 text-xs">Current</Badge>
                    </div>
                    <button onClick={() => toast.success('Signed out of all other sessions')} className="text-sm text-zinc-400 hover:text-white mt-3 flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Sign out of all other sessions
                    </button>
                  </Card>
                  <Card title="Danger Zone" desc="Irreversible account actions." danger>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-[#FF2D55]">Delete account</div>
                        <div className="text-xs text-zinc-400">Permanently remove your account and all data</div>
                      </div>
                      <Button variant="outline" size="sm" className="border-[#FF2D55]/30 text-[#FF2D55] hover:bg-[#FF2D55]/10" onClick={() => toast.error('Account deletion is disabled in demo mode')}>
                        <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                      </Button>
                    </div>
                  </Card>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Card({ title, desc, children, danger }: { title: string; desc?: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className={`p-6 glass-card rounded-2xl ${danger ? '!border-[#FF2D55]/20' : ''}`}>
      <div className="mb-5">
        <h2 className={`font-bold ${danger ? 'text-[#FF2D55]' : ''}`}>{title}</h2>
        {desc && <p className="text-zinc-400 text-xs mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">{label}</label>
      {children}
    </div>
  )
}

function ToggleRow({ icon: Icon, label, desc, checked, onChange, disabled }: {
  icon: any; label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-zinc-400" />
        </div>
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-zinc-400">{desc}</div>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} className="data-[state=checked]:bg-[#FF2D55]" />
    </div>
  )
}

function SaveBar({ onSave }: { onSave: () => void }) {
  return (
    <div className="flex justify-end gap-3">
      <Button variant="outline" className="border-white/15">Cancel</Button>
      <Button onClick={onSave} className="bg-gradient-to-r from-[#FF2D55] to-[#FF6B35] hover:from-[#FF1B47] text-white border-0">
        <Check className="w-4 h-4 mr-1.5" /> Save Changes
      </Button>
    </div>
  )
}
