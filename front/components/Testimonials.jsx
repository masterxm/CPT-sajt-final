import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote: "CPT transformed our Series B narrative. The deck wasn't just beautiful — it was strategically airtight. We closed $120M in 6 weeks.",
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    company: 'NovaPay',
    avatar: '#7c6bff',
    initials: 'SC',
  },
  {
    quote: "Our old deck was a liability in board meetings. CPT rebuilt it from the ground up. The board passed our Q3 strategy unanimously for the first time in three years.",
    name: 'Marcus Okafor',
    role: 'CFO',
    company: 'Meridian Capital',
    avatar: '#ff6b9d',
    initials: 'MO',
  },
  {
    quote: "We tripled our enterprise deal close rate within two quarters of adopting the CPT sales deck. The ROI was immediate and measurable.",
    name: 'Priya Nair',
    role: 'VP of Sales',
    company: 'CloudStack Pro',
    avatar: '#6bffd4',
    initials: 'PN',
  },
  {
    quote: "The CPT team understood our brand and our audience before I finished the brief. The speed and quality are unmatched in this category.",
    name: 'James Whitfield',
    role: 'Managing Director',
    company: 'Apex Partners',
    avatar: '#ffb86b',
    initials: 'JW',
  },
  {
    quote: "We went into our Series A with a CPT deck and emerged with three competing term sheets. Worth every penny.",
    name: 'Leila Amara',
    role: 'Founder',
    company: 'GreenLoop',
    avatar: '#6bc8ff',
    initials: 'LA',
  },
]

const variants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
}

export default function Testimonials() {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)

  const go = (d) => {
    setDir(d)
    setIdx(i => (i + d + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  useEffect(() => {
    const t = setInterval(() => go(1), 4800)
    return () => clearInterval(t)
  }, [])

  const t = TESTIMONIALS[idx]

  return (
    <section id="testimonials" style={{
      padding: '120px 0',
      background: 'linear-gradient(180deg, transparent, rgba(124,107,255,0.04), transparent)',
    }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 3,
            textTransform: 'uppercase', color: '#ffb86b',
            background: 'rgba(255,184,107,0.1)', border: '1px solid rgba(255,184,107,0.2)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 20,
          }}>
            Client Stories
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Results That<br />
            <span className="grad-text">Speak Louder.</span>
          </h2>
        </motion.div>

        <div style={{
          maxWidth: 780, margin: '0 auto',
          background: 'rgba(13,13,20,0.7)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24,
          padding: 'clamp(32px, 5vw, 64px)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(124,107,255,0.5), rgba(255,107,157,0.5), transparent)',
          }} />

          <Quote size={32} color="rgba(124,107,255,0.3)" style={{ marginBottom: 24 }} />

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p style={{
                fontSize: 'clamp(16px, 2vw, 21px)', color: '#d0d0e8',
                lineHeight: 1.75, marginBottom: 40, fontStyle: 'italic',
                fontWeight: 400,
              }}>
                "{t.quote}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: t.avatar, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff',
                  flexShrink: 0,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: '#7777a0' }}>{t.role}, {t.company}</div>
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} style={{ color: '#ffb86b', fontSize: 14 }}>★</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 32 }}>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
            onClick={() => go(-1)}
            style={{
              width: 40, height: 40, borderRadius: '50%', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronLeft size={18} />
          </motion.button>

          <div style={{ display: 'flex', gap: 8 }}>
            {TESTIMONIALS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i) }}
                animate={{ width: i === idx ? 24 : 8, background: i === idx ? '#7c6bff' : 'rgba(255,255,255,0.15)' }}
                style={{ height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0 }}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
            onClick={() => go(1)}
            style={{
              width: 40, height: 40, borderRadius: '50%', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>
    </section>
  )
}
