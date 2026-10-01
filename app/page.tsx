'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent, MouseEvent, ReactNode } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion'
import type { Variants } from 'framer-motion'
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google'
import Image from 'next/image'
import Lenis from 'lenis'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowUp,
  ArrowUpRight,
  Award,
  Boxes,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Download,
  Flag,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Send,
  Sun,
  Terminal,
  Trophy,
  Users,
  X,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Fonts                                                              */
/* ------------------------------------------------------------------ */

const grotesk = Space_Grotesk({ subsets: ['latin'], display: 'swap' })
const plexMono = IBM_Plex_Mono({ weight: ['400', '500'], subsets: ['latin'], display: 'swap' })
const monoClass = plexMono.className

/* ------------------------------------------------------------------ */
/*  Motion presets                                                     */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const heroStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const heroItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

/* Headline: per-letter stagger */
const h1Stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
}

const h1Word: Variants = {
  hidden: { y: '115%' },
  show: { y: '0%', transition: { duration: 0.75, ease: EASE } },
}

/* Section titles: word-by-word rise, orchestrated by the heading itself */
const titleStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const titleWord: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.6, ease: EASE } },
}

/* ------------------------------------------------------------------ */
/*  Helpers (Lenis-aware smooth scrolling)                             */
/* ------------------------------------------------------------------ */

let lenis: Lenis | null = null

