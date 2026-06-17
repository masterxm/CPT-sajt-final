import { motion } from 'framer-motion'

const CLIENTS = [
  'Sequoia Capital', 'Goldman Sachs', 'McKinsey & Co', 'Andreessen Horowitz',
  'BlackRock', 'Bain & Company', 'KKR', 'Deloitte', 'JP Morgan', 'BCG',
  'Accenture', 'Citadel', 'Bridgewater', 'Morgan Stanley',
]

export default function LogoMarquee() {
  const doubled = [...CLIENTS, ...CLIENTS]

  return (
    <section style={{
      padding: '40px 0',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(255,255,255,0.01)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        fontSize: 11, textAlign: 'center', color: '#44445a',
        fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase',
        marginBottom: 24,
      }}>
        Trusted by leading firms worldwide
      </div>

      {/* Fade edges */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 120,
        background: 'linear-gradient(90deg, #050508, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 120,
        background: 'linear-gradient(-90deg, #050508, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
        style={{ display: 'flex', gap: 60, whiteSpace: 'nowrap', alignItems: 'center' }}
      >
        {doubled.map((name, i) => (
          <div key={i} style={{
            fontSize: 14, fontWeight: 600, color: '#40405a',
            letterSpacing: 0.5, userSelect: 'none',
            display: 'flex', alignItems: 'center', gap: 10,
            transition: 'color 0.2s',
          }}>
            <span style={{
              display: 'inline-block', width: 4, height: 4, borderRadius: '50%',
              background: 'rgba(124,107,255,0.4)',
            }} />
            {name}
          </div>
        ))}
      </motion.div>
    </section>
  )
}
