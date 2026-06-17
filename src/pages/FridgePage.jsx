import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, RefreshCw, X } from 'lucide-react'
import { analyzeFridgeInput } from '../services/fridgeAI'

// ── Visual constants ──────────────────────────────────────────────────────────
const CAT_R = 60
const ITEM_R = 26
const RECIPE_R = 33
const ITEM_ORBIT = 165
const RECIPE_ORBIT = 295

const SWEET_COL = '#f4a261'
const SWEET_REC_COL = '#e76f51'
const SAVORY_COL = '#52b788'
const SAVORY_REC_COL = '#2d9250'
const GRAPH_BG = '#0b0907'

// ── Layout engine ─────────────────────────────────────────────────────────────
function computeLayout(items, recipes, w, h) {
  const sweetX = w * 0.26
  const savoryX = w * 0.74
  const midY = h * 0.50

  const nodeMap = new Map()
  const edges = []

  nodeMap.set('cat-sweet', {
    id: 'cat-sweet', x: sweetX, y: midY,
    type: 'category', label: 'Sweet', emoji: '🍬', color: SWEET_COL,
  })
  nodeMap.set('cat-savory', {
    id: 'cat-savory', x: savoryX, y: midY,
    type: 'category', label: 'Savory', emoji: '🥗', color: SAVORY_COL,
  })

  function spread(list, cx, cy, aStart, aEnd, radius, type) {
    list.forEach((node, i) => {
      const angle = list.length === 1
        ? (aStart + aEnd) / 2
        : aStart + (aEnd - aStart) * i / (list.length - 1)
      const rad = (angle * Math.PI) / 180
      const color = type === 'item'
        ? (node.category === 'sweet' ? SWEET_COL : SAVORY_COL)
        : (node.category === 'sweet' ? SWEET_REC_COL : SAVORY_REC_COL)
      nodeMap.set(node.id, {
        ...node, type, color,
        x: cx + radius * Math.cos(rad),
        y: cy + radius * Math.sin(rad),
      })
      edges.push({ from: `cat-${node.category}`, to: node.id, category: node.category })
    })
  }

  const sweetItems = items.filter(n => n.category === 'sweet')
  const savoryItems = items.filter(n => n.category === 'savory')
  const sweetRecs = recipes.filter(n => n.category === 'sweet')
  const savoryRecs = recipes.filter(n => n.category === 'savory')

  // Sweet fans left (130°→230°), savory fans right (−50°→50°)
  spread(sweetItems, sweetX, midY, 130, 230, ITEM_ORBIT, 'item')
  spread(sweetRecs, sweetX, midY, 145, 215, RECIPE_ORBIT, 'recipe')
  spread(savoryItems, savoryX, midY, -50, 50, ITEM_ORBIT, 'item')
  spread(savoryRecs, savoryX, midY, -40, 40, RECIPE_ORBIT, 'recipe')

  return { nodeMap, edges }
}

// ── SVG sub-components ────────────────────────────────────────────────────────
function Edge({ x1, y1, x2, y2, category, lit }) {
  const col = category === 'sweet' ? SWEET_COL : SAVORY_COL
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={col}
      strokeWidth={lit ? 2 : 1}
      strokeOpacity={lit ? 0.85 : 0.28}
      style={{ transition: 'stroke-opacity 0.2s, stroke-width 0.2s' }}
    />
  )
}

