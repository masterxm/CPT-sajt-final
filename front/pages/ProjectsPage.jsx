import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink, GitBranch, Tag, ArrowUpRight, Layers } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// ADD YOUR PROJECTS HERE
// Each project can have:
//   title       - project name
//   desc        - one-sentence description
//   longDesc    - fuller description shown on the card
//   tags        - tech stack / category tags
//   category    - used for filter tabs
//   demoUrl     - link to live demo  (set to null if not available)
//   repoUrl     - link to GitHub repo (set to null if private)
//   status      - 'Live' | 'In Development' | 'Beta' | 'Archived'
//   accent      - card accent colour (hex)
//   visual      - colour stops for the card thumbnail gradient (2-element array)
// ─────────────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 0,
    title: 'CPT Tajmer',
    desc: 'Pomodoro tajmer — 25 min fokus, 5 min pauza, duga pauza na svakih 4 runde.',
    longDesc: 'Pomodoro tehnika za produktivnost: fokusiraj se 25 minuta, odmori 5 minuta. Vizuelni krug napretka, zvučni signal, automatsko smenjivanje modova.',
    tags: ['React', 'Vite', 'Web Audio API'],
    category: 'Web App',
    demoUrl: '/apps/cpt-tajmer',
    repoUrl: null,
    status: 'Live',
    accent: '#a89aff',
    visual: ['#0e0c22', '#14103a'],
  },
  {
    id: 1,
    title: 'Serbian AI News Filter',
    desc: 'Aggregates Serbian news RSS feeds and surfaces only AI & machine learning coverage.',
    longDesc: 'Live RSS aggregator across five Serbian news sources with real-time filtering for artificial intelligence and machine learning articles.',
    tags: ['React', 'RSS', 'Vite'],
    category: 'Web App',
    demoUrl: null,
    repoUrl: null,
    status: 'Live',
    accent: '#8b6914',
    visual: ['#f0e8d8', '#e8dcc8'],
    slug: 'alpha',
  },
  {
    id: 2,
    title: 'Fridge',
    desc: 'AI-powered fridge inventory that maps your ingredients as a live graph and suggests recipes.',
    longDesc: 'Describe your fridge contents in plain language and the AI categorises everything into sweet and savory nodes, then suggests recipes — visualised as an Obsidian-style graph.',
    tags: ['React', 'Claude AI', 'SVG'],
    category: 'Web App',
    demoUrl: null,
    repoUrl: null,
    status: 'Beta',
    accent: '#7a5230',
    visual: ['#ece0d4', '#e4d8c8'],
    slug: 'beta',
  },
  {
    id: 3,
    title: 'Project Gamma',
    desc: 'Internal tooling or automation — describe it here.',
    longDesc: 'Add a longer description here. Explain what the project does, who it is for, and what makes it interesting.',
    tags: ['TypeScript', 'Electron', 'SQLite'],
    category: 'Desktop',
    demoUrl: null,
    repoUrl: null,
    status: 'In Development',
    accent: '#5a7a5a',
    visual: ['#dce8dc', '#d4e0d4'],
  },
  {
    id: 4,
    title: 'Project Delta',
    desc: 'A data or analytics tool — replace with real details.',
    longDesc: 'Add a longer description here. Explain what the project does, who it is for, and what makes it interesting.',
    tags: ['Vue', 'D3.js', 'BigQuery'],
    category: 'Web App',
    demoUrl: null,
    repoUrl: null,
    status: 'Live',
    accent: '#b07030',
    visual: ['#f0e4cc', '#e8dcc0'],
  },
  {
    id: 5,
    title: 'Project Epsilon',
    desc: 'A mobile or cross-platform app — describe it here.',
    longDesc: 'Add a longer description here. Explain what the project does, who it is for, and what makes it interesting.',
    tags: ['React Native', 'Expo', 'Supabase'],
    category: 'Mobile',
    demoUrl: null,
    repoUrl: null,
    status: 'Beta',
    accent: '#4a6a8a',
    visual: ['#d8e4f0', '#d0dce8'],
  },
  {
    id: 6,
    title: 'Project Zeta',
    desc: 'An automation or integration pipeline — add your description.',
    longDesc: 'Add a longer description here. Explain what the project does, who it is for, and what makes it interesting.',
    tags: ['Python', 'Celery', 'Docker'],
    category: 'Automation',
    demoUrl: null,
    repoUrl: null,
    status: 'Live',
    accent: '#9b5030',
    visual: ['#ece0d8', '#e4d8d0'],
  },
]