const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { offset: -80, duration: 1.1 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToTop = () => {
  if (lenis) lenis.scrollTo(0, { duration: 1.1 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleAnchor = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault()
  scrollToId(id)
}

/* ------------------------------------------------------------------ */
/*  Paths & assets — keep the values that work on your machine         */
/* ------------------------------------------------------------------ */

const CV_PATH = '/M-Tahsinur-Rahman.pdf'
const LINKEDIN_URL = 'https://www.linkedin.com/in/m-tahsinur-rahman'
const PORTRAIT_PATH = '/mtr-portrait.jpg'

/* ------------------------------------------------------------------ */
/*  Content — sourced from the final CV                                */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Education', id: 'education' },
  { label: 'Experience', id: 'experience' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
]

const MARQUEE_ITEMS = [
  'Web Development',
  'Software QA',
  'Technical Sales',
  'WordPress',
  'Webflow',
  'JavaScript',
  'Machine Learning',
  'Event Operations',
]

const STATS = [
  { value: 5, label: 'Technical Projects' },
  { value: 4, label: 'Leadership Roles' },
  { value: 3, label: 'Certifications' },
  { value: 2, label: 'Live Websites' },
]

type TimelineItem = { years: string; title: string; institution: string }

const TIMELINE: TimelineItem[] = [
  {
    years: '2022 – 2026',
    title: 'BSc. in Computer Science and Engineering',
    institution: 'Green University of Bangladesh',
  },
  {
    years: '2018 – 2020',
    title: 'Higher Secondary Certificate (HSC)',
    institution: 'Udayan Uchcha Madhamik Bidyalaya',
  },
  {
    years: '2016 – 2018',
    title: 'Secondary School Certificate (SSC)',
    institution: 'Khilgaon Govt. High School',
  },
]

type ExperienceItem = {
  icon: LucideIcon
  logo?: string
  role: string
  org: string
  period: string
  description: string
}

const EXPERIENCES: ExperienceItem[] = [
  {
    icon: Trophy,
    logo: '/hult-prize.png',
    role: 'Head of Operations',
    org: 'Hult Prize at Green University of Bangladesh',
    period: 'Oct 2025 – Present',
    description:
      'Directed operational activities and logistics for HULT BATTLE 06, coordinating volunteers, scheduling, and on-the-ground event execution. Communicated closely with team members to ensure all assigned tasks met organizational requirements.',
  },
  {
    icon: Users,
    logo: '/vgs.png',
    role: 'Chair',
    org: 'GUCC Virtual Gaming Society (VGS)',
    period: 'Sept 2025 – Present',
    description:
      'Lead strategic planning and coordinate all society activities and team responsibilities. Organized large-scale events including Virtual Warzone Season 01 and Cyber WarFront.',
  },
  {
    icon: Boxes,
    logo: '/hult-prize.png',
    role: 'Associate of Logistics',
    org: 'Hult Prize at Green University of Bangladesh',
    period: 'Jan 2025 – Oct 2025',
    description:
      'Supported primary logistics and operational frameworks for Hult Prize events. Worked directly as an organizer for HULT BATTLE 05, coordinating tasks across multiple teams.',
  },
  {
    icon: Flag,
    logo: '/vgs.png',
    role: 'Founding Vice Chair',
    org: 'GUCC Virtual Gaming Society (VGS)',
    period: 'Sept 2024 – Sept 2025',
    description:
      'Co-founded the society, helping to establish its foundational operations and activity structures. Served as Main Organizer for the Inter-Department Gaming Competition (IDGC), powered by Gigabyte, and supported the execution of the GUB CSE Carnival gaming section.',
  },
]

const SKILL_GROUPS = [
  {
    icon: Globe,
    title: 'Web & CMS',
    tagline: 'Sites & platforms I build and ship on',
    skills: ['HTML', 'CSS', 'JavaScript', 'WordPress', 'Webflow', 'Shopify', 'Wix'],
  },
  {
    icon: Terminal,
    title: 'Tools & Platforms',
    tagline: 'Databases, version control & design tooling',
    skills: ['SQL', 'GitHub', 'Figma', 'Canva', 'Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint'],
  },
  {
    icon: Briefcase,
    title: 'Professional Competencies',
    tagline: 'Where technology meets business',
    skills: [
      'Technical Sales',
      'Software QA/Testing',
      'Event Logistics',
      'Documentation & Reporting',
      'Task Management',
      'Project Support',
    ],
  },
]

type Project = {
  category: string
  title: string
  description: string
  tags: string[]
  url?: string
  domain?: string
}

const PROJECTS: Project[] = [
  {
    category: 'WordPress Development',
    title: 'Piles Doctor',
    description:
      'Developed a fully responsive healthcare website using WordPress and Elementor, featuring conversion-focused landing sections and patient inquiry tools.',
    tags: ['WordPress', 'Elementor', 'Healthcare', 'Conversion Design'],
    url: 'https://pilesdoctor.com.bd',
    domain: 'pilesdoctor.com.bd',
  },
  {
    category: 'Webflow Development',
    title: 'Arthea Site',
    description:
      'Converted a Figma design into a fully responsive website using Webflow, building cross-device structures via no-code development.',
    tags: ['Webflow', 'Figma', 'Responsive', 'No-Code'],
    url: 'https://arthea-site.webflow.io',
    domain: 'arthea-site.webflow.io',
  },
  {
    category: 'Machine Learning',
    title: 'Uber ML Analytics Project',
    description:
      'Contributed to a ride-hailing application utilizing machine learning for dynamic pricing, ETA prediction, and destination recommendations using Next.js, React, Python, and pandas.',
    tags: ['Next.js', 'React', 'Python', 'pandas', 'Machine Learning'],
  },
  {
    category: 'Full-Stack & QA',
    title: 'Online Auction Platform',
    description:
      'Designed an online auction platform and performed comprehensive manual functional testing for authentication, bidding, and payment workflows.',
    tags: ['Manual Testing', 'Authentication', 'Bidding', 'Payments'],
  },
  {
    category: 'AI Application Testing',
    title: 'Retina Disease Detection App',
    description:
      'Validated AI prediction results and performed UI testing across Android devices to identify usability issues and suggest improvements.',
    tags: ['Prediction Validation', 'Android UI Testing', 'Usability'],
  },
]

type Certification = { title: string; issuer: string; note?: string; year: string }

const CERTIFICATIONS: Certification[] = [
  { title: 'Platform QC Analyst', issuer: 'FastFlowUP', year: '2025' },
  { title: 'Software Development Life Cycle (SDLC)', issuer: 'FastFlowUP', note: 'Edition 2026', year: '2026' },
  { title: 'GP WordPress Course', issuer: 'GrameenPhone Academy', year: '2025' },
]

const GRID_MASK = 'radial-gradient(ellipse 75% 60% at 50% 40%, black 25%, transparent 72%)'

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

/** Fade-up + de-blur reveal, triggered once on scroll. */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Numbered kicker + title that assembles word-by-word out of masks. */
function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-12 md:mb-16">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className={`text-sm text-[color:var(--accent-text)] ${monoClass}`}>{index}</span>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="h-px w-12 origin-left bg-[color:var(--accent-soft)]"
          />
        </div>
      </Reveal>
      <motion.h2
        variants={titleStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="mt-5 flex flex-wrap text-3xl font-semibold tracking-tight text-[color:var(--heading)] md:text-4xl"
      >
        {title.split(' ').map((word, i) => (
          <span key={`${word}-${i}`} className="mr-[0.25em] inline-block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <motion.span variants={titleWord} className="inline-block">
              {word}
            </motion.span>
          </span>
        ))}
      </motion.h2>
    </div>
  )
}

function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[color:var(--line-faint)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Animation toolkit                                                  */
/* ------------------------------------------------------------------ */

/** Intro curtain: logo + progress line, then it lifts away. */
function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [gone, setGone] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const t = setTimeout(onComplete, 1400)
    return () => clearTimeout(t)
  }, [onComplete])

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 1.15,
      ease: 'easeInOut',
      onUpdate: (v) => setCount(Math.round(v)),
    })
    return () => controls.stop()
  }, [])

  if (gone) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[color:var(--bg)]"
      initial={{ y: 0 }}
      animate={{ y: '-100%' }}
      transition={{ delay: 1.4, duration: 0.7, ease: EASE }}
      onAnimationComplete={() => setGone(true)}
    >
      <span className={`text-sm tracking-[0.3em] text-[color:var(--heading)] ${monoClass}`}>
        MTR<span className="text-[color:var(--accent-text)]">_</span>
      </span>
      <div className="mt-5 h-px w-44 overflow-hidden bg-[color:var(--line)]">
        <motion.div
          className="h-full origin-left bg-[color:var(--accent)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.15, ease: 'easeInOut' }}
        />
      </div>
      <span className={`mt-3 text-xs text-[color:var(--muted)] ${monoClass}`}>
        {String(count).padStart(3, '0')}%
      </span>
    </motion.div>
  )
}