function CategoryNode({ node, empty, hovId, onHov }) {
  const isHov = hovId === node.id
  return (
    <g
      style={{ cursor: 'default' }}
      onMouseEnter={() => onHov(node.id)}
      onMouseLeave={() => onHov(null)}
    >
      {/* Animated glow rings for empty state */}
      <motion.circle
        cx={node.x} cy={node.y} r={CAT_R + 22}
        fill={node.color}
        animate={empty ? { opacity: [0.04, 0.10, 0.04] } : { opacity: 0.06 }}
        transition={empty ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } : {}}
      />
      <circle cx={node.x} cy={node.y} r={CAT_R + 10} fill={node.color} opacity={0.08} />

      {/* Main circle */}
      <motion.circle
        cx={node.x} cy={node.y} r={CAT_R}
        fill={node.color}
        animate={{ opacity: isHov ? 1 : 0.93 }}
        style={{ filter: `drop-shadow(0 0 ${isHov ? 28 : 18}px ${node.color}bb)`, transition: 'filter 0.3s' }}
      />

      {/* Emoji */}
      <text x={node.x} y={node.y - 11} textAnchor="middle" dominantBaseline="middle" fontSize={26}>
        {node.emoji}
      </text>

      {/* Label */}
      <text
        x={node.x} y={node.y + 22}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={14} fontWeight={800}
        fontFamily="'Inter', sans-serif"
        fill="#0b0907"
        letterSpacing={1.5}
      >
        {node.label.toUpperCase()}
      </text>
    </g>
  )
}

function LeafNode({ node, selected, hovId, onHov, onSelect }) {
  const r = node.type === 'recipe' ? RECIPE_R : ITEM_R
  const isHov = hovId === node.id
  const isLit = isHov || selected

  const labelLine = truncate(node.name, 14)

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      style={{ cursor: 'pointer', transformOrigin: `${node.x}px ${node.y}px` }}
      onClick={() => onSelect(node)}
      onMouseEnter={() => onHov(node.id)}
      onMouseLeave={() => onHov(null)}
    >
      {/* Hover ring */}
      <circle
        cx={node.x} cy={node.y} r={r + 9}
        fill={node.color}
        opacity={isLit ? 0.14 : 0}
        style={{ transition: 'opacity 0.18s' }}
      />

      {/* Main circle */}
      <circle
        cx={node.x} cy={node.y} r={r}
        fill={isLit ? node.color : `${node.color}bb`}
        stroke={selected ? '#fff' : node.color}
        strokeWidth={selected ? 2.5 : 1}
        style={{
          filter: `drop-shadow(0 0 ${isLit ? 10 : 4}px ${node.color}99)`,
          transition: 'all 0.18s',
        }}
      />

      {/* Emoji / icon */}
      <text
        x={node.x} y={node.y}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={node.type === 'recipe' ? 17 : 13}
      >
        {node.type === 'recipe' ? '📖' : node.emoji}
      </text>

      {/* Name label below node */}
      <text
        x={node.x} y={node.y + r + 13}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={9.5} fontWeight={500}
        fontFamily="'Inter', sans-serif"
        fill="rgba(247,242,234,0.72)"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {labelLine}
      </text>
    </motion.g>
  )
}

function truncate(str, max) {
  return str.length <= max ? str : str.slice(0, max - 1) + '…'
}

