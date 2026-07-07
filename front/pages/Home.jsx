import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Code2, Layers, Zap, Globe, BarChart3, Shield } from 'lucide-react'
import { PROJECTS, STATUS_STYLE } from '../data/projects'

// ── Rotating headline words ────────────────────────────────────────────────
const WORDS = ['Ship Faster', 'Scale Smarter', 'Build Better', 'Move Forward']

function RotatingWord() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % WORDS.length), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ display: 'inline-block', position: 'relative' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: 36, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -36, opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="grad-text"
          style={{ display: 'inline-block' }}
        >
          {WORDS[idx]}
        </motion.span>
      </AnimatePresence>
      <span style={{
        display: 'inline-block', width: 3, height: '0.8em',
        background: '#7a5230', marginLeft: 6, verticalAlign: 'middle',
        animation: 'blink 1s step-end infinite',
      }} />
    </span>
  )
}

// ── Floating background orb ────────────────────────────────────────────────
function Orb({ x, y, size, color, delay }) {
  return (
    <motion.div
      animate={{ y: [0, -20, 0], opacity: [0.4, 0.65, 0.4] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size, borderRadius: '50%',
        background: color, filter: 'blur(90px)', pointerEvents: 'none',
      }}
    />
  )
}

// ── Services ──────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: Code2,    title: 'Custom Software',   desc: 'Tailor-made web and desktop apps built to your exact workflow.' },
  { icon: Globe,    title: 'Web Platforms',      desc: 'Scalable SaaS products and client portals with modern UX.' },
  { icon: Layers,   title: 'System Integration', desc: 'Connecting your tools, APIs, and data pipelines seamlessly.' },
  { icon: Zap,      title: 'Automation',         desc: 'Eliminate repetitive work with smart process automation.' },
  { icon: BarChart3, title: 'Data & Analytics',  desc: 'Dashboards and reporting tools that surface actionable insight.' },
  { icon: Shield,   title: 'Security & QA',      desc: 'Rigorous testing, audits, and compliance-ready architecture.' },
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

// ── Quote hook ─────────────────────────────────────────────────────────────
const FALLBACK_QUOTE = {
  content: 'CPT builds custom software, automation tools, and data platforms for companies that refuse to settle for off-the-shelf.',
  author: null,
}

function useRandomQuote() {
  const [quote, setQuote] = useState(FALLBACK_QUOTE)
  useEffect(() => {
    fetch('/quote-api/random')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => { if (d?.content && d?.author) setQuote({ content: d.content, author: d.author }) })
      .catch(() => setQuote(FALLBACK_QUOTE))
  }, [])
  return quote
}

