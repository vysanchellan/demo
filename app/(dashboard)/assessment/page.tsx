'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Brain, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getBurnoutColor, getBurnoutLevel } from '@/lib/utils'

const QUESTIONS = [
  // Exhaustion (E)
  { id: 1, dimension: 'E', text: 'I feel emotionally drained by my work.' },
  { id: 2, dimension: 'E', text: 'I feel used up at the end of the workday.' },
  { id: 3, dimension: 'E', text: 'I feel fatigued when I get up in the morning and have to face another day on the job.' },
  { id: 4, dimension: 'E', text: 'Working with people all day is really a strain for me.' },
  { id: 5, dimension: 'E', text: 'I feel burned out from my work.' },
  { id: 6, dimension: 'E', text: 'I feel frustrated by my job.' },
  { id: 7, dimension: 'E', text: 'I feel I\'m working too hard on my job.' },
  { id: 8, dimension: 'E', text: 'Working with people directly puts too much stress on me.' },
  // Cynicism (C)
  { id: 9, dimension: 'C', text: 'I have become less enthusiastic about my work.' },
  { id: 10, dimension: 'C', text: 'I doubt the significance of my work.' },
  { id: 11, dimension: 'C', text: 'I\'ve become more cynical about my work.' },
  { id: 12, dimension: 'C', text: 'I just want to do my job and not be bothered.' },
  // Efficacy (EF)
  { id: 13, dimension: 'EF', text: 'I can effectively solve the problems that arise in my work.' },
  { id: 14, dimension: 'EF', text: 'I feel I\'m making an effective contribution through my work.' },
  { id: 15, dimension: 'EF', text: 'I have accomplished many worthwhile things in this job.' },
  { id: 16, dimension: 'EF', text: 'I feel confident that I am effective at getting things done.' },
]

const SCALE = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'Often' },
  { value: 4, label: 'Always' },
]

function calcScore(answers: Record<number, number>) {
  const E = [1,2,3,4,5,6,7,8].reduce((s, id) => s + (answers[id] ?? 0), 0)
  const C = [9,10,11,12].reduce((s, id) => s + (answers[id] ?? 0), 0)
  const EF = [13,14,15,16].reduce((s, id) => s + (answers[id] ?? 0), 0)
  const maxE = 8 * 4, maxC = 4 * 4, maxEF = 4 * 4
  const eScore = (E / maxE) * 100
  const cScore = (C / maxC) * 100
  const efScore = 100 - (EF / maxEF) * 100
  return {
    overall: Math.round((eScore * 0.5 + cScore * 0.3 + efScore * 0.2)),
    exhaustion: Math.round(eScore),
    cynicism: Math.round(cScore),
    efficacy: Math.round(efScore),
  }
}

