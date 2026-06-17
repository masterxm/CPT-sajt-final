import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FILTERS = ['All', 'Investor', 'Sales', 'Corporate', 'Strategy']

const PROJECTS = [
  {
    id: 1, title: 'Series B Raise Deck', client: 'FinTech Unicorn',
    category: 'Investor',
    grad: 'linear-gradient(135deg, #1a0f3d 0%, #0d1a3d 100%)',
    accent: '#7c6bff',
    result: '$120M raised',
    slides: 28,
    bars: [0.8, 0.5, 0.9, 0.6, 0.75],
  },
  {
    id: 2, title: 'Enterprise Sales Deck', client: 'SaaS Platform',
    category: 'Sales',
    grad: 'linear-gradient(135deg, #3d0f1a 0%, #1a0d20 100%)',
    accent: '#ff6b9d',
    result: '38% close rate',
    slides: 22,
    bars: [0.6, 0.85, 0.4, 0.7, 0.9],
  },
  {
    id: 3, title: 'Annual Report 2024', client: 'Global Asset Manager',
    category: 'Corporate',
    grad: 'linear-gradient(135deg, #0a2a1a 0%, #0d1f2a 100%)',
    accent: '#6bffd4',
    result: 'Published globally',
    slides: 56,
    bars: [0.7, 0.55, 0.8, 0.65, 0.5],
  },
  {
    id: 4, title: 'Pre-Seed Pitch', client: 'CleanTech Startup',
    category: 'Investor',
    grad: 'linear-gradient(135deg, #1f2a0a 0%, #2a1a00 100%)',
    accent: '#ffb86b',
    result: '$4M secured',
    slides: 16,
    bars: [0.5, 0.7, 0.9, 0.4, 0.8],
  },
  {
    id: 5, title: 'Go-to-Market Strategy', client: 'PE-Backed Retailer',
    category: 'Strategy',
    grad: 'linear-gradient(135deg, #0a1530 0%, #1a0a30 100%)',
    accent: '#6bc8ff',
    result: '3 markets entered',
    slides: 34,
    bars: [0.9, 0.6, 0.5, 0.85, 0.7],
  },
  {
    id: 6, title: 'Board Presentation Q3', client: 'Mid-Market Corp.',
    category: 'Corporate',
    grad: 'linear-gradient(135deg, #200a30 0%, #300a1a 100%)',
    accent: '#ff9e6b',
    result: 'Passed unanimously',
    slides: 44,
    bars: [0.65, 0.8, 0.55, 0.9, 0.6],
  },
]

function ProjectCard({ project }) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{
        borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        border: `1px solid ${hov ? project.accent + '50' : 'rgba(255,255,255,0.07)'}`,
        transition: 'border 0.3s',
        position: 'relative',
      }}
    >
      {/* Slide Preview */}
      <div style={{
        background: project.grad, aspectRatio: '16/10',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        padding: 24,
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 80% 20%, ${project.accent}25, transparent 60%)`,
        }} />

        {/* Chart bars */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', marginBottom: 16, zIndex: 1 }}>
          {project.bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={hov ? { scaleY: 1 } : { scaleY: 0.4 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: 'easeOut' }}
              style={{
                width: 20, height: 50 * h, borderRadius: '3px 3px 0 0',
                background: i === project.bars.indexOf(Math.max(...project.bars))
                  ? `linear-gradient(180deg, ${project.accent}, ${project.accent}80)`
                  : 'rgba(255,255,255,0.12)',
                transformOrigin: 'bottom',
              }}
            />
          ))}
        </div>

        {/* Slide number */}
        <div style={{ zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: project.accent, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>
            {project.slides} SLIDES
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif' }}>
            {project.title}
          </div>
        </div>

        {/* Hover overlay */}
        <motion.div
          animate={{ opacity: hov ? 1 : 0 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(5,5,8,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8,
          }}
        >
          <div style={{
            padding: '8px 20px', borderRadius: 8,
            background: `linear-gradient(135deg, ${project.accent}, ${project.accent}bb)`,
            fontSize: 13, fontWeight: 700, color: '#fff',
          }}>
            View Case Study
          </div>
        </motion.div>
      </div>

      {/* Card footer */}
      <div style={{
        background: 'rgba(13,13,20,0.95)', padding: '18px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ddd' }}>{project.client}</div>
          <div style={{ fontSize: 11, color: '#55556a', marginTop: 2 }}>{project.category}</div>
        </div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: project.accent,
          background: project.accent + '15', border: `1px solid ${project.accent}30`,
          borderRadius: 20, padding: '4px 12px',
        }}>
          {project.result}
        </div>
      </div>
    </motion.div>
  )
}

export default function Portfolio() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === active)

  return (
    <section id="work" style={{ padding: '120px 0' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 3,
            textTransform: 'uppercase', color: '#6bffd4',
            background: 'rgba(107,255,212,0.1)', border: '1px solid rgba(107,255,212,0.2)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 20,
          }}>
            Our Work
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Decks That Delivered<br />
            <span className="grad-text">Real Results.</span>
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 40, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActive(f)}
              style={{
                padding: '8px 20px', borderRadius: 100, cursor: 'pointer',
                background: active === f ? 'linear-gradient(135deg, #7c6bff, #ff6b9d)' : 'rgba(255,255,255,0.04)',
                border: active === f ? 'none' : '1px solid rgba(255,255,255,0.09)',
                color: active === f ? '#fff' : '#7777a0',
                fontSize: 13, fontWeight: 600,
                transition: 'background 0.25s, color 0.25s, border 0.25s',
              }}
            >
              {f}
            </motion.button>
          ))}
        </div>

        <motion.div layout style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}>
          <AnimatePresence mode="popLayout">
            {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
