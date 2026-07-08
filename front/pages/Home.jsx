import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Layers, Zap, Globe, BarChart3, Shield } from 'lucide-react'

// ── Capability ticker ──────────────────────────────────────────────────────
const CAPS = [
  'Custom Software', 'Web Platforms', 'System Integration',
  'Automation', 'Data & Analytics', 'Security & QA',
  'SaaS Products', 'API Development', 'Process Automation',
]

// ── Rotating words ─────────────────────────────────────────────────────────
const WORDS = ['Ship Faster', 'Scale Smarter', 'Build Better', 'Move Forward']
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!&#'

// Mounts with scrambled chars, resolves to the real word
function ScrambleWord({ word }) {
  const [display, setDisplay] = useState(() =>
    word.split('').map(c => c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  )
  useEffect(() => {
    let frame = 0
    const FRAMES = 14
    const id = setInterval(() => {
      frame++
      setDisplay(word.split('').map((char, i) => {
        if (char === ' ') return ' '
        return frame > Math.floor((i / word.length) * FRAMES)
          ? char
          : CHARS[Math.floor(Math.random() * CHARS.length)]
      }).join(''))
      if (frame >= FRAMES) clearInterval(id)
    }, 38)
    return () => clearInterval(id)
  }, [word])
  return <>{display}</>
}

function RotatingWord() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % WORDS.length), 2800)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ display: 'inline-block' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 36, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
          exit={{   opacity: 0, y: -36, filter: 'blur(10px)' }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="grad-text"
          style={{ display: 'inline-block' }}
        >
          <ScrambleWord word={WORDS[idx]} />
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// ── Floating orb ───────────────────────────────────────────────────────────
function Orb({ x, y, size, color, delay }) {
  return (
    <motion.div
      animate={{ y: [0, -24, 0], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 9 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size, borderRadius: '50%',
        background: color, filter: 'blur(110px)', pointerEvents: 'none',
      }}
    />
  )
}

// ── Services ───────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: Code2,     title: 'Custom Software',   desc: 'Tailor-made web and desktop apps built to your exact workflow.' },
  { icon: Globe,     title: 'Web Platforms',      desc: 'Scalable SaaS products and client portals with modern UX.' },
  { icon: Layers,    title: 'System Integration', desc: 'Connecting your tools, APIs, and data pipelines seamlessly.' },
  { icon: Zap,       title: 'Automation',         desc: 'Eliminate repetitive work with smart process automation.' },
  { icon: BarChart3, title: 'Data & Analytics',   desc: 'Dashboards and reporting tools that surface actionable insight.' },
  { icon: Shield,    title: 'Security & QA',       desc: 'Rigorous testing, audits, and compliance-ready architecture.' },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

function ServiceCard({ item }) {
  const [hov, setHov] = useState(false)
  const Icon = item.icon
  return (
    <motion.div
      variants={fadeUp}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -5 }}
      style={{
        background: hov ? 'rgba(224, 210, 190, 0.95)' : 'rgba(235, 226, 212, 0.7)',
        border: `1px solid ${hov ? 'rgba(110, 78, 42, 0.32)' : 'rgba(110, 78, 42, 0.15)'}`,
        borderRadius: 14, padding: '28px 24px',
        transition: 'background 0.3s, border 0.3s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <motion.div
        animate={{ opacity: hov ? 1 : 0 }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at 20% 20%, rgba(122, 82, 48, 0.06), transparent 60%)',
        }}
      />
      <div style={{
        width: 40, height: 40, borderRadius: 10, marginBottom: 16,
        background: 'rgba(122, 82, 48, 0.1)', border: '1px solid rgba(122, 82, 48, 0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} color="#7a5230" />
      </div>
      <div style={{ fontSize: 15, color: '#2a1a0a', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 8 }}>
        {item.title}
      </div>
      <div style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", color: '#9b7c5a', lineHeight: 1.65 }}>
        {item.desc}
      </div>
    </motion.div>
  )
}

// ── Home ───────────────────────────────────────────────────────────────────
export default function Home() {
  const heroRef    = useRef(null)
  const spotRef    = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY      = useTransform(scrollYProgress, [0, 1], [0, 70])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  // Direct DOM update avoids React re-render on every mouse move
  const onMouseMove = useCallback((e) => {
    if (!heroRef.current || !spotRef.current) return
    const r = heroRef.current.getBoundingClientRect()
    spotRef.current.style.background =
      `radial-gradient(700px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(122,82,48,0.09), transparent 65%)`
  }, [])
  const onMouseLeave = useCallback(() => {
    if (spotRef.current) spotRef.current.style.background = 'none'
  }, [])

  return (
    <>
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden', paddingTop: 72,
        }}
      >
        {/* Cursor spotlight */}
        <div ref={spotRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }} />

        <Orb x="62%" y="-8%"  size={580} color="rgba(160,110,60,0.12)" delay={0} />
        <Orb x="-8%"  y="35%" size={380} color="rgba(176,140,80,0.08)"  delay={3} />

        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(110,78,42,0.32) 2px, transparent 2px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 80%)',
        }} />

        {/* Main content */}
        <motion.div style={{ y: heroY, opacity: heroOpacity, flex: 1, position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ textAlign: 'center', padding: '60px 28px 80px' }}>

            {/* Badge with pulsing dot */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(122,82,48,0.08)', border: '1px solid rgba(122,82,48,0.2)',
                borderRadius: 100, padding: '6px 16px', marginBottom: 44,
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#7a5230', display: 'inline-block' }}
              />
              <span style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 700, color: '#7a5230', letterSpacing: 0.5 }}>
                Software Development Studio
              </span>
            </motion.div>

            {/* Headline — two large lines */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(50px, 8.5vw, 112px)',
                color: '#2a1a0a', lineHeight: 1.04,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 800, marginBottom: 10,
              }}
            >
              We Help You
            </motion.h1>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(50px, 8.5vw, 112px)',
                lineHeight: 1.04,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 800, marginBottom: 44,
              }}
            >
              <RotatingWord />
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              style={{
                fontSize: 'clamp(16px, 1.9vw, 20px)',
                fontFamily: "'Inter', sans-serif",
                color: '#9b7c5a', maxWidth: 500, margin: '0 auto 52px', lineHeight: 1.7,
              }}
            >
              Custom software for companies that refuse to settle for off-the-shelf.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42 }}
              style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link to="/contact">
                <motion.span
                  whileHover={{ scale: 1.04, boxShadow: '0 4px 28px rgba(122,82,48,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '15px 34px', borderRadius: 10,
                    background: 'linear-gradient(135deg, #7a5230, #b07850)',
                    fontSize: 16, fontFamily: "'Inter', sans-serif", fontWeight: 700, color: '#f7f2ea',
                    boxShadow: '0 2px 16px rgba(122,82,48,0.22)',
                  }}
                >
                  Get in Touch <ArrowRight size={16} />
                </motion.span>
              </Link>
              <Link to="/apps">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '15px 34px', borderRadius: 10,
                    background: 'rgba(110,78,42,0.06)',
                    border: '1px solid rgba(110,78,42,0.2)',
                    fontSize: 16, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#5a3a20',
                  }}
                >
                  See Our Apps
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Capability ticker */}
        <div style={{
          position: 'relative', zIndex: 2,
          borderTop: '1px solid rgba(110,78,42,0.1)',
          overflow: 'hidden', height: 46,
          display: 'flex', alignItems: 'center',
        }}>
          <div style={{
            display: 'inline-flex', whiteSpace: 'nowrap',
            animation: 'ticker 28s linear infinite', willChange: 'transform',
          }}>
            {[...CAPS, ...CAPS].map((cap, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 20,
                padding: '0 20px',
                fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 700,
                color: '#b09870', letterSpacing: 1.5, textTransform: 'uppercase',
              }}>
                {cap}
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(110,78,42,0.28)', display: 'inline-block', flexShrink: 0 }} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────────────── */}
      <section id="services" style={{ padding: '100px 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <div style={{
              display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 3,
              fontFamily: "'Inter', sans-serif",
              textTransform: 'uppercase', color: '#7a5230',
              background: 'rgba(122,82,48,0.08)', border: '1px solid rgba(122,82,48,0.2)',
              borderRadius: 100, padding: '5px 14px', marginBottom: 18,
            }}>What We Build</div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', color: '#2a1a0a', marginBottom: 14 }}>
              Full-Stack Expertise.<br /><span className="grad-text">End-to-End Delivery.</span>
            </h2>
            <p style={{ fontSize: 16, fontFamily: "'Inter', sans-serif", color: '#9b7c5a', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
              From idea to production — we cover the full software lifecycle.
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden"
            whileInView="show" viewport={{ once: true, amount: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}
          >
            {SERVICES.map(s => <ServiceCard key={s.title} item={s} />)}
          </motion.div>
        </div>
      </section>
    </>
  )
}
