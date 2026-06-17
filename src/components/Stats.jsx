import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { value: 500, suffix: '+', label: 'Projects Delivered', sub: 'across 30 industries' },
  { value: 98, suffix: '%', label: 'Client Satisfaction', sub: 'average CSAT score' },
  { value: 4.2, suffix: 'B', prefix: '$', label: 'Capital Raised', sub: 'via our pitch decks' },
  { value: 14, suffix: ' hrs', label: 'Avg Turnaround', sub: 'for standard decks' },
]

function Counter({ value, suffix, prefix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const isFloat = !Number.isInteger(value)
    const duration = 1600
    const steps = 50
    const interval = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const ease = 1 - Math.pow(1 - progress, 3)
      const current = value * ease
      setDisplay(isFloat ? parseFloat(current.toFixed(1)) : Math.round(current))
      if (step >= steps) clearInterval(timer)
    }, interval)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <span ref={ref}>
      {prefix || ''}{display}{suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section style={{
      padding: '80px 0',
      background: 'linear-gradient(180deg, rgba(124,107,255,0.04) 0%, rgba(255,107,157,0.02) 100%)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 2,
        }}>
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                textAlign: 'center', padding: '32px 20px',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
              className="stat-item"
            >
              <div style={{
                fontSize: 'clamp(36px, 4vw, 52px)',
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                background: 'linear-gradient(135deg, #fff 30%, #9999cc)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', marginBottom: 8,
              }}>
                <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#ccc', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: '#555', letterSpacing: 0.3 }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .stat-item { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); }
        }
      `}</style>
    </section>
  )
}