const STATUS_STYLE = {
  'Live':           { bg: 'rgba(90,122,90,0.12)',  border: 'rgba(90,122,90,0.28)',   text: '#5a7a5a', dot: '#5a7a5a' },
  'Beta':           { bg: 'rgba(122,82,48,0.12)',   border: 'rgba(122,82,48,0.28)',   text: '#9b7c5a', dot: '#7a5230' },
  'In Development': { bg: 'rgba(176,112,48,0.12)',  border: 'rgba(176,112,48,0.28)',  text: '#c08050', dot: '#b07040' },
  'Archived':       { bg: 'rgba(130,110,90,0.12)',  border: 'rgba(130,110,90,0.25)',  text: '#9b8060', dot: '#7a6040' },
}

const CATEGORIES = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))]

// ── Card thumbnail ────────────────────────────────────────────────────────
function CardVisual({ project, hov }) {
  return (
    <div style={{
      aspectRatio: '16/9', position: 'relative', overflow: 'hidden',
      background: `linear-gradient(135deg, ${project.visual[0]}, ${project.visual[1]})`,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 75% 30%, ${project.accent}28, transparent 60%)`,
      }} />

      <div style={{
        position: 'absolute', top: '15%', left: '10%',
        width: '40%', height: '35%',
        background: `${project.accent}14`,
        borderRadius: 10,
        border: `1px solid ${project.accent}28`,
      }} />
      <div style={{
        position: 'absolute', top: '30%', left: '25%',
        width: '55%', height: '8px',
        background: `${project.accent}20`,
        borderRadius: 4,
      }} />
      <div style={{
        position: 'absolute', top: '45%', left: '25%',
        width: '38%', height: '8px',
        background: `rgba(110, 78, 42, 0.1)`,
        borderRadius: 4,
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '10%',
        width: '28%', height: '28%',
        border: `1px solid ${project.accent}35`,
        borderRadius: '50%',
        background: `${project.accent}0c`,
      }} />

      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800,
        fontSize: 42, color: `${project.accent}28`,
        userSelect: 'none', letterSpacing: -2,
      }}>
        {project.title.split(' ').map(w => w[0]).join('')}
      </div>

      <motion.div
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.22 }}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(247, 242, 234, 0.88)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        }}
      >
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              background: `linear-gradient(135deg, #7a5230, #b07850)`,
              color: '#f7f2ea',
            }}
          >
            <ExternalLink size={13} /> Live Demo
          </a>
        )}
        {!project.demoUrl && (
          <div style={{
            padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: 'rgba(110, 78, 42, 0.08)', border: '1px solid rgba(110, 78, 42, 0.2)',
            color: '#9b7c5a',
          }}>
            Demo coming soon
          </div>
        )}
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'rgba(110, 78, 42, 0.08)', border: '1px solid rgba(110, 78, 42, 0.18)',
              color: '#7a5230',
            }}
          >
            <GitBranch size={13} />
          </a>
        )}
      </motion.div>
    </div>
  )
}

