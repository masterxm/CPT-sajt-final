import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
)
const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const LINKS = {
  Services: ['Investor Decks', 'Pitch Books', 'Board Presentations', 'Sales Decks', 'Annual Reports'],
  Company: ['About Us', 'How We Work', 'Careers', 'Blog', 'Press Kit'],
  Legal: ['Privacy Policy', 'Terms of Use', 'Cookie Policy'],
}

function FooterLink({ children }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href="#"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: 14,
        fontFamily: "'Inter', sans-serif",
        color: hov ? '#2a1a0a' : '#9b7c5a',
        transition: 'color 0.2s',
        display: 'inline-flex', alignItems: 'center', gap: 4,
      }}
    >
      {children}
    </a>
  )
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
          gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
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
            <p style={{ fontSize: 14, fontFamily: "'Inter', sans-serif", color: '#9b7c5a', lineHeight: 1.7, maxWidth: 260, marginBottom: 24 }}>
              Custom software, automation tools, and data platforms
              for companies that refuse to settle for off-the-shelf.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[LinkedinIcon, TwitterIcon, InstagramIcon].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(110, 78, 42, 0.06)',
                    border: '1px solid rgba(110, 78, 42, 0.14)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#9b7c5a',
                  }}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
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
                  <li key={item}>
                    <FooterLink>{item}</FooterLink>
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
            © 2025 CPT Studio. All rights reserved.
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
