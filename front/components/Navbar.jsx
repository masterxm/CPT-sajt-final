import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Services',  href: '/#services',  anchor: true },
  { label: 'Apps',      href: '/apps',        anchor: false },
  { label: 'Contact',   href: '/contact',     anchor: false },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(247, 242, 234, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(110, 78, 42, 0.12)' : 'none',
        transition: 'background 0.4s, backdrop-filter 0.4s, border 0.4s',
      }}
    >
      <div style={{
        maxWidth: 1160, margin: '0 auto', padding: '0 28px',
        height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <Link to="/" style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 22,
            letterSpacing: '0.01em', color: '#2a1a0a',
          }}>
            CPT<span style={{ color: '#7a5230' }}>.</span>
          </Link>
        </div>

        <nav style={{ display: 'flex', gap: 38, alignItems: 'center' }}
          className="desktop-nav">
          {links.map(l => (
            <NavLink key={l.label} href={l.href} anchor={l.anchor}>{l.label}</NavLink>
          ))}
        </nav>

        <button
          onClick={() => setOpen(p => !p)}
          className="mobile-menu-btn"
          style={{ background: 'none', border: 'none', color: '#2a1a0a', cursor: 'pointer', padding: 4 }}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: 'hidden',
              background: 'rgba(247, 242, 234, 0.98)',
              backdropFilter: 'blur(24px)',
              borderTop: '1px solid rgba(110, 78, 42, 0.1)',
            }}
          >
            <div style={{ padding: '12px 28px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {links.map((l, i) => (
                <motion.div key={l.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  {l.anchor
                    ? <a href={l.href} onClick={() => setOpen(false)} style={{ display: 'block', padding: '14px 0', fontSize: 18, fontFamily: "'Playfair Display', Georgia, serif", borderBottom: '1px solid rgba(110, 78, 42, 0.08)', color: '#2a1a0a' }}>{l.label}</a>
                    : <Link to={l.href} onClick={() => setOpen(false)} style={{ display: 'block', padding: '14px 0', fontSize: 18, fontFamily: "'Playfair Display', Georgia, serif", borderBottom: '1px solid rgba(110, 78, 42, 0.08)', color: '#2a1a0a' }}>{l.label}</Link>
                  }
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 769px) { .mobile-menu-btn { display: none !important; } }
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
      `}</style>
    </motion.header>
  )
}

function NavLink({ href, anchor, children }) {
  const [hov, setHov] = useState(false)
  const location = useLocation()
  const isActive = !anchor && location.pathname === href

  const style = {
    fontSize: 14, fontWeight: 400,
    fontFamily: "'Inter', sans-serif",
    color: isActive ? '#2a1a0a' : hov ? '#2a1a0a' : '#9b7c5a',
    transition: 'color 0.2s',
    position: 'relative',
  }
  const underline = (
    <motion.span
      animate={{ scaleX: hov || isActive ? 1 : 0 }}
      style={{
        position: 'absolute', bottom: -2, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, #7a5230, #b07850)',
        transformOrigin: 'left',
      }}
    />
  )

  return anchor
    ? (
      <a href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={style}>
        {children}{underline}
      </a>
    ) : (
      <Link to={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={style}>
        {children}{underline}
      </Link>
    )
}