// ── Graph canvas ──────────────────────────────────────────────────────────────
function FridgeGraph({ items, recipes, selected, onSelect }) {
  const containerRef = useRef(null)
  const [size, setSize] = useState({ w: 860, h: 520 })
  const [hovId, setHovId] = useState(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      setSize({ w, h: Math.max(460, Math.min(580, w * 0.58)) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { nodeMap, edges } = useMemo(
    () => computeLayout(items, recipes, size.w, size.h),
    [items, recipes, size.w, size.h]
  )

  const empty = items.length === 0 && recipes.length === 0

  // Lit edges when hovering a node
  const litEdgeKeys = useMemo(() => {
    if (!hovId) return new Set()
    const s = new Set()
    edges.forEach(e => { if (e.from === hovId || e.to === hovId) s.add(`${e.from}|${e.to}`) })
    return s
  }, [hovId, edges])

  const catSweet = nodeMap.get('cat-sweet')
  const catSavory = nodeMap.get('cat-savory')
  const leaves = [...nodeMap.values()].filter(n => n.type === 'item' || n.type === 'recipe')

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%', borderRadius: 18, overflow: 'hidden',
        background: GRAPH_BG,
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 10px 48px rgba(0,0,0,0.38)',
      }}
    >
      <svg width={size.w} height={size.h} style={{ display: 'block' }}>
        <defs>
          <pattern id="fdots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="1" fill="rgba(255,255,255,0.045)" />
          </pattern>
        </defs>

        <rect width={size.w} height={size.h} fill={GRAPH_BG} />
        <rect width={size.w} height={size.h} fill="url(#fdots)" />

        {/* Edges */}
        {edges.map(e => {
          const from = nodeMap.get(e.from)
          const to = nodeMap.get(e.to)
          if (!from || !to) return null
          const key = `${e.from}|${e.to}`
          return (
            <Edge
              key={key}
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              category={e.category}
              lit={litEdgeKeys.has(key)}
            />
          )
        })}

        {/* Category nodes (rendered last so they sit on top of edges) */}
        {catSweet && (
          <CategoryNode node={catSweet} empty={empty} hovId={hovId} onHov={setHovId} />
        )}
        {catSavory && (
          <CategoryNode node={catSavory} empty={empty} hovId={hovId} onHov={setHovId} />
        )}

        {/* Leaf nodes (items + recipes) */}
        <AnimatePresence>
          {leaves.map(n => (
            <LeafNode
              key={n.id}
              node={n}
              selected={selected?.id === n.id}
              hovId={hovId}
              onHov={setHovId}
              onSelect={onSelect}
            />
          ))}
        </AnimatePresence>

        {/* Empty state hint */}
        {empty && (
          <text
            x={size.w / 2} y={size.h - 36}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={12} fill="rgba(247,242,234,0.2)"
            fontFamily="'Inter', sans-serif"
          >
            Describe your fridge below to populate the map
          </text>
        )}
      </svg>
    </div>
  )
}

