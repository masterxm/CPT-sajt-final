import { motion } from 'framer-motion'
import { useState } from 'react'
import { BarChart3, BookOpen, Globe, Lightbulb, PresentationIcon, TrendingUp } from 'lucide-react'

const SERVICES = [
  {
    icon: PresentationIcon,
    title: 'Investor Decks',
    desc: 'Series A to IPO — we craft narratives that resonate with institutional investors and unlock capital.',
    tag: 'Fundraising',
    color: '#7c6bff',
  },
  {
    icon: TrendingUp,
    title: 'Pitch Books',
    desc: 'M&A advisory, deal sourcing, and investment banking pitch materials built with precision.',
    tag: 'Deal Flow',
    color: '#ff6b9d',
  },
  {
    icon: BarChart3,
    title: 'Board Presentations',
    desc: 'Board-ready decks that communicate KPIs, strategy, and risk with clarity and authority.',
    tag: 'Executive',
    color: '#6bffd4',
  },
  {
    icon: Globe,
    title: 'Sales Enablement',
    desc: 'Enterprise sales decks that shorten deal cycles. Tailored per vertical, persona, and stage.',
    tag: 'Revenue',
    color: '#ffb86b',
  },
  {
    icon: BookOpen,
    title: 'Annual Reports',
    desc: 'Stakeholder-grade annual reports that reinforce brand credibility and financial trust.',
    tag: 'Corporate',
    color: '#6bc8ff',
  },
  {
    icon: Lightbulb,
    title: 'Strategy Decks',
    desc: 'Internal strategy, OKR, and roadmap presentations that align teams around a shared vision.',
    tag: 'Strategy',
    color: '#ff9e6b',
  },
]

const containerVar = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const cardVar = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function ServiceCard({ item }) {
  const [hov, setHov] = useState(false)
  const Icon = item.icon

  return (
    <motion.div
      variants={cardVar}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -6 }}
      style={{
        background: hov ? 'rgba(17,17,24,0.9)' : 'rgba(13,13,20,0.6)',
        border: `1px solid ${hov ? item.color + '40' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 16, padding: '32px 28px',
        cursor: 'default', position: 'relative', overflow: 'hidden',
        transition: 'background 0.3s, border 0.3s',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Glow */}
      <motion.div
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(circle at 30% 30%, ${item.color}12, transparent 60%)`,
        }}
      />

      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: item.color + '18',
        border: `1px solid ${item.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <Icon size={20} color={item.color} />
      </div>

      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
        color: item.color, marginBottom: 10,
      }}>
        {item.tag}
      </div>

      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 12, fontFamily: 'Syne, sans-serif' }}>
        {item.title}
      </h3>
      <p style={{ fontSize: 14, color: '#7777a0', lineHeight: 1.7 }}>
        {item.desc}
      </p>

      <motion.div
        animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -8 }}
        style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: item.color }}
      >
        Learn more
        <span style={{ fontSize: 16 }}>→</span>
      </motion.div>
    </motion.div>
  )
}

export default function Services() {
  return (
    <section id="services" style={{ padding: '120px 0' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 3,
            textTransform: 'uppercase', color: '#7c6bff',
            background: 'rgba(124,107,255,0.1)', border: '1px solid rgba(124,107,255,0.2)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 20,
          }}>
            What We Do
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Every Format.<br />
            <span className="grad-text">Every Industry.</span>
          </h2>
          <p style={{ fontSize: 17, color: '#7777a0', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            From Series A fundraises to Fortune 500 board decks —
            we specialize in the presentations that matter most.
          </p>
        </motion.div>

        <motion.div
          variants={containerVar}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {SERVICES.map((s) => <ServiceCard key={s.title} item={s} />)}
        </motion.div>
      </div>
    </section>
  )
}
