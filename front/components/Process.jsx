import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquare, Lightbulb, Palette, Rocket } from 'lucide-react'

const STEPS = [
  {
    num: '01',
    icon: MessageSquare,
    title: 'Discovery & Brief',
    desc: 'We start with a deep-dive session to understand your audience, goals, and narrative arc. No templates, no shortcuts.',
    color: '#7c6bff',
    duration: '1–2 days',
  },
  {
    num: '02',
    icon: Lightbulb,
    title: 'Strategy & Structure',
    desc: 'Our strategists craft the narrative flow, slide architecture, and key message hierarchy before a single pixel is designed.',
    color: '#ff6b9d',
    duration: '1–2 days',
  },
  {
    num: '03',
    icon: Palette,
    title: 'Design & Craft',
    desc: 'Senior designers execute the vision with data visualization, custom illustrations, and motion graphics.',
    color: '#6bffd4',
    duration: '3–5 days',
  },
  {
    num: '04',
    icon: Rocket,
    title: 'Refine & Deliver',
    desc: 'Two rounds of unlimited revisions. You receive editable source files, a delivery PDF, and presenter notes.',
    color: '#ffb86b',
    duration: '1–2 days',
  },
]

function Step({ step, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const Icon = step.icon
  const isEven = index % 2 !== 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? 40 : -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex', gap: 28, alignItems: 'flex-start',
        background: 'rgba(13,13,20,0.5)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20, padding: '32px 28px',
        position: 'relative', overflow: 'hidden',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${step.color}60, transparent)`,
      }} />

      <div style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
        background: step.color + '15',
        border: `1px solid ${step.color}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={22} color={step.color} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10,
        }}>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontSize: 11, fontWeight: 800,
            color: step.color, letterSpacing: 2,
          }}>
            {step.num}
          </span>
          <span style={{
            fontSize: 11, color: '#44445a', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100,
            padding: '2px 10px', letterSpacing: 0.5,
          }}>
            {step.duration}
          </span>
        </div>
        <h3 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800,
          color: '#fff', marginBottom: 10,
        }}>
          {step.title}
        </h3>
        <p style={{ fontSize: 14, color: '#7777a0', lineHeight: 1.7, margin: 0 }}>
          {step.desc}
        </p>
      </div>
    </motion.div>
  )
}

export default function Process() {
  return (
    <section id="process" style={{ padding: '120px 0' }}>
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
            textTransform: 'uppercase', color: '#ff6b9d',
            background: 'rgba(255,107,157,0.1)', border: '1px solid rgba(255,107,157,0.2)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 20,
          }}>
            How We Work
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Our Process Is<br />
            <span className="grad-text">Built for Speed.</span>
          </h2>
          <p style={{ fontSize: 17, color: '#7777a0', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Most decks delivered in 7–10 business days.
            Rush turnarounds available on request.
          </p>
        </motion.div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16,
        }}>
          {STEPS.map((step, i) => <Step key={step.num} step={step} index={i} />)}
        </div>

        {/* Timeline bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{
            marginTop: 48, height: 2,
            background: 'linear-gradient(90deg, #7c6bff, #ff6b9d, #6bffd4, #ffb86b)',
            borderRadius: 2, transformOrigin: 'left',
            boxShadow: '0 0 12px rgba(124,107,255,0.4)',
          }}
        />
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 10,
        }}>
          {['Day 1', 'Day 3', 'Day 7', 'Day 10'].map(d => (
            <span key={d} style={{ fontSize: 11, color: '#44445a', letterSpacing: 0.5 }}>{d}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
