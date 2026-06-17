import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Edit2, Check, FolderOpen, Calendar, Tag, Building2, ExternalLink } from 'lucide-react'

const STORAGE_KEY = 'cpt_projects'

const CATEGORIES = ['Investor Deck', 'Pitch Book', 'Board Presentation', 'Sales Deck', 'Annual Report', 'Strategy Deck', 'Other']
const STATUSES = ['In Progress', 'Review', 'Delivered', 'Archived']

const STATUS_COLORS = {
  'In Progress': { bg: 'rgba(124,107,255,0.15)', border: 'rgba(124,107,255,0.35)', text: '#a89aff' },
  'Review':      { bg: 'rgba(255,184,107,0.15)', border: 'rgba(255,184,107,0.35)', text: '#ffca80' },
  'Delivered':   { bg: 'rgba(107,255,212,0.15)', border: 'rgba(107,255,212,0.35)', text: '#6bffd4' },
  'Archived':    { bg: 'rgba(100,100,120,0.15)', border: 'rgba(100,100,120,0.3)',  text: '#777799' },
}

const ACCENT_COLORS = ['#7c6bff', '#ff6b9d', '#6bffd4', '#ffb86b', '#6bc8ff', '#ff9e6b']

function useProjects() {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  }, [projects])

  const add = (p) => setProjects(prev => [{ ...p, id: Date.now() }, ...prev])
  const update = (id, changes) => setProjects(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p))
  const remove = (id) => setProjects(prev => prev.filter(p => p.id !== id))

  return { projects, add, update, remove }
}

const EMPTY_FORM = { title: '', client: '', category: 'Investor Deck', status: 'In Progress', date: '', notes: '', accent: '#7c6bff' }