/** Text that decodes from random characters into the real string. */
function ScrambleText({ text, active, delay = 0 }: { text: string; active: boolean; delay?: number }) {
  const [output, setOutput] = useState(text)

  useEffect(() => {
    if (!active) return
    const chars = '!<>-_\\/[]{}=+*^?#'
    let raf = 0
    let iteration = 0
    let timeout: ReturnType<typeof setTimeout> | undefined

    const tick = () => {
      iteration += 1
      const revealed = Math.floor(iteration / 2.5)
      setOutput(
        text
          .split('')
          .map((c, i) => (i < revealed || c === ' ' ? c : chars[Math.floor(Math.random() * chars.length)]))
          .join('')
      )
      if (revealed <= text.length) {
        raf = requestAnimationFrame(tick)
      } else {
        setOutput(text)
      }
    }

    timeout = setTimeout(() => {
      raf = requestAnimationFrame(tick)
    }, delay)

    return () => {
      if (timeout) clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [active, delay, text])

  return <span>{output}</span>
}

/** Wraps a control and makes it lean toward the cursor. */
function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 14, mass: 0.2 })
  const springY = useSpring(y, { stiffness: 180, damping: 14, mass: 0.2 })

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  )
}

/** 3D tilt that follows the cursor across a card. */
function Tilt({ children, max = 4 }: { children: ReactNode; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 220, damping: 22 })
  const springY = useSpring(rotateY, { stiffness: 220, damping: 22 })

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * max)
    rotateX.set(-py * max)
  }

  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 900 }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

/** Counts up to a value (zero-padded) when scrolled into view. */
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value])

  return <span ref={ref}>{String(display).padStart(2, '0')}</span>
}

/** Marquee that speeds up and reverses based on your scroll velocity. */
function Marquee() {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const directionFactor = useRef(1)

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * -3 * (delta / 1000)
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }
    moveBy += directionFactor.current * moveBy * Math.abs(velocityFactor.get())
    baseX.set(baseX.get() + moveBy)
  })

  const content = (
    <>
      {MARQUEE_ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className={`px-6 text-sm text-[color:var(--muted)] ${monoClass}`}>{item}</span>
          <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-[color:var(--accent-soft)]" />
        </span>
      ))}
    </>
  )

  return (
    <div className="relative overflow-hidden border-t border-[color:var(--line-faint)] py-5">
      <motion.div className="flex w-max items-center" style={{ x }}>
        <div className="flex items-center">{content}</div>
        <div className="flex items-center" aria-hidden>
          {content}
        </div>
      </motion.div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[color:var(--bg)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[color:var(--bg)] to-transparent"
      />
    </div>
  )
}

/** Custom cursor: instant dot + spring-lagged ring that grows over interactive elements. */
function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)

    const onMove = (e: globalThis.MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = e.target as HTMLElement | null
      setHovering(Boolean(target?.closest('a, button, input, textarea, label')))
    }
    const onLeave = () => setVisible(false)

    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      {/* Center dot — follows the pointer exactly */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]"
        style={{ x, y }}
        animate={{ opacity: visible ? 1 : 0, scale: hovering ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
      />
      {/* Trailing ring — springs behind, expands over clickable things */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[199] -ml-4 -mt-4 h-8 w-8 rounded-full border border-[color:var(--accent-soft)]"
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: visible ? 1 : 0, scale: hovering ? 1.8 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}

/** Lenis inertia scrolling — wheel input glides instead of jumping. */
function SmoothScroll() {
  useEffect(() => {
    const instance = new Lenis({ lerp: 0.09 })
    lenis = instance
    let raf = 0
    const loop = (time: number) => {
      instance.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      instance.destroy()
      lenis = null
    }
  }, [])
  return null
}

/** Floating back-to-top with a circular scroll-progress ring. */
/** Floating back-to-top with a circular scroll-progress ring. */
function ScrollTopButton() {
  const { scrollY, scrollYProgress } = useScroll()
  const ringProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const dash = useTransform(ringProgress, [0, 1], [97.4, 0])
  const [visible, setVisible] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => {
    setVisible(v > window.innerHeight * 0.8)
  })

  return (
    <motion.button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6, y: visible ? 0 : 12 }}
      transition={{ duration: 0.3, ease: EASE }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
      className="fixed bottom-6 right-6 z-40 hidden h-12 w-12 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface)]/90 text-[color:var(--body)] backdrop-blur-md transition-colors duration-300 hover:text-[color:var(--accent-text)] md:flex"
    >
      <svg viewBox="0 0 40 40" aria-hidden className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="20" cy="20" r="15.5" fill="none" strokeWidth="2" style={{ stroke: 'var(--line)' }} />
        <motion.circle
          cx="20"
          cy="20"
          r="15.5"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="97.4"
          style={{ stroke: 'var(--accent)', strokeDashoffset: dash }}
        />
      </svg>
      <ArrowUp size={16} className="relative" />
    </motion.button>
  )
}


/** Giant outlined statement that drifts as you scroll past it. */
function ScrollWord({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-16%'])

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative select-none overflow-hidden border-t border-[color:var(--line-faint)] py-10 md:py-14"
    >
      <motion.div
        style={{ x, WebkitTextStroke: '1px var(--line)', color: 'transparent' }}
        className={`whitespace-nowrap text-[22vw] font-bold leading-none tracking-tight md:text-[15vw] ${monoClass}`}
      >
        {text}&nbsp;&nbsp;{text}&nbsp;&nbsp;{text}
      </motion.div>
    </div>
  )
}

/** LinkedIn brand mark — self-contained inline SVG (lucide dropped brand icons). */
function LinkedInIcon({ size = 19, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  )
}

