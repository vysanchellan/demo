'use client'

import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowUpRight, ArrowRight, ChevronDown, PawPrint, Apple,
  ShieldCheck, Heart, Stethoscope, MapPin, MessageSquare, BookOpen,
  ClipboardCheck, Sparkles, CheckCircle2, Star, Quote, Plus,
  Bone, Cat, Dog, Activity, Bell, Calendar, Syringe, Scale
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AuroraBackground from '@/components/public/AuroraBackground'
import HeroCanvas from '@/components/public/HeroCanvas'
import Navbar from '@/components/public/Navbar'
import Logo from '@/components/public/Logo'
import IntroExperience from '@/components/public/IntroExperience'
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid
} from 'recharts'

// ─────────── Data ───────────
const STATS = [
  { value: 38, suffix: 'M+', label: 'households own a pet', sub: 'And counting', icon: Dog },
  { value: 56, suffix: '%', label: 'of pets are overweight', sub: 'Mostly from wrong portions', icon: Scale },
  { value: 70, suffix: '%', label: 'of owners miss vaccine dates', sub: 'PawPal reminds you', icon: Syringe },
  { value: 24, suffix: '/7', label: 'food-safety & symptom help', sub: 'Whenever you need it', icon: ShieldCheck },
]

const FEATURES_BENTO = [
  { title: 'Nutrition & Portion Planner', desc: 'Tell us your pet’s species, breed, weight and activity — get an exact daily food plan, calorie target, and feeding schedule.', icon: Apple, span: 'lg:col-span-2', tag: 'Smart' },
  { title: 'Food Safety Checker', desc: 'Is it safe to feed? Instantly check any food or plant.', icon: ShieldCheck, span: '', tag: 'Lifesaver' },
  { title: 'Find a Vet', desc: 'A live map of trusted vets near your location.', icon: MapPin, span: '', tag: 'Live Map' },
  { title: 'Pet Wellness Check', desc: 'A quick guided check-up of your pet’s health, weight, mood and routine — with a personalised wellbeing score.', icon: Heart, span: 'lg:col-span-2', tag: 'Quiz' },
  { title: 'New Pet Care Plan', desc: 'A gentle week-by-week roadmap for your new puppy or kitten.', icon: ClipboardCheck, span: '', tag: 'Roadmap' },
  { title: 'Health Records & Reminders', desc: 'Vaccines, weight, meds and vet visits — tracked and never forgotten.', icon: Activity, span: '', tag: 'Tracking' },
  { title: 'Owner Community', desc: 'Swap stories, photos and advice with pet owners who get it.', icon: MessageSquare, span: 'lg:col-span-2', tag: 'Community' },
]

