import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, GitBranch, Layers } from 'lucide-react'
import NewsFilterPage from './NewsFilterPage'
import FridgePage from './FridgePage'

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT DETAIL PAGES
// Add an entry here for every project that has a slug in ProjectsPage.jsx.
// The key must match the slug exactly.
// ─────────────────────────────────────────────────────────────────────────────
const DETAIL_PAGES = {
  alpha: {
    title: 'Project Alpha',
    tagline: 'Your one-line elevator pitch goes here.',
    accent: '#7a5230',
    visual: ['#f0e8d8', '#e8dcc8'],
    status: 'Live',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    overview: `This is where you describe Project Alpha in full. What problem does it solve? Who is it built for? What makes it different?

Replace this text with real content when you're ready. You can write multiple paragraphs — each blank line becomes a new paragraph.`,
    features: [
      'Feature one — describe what it does',
      'Feature two — describe what it does',
      'Feature three — describe what it does',
      'Feature four — describe what it does',
    ],
    demoUrl: null,
    repoUrl: null,
  },
}

const STATUS_STYLE = {
  'Live':           { bg: 'rgba(90,122,90,0.12)',  border: 'rgba(90,122,90,0.28)',   text: '#5a7a5a', dot: '#5a7a5a' },
  'Beta':           { bg: 'rgba(122,82,48,0.12)',   border: 'rgba(122,82,48,0.28)',   text: '#9b7c5a', dot: '#7a5230' },
  'In Development': { bg: 'rgba(176,112,48,0.12)',  border: 'rgba(176,112,48,0.28)',  text: '#c08050', dot: '#b07040' },
  'Archived':       { bg: 'rgba(130,110,90,0.12)',  border: 'rgba(130,110,90,0.25)',  text: '#9b8060', dot: '#7a6040' },
}

