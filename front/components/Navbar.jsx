import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { APPS } from '../apps'

const links = [
  { label: 'Services', href: '/#services', anchor: true },
  { label: 'Contact',  href: '/contact',   anchor: false },
]

function AppsDropdown() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isActive = pathname.startsWith('/apps')

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontSize: 14, fontWeight: 400, fontFamily: "'Inter', sans-serif",
          color: isActive ? '#2a1a0a' : '#9b7c5a',
          transition: 'color 0.2s', position: 'relative',
        }}
      >
        Apps
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'inline-flex', marginTop: 1 }}
        >
          <ChevronDown size={12} />
        </motion.span>
        <motion.span
          animate={{ scaleX: isActive || open ? 1 : 0 }}
          style={{
            position: 'absolute', bottom: -2, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, #7a5230, #b07850)',
            transformOrigin: 'left',
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="apps-dropdown"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: 'calc(100% + 14px)', right: -12,
              background: 'rgba(247, 242, 234, 0.98)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(110, 78, 42, 0.14)',
              borderRadius: 14, padding: '8px',
              minWidth: 220, boxShadow: '0 8px 32px rgba(110, 78, 42, 0.12)',
              zIndex: 300,
            }}
          >
            {APPS.map(app => {
              const Icon = app.icon
              const active = pathname === `/apps/${app.slug}`
              return (
                <Link
                  key={app.slug}
                  to={`/apps/${app.slug}`}
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <motion.div
                    whileHover={{ background: 'rgba(122, 82, 48, 0.06)' }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px', borderRadius: 9,
                      background: active ? 'rgba(122, 82, 48, 0.08)' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: `${app.color}14`, border: `1px solid ${app.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={14} color={app.color} />
                    </div>
                    <div>
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: '#2a1a0a',
                        fontFamily: "'Inter', sans-serif", lineHeight: 1.3,
                      }}>
                        {app.name}
                      </div>
                      <div style={{
                        fontSize: 11, color: '#b09870',
                        fontFamily: "'Inter', sans-serif", lineHeight: 1.3,
                      }}>
                        {app.tagline}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )
            })}

            <div style={{ height: 1, background: 'rgba(110, 78, 42, 0.08)', margin: '6px 4px' }} />

            <Link to="/apps" style={{ display: 'block', textDecoration: 'none' }}>
              <motion.div
                whileHover={{ background: 'rgba(122, 82, 48, 0.06)' }}
                style={{
                  padding: '8px 12px', borderRadius: 9,
                  fontSize: 12, fontWeight: 600, color: '#7a5230',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'background 0.15s',
                }}
              >
                View all apps →
              </motion.div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mobileAppsOpen, setMobileAppsOpen] = useState(false)
  const { pathname } = useLocation()

  const currentApp = APPS.find(a => pathname === `/apps/${a.slug}`)

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
        position: 'relative',
      }}>
        <Link to="/" style={{
          fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 22,
          letterSpacing: '0.01em', color: '#2a1a0a', flexShrink: 0,
        }}>
          CPT<span style={{ color: '#7a5230' }}>.</span>
        </Link>

        <AnimatePresence mode="wait">
          {currentApp && (
            <motion.div
              key={currentApp.slug}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: 17,
                color: '#2a1a0a', pointerEvents: 'none', whiteSpace: 'nowrap',
              }}
            >
              {currentApp.name}
            </motion.div>
          )}
        </AnimatePresence>

        <nav style={{ display: 'flex', gap: 38, alignItems: 'center' }} className="desktop-nav">
          {links.map(l => (
            <NavLink key={l.label} href={l.href} anchor={l.anchor}>{l.label}</NavLink>
          ))}
          <AppsDropdown />
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

              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: links.length * 0.06 }}>
                <button
                  onClick={() => setMobileAppsOpen(p => !p)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '14px 0', background: 'none', border: 'none',
                    borderBottom: mobileAppsOpen ? 'none' : '1px solid rgba(110, 78, 42, 0.08)',
                    fontSize: 18, fontFamily: "'Playfair Display', Georgia, serif",
                    color: '#2a1a0a', cursor: 'pointer',
                  }}
                >
                  Apps
                  <motion.span
                    animate={{ rotate: mobileAppsOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'inline-flex' }}
                  >
                    <ChevronDown size={16} />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {mobileAppsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden', borderBottom: '1px solid rgba(110, 78, 42, 0.08)' }}
                    >
                      <div style={{ paddingBottom: 8 }}>
                        {APPS.map(app => {
                          const Icon = app.icon
                          return (
                            <Link
                              key={app.slug}
                              to={`/apps/${app.slug}`}
                              onClick={() => { setOpen(false); setMobileAppsOpen(false) }}
                              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', textDecoration: 'none' }}
                            >
                              <div style={{
                                width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                                background: `${app.color}14`, border: `1px solid ${app.color}30`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <Icon size={13} color={app.color} />
                              </div>
                              <span style={{ fontSize: 15, fontFamily: "'Inter', sans-serif", color: '#2a1a0a' }}>
                                {app.name}
                              </span>
                            </Link>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
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