const TESTIMONIALS = [
  { name: 'Amara Okonkwo', role: 'Mum to Biscuit (Beagle)', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', quote: 'The portion planner alone fixed Biscuit’s weight in two months. I had been overfeeding him for a year without realising.', metricLabel: 'Weight to healthy', metric: '−18%' },
  { name: 'Thabo Mokoena', role: 'Dad to Luna (Maine Coon)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', quote: 'Luna ate something off the counter at 11pm. The food checker told me it was toxic and the vet finder had an emergency clinic open. PawPal saved her life.', metricLabel: 'Emergency vet found', metric: '4 min' },
  { name: 'Lerato Dube', role: 'Mum to Max & Milo (Huskies)', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', quote: 'Two dogs, endless vaccine dates, two diets. PawPal keeps all of it straight. I finally feel like a good pet parent.', metricLabel: 'Reminders kept', metric: '100%' },
]

const FAQS = [
  { q: 'Is PawPal free?', a: 'Yes — creating pet profiles, the nutrition planner, food-safety checker, wellness check and vet finder are all free for pet owners. Forever.' },
  { q: 'How accurate is the nutrition planner?', a: 'It uses veterinary RER/MER energy formulas (Resting and Maintenance Energy Requirements) based on your pet’s weight, species, life stage and activity level. It is guidance, not a substitute for your vet’s advice.' },
  { q: 'How does the food-safety checker work?', a: 'We maintain a curated database of foods, plants and household items that are toxic or unsafe for dogs and cats, with severity levels and what to do. If something is dangerous, we tell you immediately and point you to the nearest vet.' },
  { q: 'How does Find a Vet know where I am?', a: 'With your permission, your browser shares your approximate location so we can show vets near you on the map. We never store your location.' },
  { q: 'Can I track more than one pet?', a: 'Absolutely. Add as many pets as you like — each with their own profile, diet, weight history, vaccine schedule and reminders.' },
]

const SPECIES_TICKER = [
  'Dogs', 'Cats', 'Rabbits', 'Birds', 'Hamsters', 'Guinea Pigs',
  'Ferrets', 'Reptiles', 'Fish', 'Horses', 'Tortoises', 'Parrots',
]

const TREND_DATA = [
  { week: 'Mon', weight: 32.1 }, { week: 'Tue', weight: 31.8 },
  { week: 'Wed', weight: 31.9 }, { week: 'Thu', weight: 31.5 },
  { week: 'Fri', weight: 31.2 }, { week: 'Sat', weight: 31.0 },
  { week: 'Sun', weight: 30.7 },
]

// ─────────── Animated Counter ───────────
function Counter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = to / (1800 / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setVal(to); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, to])
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

// ─────────── Nutrition Planner (inline live demo) ───────────
function NutritionDemo() {
  const [species, setSpecies] = useState<'dog' | 'cat'>('dog')
  const [weight, setWeight] = useState(12)
  const [activity, setActivity] = useState(1.6)
  const [lifeStage, setLifeStage] = useState<'puppy' | 'adult' | 'senior'>('adult')

  // Veterinary energy formula: RER = 70 * (kg^0.75); MER = RER * factor
  const rer = 70 * Math.pow(weight, 0.75)
  const stageFactor = lifeStage === 'puppy' ? 2.0 : lifeStage === 'senior' ? 1.1 : 1.0
  const speciesFactor = species === 'cat' ? 0.9 : 1.0
  const mer = Math.round(rer * activity * stageFactor * speciesFactor)
  const grams = Math.round(mer / 3.5) // ~3.5 kcal/g dry food
  const cups = (grams / 110).toFixed(1) // ~110g per cup
  const meals = lifeStage === 'puppy' ? 3 : 2

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <div className="space-y-5">
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Species</label>
          <div className="grid grid-cols-2 gap-2">
            {([['dog', 'Dog', Dog], ['cat', 'Cat', Cat]] as const).map(([k, label, Icon]) => (
              <button key={k} onClick={() => setSpecies(k)} aria-pressed={species === k}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${species === k ? 'bg-[#FF7A6B]/15 border-[#FF7A6B]/40 text-[#FF7A6B]' : 'bg-white/[0.03] border-white/8 text-zinc-400 hover:border-white/20'}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Weight</label>
            <span className="font-mono text-sm text-[#FF7A6B] font-semibold">{weight} kg</span>
          </div>
          <input type="range" min={1} max={60} value={weight} onChange={e => setWeight(+e.target.value)} className="w-full accent-[#FF7A6B]" aria-label="Weight" />
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Life stage</label>
          <div className="grid grid-cols-3 gap-2">
            {(['puppy', 'adult', 'senior'] as const).map(s => (
              <button key={s} onClick={() => setLifeStage(s)} aria-pressed={lifeStage === s}
                className={`px-2 py-2 rounded-xl border text-xs capitalize transition-all ${lifeStage === s ? 'bg-[#FF7A6B]/15 border-[#FF7A6B]/40 text-[#FF7A6B]' : 'bg-white/[0.03] border-white/8 text-zinc-400 hover:border-white/20'}`}>
                {s === 'puppy' ? (species === 'cat' ? 'Kitten' : 'Puppy') : s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Activity</label>
          <div className="grid grid-cols-3 gap-2">
            {([['Low', 1.3], ['Normal', 1.6], ['High', 2.0]] as const).map(([label, f]) => (
              <button key={label} onClick={() => setActivity(f)} aria-pressed={activity === f}
                className={`px-2 py-2 rounded-xl border text-xs transition-all ${activity === f ? 'bg-[#FF7A6B]/15 border-[#FF7A6B]/40 text-[#FF7A6B]' : 'bg-white/[0.03] border-white/8 text-zinc-400 hover:border-white/20'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass-card rounded-2xl p-5" style={{ borderColor: 'rgba(255,122,107,0.3)' }}>
          <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">Daily calories</div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-semibold tabular-nums text-[#FF7A6B]" style={{ fontFamily: 'var(--font-display)' }}>{mer}</span>
            <span className="text-zinc-500 mb-2 text-sm">kcal / day</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-2xl p-4">
            <div className="text-xs text-zinc-400 mb-1">Dry food</div>
            <div className="text-2xl font-semibold tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>{grams}g</div>
            <div className="text-[11px] text-zinc-500">≈ {cups} cups</div>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <div className="text-xs text-zinc-400 mb-1">Meals / day</div>
            <div className="text-2xl font-semibold tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>{meals}</div>
            <div className="text-[11px] text-zinc-500">≈ {Math.round(grams / meals)}g each</div>
          </div>
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Based on veterinary RER/MER energy formulas. Always confirm with your vet for medical diets.
        </p>
      </div>
    </div>
  )
}

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[number] }) {
  return (
    <div className="glass-card rounded-2xl p-6 surface-hover h-full flex flex-col">
      <Quote className="w-7 h-7 text-[#FF7A6B]/40 mb-4" />
      <p className="text-zinc-300 leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
      <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-xl bg-[#FF7A6B]/10 border border-[#FF7A6B]/20 mb-5">
        <span className="text-2xl font-semibold tabular-nums text-[#FF7A6B]" style={{ fontFamily: 'var(--font-display)' }}>{t.metric}</span>
        <span className="text-[11px] text-zinc-400 leading-tight">{t.metricLabel}</span>
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/10">
          <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="44px" />
        </div>
        <div>
          <div className="font-semibold text-sm">{t.name}</div>
          <div className="text-xs text-zinc-400">{t.role}</div>
        </div>
      </div>
    </div>
  )
}

function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(idx === 0)
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.04 }}
      className="glass-card rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors" aria-expanded={open}>
        <span className="font-semibold text-sm">{q}</span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3 }}><Plus className="w-4 h-4 text-zinc-400" /></motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─────────── Parallax Photo Band ───────────
const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&h=640&fit=crop', speed: -80, h: 'h-72' },
  { src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&h=520&fit=crop', speed: 120, h: 'h-56' },
  { src: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500&h=680&fit=crop', speed: -140, h: 'h-80' },
  { src: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=520&fit=crop', speed: 90, h: 'h-56' },
  { src: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=620&fit=crop', speed: -100, h: 'h-72' },
]

function ParallaxGallery() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Hooks called unconditionally at top level (fixed count)
  const y0 = useTransform(scrollYProgress, [0, 1], [GALLERY[0].speed, -GALLERY[0].speed])
  const y1 = useTransform(scrollYProgress, [0, 1], [GALLERY[1].speed, -GALLERY[1].speed])
  const y2 = useTransform(scrollYProgress, [0, 1], [GALLERY[2].speed, -GALLERY[2].speed])
  const y3 = useTransform(scrollYProgress, [0, 1], [GALLERY[3].speed, -GALLERY[3].speed])
  const y4 = useTransform(scrollYProgress, [0, 1], [GALLERY[4].speed, -GALLERY[4].speed])
  const ys = [y0, y1, y2, y3, y4]

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-mesh-soft" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-semibold leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="text-gradient-soft">The faces</span> <span className="text-gradient-aurora">behind the data.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
          {GALLERY.map((g, i) => (
            <motion.div key={i} style={{ y: ys[i] }} className={`relative ${g.h} rounded-3xl overflow-hidden border border-white/8 ${i === 2 ? 'md:scale-110 z-10' : ''}`}>
              <Image src={g.src} alt="A happy pet" fill className="object-cover" sizes="(max-width:768px) 50vw, 20vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A0A]/60 via-transparent to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────── Pinned Horizontal Showcase ───────────
const SHOWCASE = [
  { tag: 'Nutrition', title: 'Feed them exactly right', desc: 'Precise calories, grams and meals — calculated like a vet would.', img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900&h=900&fit=crop', href: '/nutrition' },
  { tag: 'Safety', title: 'Know what’s safe', desc: 'Check any food or plant against our toxicity database in a tap.', img: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=900&h=900&fit=crop', href: '/food-safety' },
  { tag: 'Vets', title: 'Help, right nearby', desc: 'A live map of trusted vets the moment you need one.', img: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=900&h=900&fit=crop', href: '/vet-finder' },
  { tag: 'Wellness', title: 'A happier, healthier pet', desc: 'Track weight, mood and milestones — and never miss a date.', img: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=900&h=900&fit=crop', href: '/wellness' },
]

function PinnedShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-72%'])

  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-mesh-soft" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 w-full mb-10">
          <Badge className="mb-4 bg-[#FF7A6B]/10 text-[#FF7A6B] border-[#FF7A6B]/30 font-mono"><PawPrint className="w-3 h-3 mr-1.5" /> HOW IT HELPS</Badge>
          <h2 className="text-4xl md:text-6xl font-semibold leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="text-gradient-soft">Four ways PawPal</span> <span className="text-gradient-aurora">has your back.</span>
          </h2>
        </div>
        <motion.div style={{ x }} className="relative flex gap-6 px-6 will-change-transform">
          {SHOWCASE.map((s, i) => (
            <Link key={i} href={s.href} className="relative shrink-0 w-[78vw] sm:w-[42vw] lg:w-[30vw] aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 group">
              <Image src={s.img} alt={s.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="40vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A0A] via-[#0C0A0A]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <Badge className="mb-3 bg-[#FF7A6B]/15 text-[#FF7A6B] border-[#FF7A6B]/30 font-mono text-[10px]">{s.tag}</Badge>
                <h3 className="text-2xl font-semibold mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>{s.title}</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">{s.desc}</p>
                <span className="inline-flex items-center gap-1.5 mt-4 text-sm text-[#FF7A6B] font-medium">Explore <ArrowUpRight className="w-4 h-4" /></span>
              </div>
            </Link>
          ))}
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-6 w-full mt-8">
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-full bg-[#FF7A6B] origin-left rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────── MAIN ───────────
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.96])

  return (
    <div className="min-h-screen bg-[#0C0A0A] text-zinc-100 overflow-x-hidden">
      <IntroExperience />
      <Navbar />

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden grain">
        <AuroraBackground />
        <HeroCanvas />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[760px] pointer-events-none animate-glow-pulse" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse, rgba(255,122,107,0.16) 0%, transparent 62%)' }} />
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF7A6B]/40 to-transparent animate-scan pointer-events-none" aria-hidden="true" />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 px-6 max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-gradient bg-white/[0.04] backdrop-blur-xl text-xs text-zinc-200 mb-8">
            <PawPrint className="w-3.5 h-3.5 text-[#FF7A6B]" />
            <span className="font-medium">Loved by 120,000+ pet parents</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-[9rem] font-semibold leading-[0.92] tracking-[-0.04em] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="block bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(180deg, #F6F1EE 0%, #C8D0CD 55%, #5B6562 100%)' }}>
              Everything your pet
            </span>
            <span className="block">
              <span style={{ fontFamily: 'var(--font-serif)' }} className="italic font-normal text-[#FF7A6B]">needs</span>
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(180deg, #F6F1EE 0%, #C8D0CD 55%, #5B6562 100%)' }}> — in one place.</span>
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Nutrition plans, food-safety checks, health tracking, a wellness quiz, and trusted vets near you.
            PawPal is the all-in-one companion for people who love their animals.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link href="/auth/signup">
              <Button size="lg" className="btn-glass-emerald text-base px-7 py-6 gap-2 group rounded-2xl">
                <PawPrint className="w-5 h-5" /> Add Your Pet
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/nutrition">
              <Button size="lg" className="btn-glass text-white text-base px-7 py-6 gap-2 group rounded-2xl">
                <Apple className="w-5 h-5" /> Try the Nutrition Planner
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5"><Apple className="w-3.5 h-3.5 text-[#FF7A6B]" /> Vet-backed nutrition</div>
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#FF7A6B]" /> Food-safety database</div>
            <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#FF7A6B]" /> Vets near you</div>
            <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-[#FF7A6B]" /> 4.9/5 (8,400 reviews)</div>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ChevronDown className="w-4 h-4" /></motion.div>
        </motion.div>
      </section>

      {/* ─── STATS ─── */}
      <section className="relative py-24 border-y border-white/5">
        <div className="absolute inset-0 bg-mesh-soft" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass-card rounded-2xl p-5 surface-hover">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-[#FF7A6B]/12 border border-[#FF7A6B]/20">
                  <s.icon className="w-4 h-4 text-[#FF7A6B]" />
                </div>
                <div className="text-4xl lg:text-5xl font-semibold mb-1 tabular-nums text-[#FF7A6B]" style={{ fontFamily: 'var(--font-display)' }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <p className="text-zinc-300 text-sm mb-1">{s.label}</p>
                <p className="text-zinc-500 text-xs">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SPECIES TICKER ─── */}
      <div className="border-b border-white/5 py-5 overflow-hidden bg-[#100D0E]">
        <div className="animate-marquee-x">
          {[...SPECIES_TICKER, ...SPECIES_TICKER].map((s, i) => (
            <div key={i} className="mx-6 flex items-center gap-2 whitespace-nowrap text-sm text-zinc-400">
              <PawPrint className="w-3.5 h-3.5 text-[#FF7A6B]" /> {s}
            </div>
          ))}
        </div>
      </div>

      {/* ─── PARALLAX GALLERY ─── */}
      <ParallaxGallery />

      {/* ─── PINNED HORIZONTAL SHOWCASE ─── */}
      <PinnedShowcase />

      {/* ─── BENTO FEATURES ─── */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mb-16">
          <Badge className="mb-5 bg-[#FF7A6B]/10 text-[#FF7A6B] border-[#FF7A6B]/30 font-mono">
            <PawPrint className="w-3 h-3 mr-1.5" /> THE PLATFORM
          </Badge>
          <h2 className="text-5xl md:text-6xl font-semibold mb-6 leading-[1.05] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="text-gradient-soft">One app for every</span><br />
            <span className="text-gradient-aurora">wag, purr and paw.</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            From the first meal to the next vet visit — everything a pet parent needs, beautifully organised.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">
          {FEATURES_BENTO.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`group relative p-7 rounded-3xl glass-card surface-hover overflow-hidden ${f.span}`}>
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-[0.12] group-hover:opacity-25 transition-opacity duration-500" style={{ background: 'radial-gradient(circle, #FF7A6B, transparent 70%)' }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-sm bg-[#FF7A6B]/12 border border-[#FF7A6B]/20">
                    <f.icon className="w-5 h-5 text-[#FF7A6B]" />
                  </div>
                  <Badge className="text-[10px] font-mono uppercase bg-[#FF7A6B]/10 text-[#FF7A6B] border-[#FF7A6B]/25">{f.tag}</Badge>
                </div>
                <h3 className="text-xl font-semibold mb-2.5 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── NUTRITION PLANNER DEMO ─── */}
      <section className="relative py-32 border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-soft" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Badge className="mb-5 bg-[#FF7A6B]/10 text-[#FF7A6B] border-[#FF7A6B]/30 font-mono">
              <Apple className="w-3 h-3 mr-1.5" /> NUTRITION PLANNER
            </Badge>
            <h2 className="text-5xl md:text-6xl font-semibold mb-6 leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
              Feed them<br /><span className="text-gradient-aurora">exactly right.</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              Over half of pets are overweight — almost always from guesswork at the food bowl.
              PawPal calculates your pet&rsquo;s precise daily calories, food weight, and meal schedule
              using the same energy formulas vets use.
            </p>
            <ul className="space-y-3 mb-10">
              {['Vet-grade RER/MER calorie math', 'Adjusts for breed, life stage & activity', 'Exact grams, cups and meals per day', 'Re-plans automatically as they grow'].map(t => (
                <li key={t} className="flex items-center gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-[#FF7A6B] shrink-0" /> {t}
                </li>
              ))}
            </ul>
            <Link href="/nutrition">
              <Button size="lg" className="btn-glass-emerald gap-2 rounded-2xl px-7">Open the full planner <ArrowUpRight className="w-4 h-4" /></Button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:sticky lg:top-32">
            <div className="relative p-7 rounded-3xl border-gradient glass-card shadow-2xl">
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-br from-[#FF7A6B] to-[#2DD4BF] flex items-center justify-center shadow-[0_8px_30px_rgba(255,122,107,0.5)]">
                <Apple className="w-5 h-5 text-[#2A0E0A]" />
              </div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Live Demo</span>
                <div className="flex items-center gap-1.5 text-[10px] text-[#FF7A6B]"><span className="w-1.5 h-1.5 rounded-full bg-[#FF7A6B] animate-pulse" /> Calculating</div>
              </div>
              <NutritionDemo />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── HEALTH TRACKING ─── */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Badge className="mb-5 bg-[#FF7A6B]/10 text-[#FF7A6B] border-[#FF7A6B]/30 font-mono">
            <Activity className="w-3 h-3 mr-1.5" /> HEALTH TRACKING
          </Badge>
          <h2 className="text-5xl font-semibold mb-5 leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
            Every milestone,<br /><span className="text-gradient-aurora">remembered.</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Weight trends, vaccine dates, medications and vet visits — all in one timeline,
            with gentle reminders so nothing slips.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[{ icon: Syringe, label: 'Vaccines', v: 'On track' }, { icon: Bell, label: 'Reminders', v: '3 upcoming' }, { icon: Scale, label: 'Weight', v: '−1.4 kg' }].map(s => (
              <div key={s.label} className="glass-card rounded-xl p-4">
                <s.icon className="w-4 h-4 text-[#FF7A6B] mb-2" />
                <div className="text-lg font-semibold tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>{s.v}</div>
                <div className="text-[11px] text-zinc-500">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold flex items-center gap-2"><Dog className="w-4 h-4 text-[#FF7A6B]" /> Biscuit · weight (kg)</span>
            <Badge className="bg-[#FF7A6B]/10 text-[#FF7A6B] border-[#FF7A6B]/30 text-xs">Healthy trend</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={TREND_DATA}>
              <defs>
                <linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF7A6B" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#FF7A6B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: '#A79F9C', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fill: '#A79F9C', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1A1516', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="weight" stroke="#FF7A6B" strokeWidth={2.5} fill="url(#wgrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="relative py-32 border-y border-white/5">
        <div className="absolute inset-0 bg-mesh-soft" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <Badge className="mb-5 bg-[#FF7A6B]/10 text-[#FF7A6B] border-[#FF7A6B]/30 font-mono">
              <Heart className="w-3 h-3 mr-1.5" /> HAPPY TAILS
            </Badge>
            <h2 className="text-5xl md:text-6xl font-semibold mb-5 leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-gradient-soft">Pet parents</span><br /><span className="text-gradient-aurora">who rest easier.</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <TestimonialCard t={t} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-32 px-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <Badge className="mb-5 bg-white/[0.06] text-zinc-300 border-white/10 font-mono">FAQ</Badge>
          <h2 className="text-5xl font-semibold leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
            Good questions, <span className="text-gradient-aurora">honest answers.</span>
          </h2>
        </motion.div>
        <div className="space-y-3">
          {FAQS.map((f, i) => <FaqItem key={f.q} q={f.q} a={f.a} idx={i} />)}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative max-w-3xl mx-auto text-center p-12 rounded-3xl border-gradient glass-card">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-float-medium"><Logo size={80} glow /></div>
          <div className="pt-10">
            <h2 className="text-5xl md:text-6xl font-semibold mb-6 leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-gradient-soft">They give you everything.</span><br />
              <span className="text-gradient-aurora">Give them PawPal.</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-md mx-auto mb-8 leading-relaxed">
              Set up your pet&rsquo;s profile in under a minute. Free forever, for every pet you love.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/auth/signup"><Button size="lg" className="btn-glass-emerald gap-2 rounded-2xl px-7">Add Your Pet <ArrowUpRight className="w-4 h-4" /></Button></Link>
              <Link href="/wellness"><Button size="lg" className="btn-glass text-white gap-2 rounded-2xl px-7">Try the Wellness Check</Button></Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <Logo size={36} />
                <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>Paw<span className="text-[#FF7A6B]">Pal</span></span>
              </Link>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                The all-in-one companion for pet owners — nutrition, health, safety and care, beautifully in one place.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Tools</h4>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                {[['Nutrition Planner', '/nutrition'], ['Food Safety', '/food-safety'], ['Find a Vet', '/vet-finder'], ['Wellness Check', '/wellness'], ['Care Guides', '/resources']].map(([l, h]) => (
                  <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Account</h4>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">Create Account</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>&copy; 2026 PawPal · Made for the ones who never let you down.</p>
            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF7A6B] animate-pulse" /> All systems operational</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
