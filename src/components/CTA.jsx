import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Send } from 'lucide-react'

function MagBtn({ children, style, href }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    setPos({ x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3 })
  }
  const onLeave = () => setPos({ x: 0, y: 0 })

  return (
    <motion.a
      ref={ref}
      href={href || '#contact'}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ x: pos.x, y: pos.y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...style }}
    >
      {children}
    </motion.a>
  )
}

export default function CTA() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) { setSent(true); setEmail('') }
  }

  return (
    <section id="contact" style={{ padding: '100px 0 120px' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: 28, overflow: 'hidden', position: 'relative',
            background: 'linear-gradient(135deg, #0f0d20 0%, #1a0d14 50%, #0d1520 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 'clamp(48px, 6vw, 88px)',
            textAlign: 'center',
          }}
        >
          {/* Animated gradient orbs */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '-30%', left: '-10%',
              width: '50%', paddingBottom: '50%', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,107,255,0.3), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{
              position: 'absolute', bottom: '-20%', right: '-10%',
              width: '45%', paddingBottom: '45%', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,107,157,0.25), transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Grid pattern */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 3,
              textTransform: 'uppercase', color: '#7c6bff',
              background: 'rgba(124,107,255,0.12)', border: '1px solid rgba(124,107,255,0.25)',
              borderRadius: 100, padding: '5px 14px', marginBottom: 28,
            }}>
              Ready to Begin?
            </div>

            <h2 style={{
              fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 800, color: '#fff',
              marginBottom: 20, lineHeight: 1.08,
            }}>
              Your Next Big Pitch<br />
              <span className="grad-text">Starts Here.</span>
            </h2>

            <p style={{
              fontSize: 18, color: '#8888a0', maxWidth: 520, margin: '0 auto 48px',
              lineHeight: 1.7,
            }}>
              Tell us about your project. We'll get back to you within
              one business day with a tailored proposal.
            </p>

            {/* Email form */}
            <form onSubmit={handleSubmit} style={{
              display: 'flex', gap: 10, maxWidth: 460, margin: '0 auto 32px',
              flexWrap: 'wrap', justifyContent: 'center',
            }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1, minWidth: 220, padding: '14px 20px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff', fontSize: 15, outline: 'none',
                  backdropFilter: 'blur(8px)',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(124,107,255,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(124,107,255,0.5)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '14px 28px', borderRadius: 10, cursor: 'pointer',
                  background: sent ? '#22c55e' : 'linear-gradient(135deg, #7c6bff, #ff6b9d)',
                  border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'background 0.4s',
                }}
              >
                {sent ? '✓ Sent!' : <><Send size={16} /> Get in Touch</>}
              </motion.button>
            </form>

            <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['No commitment required', 'Response in < 24 hrs', 'Free consultation'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#55557a' }}>
                  <span style={{ color: '#7c6bff', fontSize: 12 }}>✓</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