// ── Info panel for selected node ──────────────────────────────────────────────
function InfoPanel({ node, onClose }) {
  if (!node || node.type === 'category') return null

  const accent = node.color

  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: '18px 22px',
        border: '1px solid rgba(110,78,42,0.12)',
        boxShadow: '0 4px 28px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        position: 'relative',
      }}
    >
      <div style={{ fontSize: 38, lineHeight: 1, marginTop: 2 }}>
        {node.type === 'recipe' ? '📖' : node.emoji}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: accent,
          textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 5,
          fontFamily: "'Inter', sans-serif",
        }}>
          {node.type === 'recipe' ? 'Recipe' : 'Ingredient'} · {node.category}
        </div>

        <div style={{
          fontSize: 18, fontWeight: 700, color: '#2a1a0a', marginBottom: 6,
          fontFamily: "'Playfair Display', Georgia, serif",
        }}>
          {node.name}
        </div>

        {node.description && (
          <div style={{ fontSize: 13, color: '#9b7c5a', lineHeight: 1.55, marginBottom: 8 }}>
            {node.description}
          </div>
        )}

        {node.usesItems?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {node.usesItems.map(item => (
              <span
                key={item}
                style={{
                  fontSize: 11, padding: '3px 9px', borderRadius: 6,
                  background: 'rgba(122,82,48,0.07)',
                  color: '#7a5230', fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#9b7c5a', padding: 4, marginTop: -2, flexShrink: 0,
        }}
      >
        <X size={15} />
      </button>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FridgePage() {
  const [items, setItems] = useState([])
  const [recipes, setRecipes] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  // Persist fridge state
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cpt_fridge_v1') ?? 'null')
      if (saved?.items) setItems(saved.items)
      if (saved?.recipes) setRecipes(saved.recipes)
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('cpt_fridge_v1', JSON.stringify({ items, recipes }))
  }, [items, recipes])

  async function handleAnalyze() {
    if (!input.trim() || loading) return
    setLoading(true)
    setError(null)
    try {
      const result = await analyzeFridgeInput(input.trim(), items)
      const ts = Date.now()
      const newItems = (result.newItems ?? []).map((item, i) => ({
        ...item, id: `item-${ts}-${i}`,
      }))
      const newRecipes = (result.recipes ?? []).map((r, i) => ({
        ...r, id: `recipe-${ts}-${i}`,
      }))
      setItems(prev => [...prev, ...newItems])
      setRecipes(newRecipes)
      setInput('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function clearFridge() {
    setItems([])
    setRecipes([])
    setSelected(null)
  }

  const totalCount = `${items.length} item${items.length !== 1 ? 's' : ''} · ${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} suggested`

  return (
    <section style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 28 }}
        >
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#7a5230',
            letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 14,
            padding: '4px 10px', borderRadius: 6,
            background: 'rgba(122,82,48,0.08)',
            fontFamily: "'Inter', sans-serif",
          }}>
            Beta
          </div>
          <h1 style={{
            fontSize: 'clamp(30px, 4.5vw, 52px)',
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#2a1a0a', marginBottom: 10, lineHeight: 1.15,
          }}>
            What's in your fridge?
          </h1>
          <p style={{ fontSize: 15, color: '#9b7c5a', maxWidth: 460, lineHeight: 1.65, fontFamily: "'Inter', sans-serif" }}>
            Describe your ingredients and the AI will map them into a live graph — split by sweet and savory — then suggest recipes.
          </p>
        </motion.div>

        {/* Graph */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 14 }}
        >
          <FridgeGraph
            items={items}
            recipes={recipes}
            selected={selected}
            onSelect={node => setSelected(prev => prev?.id === node.id ? null : node)}
          />
        </motion.div>

        {/* Selected node info */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div key={selected.id} style={{ marginBottom: 14 }}>
              <InfoPanel node={selected} onClose={() => setSelected(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                marginBottom: 14, padding: '12px 16px',
                background: '#fff0ee', border: '1px solid rgba(231,111,81,0.3)',
                borderRadius: 10, fontSize: 13, color: '#c0392b',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            background: '#fff', borderRadius: 16, padding: '18px 20px',
            border: '1px solid rgba(110,78,42,0.12)',
            boxShadow: '0 4px 28px rgba(0,0,0,0.06)',
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAnalyze() }}
              placeholder="What's in your fridge? E.g. 'I have eggs, milk, chicken, some apples, and dark chocolate…'"
              disabled={loading}
              rows={3}
              style={{
                width: '100%', padding: '13px 15px', borderRadius: 10,
                border: '1.5px solid rgba(110,78,42,0.15)',
                fontFamily: "'Inter', sans-serif", fontSize: 14,
                color: '#2a1a0a', background: loading ? '#f9f6f1' : '#fff',
                resize: 'none', outline: 'none', lineHeight: 1.65,
                boxSizing: 'border-box', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#7a5230')}
              onBlur={e => (e.target.style.borderColor = 'rgba(110,78,42,0.15)')}
            />

            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginTop: 12, gap: 10,
              flexWrap: 'wrap',
            }}>
              <div style={{ fontSize: 11, color: '#b09070', fontFamily: "'Inter', sans-serif" }}>
                {items.length > 0 ? totalCount : 'Cmd+Enter to submit'}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {items.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={clearFridge}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '9px 15px', borderRadius: 9,
                      border: '1.5px solid rgba(110,78,42,0.18)',
                      background: 'transparent', cursor: 'pointer',
                      fontSize: 13, fontWeight: 500, color: '#9b7c5a',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <Trash2 size={13} /> Clear
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: loading || !input.trim() ? 1 : 1.04 }}
                  whileTap={{ scale: loading || !input.trim() ? 1 : 0.96 }}
                  onClick={handleAnalyze}
                  disabled={loading || !input.trim()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '9px 20px', borderRadius: 9, border: 'none',
                    background: loading || !input.trim()
                      ? 'rgba(122,82,48,0.25)'
                      : 'linear-gradient(135deg, #7a5230 0%, #b07850 100%)',
                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                    fontSize: 13, fontWeight: 700, color: '#f7f2ea',
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: loading || !input.trim() ? 'none' : '0 2px 14px rgba(122,82,48,0.22)',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                >
                  {loading
                    ? <><RefreshCw size={13} style={{ animation: 'fridge-spin 0.9s linear infinite' }} /> Analyzing…</>
                    : '+ Add to Fridge'
                  }
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`@keyframes fridge-spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}