/** Theme toggle — moon in dark mode, sun in light mode. */
function ThemeToggle({ theme, onToggle }: { theme: 'dark' | 'light'; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[color:var(--line)] text-[color:var(--body)] transition-colors duration-300 hover:border-[color:var(--accent-soft)] hover:text-[color:var(--accent-text)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex"
        >
          {theme === 'dark' ? <Moon size={17} strokeWidth={1.75} /> : <Sun size={17} strokeWidth={1.75} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Navbar — scroll-spy, theme toggle, scrambling logo, progress rail  */
/* ------------------------------------------------------------------ */

function Navbar({ theme, onToggle }: { theme: 'dark' | 'light'; onToggle: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')
  const [logoHover, setLogoHover] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = [...NAV_LINKS.map((l) => l.id), 'contact']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setMenuOpen(false)
    scrollToId(id)
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
        scrolled || menuOpen
          ? 'border-[color:var(--line)] bg-[color:var(--nav-solid)]'
          : 'border-[color:var(--line-faint)] bg-[color:var(--nav-ghost)]'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          onClick={go('top')}
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
          className={`text-sm font-medium tracking-[0.2em] text-[color:var(--heading)] transition-colors hover:text-[color:var(--accent-text)] ${monoClass}`}
        >
          <ScrambleText text="MTR" active={logoHover} />
          <span className="text-[color:var(--accent-text)]">_</span>
        </a>

        {/* Desktop links + theme toggle + CV */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={go(link.id)}
              className={`relative text-sm transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-[color:var(--accent-text)] after:content-[''] after:transition-all after:duration-300 ${
                active === link.id
                  ? 'text-[color:var(--heading)] after:w-full'
                  : 'text-[color:var(--body)] after:w-0 hover:text-[color:var(--heading)] hover:after:w-full'
              }`}
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle theme={theme} onToggle={onToggle} />
          <Magnetic strength={0.25}>
            <a
              href={CV_PATH}
              download
              className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[#0B0F19] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-text)]"
            >
              <Download size={15} strokeWidth={2} />
              Download CV
            </a>
          </Magnetic>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle theme={theme} onToggle={onToggle} />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--line)] text-[color:var(--body)] transition-colors hover:text-[color:var(--heading)]"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden md:hidden"
          >
            <div className="space-y-1 border-t border-[color:var(--line)] bg-[color:var(--nav-solid)] px-6 pb-6 pt-4">
              {[...NAV_LINKS, { label: 'Contact', id: 'contact' }].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={go(link.id)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-[color:var(--body)] transition-colors hover:bg-[color:var(--line-faint)] hover:text-[color:var(--heading)]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={CV_PATH}
                download
                onClick={() => setMenuOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-3 text-sm font-semibold text-[#0B0F19]"
              >
                <Download size={15} />
                Download CV
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll-progress rail */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[color:var(--accent)]"
      />
    </header>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero — living grid, letter-by-letter name, decoding tagline        */
/* ------------------------------------------------------------------ */

function Hero({ started }: { started: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 18 })
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 18 })
  const parallaxX = useTransform(smoothX, [-0.5, 0.5], [-16, 16])
  const parallaxY = useTransform(smoothY, [-0.5, 0.5], [-10, 10])

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }


  /* Tagline spotlight: the highlighted phrase rotates on its own */
    const [spotlight, setSpotlight] = useState(0)
    useEffect(() => {
      if (!started) return
      const t = setInterval(() => setSpotlight((s) => (s + 1) % 3), 3200)
      return () => clearInterval(t)
    }, [started])

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Blueprint grid — drifting, cursor-reactive, scroll-parallaxed */}
      <div aria-hidden className="absolute inset-0" style={{ maskImage: GRID_MASK, WebkitMaskImage: GRID_MASK }}>
        <motion.div style={{ y: gridY }} className="absolute inset-0">
          <motion.div
            className="absolute -inset-10"
            style={{ x: parallaxX, y: parallaxY, backgroundImage: 'var(--grid-image)', backgroundSize: '64px 64px' }}
            animate={{ backgroundPosition: ['0px 0px', '64px 64px'] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24"
      >
        <motion.div variants={heroStagger} initial="hidden" animate={started ? 'show' : 'hidden'} className="max-w-4xl">
          <motion.div variants={heroItem}>
            <span className="inline-flex items-center gap-3 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--accent)] opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--accent)]" />
              </span>
              <span className={`text-xs text-[color:var(--body)] ${monoClass}`}>Available for new opportunities</span>
            </span>
          </motion.div>

          {/* Name — letter-by-letter cascade, letters hop on hover */}
          <motion.h1
            variants={h1Stagger}
            className="mt-8 flex flex-wrap text-5xl font-semibold leading-[1.1] tracking-tight text-[color:var(--heading)] sm:text-6xl lg:text-7xl"
          >
            {['M.', 'Tahsinur', 'Rahman'].map((word) => (
              <span key={word} className="mr-[0.26em] inline-flex overflow-hidden pb-[0.1em] -mb-[0.1em]">
                {word.split('').map((letter, li) => (
                  <motion.span key={`${word}-${li}`} variants={h1Word} className="inline-block">
                    <span className="inline-block transition-all duration-300 hover:-translate-y-2 hover:text-[color:var(--accent-text)]">
                      {letter}
                    </span>
                  </motion.span>
                ))}
              </span>
            ))}
            <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <motion.span variants={h1Word} className="inline-block">
                <motion.span
                  aria-hidden
                  className="ml-1 inline-block h-[0.75em] w-[0.25em] bg-[color:var(--accent)]"
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: 'linear' }}
                />
              </motion.span>
            </span>
          </motion.h1>

          <motion.h2
            variants={heroItem}
            className={`mt-6 flex flex-wrap items-center gap-x-1 text-base sm:text-lg md:text-xl ${monoClass}`}
          >
            {['Web Development', 'Software QA & Testing', 'Technical Sales'].map((phrase, i) => (
              <span key={phrase} className="flex items-center">
                {i > 0 && <span className="mx-2 text-[color:var(--faint)]">|</span>}
                <span
                  className={`transition-colors duration-700 ${
                    spotlight === i ? 'text-[color:var(--accent-text)]' : 'text-[color:var(--muted)]'
                  }`}
                >
                  <ScrambleText text={phrase} active={started && spotlight === i} delay={200} />
                </span>
              </span>
            ))}
          </motion.h2>

          <motion.div variants={heroItem} className="mt-12 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#projects"
                onClick={(e) => handleAnchor(e, 'projects')}
                className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-7 py-3.5 text-sm font-semibold text-[#0B0F19] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-text)]"
              >
                View My Work
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => handleAnchor(e, 'contact')}
                className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--line)] px-7 py-3.5 text-sm font-medium text-[color:var(--heading)] transition-colors duration-300 hover:border-[color:var(--accent-soft)] hover:text-[color:var(--accent-text)]"
              >
                Get in Touch
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        onClick={() => scrollToId('about')}
        aria-label="Scroll to the About section"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5 text-[color:var(--faint)] transition-colors hover:text-[color:var(--accent-text)]"
      >
        <span className={`text-[10px] tracking-[0.35em] ${monoClass}`}>SCROLL</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown size={15} />
        </motion.span>
      </motion.button>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Academic Journey — scroll-drawn rail, alternating slide-ins        */
/* ------------------------------------------------------------------ */

function AcademicTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start end', 'end start'],
  })
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <div ref={timelineRef} className="relative max-w-3xl">
      <div aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-[color:var(--line)]" />
      <motion.div
        aria-hidden
        style={{ scaleY: lineScale }}
        className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-[color:var(--accent-text)]"
      />

      <div className="space-y-10 md:space-y-12">
        {TIMELINE.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -48 : 48, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="relative pl-10"
          >
            <motion.span
              aria-hidden
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ type: 'spring', stiffness: 320, damping: 16 }}
              className="absolute left-0 top-1 flex h-[15px] w-[15px] items-center justify-center"
            >
              <span className="absolute h-full w-full rounded-full bg-[color:var(--accent-faint)]" />
              <span className="relative h-[9px] w-[9px] rounded-full bg-[color:var(--accent-text)]" />
            </motion.span>

            <p className={`text-sm text-[color:var(--accent-text)] ${monoClass}`}>{item.years}</p>

            <div className="group mt-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 transition-colors duration-300 hover:border-[color:var(--accent-soft)] md:p-7">
              <h3 className="text-lg font-semibold text-[color:var(--heading)]">{item.title}</h3>
              <p className={`mt-2 flex items-center gap-2.5 text-sm text-[color:var(--body)] ${monoClass}`}>
                <GraduationCap size={15} className="shrink-0 text-[color:var(--accent-text)]" />
                {item.institution}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Portrait — wipe-in photo, popping brackets, scanner on hover       */
/* ------------------------------------------------------------------ */

function Portrait() {
  return (
    <div className="group mx-auto w-full max-w-[320px] lg:mx-0 lg:max-w-none">
      <div className="relative">
        {/* Photo wipes in from the top on first view */}
        <motion.div
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)]"
        >
          <Image
            src={PORTRAIT_PATH}
            alt="Portrait of M. Tahsinur Rahman"
            fill
            unoptimized
            sizes="(min-width: 1024px) 340px, 92vw"
            className="object-cover grayscale transition-all duration-700 ease-out [@media(hover:none)]:grayscale-0 group-hover:scale-[1.03] group-hover:grayscale-0"
          />
          <div
            aria-hidden
            className="absolute inset-x-4 top-[10%] h-[2px] rounded-full bg-[color:var(--accent-soft)] opacity-0 transition-all duration-700 ease-out group-hover:top-[90%] group-hover:opacity-100"
          />
        </motion.div>

        {/* Brackets pop in one corner at a time, then nudge on hover */}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.2 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.65, type: 'spring', stiffness: 300, damping: 18 }}
          className="absolute -left-2.5 -top-2.5"
        >
          <span className="block h-5 w-5 border-l-2 border-t-2 border-[color:var(--accent-text)] transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
        </motion.span>
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.2 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.72, type: 'spring', stiffness: 300, damping: 18 }}
          className="absolute -right-2.5 -top-2.5"
        >
          <span className="block h-5 w-5 border-r-2 border-t-2 border-[color:var(--accent-text)] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </motion.span>
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.2 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.79, type: 'spring', stiffness: 300, damping: 18 }}
          className="absolute -bottom-2.5 -left-2.5"
        >
          <span className="block h-5 w-5 border-b-2 border-l-2 border-[color:var(--accent-text)] transition-transform duration-500 group-hover:-translate-x-1 group-hover:translate-y-1" />
        </motion.span>
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.2 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.86, type: 'spring', stiffness: 300, damping: 18 }}
          className="absolute -bottom-2.5 -right-2.5"
        >
          <span className="block h-5 w-5 border-b-2 border-r-2 border-[color:var(--accent-text)] transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1" />
        </motion.span>
      </div>

      {/* Caption fades in last */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ delay: 0.95, duration: 0.5, ease: EASE }}
        className={`mt-5 flex items-center justify-between text-[11px] ${monoClass}`}
      >
        <span className="text-[color:var(--body)]">M. Tahsinur Rahman</span>
        <span className="flex items-center gap-2 text-[color:var(--muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
          Dhaka, Bangladesh
        </span>
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Project card — ghost numeral parallax, tilt applied at render     */
/* ------------------------------------------------------------------ */

