import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

const ROTATING_WORDS = ['Close Deals', 'Win Clients', 'Build Trust', 'Scale Revenue']

function FloatingOrb({ x, y, size, color, delay }) {
  return (
    <motion.div
      animate={{
        y: [0, -24, 0],
        scale: [1, 1.08, 1],
        opacity: [0.6, 0.85, 0.6],
      }}
      transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size, borderRadius: '50%',
        background: color, filter: 'blur(80px)',
        pointerEvents: 'none',
      }}
    />
  )
}

function RotatingWord() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % ROTATING_WORDS.length), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ display: 'inline-block', position: 'relative', minWidth: '260px' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="grad-text"
          style={{ display: 'inline-block' }}
        >
          {ROTATING_WORDS[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function SlideMockup() {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: '100%', maxWidth: 520,
        borderRadius: 16,
        background: 'rgba(17,17,24,0.9)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: 6,
        boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,107,255,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {/* Window chrome */}
      <div style={{ display: 'flex', gap: 6, padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {['#ff5f57','#febc2e','#28c840'].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
        ))}
      </div>
      {/* Slide preview */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0d18 0%, #12101e 100%)',
        borderRadius: 10, padding: '36px 32px', margin: 4,
        aspectRatio: '16/9', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute', right: -30, top: -30,
          width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,107,255,0.4), transparent)',
        }} />
        <div style={{
          fontSize: 10, color: '#7c6bff', fontWeight: 700, letterSpacing: 2,
          textTransform: 'uppercase', marginBottom: 10,
        }}>Q3 2025 Investor Brief</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.2, fontFamily: 'Syne, sans-serif', marginBottom: 14 }}>
          Revenue<br/>
          <span style={{ background: 'linear-gradient(90deg,#7c6bff,#ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Up 340%
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[85, 62, 90, 48, 75].map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                style={{
                  width: '100%', height: h * 0.65,
                  background: i === 4
                    ? 'linear-gradient(180deg, #7c6bff, #ff6b9d)'
                    : 'rgba(255,255,255,0.1)',
                  borderRadius: 3, transformOrigin: 'bottom',
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['MRR', '+142%'], ['ARR', '$4.2M'], ['NPS', '87']].map(([k, v]) => (
            <div key={k} style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '4px 8px',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ fontSize: 7, color: '#6b6b80', textTransform: 'uppercase', letterSpacing: 1 }}>{k}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const containerVar = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const itemVar = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 80])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden', paddingTop: 72,
    }}>
      {/* Background orbs */}
      <FloatingOrb x="10%" y="15%" size={500} color="rgba(124,107,255,0.18)" delay={0} />
      <FloatingOrb x="60%" y="5%" size={400} color="rgba(255,107,157,0.14)" delay={1.5} />
      <FloatingOrb x="40%" y="60%" size={350} color="rgba(107,255,212,0.08)" delay={3} />

      {/* Grid lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)',
      }} />

      <motion.div style={{ y, opacity, position: 'relative', zIndex: 1 }} className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64, alignItems: 'center',
          maxWidth: 1160, margin: '0 auto', padding: '80px 28px',
        }} className="hero-grid">
          {/* Left col */}
          <motion.div variants={containerVar} initial="hidden" animate="show">
            <motion.div variants={itemVar} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(124,107,255,0.1)', border: '1px solid rgba(124,107,255,0.25)',
              borderRadius: 100, padding: '6px 14px', marginBottom: 28,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c6bff', display: 'inline-block' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#a89aff', letterSpacing: 0.5 }}>
                B2B Presentation Studio
              </span>
            </motion.div>

            <motion.h1 variants={itemVar} style={{
              fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 800,
              lineHeight: 1.08, marginBottom: 24, color: '#fff',
            }}>
              Presentations<br />
              That&nbsp;<RotatingWord />
            </motion.h1>

            <motion.p variants={itemVar} style={{
              fontSize: 'clamp(16px, 1.8vw, 18px)', color: '#8888a0',
              maxWidth: 480, lineHeight: 1.7, marginBottom: 40,
            }}>
              CPT designs investor decks, pitch books, and board presentations
              for the world's most ambitious firms. Strategy meets design.
            </motion.p>

            <motion.div variants={itemVar} style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(124,107,255,0.5)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '14px 32px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #7c6bff 0%, #ff6b9d 100%)',
                  fontSize: 15, fontWeight: 700, color: '#fff',
                  boxShadow: '0 0 24px rgba(124,107,255,0.3)',
                  display: 'inline-block',
                }}
              >
                Start a Project
              </motion.a>
              <motion.a
                href="#work"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '14px 32px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 15, fontWeight: 600, color: '#ccc',
                  display: 'inline-block',
                  backdropFilter: 'blur(8px)',
                }}
              >
                View Our Work
              </motion.a>
            </motion.div>

            <motion.div variants={itemVar} style={{
              display: 'flex', alignItems: 'center', gap: 16, marginTop: 48,
              paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex' }}>
                {['#7c6bff','#ff6b9d','#6bffd4','#ffb86b'].map((c, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: c, border: '2px solid #050508',
                    marginLeft: i === 0 ? 0 : -8,
                  }} />
                ))}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>500+ firms served</div>
                <div style={{ fontSize: 12, color: '#6b6b80' }}>across 30+ industries</div>
              </div>
              <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.08)' }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>⭐ 4.97 / 5.0</div>
                <div style={{ fontSize: 12, color: '#6b6b80' }}>client satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right col */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="hero-visual"
          >
            <SlideMockup />
          </motion.div>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-visual { display: none !important; }
        }
      `}</style>
    </section>
  )
}
