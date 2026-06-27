'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanLine, AlertTriangle, Flag, Sparkles, RotateCcw, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Curated dictionary of toxic job-ad phrases → what they really mean
const RED_FLAGS: { pattern: RegExp; phrase: string; meaning: string; weight: number }[] = [
  { pattern: /\bwe('| a)re a family\b/i, phrase: "we're a family", meaning: 'Expect guilt-driven overwork and blurred boundaries.', weight: 18 },
  { pattern: /\bwork hard,? play hard\b/i, phrase: 'work hard, play hard', meaning: 'Long hours dressed up as culture.', weight: 14 },
  { pattern: /\b(rockstar|ninja|guru|wizard)\b/i, phrase: 'rockstar / ninja / guru', meaning: 'One person expected to do three jobs.', weight: 12 },
  { pattern: /\bwear(s|ing)? many hats\b/i, phrase: 'wear many hats', meaning: 'No clear role, no extra pay.', weight: 13 },
  { pattern: /\bfast[- ]paced\b/i, phrase: 'fast-paced', meaning: 'Understaffed and chaotic.', weight: 10 },
  { pattern: /\bunlimited (pto|leave|vacation|holiday)\b/i, phrase: 'unlimited PTO', meaning: 'Often means nobody actually takes leave.', weight: 11 },
  { pattern: /\bthrive(s)? under pressure\b/i, phrase: 'thrives under pressure', meaning: 'Chronic stress is the baseline.', weight: 12 },
  { pattern: /\bself[- ]starter\b/i, phrase: 'self-starter', meaning: "You'll get little support or onboarding.", weight: 8 },
  { pattern: /\bwhatever it takes\b/i, phrase: 'whatever it takes', meaning: 'Boundaries will not be respected.', weight: 15 },
  { pattern: /\bhustle\b/i, phrase: 'hustle', meaning: 'Glorified burnout culture.', weight: 11 },
  { pattern: /\bcompetitive salary\b/i, phrase: 'competitive salary', meaning: 'They will not state the number.', weight: 9 },
  { pattern: /\bgo[- ]getter\b/i, phrase: 'go-getter', meaning: 'Unrealistic targets ahead.', weight: 8 },
  { pattern: /\bno (drama|politics)\b/i, phrase: 'no drama', meaning: 'Usually plenty of drama.', weight: 10 },
  { pattern: /\bwork[- ]life balance\b/i, phrase: 'work-life balance', meaning: 'Mentioned defensively — verify it exists.', weight: 6 },
  { pattern: /\bdynamic environment\b/i, phrase: 'dynamic environment', meaning: 'Disorganised and unpredictable.', weight: 9 },
  { pattern: /\bpassionate\b/i, phrase: 'passionate', meaning: 'Passion expected in place of pay.', weight: 7 },
  { pattern: /\bgrindset|grind\b/i, phrase: 'grind', meaning: 'Overwork as a badge of honour.', weight: 12 },
  { pattern: /\bother duties as assigned\b/i, phrase: 'other duties as assigned', meaning: 'Scope creep is guaranteed.', weight: 10 },
]

const SAMPLE = `We're a fast-paced, dynamic startup and we're a family! We're looking for a passionate rockstar developer who thrives under pressure and is ready to do whatever it takes. You'll wear many hats in this hustle-friendly environment. Competitive salary and unlimited PTO. Must be a self-starter — work hard, play hard!`

export default function RedFlagsPage() {
  const [text, setText] = useState('')

  const analysis = useMemo(() => {
    if (!text.trim()) return null
    const found = RED_FLAGS.filter(f => f.pattern.test(text))
    const score = Math.min(100, found.reduce((s, f) => s + f.weight, 0))
    return { found, score }
  }, [text])

  const verdict = !analysis ? null
    : analysis.score >= 60 ? { label: 'SEVERE', color: '#FF5A5F', desc: 'This listing is a minefield of toxic signals.' }
    : analysis.score >= 30 ? { label: 'CAUTION', color: '#FFC83D', desc: 'Several warning signs. Ask pointed questions in the interview.' }
    : analysis.found.length > 0 ? { label: 'MILD', color: '#00E599', desc: 'A few clichés, but nothing alarming.' }
    : { label: 'CLEAN', color: '#00E599', desc: 'No common red-flag phrases detected. Still trust your gut.' }

  // Highlighted text
  const highlighted = useMemo(() => {
    if (!text) return null
    let parts: (string | { m: string })[] = [text]
    RED_FLAGS.forEach(f => {
      const next: typeof parts = []
      parts.forEach(p => {
        if (typeof p !== 'string') { next.push(p); return }
        let last = 0
        const re = new RegExp(f.pattern.source, 'gi')
        let mm: RegExpExecArray | null
        while ((mm = re.exec(p)) !== null) {
          if (mm.index > last) next.push(p.slice(last, mm.index))
          next.push({ m: mm[0] })
          last = mm.index + mm[0].length
        }
        if (last < p.length) next.push(p.slice(last))
      })
      parts = next
    })
    return parts
  }, [text])

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-mesh-soft pointer-events-none" />
      <div className="relative p-6 lg:p-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge className="mb-4 btn-glass-emerald border-0 font-mono text-[10px]">
            <Sparkles className="w-3 h-3 mr-1.5" /> NEW TOOL
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Red Flag <span className="text-[#00E599]">Detector</span>
          </h1>
          <p className="text-zinc-400 max-w-xl">
            Paste any job description. We decode the corporate clichés that signal a toxic workplace before you ever apply.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-[#00E599]" /> Job Description
              </label>
              <button onClick={() => setText(SAMPLE)} className="text-xs text-[#00E599] hover:underline">
                Try a sample
              </button>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste the job ad here…"
              rows={14}
              className="w-full px-4 py-3 rounded-xl bg-[#070A0C] border border-white/8 text-sm leading-relaxed focus:outline-none focus:border-[#00E599]/40 resize-none"
            />
            {text && (
              <Button onClick={() => setText('')} className="btn-glass mt-3 text-white text-sm gap-2 rounded-xl">
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <AnimatePresence mode="wait">
              {!analysis ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="glass-card rounded-2xl p-10 text-center text-zinc-500 h-full flex flex-col items-center justify-center min-h-[300px]"
                >
                  <Flag className="w-10 h-10 mb-4 opacity-30" />
                  <p className="text-sm">Paste a job description to scan for toxic signals.</p>
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {/* Score */}
                  <div className="glass-card rounded-2xl p-6" style={{ borderColor: `${verdict!.color}40` }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Toxicity Signal</span>
                      <Badge className="font-mono" style={{ background: `${verdict!.color}1F`, color: verdict!.color, borderColor: `${verdict!.color}40` }}>
                        {verdict!.label}
                      </Badge>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-6xl font-semibold tabular-nums" style={{ color: verdict!.color, fontFamily: 'var(--font-display)' }}>
                        {analysis.score}
                      </span>
                      <span className="text-zinc-500 mb-2 text-sm">/ 100</span>
                    </div>
                    <p className="text-sm text-zinc-300 mt-2">{verdict!.desc}</p>
                    <div className="mt-4 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${analysis.score}%` }} transition={{ duration: 0.6 }}
                        className="h-full rounded-full" style={{ background: verdict!.color }} />
                    </div>
                  </div>

                  {/* Found flags */}
                  {analysis.found.length > 0 && (
                    <div className="glass-card rounded-2xl p-5">
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                        {analysis.found.length} signal{analysis.found.length > 1 ? 's' : ''} detected
                      </p>
                      <div className="space-y-3">
                        {analysis.found.map(f => (
                          <div key={f.phrase} className="flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-[#FFC83D] mt-0.5 shrink-0" />
                            <div>
                              <div className="text-sm font-medium">&ldquo;{f.phrase}&rdquo;</div>
                              <div className="text-xs text-zinc-400">{f.meaning}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Highlighted preview */}
        {highlighted && analysis && analysis.found.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 mt-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              <Info className="w-3.5 h-3.5" /> Annotated text
            </div>
            <p className="text-sm leading-relaxed text-zinc-300">
              {highlighted.map((p, i) =>
                typeof p === 'string'
                  ? <span key={i}>{p}</span>
                  : <mark key={i} className="bg-[#00E599]/15 text-[#00E599] rounded px-1 mx-0.5 border-b border-[#00E599]/50">{p.m}</mark>
              )}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
