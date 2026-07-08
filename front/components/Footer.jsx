import { useState } from 'react'
import { Link } from 'react-router-dom'

const LINKS = {
  Services: [
    { label: 'Custom Software',    href: '/#services' },
    { label: 'Web Platforms',      href: '/#services' },
    { label: 'System Integration', href: '/#services' },
    { label: 'Automation',         href: '/#services' },
    { label: 'Data & Analytics',   href: '/#services' },
  ],
  Explore: [
    { label: 'Home',     to: '/' },
    { label: 'Projects', to: '/projects' },
    { label: 'Apps',     to: '/apps' },
    { label: 'Contact',  to: '/contact' },
  ],
}

function FooterLink({ item }) {
  const [hov, setHov] = useState(false)
  const style = {
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    color: hov ? '#2a1a0a' : '#9b7c5a',
    transition: 'color 0.2s',
    display: 'inline-flex', alignItems: 'center', gap: 4,
  }
  const hoverProps = {
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
  }
  return item.to
    ? <Link to={item.to} {...hoverProps} style={style}>{item.label}</Link>
    : <a href={item.href} {...hoverProps} style={style}>{item.label}</a>
}

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(110, 78, 42, 0.12)',
      background: '#efe8da',
      padding: '72px 0 36px',
    }}>
      <div className="container">
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1fr',
          gap: 48, marginBottom: 64,
        }}>
          <div>
            <Link to="/" style={{
              display: 'inline-block',
              fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, fontSize: 24,
              color: '#2a1a0a', letterSpacing: '0.01em', marginBottom: 16,
            }}>
              CPT<span style={{ color: '#7a5230' }}>.</span>
            </Link>
            <p style={{ fontSize: 14, fontFamily: "'Inter', sans-serif", color: '#9b7c5a', lineHeight: 1.7, maxWidth: 260 }}>
              Custom software, automation tools, and data platforms
              for companies that refuse to settle for off-the-shelf.
            </p>
          </div>

          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 2,
                fontFamily: "'Inter', sans-serif",
                textTransform: 'uppercase', color: '#b09870', marginBottom: 20,
              }}>
                {heading}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(item => (
                  <li key={item.label}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '1px solid rgba(110, 78, 42, 0.08)',
          paddingTop: 28, display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", color: '#c0a880' }}>
            © {new Date().getFullYear()} CPT Studio. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", color: '#b09870' }}>All systems operational</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