function Modal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const isEdit = !!initial

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.client.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0e0e18',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, padding: 32,
          width: '100%', maxWidth: 520,
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: '#fff' }}>
            {isEdit ? 'Edit Project' : 'Add New Project'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Project Title *">
            <input
              value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Series B Raise Deck" required
              style={inputStyle}
            />
          </Field>

          <Field label="Client / Firm *">
            <input
              value={form.client} onChange={e => set('client', e.target.value)}
              placeholder="e.g. NovaPay" required
              style={inputStyle}
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Category">
              <select value={form.category} onChange={e => set('category', e.target.value)} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => set('status', e.target.value)} style={inputStyle}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Delivery Date">
            <input
              type="date" value={form.date} onChange={e => set('date', e.target.value)}
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </Field>

          <Field label="Notes">
            <textarea
              value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Key details, deliverables, results..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 76 }}
            />
          </Field>

          <Field label="Card Color">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ACCENT_COLORS.map(c => (
                <button
                  key={c} type="button"
                  onClick={() => set('accent', c)}
                  style={{
                    width: 28, height: 28, borderRadius: '50%', background: c,
                    border: form.accent === c ? `2px solid #fff` : '2px solid transparent',
                    cursor: 'pointer', transition: 'transform 0.15s',
                    transform: form.accent === c ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </Field>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '12px 0', borderRadius: 10, cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#999', fontSize: 14, fontWeight: 600,
            }}>
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{
                flex: 2, padding: '12px 0', borderRadius: 10, cursor: 'pointer',
                background: 'linear-gradient(135deg, #7c6bff, #ff6b9d)',
                border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Check size={15} /> {isEdit ? 'Save Changes' : 'Add Project'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6666aa', letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#e8e8f0', fontSize: 14, outline: 'none',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

function ProjectCard({ project, onEdit, onDelete }) {
  const [hov, setHov] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const sc = STATUS_COLORS[project.status] || STATUS_COLORS['Archived']

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => { setHov(false); setConfirmDel(false) }}
      style={{
        background: hov ? 'rgba(17,17,28,0.95)' : 'rgba(13,13,22,0.7)',
        border: `1px solid ${hov ? project.accent + '40' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 16, overflow: 'hidden',
        transition: 'background 0.3s, border 0.3s',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Accent top bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${project.accent}, ${project.accent}55)` }} />

      <div style={{ padding: '22px 22px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif', lineHeight: 1.3, marginBottom: 4 }}>
              {project.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#7777a0' }}>
              <Building2 size={12} />
              {project.client}
            </div>
          </div>

          {/* Action buttons */}
          <motion.div
            animate={{ opacity: hov ? 1 : 0 }}
            style={{ display: 'flex', gap: 4, flexShrink: 0 }}
          >
            <button
              onClick={() => onEdit(project)}
              style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 7, padding: '5px 7px', cursor: 'pointer', color: '#aaa',
              }}
            >
              <Edit2 size={13} />
            </button>
            {confirmDel ? (
              <button
                onClick={() => onDelete(project.id)}
                style={{
                  background: 'rgba(255,60,60,0.2)', border: '1px solid rgba(255,60,60,0.4)',
                  borderRadius: 7, padding: '5px 10px', cursor: 'pointer',
                  fontSize: 11, fontWeight: 700, color: '#ff6060',
                }}
              >
                Confirm
              </button>
            ) : (
              <button
                onClick={() => setConfirmDel(true)}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 7, padding: '5px 7px', cursor: 'pointer', color: '#aaa',
                }}
              >
                <X size={13} />
              </button>
            )}
          </motion.div>
        </div>

        {/* Tags row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: project.notes ? 14 : 0 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
            background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text,
          }}>
            {project.status}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#7777a0',
          }}>
            <Tag size={9} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            {project.category}
          </span>
          {project.date && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#7777a0', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Calendar size={9} />
              {new Date(project.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>

        {/* Notes */}
        {project.notes && (
          <p style={{
            fontSize: 13, color: '#5f5f80', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {project.notes}
          </p>
        )}
      </div>
    </motion.div>
  )
}

const FILTER_STATUSES = ['All', ...STATUSES]

export default function Projects() {
  const { projects, add, update, remove } = useProjects()
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [search, setSearch] = useState('')

  const openAdd = () => { setEditTarget(null); setShowModal(true) }
  const openEdit = (p) => { setEditTarget(p); setShowModal(true) }
  const handleSave = (form) => {
    if (editTarget) {
      update(editTarget.id, form)
    } else {
      add(form)
    }
  }

  const visible = projects.filter(p => {
    const matchStatus = filterStatus === 'All' || p.status === filterStatus
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: projects.filter(p => p.status === s).length }), {})

  return (
    <>
      <section id="projects" style={{ padding: '120px 0' }}>
        <div className="container">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 48 }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
              <div>
                <div style={{
                  display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 3,
                  textTransform: 'uppercase', color: '#7c6bff',
                  background: 'rgba(124,107,255,0.1)', border: '1px solid rgba(124,107,255,0.2)',
                  borderRadius: 100, padding: '5px 14px', marginBottom: 16,
                }}>
                  Project Board
                </div>
                <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Active Projects<br />
                  <span className="grad-text">& Deliveries.</span>
                </h2>
              </div>

              <motion.button
                onClick={openAdd}
                whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(124,107,255,0.4)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 24px', borderRadius: 10, cursor: 'pointer',
                  background: 'linear-gradient(135deg, #7c6bff, #ff6b9d)',
                  border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
                  boxShadow: '0 0 20px rgba(124,107,255,0.25)',
                }}
              >
                <Plus size={16} /> New Project
              </motion.button>
            </div>

            {/* Stats strip */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
              {STATUSES.map(s => {
                const sc = STATUS_COLORS[s]
                return (
                  <div key={s} style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '6px 14px', borderRadius: 20,
                    background: sc.bg, border: `1px solid ${sc.border}`,
                  }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: sc.text }}>{counts[s]}</span>
                    <span style={{ fontSize: 12, color: sc.text, opacity: 0.8 }}>{s}</span>
                  </div>
                )
              })}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '6px 14px', borderRadius: 20,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{projects.length}</span>
                <span style={{ fontSize: 12, color: '#777' }}>Total</span>
              </div>
            </div>

            {/* Search + filter */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title or client..."
                style={{
                  flex: 1, minWidth: 200, padding: '9px 16px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                  color: '#e8e8f0', fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif',
                }}
              />
              <div style={{ display: 'flex', gap: 6 }}>
                {FILTER_STATUSES.map(f => (
                  <motion.button
                    key={f}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setFilterStatus(f)}
                    style={{
                      padding: '8px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      background: filterStatus === f ? 'linear-gradient(135deg, #7c6bff, #ff6b9d)' : 'rgba(255,255,255,0.04)',
                      border: filterStatus === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      color: filterStatus === f ? '#fff' : '#7777a0',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                  >
                    {f}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Grid */}
          {visible.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{
                textAlign: 'center', padding: '80px 20px',
                border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 20,
              }}
            >
              <FolderOpen size={40} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: 16, fontWeight: 600, color: '#44445a', marginBottom: 8 }}>
                {search || filterStatus !== 'All' ? 'No projects match your filters' : 'No projects yet'}
              </div>
              <div style={{ fontSize: 13, color: '#33334a', marginBottom: 24 }}>
                {search || filterStatus !== 'All' ? 'Try adjusting your search or filter.' : 'Add your first project to get started.'}
              </div>
              {!search && filterStatus === 'All' && (
                <motion.button
                  onClick={openAdd}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '10px 24px', borderRadius: 10, cursor: 'pointer',
                    background: 'linear-gradient(135deg, #7c6bff, #ff6b9d)',
                    border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <Plus size={15} /> Add First Project
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div layout style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 16,
            }}>
              <AnimatePresence mode="popLayout">
                {visible.map(p => (
                  <ProjectCard key={p.id} project={p} onEdit={openEdit} onDelete={remove} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showModal && (
          <Modal
            initial={editTarget}
            onSave={handleSave}
            onClose={() => { setShowModal(false); setEditTarget(null) }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