const PROJECT_CARD_BASE =
  'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 transition-colors duration-300 hover:border-[color:var(--accent-soft)] md:p-8'

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] })
  const ghostY = useTransform(scrollYProgress, [0, 1], [40, -40])

  const body = (
    <>
      {/* Ghost numeral drifts at its own scroll speed */}
      <motion.span
        aria-hidden
        style={{ y: ghostY }}
        className={`pointer-events-none absolute -top-8 right-1 select-none text-[120px] font-bold leading-none text-[color:var(--ghost)] ${monoClass}`}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.span>

      <p className={`text-xs uppercase tracking-[0.22em] text-[color:var(--accent-text)] ${monoClass}`}>
        {project.category}
      </p>
      <h3 className="mt-4 text-xl font-semibold tracking-tight text-[color:var(--heading)] md:text-2xl">
        {project.title}
      </h3>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--body)]">{project.description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full border border-[color:var(--line)] px-3.5 py-1 text-xs text-[color:var(--muted-strong)] transition-colors duration-300 group-hover:border-[color:var(--accent-faint)] ${monoClass}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {project.url && project.domain && (
        <span className={`mt-auto inline-flex items-center gap-1.5 pt-6 text-xs text-[color:var(--accent-text)] ${monoClass}`}>
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
          {project.domain}
        </span>
      )}
    </>
  )

  return (
    <div ref={cardRef} className="h-full">
      {project.url ? (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} — visit live site`}
          className={`${PROJECT_CARD_BASE} cursor-pointer`}
        >
          {body}
        </a>
      ) : (
        <article className={PROJECT_CARD_BASE}>{body}</article>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Contact form                                                       */
/* ------------------------------------------------------------------ */

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
  }

  const resetForm = () => {
    setForm({ name: '', email: '', message: '' })
    setSent(false)
  }

  const inputClasses =
  'w-full rounded-lg border border-[color:var(--line)] bg-[color:var(--field)] px-4 py-3 text-sm [@media(pointer:coarse)]:text-base text-[color:var(--heading)] placeholder:text-[color:var(--faint)] outline-none transition-colors duration-300 focus:border-[color:var(--accent-soft)] focus:ring-2 focus:ring-[color:var(--accent-faint)]'

  const labelClasses = `mb-2 block text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)] ${monoClass}`

  return (
    <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 md:p-8">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex flex-col items-center py-12 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--accent-soft)] bg-[color:var(--accent-faint)] text-[color:var(--accent-text)]">
              <CheckCircle2 size={26} strokeWidth={1.75} />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-[color:var(--heading)]">Message sent</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-[color:var(--body)]">
              Thanks for reaching out — I&apos;ll get back to you shortly.
            </p>
            <button
              type="button"
              onClick={resetForm}
              className={`mt-6 text-xs uppercase tracking-[0.2em] text-[color:var(--accent-text)] transition-opacity hover:opacity-70 ${monoClass}`}
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={labelClasses}>Name</span>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className={inputClasses}
                />
              </label>
              <label className="block">
                <span className={labelClasses}>Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className={inputClasses}
                />
              </label>
            </div>

            <label className="block">
              <span className={labelClasses}>Message</span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about your project..."
                className={`${inputClasses} resize-none`}
              />
            </label>

            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-[color:var(--accent)] px-6 py-3.5 text-sm font-semibold text-[#0B0F19] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-text)]"
            >
              Send Message
              <Send
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortfolioPage() {
  const [introDone, setIntroDone] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    try {
      if (localStorage.getItem('theme') === 'light') setTheme('light')
    } catch {
      /* private mode — ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', theme === 'light')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <div
      className={`min-h-screen bg-[color:var(--bg)] text-[color:var(--body)] antialiased transition-colors duration-300 selection:bg-[color:var(--accent-faint)] ${grotesk.className}`}
    >
      <IntroLoader onComplete={() => setIntroDone(true)} />
      <Cursor />
      <SmoothScroll />
      <ScrollTopButton />
      <Navbar theme={theme} onToggle={toggleTheme} />

      <main>
        <Hero started={introDone} />
        <Marquee />

        {/* ------------------------------ About ------------------------------ */}
        <Section id="about">
          <SectionHeader index="01" title="About Me" />
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)_minmax(0,1fr)]">
            <Reveal className="order-2 lg:order-1">
              <p className="text-[15px] leading-7 text-[color:var(--body)] md:text-base md:leading-8">
                I&apos;m a versatile and results-driven{' '}
                <span className="font-medium text-[color:var(--heading)]">Computer Science and Engineering</span>{' '}
                graduate with a robust foundation in{' '}
                <span className="font-medium text-[color:var(--heading)]">web development</span>,{' '}
                <span className="font-medium text-[color:var(--heading)]">software quality assurance</span>, and{' '}
                <span className="font-medium text-[color:var(--heading)]">technical sales</span>. My experience
                spans shipping live production websites on{' '}
                <span className="font-medium text-[color:var(--heading)]">WordPress</span> and{' '}
                <span className="font-medium text-[color:var(--heading)]">Webflow</span>, validating AI-powered
                applications, and directing operations and logistics for large-scale university events with
                cross-functional teams.
              </p>
            </Reveal>

            <Reveal className="order-1 lg:order-2" delay={0.1}>
              <Portrait />
            </Reveal>

            <Reveal className="order-3" delay={0.15}>
              <p className="text-[15px] leading-7 text-[color:var(--body)] md:text-base md:leading-8">
                I&apos;m adept at leveraging technical expertise, data-driven problem-solving, and effective
                communication to{' '}
                <span className="font-medium text-[color:var(--heading)]">
                  bridge the gap between technology and business objectives
                </span>
                , and I&apos;m seeking to apply a diverse skill set in a dynamic professional environment to drive
                operational and commercial success.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-16 md:mt-20">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--line-faint)] md:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-[color:var(--surface)] px-6 py-8 text-center">
                  <span className="text-3xl font-semibold tracking-tight text-[color:var(--heading)] md:text-4xl">
                    <CountUp value={stat.value} />
                  </span>
                  <p className={`mt-3 text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted-strong)] ${monoClass}`}>
                    {stat.label}
                  </p>
                  {/* Fill bar sweeps in with the count */}
                  <div className="mt-4 h-0.5 overflow-hidden rounded-full bg-[color:var(--line-faint)]">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
                      style={{ width: `${(stat.value / 5) * 100}%` }}
                      className="h-full origin-left rounded-full bg-[color:var(--accent)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* ------------------------ Academic Journey ------------------------- */}
        <Section id="education">
          <SectionHeader index="02" title="Academic Journey" />
          <AcademicTimeline />
        </Section>

        {/* --------------------- Experience & Leadership ---------------------- */}
        <Section id="experience">
          <SectionHeader index="03" title="Experience & Leadership" />
          <div className="focus-grid grid gap-6 md:grid-cols-2">
            {EXPERIENCES.map((exp, i) => {
                const Icon = exp.icon
                return (
                  <div key={`${exp.role}-${exp.period}`} className="focus-item h-full">
                    <motion.article
                      initial={{ opacity: 0, y: 44, rotateX: 10, filter: 'blur(6px)' }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.85, delay: (i % 2) * 0.12, ease: EASE }}
                      whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
                      style={{ transformPerspective: 900 }}
                      className="group h-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-7 transition-colors duration-300 hover:border-[color:var(--accent-soft)]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                        {exp.logo ? (
                          <span className="flex h-12 shrink-0 items-center rounded-lg border border-[color:var(--line)] px-2.5 transition-colors duration-300 group-hover:border-[color:var(--accent-soft)] md:h-14 md:px-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={exp.logo}
                              alt={`${exp.org} logo`}
                              className="h-9 w-auto max-w-[110px] object-contain md:h-12 md:max-w-[170px]"
                            />
                          </span>
                        ) : (
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[color:var(--line)] text-[color:var(--accent-text)] transition duration-300 group-hover:rotate-6 group-hover:border-[color:var(--accent-soft)] group-hover:bg-[color:var(--accent-faint)]">
                            <Icon size={20} strokeWidth={1.75} />
                          </span>
                        )}
                        <span className={`pt-1 text-xs text-[color:var(--muted)] ${monoClass}`}>{exp.period}</span>
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-[color:var(--heading)]">{exp.role}</h3>
                      <p className={`mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--accent-text)] ${monoClass}`}>
                        {exp.org}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-[color:var(--body)]">{exp.description}</p>
                    </motion.article>
                  </div>
                )
              })}
          </div>
        </Section>

        {/* --------------------- Skills & Technical Arsenal ------------------- */}
        <Section id="skills">
          <SectionHeader index="04" title="Skills & Technical Arsenal" />
          <div className="border-y border-[color:var(--line-faint)]">
            {SKILL_GROUPS.map((group, i) => {
              const Icon = group.icon
              return (
                <Reveal
                  key={group.title}
                  delay={i * 0.08}
                  className={`grid gap-6 py-8 md:grid-cols-[minmax(0,300px)_1fr] md:gap-12 md:py-10 ${
                    i > 0 ? 'border-t border-[color:var(--line-faint)]' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[color:var(--line)] text-[color:var(--accent-text)]">
                      <Icon size={18} strokeWidth={1.75} />
                    </span>
                    <span>
                      <h3 className="text-base font-semibold text-[color:var(--heading)]">{group.title}</h3>
                      <p className={`mt-1.5 text-xs text-[color:var(--muted)] ${monoClass}`}>{group.tagline}</p>
                    </span>
                  </div>
                  <div className="flex flex-wrap content-start gap-2.5 md:pt-1">
                    {group.skills.map((skill, j) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, y: 12, scale: 0.85 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ delay: 0.25 + j * 0.06, type: 'spring', stiffness: 260, damping: 20 }}
                        className={`rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-1.5 text-[13px] text-[color:var(--muted-strong)] transition-colors duration-300 hover:border-[color:var(--accent-soft)] hover:text-[color:var(--accent-text)] ${monoClass}`}
                      >
                        {skill}
                      </motion.span>
                      
                    ))}

                    {/* Corner accents draw in on hover, clockwise */}
                      <span aria-hidden className="pointer-events-none absolute left-3 top-3 h-4 w-4 origin-top-left scale-0 border-l-2 border-t-2 border-[color:var(--accent-text)] opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
                      <span aria-hidden className="pointer-events-none absolute right-3 top-3 h-4 w-4 origin-top-right scale-0 border-r-2 border-t-2 border-[color:var(--accent-text)] opacity-0 transition-all delay-75 duration-500 group-hover:scale-100 group-hover:opacity-100" />
                      <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 origin-bottom-left scale-0 border-b-2 border-l-2 border-[color:var(--accent-text)] opacity-0 transition-all delay-150 duration-500 group-hover:scale-100 group-hover:opacity-100" />
                      <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 origin-bottom-right scale-0 border-b-2 border-r-2 border-[color:var(--accent-text)] opacity-0 transition-all delay-[225ms] duration-500 group-hover:scale-100 group-hover:opacity-100" />
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Section>

        {/* ---------------------------- Selected Works ------------------------ */}
        <Section id="projects">
          <SectionHeader index="05" title="Selected Works" />
          <div className="focus-grid grid gap-6 lg:grid-cols-2">
            {PROJECTS.map((project, i) => (
              <div key={project.title} className={`focus-item h-full ${i === 0 ? 'lg:col-span-2' : ''}`}>
                <Reveal delay={(i % 2) * 0.1} className="h-full">
                  <Tilt max={i === 0 ? 3 : 4}>
                    <ProjectCard project={project} index={i} />
                  </Tilt>
                </Reveal>
              </div>
            ))}
          </div>
        </Section>

        {/* ---------------------------- Certifications ------------------------ */}
        <Section id="certifications">
          <SectionHeader index="06" title="Certifications" />
          <div className="max-w-3xl border-y border-[color:var(--line-faint)]">
            {CERTIFICATIONS.map((cert, i) => (
              <Reveal
                key={cert.title}
                delay={i * 0.08}
                className={`flex items-center gap-5 py-6 ${i > 0 ? 'border-t border-[color:var(--line-faint)]' : ''}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[color:var(--line)] text-[color:var(--accent-text)]">
                  <Award size={18} strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-[color:var(--heading)]">{cert.title}</h3>
                  <p className={`mt-1 text-xs text-[color:var(--muted-strong)] ${monoClass}`}>
                    {cert.issuer}
                    {cert.note ? ` — ${cert.note}` : ''}
                  </p>
                </span>
                <span className={`shrink-0 text-sm text-[color:var(--accent-text)] ${monoClass}`}>{cert.year}</span>
              </Reveal>
            ))}
          </div>
        </Section>
      </main>

      {/* Giant outlined statement drifting into the contact section */}
      <ScrollWord text="LET'S TALK" />

      {/* ------------------------------ Contact ------------------------------ */}
      <footer id="contact" className="scroll-mt-24 border-t border-[color:var(--line-faint)] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader index="07" title="Get in Touch" />

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="max-w-md text-base leading-8 text-[color:var(--body)]">
                Have a role to discuss, a project to build, or just want to talk about where technology meets
                business? My inbox is always open.
              </p>

              <div className="mt-10 space-y-5">
                <a href="mailto:mtahsinurr@gmail.com" className="group flex items-center gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--accent-text)] transition-colors duration-300 group-hover:border-[color:var(--accent-soft)]">
                    <Mail size={19} strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className={`block text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)] ${monoClass}`}>
                      Email
                    </span>
                    <span className="mt-1 block text-[15px] text-[color:var(--heading)] transition-colors duration-300 group-hover:text-[color:var(--accent-text)]">
                      mtahsinurr@gmail.com
                    </span>
                  </span>
                </a>

                <a href="tel:01645743030" className="group flex items-center gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--accent-text)] transition-colors duration-300 group-hover:border-[color:var(--accent-soft)]">
                    <Phone size={19} strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className={`block text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)] ${monoClass}`}>
                      Phone
                    </span>
                    <span className="mt-1 block text-[15px] text-[color:var(--heading)] transition-colors duration-300 group-hover:text-[color:var(--accent-text)]">
                      01645743030
                    </span>
                  </span>
                </a>

                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--accent-text)] transition-colors duration-300 group-hover:border-[color:var(--accent-soft)]">
                    <LinkedInIcon size={19} />
                  </span>
                  <span>
                    <span className={`block text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)] ${monoClass}`}>
                      LinkedIn
                    </span>
                    <span className="mt-1 block text-[15px] text-[color:var(--heading)] transition-colors duration-300 group-hover:text-[color:var(--accent-text)]">
                      M. Tahsinur Rahman
                    </span>
                  </span>
                </a>

                <div className="group flex items-center gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--accent-text)] transition-colors duration-300 group-hover:border-[color:var(--accent-soft)]">
                    <MapPin size={19} strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className={`block text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)] ${monoClass}`}>
                      Location
                    </span>
                    <span className="mt-1 block text-[15px] text-[color:var(--heading)]">
                      Modhubag, Moghbazar, Dhaka
                    </span>
                  </span>
                </div>
              </div>

              <div className="mt-12 flex items-center gap-3 border-t border-[color:var(--line-faint)] pt-8">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--accent)] opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                </span>
                <span className={`text-xs text-[color:var(--muted)] ${monoClass}`}>
                  Open to roles in web development, QA &amp; technical sales
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <ContactForm />
            </Reveal>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-[color:var(--line-faint)] pt-8 sm:flex-row">
            <p className={`text-xs text-[color:var(--faint)] ${monoClass}`}>
              © {new Date().getFullYear()} M. Tahsinur Rahman. All rights reserved.
            </p>
            <p className={`text-xs text-[color:var(--faint)] ${monoClass}`}>Next.js · Tailwind CSS · Framer Motion</p>
            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--line)] text-[color:var(--body)] transition-colors duration-300 hover:border-[color:var(--accent-soft)] hover:text-[color:var(--accent-text)]"
              >
                <ArrowUp size={16} />
              </button>
            </Magnetic>
          </div>
        </div>
      </footer>
    </div>
  )
}