import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, LayoutGrid } from 'lucide-react'
import { APPS } from '../apps'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
}

function AppCard({ app }) {
  const Icon = app.icon
  return (
    <motion.div variants={fadeUp}>
      <Link to={`/apps/${app.slug}`} style={{ display: 'block' }}>
        <motion.div
          whileHover={{ y: -6 }}
          style={{
            background: 'rgba(235, 226, 212, 0.8)',
            border: '1px solid rgba(110, 78, 42, 0.15)',
            borderRadius: 16, padding: '28px 24px', cursor: 'pointer',
            transition: 'border-color 0.3s, background 0.3s',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${app.color}14`, border: `1px solid ${app.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={22} color={app.color} />
              </div>
              {app.badge && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100, letterSpacing: 0.5,
                  background: `${app.color}14`, border: `1px solid ${app.color}30`, color: app.color,
                  textTransform: 'uppercase', fontFamily: "'Inter', sans-serif",
                }}>
                  {app.badge}
                </span>
              )}
            </div>

            <h3 style={{
              fontSize: 19, fontWeight: 700, color: '#2a1a0a',
              fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 6,
            }}>
              {app.name}
            </h3>
            <p style={{ fontSize: 13, color: app.color, fontWeight: 600, marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>
              {app.tagline}
            </p>
            <p style={{ fontSize: 13, color: '#9b7c5a', lineHeight: 1.65, marginBottom: 20, fontFamily: "'Inter', sans-serif" }}>
              {app.description}
            </p>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 600, color: '#7a5230', fontFamily: "'Inter', sans-serif",
            }}>
              Open app <ArrowRight size={13} />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default function AppsPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 80 }}>
      <section style={{ padding: '70px 0 100px' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(122, 82, 48, 0.08)', border: '1px solid rgba(122, 82, 48, 0.2)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 20,
            }}>
              <LayoutGrid size={12} color="#7a5230" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#7a5230', letterSpacing: 0.5, fontFamily: "'Inter', sans-serif" }}>
                CPT Apps
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 60px)', color: '#2a1a0a', marginBottom: 16 }}>
              Our <span className="grad-text">Apps</span>
            </h1>
            <p style={{ fontSize: 16, color: '#9b7c5a', maxWidth: 480, margin: '0 auto', lineHeight: 1.75, fontFamily: "'Inter', sans-serif" }}>
              Standalone tools and apps we've built — each one a living demo of what we can do.
            </p>
          </motion.div>

          <Suspense fallback={null}>
            <motion.div
              variants={stagger} initial="hidden" animate="show"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}
            >
              {APPS.map(app => <AppCard key={app.slug} app={app} />)}
            </motion.div>
          </Suspense>

          {APPS.length === 0 && (
            <div style={{ textAlign: 'center', color: '#b09870', fontSize: 15, padding: '60px 0', fontFamily: "'Inter', sans-serif" }}>
              Coming soon — apps are in the works.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