export default function ProjectDetail() {
  const { slug } = useParams()
  if (slug === 'alpha') return <NewsFilterPage />
  if (slug === 'beta') return <FridgePage />
  const project = DETAIL_PAGES[slug]

  if (!project) {
    return (
      <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 28px' }}>
        <div>
          <div style={{ fontSize: 64, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800, color: 'rgba(110, 78, 42, 0.12)', marginBottom: 16 }}>404</div>
          <div style={{ fontSize: 20, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: '#2a1a0a', marginBottom: 8 }}>Project not found</div>
          <div style={{ fontSize: 14, color: '#9b7c5a', marginBottom: 32 }}>This project page doesn't exist yet.</div>
          <Link to="/projects">
            <motion.span
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 24px', borderRadius: 10,
                background: 'linear-gradient(135deg, #7a5230, #b07850)',
                fontSize: 14, fontWeight: 700, color: '#f7f2ea',
              }}
            >
              <ArrowLeft size={14} /> Back to Projects
            </motion.span>
          </Link>
        </div>
      </section>
    )
  }

  const ss = STATUS_STYLE[project.status] || STATUS_STYLE['Archived']
  const paragraphs = project.overview.split('\n\n').filter(Boolean)

  return (
    <section style={{ padding: '100px 0 120px' }}>
      <div className="container" style={{ maxWidth: 860 }}>

        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 40 }}
        >
          <Link to="/projects" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontSize: 13, fontWeight: 600, color: '#9b7c5a',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#2a1a0a'}
            onMouseLeave={e => e.currentTarget.style.color = '#9b7c5a'}
          >
            <ArrowLeft size={14} /> All Projects
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Visual banner */}
          <div style={{
            borderRadius: 20, overflow: 'hidden', marginBottom: 40,
            background: `linear-gradient(135deg, ${project.visual[0]}, ${project.visual[1]})`,
            aspectRatio: '21/9', position: 'relative',
            border: '1px solid rgba(110, 78, 42, 0.15)',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(circle at 70% 40%, ${project.accent}25, transparent 60%)`,
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800,
              fontSize: 'clamp(60px, 12vw, 120px)',
              color: `${project.accent}22`, userSelect: 'none', letterSpacing: -4,
            }}>
              {project.title.split(' ').map(w => w[0]).join('')}
            </div>
            <div style={{
              position: 'absolute', bottom: 20, left: 24,
              fontSize: 11, fontWeight: 700, letterSpacing: 2,
              color: `${project.accent}70`, textTransform: 'uppercase',
            }}>
              Screenshot / Demo preview goes here
            </div>
          </div>

          {/* Title + meta */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                background: ss.bg, border: `1px solid ${ss.border}`, color: ss.text,
              }}>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: ss.dot, display: 'inline-block' }}
                />
                {project.status}
              </span>
              {project.tags.map(t => (
                <span key={t} style={{
                  fontSize: 11, padding: '3px 9px', borderRadius: 5,
                  background: 'rgba(110, 78, 42, 0.07)', border: '1px solid rgba(110, 78, 42, 0.16)',
                  color: '#7a5230', fontFamily: "'Inter', sans-serif",
                }}>
                  {t}
                </span>
              ))}
            </div>

            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              color: '#2a1a0a', marginBottom: 12, lineHeight: 1.1,
            }}>
              {project.title}
            </h1>
            <p style={{ fontSize: 18, color: '#9b7c5a', lineHeight: 1.6 }}>
              {project.tagline}
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 56 }}>
            {project.demoUrl ? (
              <motion.a
                href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04, boxShadow: '0 4px 20px rgba(122, 82, 48, 0.28)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '12px 26px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #7a5230, #b07850)',
                  fontSize: 14, fontWeight: 700, color: '#f7f2ea',
                }}
              >
                <ExternalLink size={14} /> Live Demo
              </motion.a>
            ) : (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '12px 26px', borderRadius: 10,
                background: 'rgba(110, 78, 42, 0.06)', border: '1px solid rgba(110, 78, 42, 0.16)',
                fontSize: 14, fontWeight: 600, color: '#b09870',
              }}>
                <ExternalLink size={14} /> Demo coming soon
              </div>
            )}
            {project.repoUrl && (
              <motion.a
                href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '12px 22px', borderRadius: 10,
                  background: 'rgba(110, 78, 42, 0.06)', border: '1px solid rgba(110, 78, 42, 0.16)',
                  fontSize: 14, fontWeight: 600, color: '#7a5230',
                }}
              >
                <GitBranch size={14} /> Repository
              </motion.a>
            )}
          </div>

          <div style={{ height: 1, background: 'rgba(110, 78, 42, 0.1)', marginBottom: 48 }} />

          {/* Overview */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, color: '#2a1a0a', marginBottom: 20 }}>
              Overview
            </h2>
            {paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 16, color: '#9b7c5a', lineHeight: 1.8, marginBottom: 16 }}>
                {p}
              </p>
            ))}
          </div>

          {/* Features */}
          <div style={{
            background: 'rgba(235, 226, 212, 0.7)', border: '1px solid rgba(110, 78, 42, 0.15)',
            borderRadius: 16, padding: '28px 28px',
          }}>
            <h2 style={{ fontSize: 18, color: '#2a1a0a', marginBottom: 20 }}>
              Key Features
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {project.features.map((f, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: '#5a3a20' }}
                >
                  <span style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                    background: 'rgba(122, 82, 48, 0.1)', border: '1px solid rgba(122, 82, 48, 0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: '#7a5230', fontWeight: 700,
                  }}>
                    {i + 1}
                  </span>
                  {f}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Edit hint */}
          <div style={{
            marginTop: 48, display: 'flex', alignItems: 'flex-start', gap: 10,
            background: 'rgba(122, 82, 48, 0.06)', border: '1px solid rgba(122, 82, 48, 0.16)',
            borderRadius: 12, padding: '14px 18px',
          }}>
            <Layers size={14} color="#7a5230" style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: '#9b7c5a', lineHeight: 1.6 }}>
              <strong style={{ color: '#7a5230' }}>To update this page:</strong>{' '}
              edit the <code style={{ background: 'rgba(110, 78, 42, 0.08)', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>DETAIL_PAGES.alpha</code>{' '}
              object in{' '}
              <code style={{ background: 'rgba(110, 78, 42, 0.08)', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>src/pages/ProjectDetail.jsx</code>.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
