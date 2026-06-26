'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import Logo from '@/components/public/Logo'

const QUESTIONS = [
  {
    q: 'Do you dread Monday mornings?',
    sub: '67% of workers do.',
  },
  {
    q: 'Have you felt emotionally drained by work lately?',
    sub: 'It has a name. And a number.',
  },
  {
    q: 'Has your workplace ever made you feel powerless?',
    sub: "You're about to change that.",
  },
]

/**
 * A skippable, reflective intro shown once per session.
 * Aesthetic animated canvas, editorial serif typography,
 * a few questions that prime the visitor before they enter.
 */
export default function IntroExperience() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0) // 0 = welcome, 1..N = questions, N+1 = enter
  const [answers, setAnswers] = useState<boolean[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setMounted(true)
    const seen = typeof window !== 'undefined' && sessionStorage.getItem('burnout_intro_seen')
    if (!seen) setVisible(true)
  }, [])

  // Ambient flow-field canvas
  useEffect(() => {
    if (!visible) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0

    interface Dot { x: number; y: number; a: number; speed: number; size: number }
    let dots: Dot[] = []

    function resize() {
      if (!canvas) return
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.floor((w * h) / 9000)
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        a: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.4,
        size: Math.random() * 1.6 + 0.4,
      }))
    }

    function tick(t: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)
      for (const d of dots) {
        const angle = d.a + Math.sin((d.x + t * 0.0004) * 0.004) * 1.4 + Math.cos((d.y + t * 0.0003) * 0.004) * 1.4
        d.x += Math.cos(angle) * d.speed
        d.y += Math.sin(angle) * d.speed
        if (d.x < 0) d.x = w; if (d.x > w) d.x = 0
        if (d.y < 0) d.y = h; if (d.y > h) d.y = 0
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,229,153,${0.12 + d.size * 0.12})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [visible])

  function dismiss() {
    sessionStorage.setItem('burnout_intro_seen', '1')
    setVisible(false)
  }

  function answer(val: boolean) {
    setAnswers(a => [...a, val])
    if (step >= QUESTIONS.length) dismiss()
    else setStep(s => s + 1)
  }

  if (!mounted) return null

  const yesCount = answers.filter(Boolean).length

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-[#040506] flex items-center justify-center overflow-hidden"
        >
          {/* Ambient canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
          {/* Aurora wash */}
          <div className="absolute inset-0 bg-mesh-soft" aria-hidden="true" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none animate-glow-pulse" aria-hidden="true"
            style={{ background: 'radial-gradient(ellipse, rgba(0,229,153,0.12) 0%, transparent 65%)' }} />
          <div className="absolute inset-0 grain" aria-hidden="true" />

          {/* Skip */}
          <button
            onClick={dismiss}
            className="absolute top-6 right-6 z-10 text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white/80 transition-colors flex items-center gap-2"
          >
            Skip intro <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Logo top-left */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2.5 opacity-80">
            <Logo size={32} />
            <span className="text-sm font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              BURN<span className="text-[#00E599]">OUT</span>
            </span>
          </div>

          {/* Progress dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {Array.from({ length: QUESTIONS.length + 1 }).map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-[#00E599]' : i < step ? 'w-3 bg-[#00E599]/40' : 'w-3 bg-white/10'}`} />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 text-center max-w-2xl">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-[#00E599]/70 mb-6">Before you enter</p>
                  <h1 className="text-5xl md:text-7xl leading-[1.05] mb-6 text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                    A few honest<br /><span className="italic text-[#00E599]">questions.</span>
                  </h1>
                  <p className="text-white/50 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                    No accounts. No tracking. Just a moment to think about how work really feels.
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#00E599] text-[#04130D] font-semibold hover:bg-[#00FFAB] transition-all hover:scale-[1.03] shadow-[0_8px_30px_rgba(0,229,153,0.35)]"
                  >
                    Begin
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step >= 1 && step <= QUESTIONS.length && (
                <motion.div
                  key={`q-${step}`}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-8">
                    Question {step} of {QUESTIONS.length}
                  </p>
                  <h2 className="text-4xl md:text-6xl leading-[1.08] mb-5 text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                    {QUESTIONS[step - 1].q}
                  </h2>
                  <p className="text-white/40 text-base mb-12 italic" style={{ fontFamily: 'var(--font-serif)' }}>
                    {QUESTIONS[step - 1].sub}
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => answer(true)}
                      className="px-10 py-4 rounded-2xl border border-[#00E599]/40 bg-[#00E599]/10 text-[#00E599] font-semibold text-lg hover:bg-[#00E599]/20 hover:border-[#00E599]/60 transition-all min-w-[140px]"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => answer(false)}
                      className="px-10 py-4 rounded-2xl border border-white/15 bg-white/[0.03] text-white/70 font-semibold text-lg hover:bg-white/[0.06] hover:text-white transition-all min-w-[140px]"
                    >
                      No
                    </button>
                  </div>
                </motion.div>
              )}

              {step > QUESTIONS.length && (
                <motion.div
                  key="enter"
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#00E599]/10 border border-[#00E599]/30 flex items-center justify-center mx-auto mb-8">
                    <Check className="w-8 h-8 text-[#00E599]" />
                  </div>
                  <h2 className="text-4xl md:text-6xl leading-[1.08] mb-5 text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                    {yesCount >= 2 ? "You're not alone." : 'Knowledge is leverage.'}
                  </h2>
                  <p className="text-white/50 text-lg mb-10 max-w-md mx-auto">
                    {yesCount >= 2
                      ? 'Millions feel exactly what you feel. BURNOUT turns that feeling into data — and data into power.'
                      : 'Even if work feels fine today, knowing the signs protects your future. Welcome in.'}
                  </p>
                  <button
                    onClick={dismiss}
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#00E599] text-[#04130D] font-semibold hover:bg-[#00FFAB] transition-all hover:scale-[1.03] shadow-[0_8px_30px_rgba(0,229,153,0.35)]"
                  >
                    Enter BURNOUT
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