// ── Home page ─────────────────────────────────────────────────────────────
// ── Mini project card for the home drawer ────────────────────────────────
function MiniProjectCard({ project }) {
  const ss = STATUS_STYLE[project.status] || STATUS_STYLE['Archived']
  const inner = (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      style={{
        borderRadius: 14, overflow: 'hidden',
        background: 'rgba(235, 226, 212, 0.8)',
        border: '1px solid rgba(110, 78, 42, 0.15)',
        display: 'flex', flexDirection: 'column', height: '100%',
      }}
    >
      <div style={{ height: 4, background: `linear-gradient(90deg, ${project.accent}, ${project.accent}66)` }} />
      <div style={{ padding: '16px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: '#2a1a0a' }}>
          {project.title}
        </div>
        <div style={{ fontSize: 12, color: '#9b7c5a', lineHeight: 1.55, flex: 1 }}>
          {project.desc}
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 4 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
            background: ss.bg, border: `1px solid ${ss.border}`, color: ss.text,
          }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: ss.dot, display: 'inline-block' }} />
            {project.status}
          </span>
          {project.tags.slice(0, 2).map(t => (
            <span key={t} style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 5,
              background: 'rgba(110, 78, 42, 0.06)', border: '1px solid rgba(110, 78, 42, 0.14)',
              color: '#7a5230', fontFamily: "'Inter', sans-serif",
            }}>{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )

  if (project.demoUrl) return (
    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none', height: '100%' }}>{inner}</a>
  )
  if (project.slug) return (
    <Link to={`/projects/${project.slug}`} style={{ display: 'block', textDecoration: 'none', height: '100%' }}>{inner}</Link>
  )
  return inner
}

export default function Home() {
  const heroRef = useRef(null)
  const drawerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 70])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const quote = useRandomQuote()
  const [showProjects, setShowProjects] = useState(false)

  const toggleProjects = () => {
    setShowProjects(prev => {
      if (!prev) {
        setTimeout(() => drawerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
      }
      return !prev
    })
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{
        minHeight: '92vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: 72,
      }}>
        <Orb x="5%"  y="10%" size={480} color="rgba(160, 110, 60, 0.14)" delay={0} />
        <Orb x="65%" y="0%"  size={360} color="rgba(176, 140, 80, 0.10)" delay={2} />

        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(110, 78, 42, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(110, 78, 42, 0.05) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 70% 55% at 50% 50%, black, transparent)',
        }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, position: 'relative', zIndex: 1, width: '100%' }}>
          <div className="container" style={{ textAlign: 'center', padding: '60px 28px 80px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(122, 82, 48, 0.08)', border: '1px solid rgba(122, 82, 48, 0.2)',
                borderRadius: 100, padding: '6px 16px', marginBottom: 32,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7a5230', display: 'inline-block' }} />
              <span style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 700, color: '#7a5230', letterSpacing: 0.5 }}>
                Software Development Studio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: 'clamp(42px, 6.5vw, 82px)', color: '#2a1a0a', marginBottom: 24, lineHeight: 1.06 }}
            >
              We Help You<br /><RotatingWord />
            </motion.h1>

            <AnimatePresence mode="wait">
              <motion.p
                key={quote.content}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', fontFamily: "'Inter', sans-serif", color: '#9b7c5a', maxWidth: 520, margin: '0 auto 44px', lineHeight: 1.72 }}
              >
                {quote.author
                  ? <><em style={{ fontStyle: 'italic' }}>"{quote.content}"</em>
                      <span style={{ display: 'block', marginTop: 10, fontSize: '0.78em', color: '#b09870', letterSpacing: 0.4 }}>— {quote.author}</span></>
                  : quote.content}
              </motion.p>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <motion.button
                onClick={toggleProjects}
                whileHover={{ scale: 1.04, boxShadow: '0 4px 24px rgba(122, 82, 48, 0.32)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 30px', borderRadius: 10,
                  background: showProjects
                    ? 'rgba(110, 78, 42, 0.1)'
                    : 'linear-gradient(135deg, #7a5230, #b07850)',
                  border: showProjects ? '1px solid rgba(110, 78, 42, 0.25)' : 'none',
                  fontSize: 15, fontFamily: "'Inter', sans-serif", fontWeight: 700,
                  color: showProjects ? '#7a5230' : '#f7f2ea',
                  boxShadow: showProjects ? 'none' : '0 2px 16px rgba(122, 82, 48, 0.22)',
                  cursor: 'pointer',
                  transition: 'background 0.3s, color 0.3s, border 0.3s, box-shadow 0.3s',
                }}
              >
                {showProjects ? 'Hide Projects' : 'View Our Projects'}
                <motion.span
                  animate={{ rotate: showProjects ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'inline-flex' }}
                >
                  <ChevronDown size={15} />
                </motion.span>
              </motion.button>
              <Link to="/contact">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '13px 30px', borderRadius: 10,
                    background: 'rgba(110, 78, 42, 0.06)',
                    border: '1px solid rgba(110, 78, 42, 0.2)',
                    fontSize: 15, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#5a3a20',
                  }}
                >
                  Get in Touch
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Projects drawer ─────────────────────────────────────────────── */}
      <div ref={drawerRef}>
        <AnimatePresence>
          {showProjects && (
            <motion.section
              key="projects-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden', borderBottom: '1px solid rgba(110, 78, 42, 0.1)' }}
            >
              <div className="container" style={{ padding: '48px 28px 56px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 28, flexWrap: 'wrap', gap: 12,
                }}>
                  <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', color: '#2a1a0a' }}>
                    Our Projects
                  </h2>
                  <Link to="/projects">
                    <motion.span
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontSize: 13, fontWeight: 600, color: '#7a5230',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Full project page <ArrowRight size={13} />
                    </motion.span>
                  </Link>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 14,
                }}>
                  {PROJECTS.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.045, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <MiniProjectCard project={p} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* ── Services ────────────────────────────────────────────────────── */}
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
              background: 'rgba(122, 82, 48, 0.08)', border: '1px solid rgba(122, 82, 48, 0.2)',
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

      {/* ── Projects teaser ─────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0 100px' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: 24, overflow: 'hidden', position: 'relative',
              background: 'linear-gradient(135deg, #ece4d4, #e8ddd0, #eae4d6)',
              border: '1px solid rgba(110, 78, 42, 0.15)',
              padding: 'clamp(44px, 5vw, 72px)',
              textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: '-25%', left: '-5%', width: '40%', paddingBottom: '40%',
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(122, 82, 48, 0.14), transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
              style={{
                position: 'absolute', bottom: '-20%', right: '-5%', width: '35%', paddingBottom: '35%',
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(176, 120, 80, 0.14), transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 3,
                fontFamily: "'Inter', sans-serif",
                textTransform: 'uppercase', color: '#5a7a5a',
                background: 'rgba(90, 122, 90, 0.1)', border: '1px solid rgba(90, 122, 90, 0.22)',
                borderRadius: 100, padding: '5px 14px', marginBottom: 22,
              }}>Our Work</div>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 50px)', color: '#2a1a0a', marginBottom: 16 }}>
                See What We've Built.
              </h2>
              <p style={{ fontSize: 16, fontFamily: "'Inter', sans-serif", color: '#9b7c5a', maxWidth: 420, margin: '0 auto 36px', lineHeight: 1.7 }}>
                Browse our project demos — live previews of real software we've shipped.
              </p>
              <Link to="/projects">
                <motion.span
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 24px rgba(122, 82, 48, 0.28)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '14px 32px', borderRadius: 10,
                    background: 'linear-gradient(135deg, #7a5230, #b07850)',
                    fontSize: 15, fontFamily: "'Inter', sans-serif", fontWeight: 700, color: '#f7f2ea',
                  }}
                >
                  Browse Projects <ArrowRight size={15} />
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </>
  )
}