export default function AssessmentPage() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [result, setResult] = useState<ReturnType<typeof calcScore> | null>(null)
  const [direction, setDirection] = useState(1)

  const q = QUESTIONS[current]
  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100
  const answered = answers[q.id] !== undefined

  function answer(value: number) {
    setAnswers(prev => ({ ...prev, [q.id]: value }))
    if (current < QUESTIONS.length - 1) {
      setDirection(1)
      setTimeout(() => setCurrent(c => c + 1), 300)
    } else {
      const scores = calcScore({ ...answers, [q.id]: value })
      setResult(scores)
    }
  }

  function prev() {
    if (current > 0) { setDirection(-1); setCurrent(c => c - 1) }
  }

  function reset() { setAnswers({}); setCurrent(0); setResult(null) }

  if (result) {
    const color = getBurnoutColor(result.overall)
    const level = getBurnoutLevel(result.overall)
    return (
      <div className="min-h-screen bg-[#060507] flex items-center justify-center px-6 py-12">
        <div className="absolute inset-0 bg-grid-full opacity-20" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-2xl"
        >
          <div className="p-8 bg-[#0E0C11] border border-white/8 rounded-3xl text-center">
            <h1 className="text-4xl font-black mb-2" style={{ fontFamily: 'var(--font-display)' }}>YOUR RESULTS</h1>
            <p className="text-[#ADA7B5] mb-10">Based on your 16 responses</p>

            {/* Big score */}
            <div className="relative w-48 h-48 mx-auto mb-10">
              <div className="absolute inset-0 rounded-full border-4 animate-pulse" style={{ borderColor: `${color}30` }} />
              <div className="absolute inset-3 rounded-full border-2" style={{ borderColor: `${color}20` }} />
              <div className="absolute inset-6 rounded-full flex flex-col items-center justify-center" style={{ background: '#060507', boxShadow: `0 0 60px ${color}30` }}>
                <span className="text-6xl font-black" style={{ color, fontFamily: 'var(--font-display)' }}>{result.overall}</span>
                <span className="text-sm font-semibold mt-1" style={{ color }}>{level}</span>
              </div>
            </div>

            {/* Sub scores */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { label: 'Exhaustion', value: result.exhaustion, color: '#FF2D55' },
                { label: 'Cynicism', value: result.cynicism, color: '#FFC83D' },
                { label: 'Low Efficacy', value: result.efficacy, color: '#FF6B35' },
              ].map(s => (
                <div key={s.label} className="p-4 bg-[#060507] rounded-xl border border-white/8">
                  <div className="text-2xl font-black mb-1" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
                  <div className="text-[#ADA7B5] text-xs">{s.label}</div>
                  <div className="mt-2 h-1 bg-[#18141C] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.value}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="h-full rounded-full"
                      style={{ background: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Advice */}
            <div className="p-5 rounded-xl text-left mb-8 border" style={{ background: `${color}10`, borderColor: `${color}30` }}>
              <p className="text-sm leading-relaxed" style={{ color }}>
                {result.overall >= 76
                  ? 'CRITICAL: You are experiencing severe burnout. Immediate action required — please reach out to a mental health professional today.'
                  : result.overall >= 51
                  ? 'WARNING: You are showing significant burnout symptoms. Consider speaking to HR or a therapist and evaluating your workload.'
                  : result.overall >= 26
                  ? 'CAUTION: Early signs of burnout are present. Set boundaries, prioritise rest, and monitor your workload.'
                  : 'HEALTHY: Your burnout risk is low. Maintain your current habits and check in regularly.'}
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={reset} variant="outline" className="border-white/20">
                <RotateCcw className="w-4 h-4 mr-2" /> Retake
              </Button>
              <Link href="/resources">
                <Button className="bg-[#FF2D55] hover:bg-[#FF1B47] text-white border-0">
                  Find Resources <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#08090B] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-soft" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-[#ADA7B5] mb-2">
            <span className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Burnout Assessment
            </span>
            <span>{current + 1} / {QUESTIONS.length}</span>
          </div>
          <div className="h-1.5 bg-[#18141C] rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF2D55]"
            />
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 40 }}
            transition={{ duration: 0.25 }}
            className="p-8 bg-[#0E0C11] border border-white/8 rounded-3xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-[#ADA7B5] bg-white/5 border border-white/10">
                {q.dimension === 'E' ? 'Exhaustion' : q.dimension === 'C' ? 'Cynicism' : 'Efficacy'}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-10 leading-snug">{q.text}</h2>

            <div className="grid grid-cols-5 gap-2">
              {SCALE.map(s => (
                <motion.button
                  key={s.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => answer(s.value)}
                  className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                    answers[q.id] === s.value
                      ? 'bg-[#FF2D55] border-[#FF2D55] text-white'
                      : 'bg-[#060507] border-white/10 text-[#ADA7B5] hover:border-[#FF2D55]/40 hover:text-white'
                  }`}
                >
                  <div className="text-lg font-black mb-1" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
                  <div className="text-xs leading-tight">{s.label}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="flex items-center justify-between mt-6">
          <Button
            onClick={prev}
            disabled={current === 0}
            variant="outline"
            className="border-white/20 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          {answered && current < QUESTIONS.length - 1 && (
            <Button
              onClick={() => { setDirection(1); setCurrent(c => c + 1) }}
              className="bg-[#FF2D55] hover:bg-[#FF1B47] text-white border-0"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