// ── Single project card ───────────────────────────────────────────────────
function ProjectCard({ project }) {
  const [hov, setHov] = useState(false)
  const ss = STATUS_STYLE[project.status] || STATUS_STYLE['Archived']
  const hasPage = !!project.slug

  const card = (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.93 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{
        borderRadius: 16, overflow: 'hidden',
        cursor: hasPage ? 'pointer' : 'default',
        background: hov ? 'rgba(224, 210, 190, 0.95)' : 'rgba(235, 226, 212, 0.8)',
        border: `1px solid ${hov ? 'rgba(110, 78, 42, 0.3)' : 'rgba(110, 78, 42, 0.15)'}`,
        transition: 'background 0.3s, border 0.3s',
        display: 'flex', flexDirection: 'column',
        transform: hov && hasPage ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <CardVisual project={project} hov={hov} />

      <div style={{ padding: '20px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700,
              color: '#2a1a0a', lineHeight: 1.25, marginBottom: 4,
            }}>
              {project.title}
            </div>
            <div style={{ fontSize: 13, color: '#9b7c5a', lineHeight: 1.55 }}>
              {project.desc}
            </div>
          </div>
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, marginTop: 2 }}>
              <motion.div
                animate={{ opacity: hov ? 1 : 0.4 }}
                style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'rgba(122, 82, 48, 0.1)', border: '1px solid rgba(122, 82, 48, 0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#7a5230',
                }}
              >
                <ArrowUpRight size={14} />
              </motion.div>
            </a>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
            background: ss.bg, border: `1px solid ${ss.border}`, color: ss.text,
          }}>
            <motion.span
              animate={{ opacity: project.status === 'Live' || project.status === 'In Development' ? [1, 0.3, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: ss.dot, display: 'inline-block' }}
            />
            {project.status}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
            background: 'rgba(110, 78, 42, 0.06)', border: '1px solid rgba(110, 78, 42, 0.14)',
            color: '#9b7c5a',
          }}>
            {project.category}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 6 }}>
          {project.tags.map(t => (
            <span key={t} style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 5,
              background: 'rgba(110, 78, 42, 0.06)',
              border: '1px solid rgba(110, 78, 42, 0.14)',
              color: '#7a5230', fontFamily: "'Inter', sans-serif",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )

  return hasPage
    ? <Link to={`/projects/${project.slug}`} style={{ display: 'block', textDecoration: 'none' }}>{card}</Link>
    : card
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeStatus, setActiveStatus] = useState('All')

  const filtered = PROJECTS.filter(p => {
    const cat = activeCategory === 'All' || p.category === activeCategory
    const st  = activeStatus  === 'All' || p.status   === activeStatus
    return cat && st
  })

  const statusOptions = ['All', ...Array.from(new Set(PROJECTS.map(p => p.status)))]

  return (
    <section style={{ padding: '100px 0 120px' }}>
      <div className="container">

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
          }}>
            Our Work
          </div>
          <h1 style={{ fontSize: 'clamp(34px, 5vw, 64px)', color: '#2a1a0a', marginBottom: 16 }}>
            Project Demos
          </h1>
          <p style={{ fontSize: 17, color: '#9b7c5a', maxWidth: 520, lineHeight: 1.7, marginBottom: 36 }}>
            Live previews and demos of software we've built.
            Click a card to launch the demo, or explore the source.
          </p>

          <div style={{
            display: 'inline-flex', alignItems: 'flex-start', gap: 10,
            background: 'rgba(122, 82, 48, 0.06)', border: '1px solid rgba(122, 82, 48, 0.16)',
            borderRadius: 12, padding: '12px 18px', maxWidth: 540,
          }}>
            <Layers size={15} color="#7a5230" style={{ marginTop: 1, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: '#9b7c5a', lineHeight: 1.6 }}>
              <strong style={{ color: '#7a5230' }}>To add a project:</strong>{' '}
              open <code style={{ background: 'rgba(110, 78, 42, 0.08)', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>
                src/pages/ProjectsPage.jsx
              </code>{' '}
              and edit the <code style={{ background: 'rgba(110, 78, 42, 0.08)', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>
                PROJECTS
              </code> array at the top of the file.
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap', alignItems: 'center' }}
        >
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <FilterBtn key={c} active={activeCategory === c} onClick={() => setActiveCategory(c)}>
                {c}
              </FilterBtn>
            ))}
          </div>

          <div style={{ width: 1, height: 24, background: 'rgba(110, 78, 42, 0.15)' }} />

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {statusOptions.map(s => (
              <FilterBtn key={s} active={activeStatus === s} onClick={() => setActiveStatus(s)} small>
                {s === 'All' ? 'All Status' : s}
              </FilterBtn>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', fontSize: 13, color: '#b09870' }}>
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}
          </div>
        </motion.div>

        <motion.div layout style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20,
        }}>
          <AnimatePresence mode="popLayout">
            {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 20px' }}
          >
            <div style={{ fontSize: 15, color: '#b09870' }}>No projects match the selected filters.</div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function FilterBtn({ active, onClick, children, small }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      style={{
        padding: small ? '6px 12px' : '8px 16px',
        borderRadius: 20, cursor: 'pointer',
        background: active ? 'linear-gradient(135deg, #7a5230, #b07850)' : 'rgba(110, 78, 42, 0.06)',
        border: active ? 'none' : '1px solid rgba(110, 78, 42, 0.16)',
        color: active ? '#f7f2ea' : '#9b7c5a',
        fontSize: small ? 12 : 13, fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        transition: 'background 0.2s, color 0.2s',
      }}
    >
      {children}
    </motion.button>
  )
}
