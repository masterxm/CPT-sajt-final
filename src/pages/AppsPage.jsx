import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
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
          whileHover={{ y: -6, borderColor: `${app.color}40` }}
          style={{
            background: 'rgba(13,13,22,0.7)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 18, padding: '28px 24px', cursor: 'pointer',
            backdropFilter: 'blur(12px)', transition: 'border-color 0.3s',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <motion.div
            whileHover={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `radial-gradient(circle at 0% 0%, ${app.color}0e, transparent 60%)`,
              transition: 'opacity 0.3s',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${app.color}18`, border: `1px solid ${app.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={22} color={app.color} />
              </div>
              {app.badge && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100, letterSpacing: 0.5,
                  background: `${app.color}18`, border: `1px solid ${app.color}30`, color: app.color,
                  textTransform: 'uppercase',
                }}>
                  {app.badge}
                </span>
              )}
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#e8e8f0', fontFamily: 'Syne, sans-serif', marginBottom: 6 }}>
              {app.name}
            </h3>
            <p style={{ fontSize: 13, color: '#ff6b9d', fontWeight: 600, marginBottom: 10 }}>
              {app.tagline}
            </p>
            <p style={{ fontSize: 13, color: '#6b6b88', lineHeight: 1.65, marginBottom: 20 }}>
              {app.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: app.color }}>
              Otvori aplikaciju <ArrowRight size={13} />
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
      <section style={{ padding: '70px 28px 100px' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(124,107,255,0.1)', border: '1px solid rgba(124,107,255,0.22)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 20,
            }}>
              <ExternalLink size={12} color="#a89aff" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#a89aff', letterSpacing: 0.5 }}>CPT Apps</span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 60px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
              Naše <span className="grad-text">Aplikacije</span>
            </h1>
            <p style={{ fontSize: 16, color: '#7878a0', maxWidth: 480, margin: '0 auto', lineHeight: 1.75 }}>
              Samostalni alati i aplikacije koje smo izgradili — svaka je živ demo naših mogućnosti.
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
            <div style={{ textAlign: 'center', color: '#4a4a60', fontSize: 15, padding: '60px 0' }}>
              Uskoro — aplikacije su u pripremi.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
