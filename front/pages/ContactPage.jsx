import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, ExternalLink, Copy, Check } from 'lucide-react'

const EMAILS = [
  { name: 'A. Panajotu', email: 'a.panajotu@cpt-b2b.com' },
  { name: 'V. Krstić',   email: 'v.krstic@cpt-b2b.com'  },
  { name: 'J. Trišić',  email: 'j.trisic@cpt-b2b.com'  },
]

const MAPS_URL = 'https://maps.app.goo.gl/Y7pnM6kFAiUxyEsMA'

// Keyless embed format — short share links (maps.app.goo.gl) refuse to load
// inside iframes, so this uses the resolved coordinates of that same place.
const MAPS_EMBED_URL = 'https://maps.google.com/maps?q=42.6993741,23.3210289&z=16&output=embed'

function EmailCard({ person, index }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(person.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      style={{
        borderRadius: 16,
        background: 'rgba(235, 226, 212, 0.8)',
        border: '1px solid rgba(110, 78, 42, 0.15)',
        padding: '28px 24px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: 'rgba(122, 82, 48, 0.1)', border: '1px solid rgba(122, 82, 48, 0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Mail size={18} color="#7a5230" />
      </div>

      <div>
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 18, fontWeight: 700, color: '#2a1a0a', marginBottom: 6,
        }}>
          {person.name}
        </div>
        <div style={{ fontSize: 14, color: '#7a5230', fontFamily: "'Inter', sans-serif" }}>
          {person.email}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <a
          href={`mailto:${person.email}`}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '10px 0', borderRadius: 8,
            background: 'linear-gradient(135deg, #7a5230, #b07850)',
            color: '#f7f2ea', fontSize: 13, fontWeight: 700,
            fontFamily: "'Inter', sans-serif", textDecoration: 'none',
          }}
        >
          <Mail size={13} /> Send Email
        </a>
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={copy}
          title="Copy email"
          style={{
            width: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8, border: '1px solid rgba(110, 78, 42, 0.2)',
            background: copied ? 'rgba(90, 122, 90, 0.1)' : 'rgba(110, 78, 42, 0.06)',
            cursor: 'pointer',
            color: copied ? '#5a7a5a' : '#7a5230',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function ContactPage() {
  return (
    <section style={{ padding: '100px 0 120px' }}>
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 56 }}
        >
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 3,
            textTransform: 'uppercase', color: '#7a5230',
            background: 'rgba(122, 82, 48, 0.08)', border: '1px solid rgba(122, 82, 48, 0.2)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 20,
            fontFamily: "'Inter', sans-serif",
          }}>
            Contact
          </div>
          <h1 style={{ fontSize: 'clamp(34px, 5vw, 64px)', color: '#2a1a0a', marginBottom: 16 }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: 17, fontFamily: "'Inter', sans-serif", color: '#9b7c5a', maxWidth: 480, lineHeight: 1.7 }}>
            Reach out to any member of our team directly — we respond within one business day.
          </p>
        </motion.div>

        {/* Email cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
          marginBottom: 80,
        }}>
          {EMAILS.map((p, i) => <EmailCard key={p.email} person={p} index={i} />)}
        </div>

        {/* Map section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4 }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20, flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(122, 82, 48, 0.1)', border: '1px solid rgba(122, 82, 48, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MapPin size={16} color="#7a5230" />
              </div>
              <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', color: '#2a1a0a' }}>
                Our Location
              </h2>
            </div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 18px', borderRadius: 8,
                background: 'linear-gradient(135deg, #7a5230, #b07850)',
                color: '#f7f2ea', fontSize: 13, fontWeight: 700,
                fontFamily: "'Inter', sans-serif", textDecoration: 'none',
              }}
            >
              <ExternalLink size={13} /> Open in Google Maps
            </a>
          </div>

          <div style={{
            borderRadius: 16, overflow: 'hidden',
            border: '1px solid rgba(110, 78, 42, 0.15)',
            background: 'rgba(235, 226, 212, 0.5)',
          }}>
            <iframe
              src={MAPS_EMBED_URL}
              width="100%"
              height="480"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="CPT Location"
            />
          </div>
        </motion.div>

      </div>
    </section>
  )
}
