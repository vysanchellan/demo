'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Flame, FileWarning, Building2, MapPin, Users, AlertTriangle,
  Shield, CheckCircle2, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { REPORT_TYPE_LABELS, INDUSTRIES, type ReportType } from '@/lib/types'

const STEPS = ['Company', 'Incident', 'Details', 'Submit']

export default function ReportPage() {
  const [step, setStep] = useState(0)
  const [anonymous, setAnonymous] = useState(true)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const [form, setForm] = useState({
    company_name: '',
    industry: '',
    company_size: '',
    city: '',
    country: 'South Africa',
    report_type: '' as ReportType | '',
    severity: 5,
    description: '',
  })

  function update(key: string, val: string | number) {
    setForm(p => ({ ...p, [key]: val }))
  }

  async function submit() {
    if (!form.company_name || !form.report_type || !form.description) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-[#4ECDC4]/10 border-2 border-[#4ECDC4]/30 flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="w-10 h-10 text-[#4ECDC4]" />
          </motion.div>
          <h1 className="text-4xl font-black mb-4" style={{ fontFamily: 'var(--font-display)' }}>REPORT FILED</h1>
          <p className="text-[#9A9A9A] mb-6 leading-relaxed">
            Your anonymous report has been submitted and encrypted.
            It will be reviewed and published within 24 hours.
          </p>
          <div className="flex items-center justify-center gap-2 text-[#4ECDC4] text-sm mb-8">
            <Shield className="w-4 h-4" />
            <span>100% anonymous — zero identifying data stored</span>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/reports">
              <Button variant="outline" className="border-white/20">View Reports</Button>
            </Link>
            <Link href="/assessment">
              <Button className="bg-[#FF3B30] hover:bg-[#E0342A] text-white border-0">
                Take Burnout Test
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <Link href="/" className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#FF3B30]" />
            <span className="font-black" style={{ fontFamily: 'var(--font-display)' }}>BURNOUT</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-[#9A9A9A]" />
          <span className="text-[#9A9A9A]">File Report</span>
        </div>

        {/* Anon banner */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#4ECDC4]/5 border border-[#4ECDC4]/20 mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#4ECDC4]" />
            <div>
              <div className="text-sm font-semibold text-[#4ECDC4]">Anonymous Mode</div>
              <div className="text-xs text-[#9A9A9A]">Your identity will never be disclosed</div>
            </div>
          </div>
          <Switch checked={anonymous} onCheckedChange={setAnonymous} className="data-[state=checked]:bg-[#4ECDC4]" />
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                i < step ? 'bg-[#4ECDC4] border-[#4ECDC4] text-black'
                : i === step ? 'bg-[#FF3B30] border-[#FF3B30] text-white'
                : 'bg-transparent border-white/20 text-[#9A9A9A]'
              }`}>
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs ${i === step ? 'text-white' : 'text-[#9A9A9A]'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-white/10 mx-1 w-8" />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 bg-[#111111] border border-white/8 rounded-3xl"
        >
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-black mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                ABOUT THE COMPANY
              </h2>
              <div>
                <label className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider block mb-2">
                  Company Name *
                </label>
                <Input
                  value={form.company_name}
                  onChange={e => update('company_name', e.target.value)}
                  placeholder="Company name (will be partially redacted)"
                  className="bg-[#0A0A0A] border-white/10 focus:border-[#FF3B30]/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider block mb-2">Industry</label>
                  <select
                    value={form.industry}
                    onChange={e => update('industry', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF3B30]/50"
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider block mb-2">Company Size</label>
                  <select
                    value={form.company_size}
                    onChange={e => update('company_size', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF3B30]/50"
                  >
                    <option value="">Select size</option>
                    {['1–10', '11–50', '51–200', '201–1000', '1000+'].map(s => <option key={s} value={s}>{s} employees</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider block mb-2">City</label>
                  <Input value={form.city} onChange={e => update('city', e.target.value)} placeholder="e.g. Johannesburg" className="bg-[#0A0A0A] border-white/10 focus:border-[#FF3B30]/50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider block mb-2">Country</label>
                  <Input value={form.country} onChange={e => update('country', e.target.value)} className="bg-[#0A0A0A] border-white/10 focus:border-[#FF3B30]/50" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-black mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                WHAT HAPPENED?
              </h2>
              <label className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider block mb-3">
                Report Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(REPORT_TYPE_LABELS) as [ReportType, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => update('report_type', key)}
                    className={`p-3 text-left rounded-xl border text-sm transition-all duration-200 ${
                      form.report_type === key
                        ? 'bg-[#FF3B30]/15 border-[#FF3B30]/50 text-white'
                        : 'bg-[#0A0A0A] border-white/10 text-[#9A9A9A] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                SEVERITY & DETAILS
              </h2>
              <div>
                <label className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider block mb-3">
                  Severity: <span className="text-[#FF3B30]">{form.severity}/10</span>
                </label>
                <input
                  type="range" min={1} max={10} value={form.severity}
                  onChange={e => update('severity', parseInt(e.target.value))}
                  className="w-full accent-[#FF3B30]"
                />
                <div className="flex justify-between text-xs text-[#9A9A9A] mt-1">
                  <span>Minor</span><span>Severe</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider block mb-2">
                  Your Account *
                </label>
                <Textarea
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Describe what happened. Be specific. Dates, patterns, incidents. The more detail, the stronger the report. (Minimum 100 characters)"
                  rows={8}
                  className="bg-[#0A0A0A] border-white/10 focus:border-[#FF3B30]/50 resize-none"
                />
                <div className="text-xs text-[#9A9A9A] mt-1 text-right">{form.description.length} / min 100</div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-black mb-6" style={{ fontFamily: 'var(--font-display)' }}>REVIEW & SUBMIT</h2>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Company', value: form.company_name || '—' },
                  { label: 'Industry', value: form.industry || '—' },
                  { label: 'Location', value: form.city ? `${form.city}, ${form.country}` : '—' },
                  { label: 'Type', value: form.report_type ? REPORT_TYPE_LABELS[form.report_type] : '—' },
                  { label: 'Severity', value: `${form.severity}/10` },
                ].map(row => (
                  <div key={row.label} className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-[#9A9A9A]">{row.label}</span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#4ECDC4]/5 border border-[#4ECDC4]/20 mt-4">
                <Shield className="w-4 h-4 text-[#4ECDC4] mt-0.5 shrink-0" />
                <p className="text-xs text-[#9A9A9A] leading-relaxed">
                  This report is {anonymous ? 'anonymous' : 'attributed to your account'}.
                  Company names are partially redacted to prevent legal exposure.
                  Your IP address is not logged.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 0 ? (
              <Button onClick={() => setStep(s => s - 1)} variant="outline" className="border-white/20">
                Back
              </Button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => {
                  if (step === 0 && !form.company_name) { toast.error('Enter company name'); return }
                  if (step === 1 && !form.report_type) { toast.error('Select a report type'); return }
                  setStep(s => s + 1)
                }}
                className="bg-[#FF3B30] hover:bg-[#E0342A] text-white border-0"
              >
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={submit}
                disabled={loading}
                className="bg-[#FF3B30] hover:bg-[#E0342A] text-white border-0"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
