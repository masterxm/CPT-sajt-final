import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, ExternalLink, AlertCircle, Heart, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'

// ── Sources (colors only — data comes from Supabase) ─────────────────────
const SOURCES = [
  { id: 'n1',       name: 'N1 Info',  color: '#7a5230' },
  { id: 'blic',     name: 'Blic',     color: '#9b5030' },
  { id: 'telegraf', name: 'Telegraf', color: '#5a7a5a' },
  { id: 'novosti',  name: 'Novosti',  color: '#4a6a8a' },
  { id: 'kurir',    name: 'Kurir',    color: '#8a5a30' },
  { id: 'rts',      name: 'RTS',      color: '#306a4a' },
  { id: 'b92',      name: 'B92',      color: '#6a3a7a' },
  { id: 'naslovi',  name: 'Naslovi',  color: '#7a4a6a' },
]
const COLOR_MAP = Object.fromEntries(SOURCES.map(s => [s.id, s.color]))

function rowToArticle(row) {
  return {
    id:          row.link,
    dbId:        row.id,
    title:       row.title,
    desc:        row.description || '',
    link:        row.link,
    date:        new Date(row.published_at),
    source:      row.source_name,
    sourceId:    row.source_id,
    sourceColor: COLOR_MAP[row.source_id] || '#888888',
    isAI:        row.is_ai,
    isIT:        row.is_it,
    hearted:     row.hearted || false,
  }
}

// ── Utilities ─────────────────────────────────────────────────────────────
function timeAgo(date) {
  if (!date || date.getTime() === 0) return ''
  const mins = Math.floor((Date.now() - date.getTime()) / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// ── Sub-components ────────────────────────────────────────────────────────
function SourceChip({ source, enabled, onToggle }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onToggle}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', borderRadius: 20, cursor: 'pointer', border: 'none',
        background: enabled ? `${source.color}18` : 'rgba(110, 78, 42, 0.04)',
        outline: enabled ? `1.5px solid ${source.color}50` : '1px solid rgba(110, 78, 42, 0.14)',
        color: enabled ? source.color : '#b09870',
        fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
        transition: 'all 0.2s',
      }}
    >
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: enabled ? source.color : 'rgba(110,78,42,0.25)',
        display: 'inline-block',
      }} />
      {source.name}
    </motion.button>
  )
}

function FilterGroup({ label, children }) {
  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
        color: '#b09870', fontFamily: "'Inter', sans-serif", marginBottom: 10,
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {children}
      </div>
    </div>
  )
}

function ArticleCard({ article, onHeart }) {
  const ago = timeAgo(article.date)
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: article.hearted ? 'rgba(220, 210, 195, 0.9)' : 'rgba(235, 226, 212, 0.75)',
        border: article.hearted ? '1px solid rgba(180, 80, 60, 0.22)' : '1px solid rgba(110, 78, 42, 0.14)',
        borderRadius: 14,
        padding: '20px 22px',
        display: 'flex', flexDirection: 'column', gap: 10,
        transition: 'background 0.25s, border 0.25s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
          background: `${article.sourceColor}15`,
          outline: `1px solid ${article.sourceColor}35`,
          color: article.sourceColor,
          fontFamily: "'Inter', sans-serif",
        }}>
          {article.source}
        </span>
        {article.isAI && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
            background: 'rgba(90, 122, 90, 0.12)',
            outline: '1px solid rgba(90, 122, 90, 0.28)',
            color: '#5a7a5a',
            fontFamily: "'Inter', sans-serif",
          }}>
            AI / ML
          </span>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {ago && (
            <span style={{ fontSize: 11, color: '#b09870', fontFamily: "'Inter', sans-serif" }}>
              {ago}
            </span>
          )}
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={() => onHeart(article)}
            title={article.hearted ? 'Remove from saved' : 'Save article'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 2,
              display: 'flex', alignItems: 'center', lineHeight: 1,
            }}
          >
            <Heart
              size={15}
              fill={article.hearted ? '#c0524a' : 'none'}
              color={article.hearted ? '#c0524a' : '#c0a880'}
              style={{ transition: 'fill 0.2s, color 0.2s' }}
            />
          </motion.button>
        </div>
      </div>

      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 16, fontWeight: 700, color: '#2a1a0a', lineHeight: 1.4,
      }}>
        {article.link ? (
          <a href={article.link} target="_blank" rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#7a5230'}
            onMouseLeave={e => e.currentTarget.style.color = '#2a1a0a'}
          >
            {article.title}
          </a>
        ) : article.title}
      </div>

      {article.desc && (
        <p style={{ fontSize: 13, color: '#9b7c5a', lineHeight: 1.65, fontFamily: "'Inter', sans-serif" }}>
          {article.desc}{article.desc.length >= 240 ? '…' : ''}
        </p>
      )}

      {article.link && (
        <a
          href={article.link} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 2,
            fontSize: 12, fontWeight: 600, color: '#7a5230',
            fontFamily: "'Inter', sans-serif", textDecoration: 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Read article <ExternalLink size={11} />
        </a>
      )}
    </motion.article>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function NewsFilterPage() {
  const [articles, setArticles]     = useState([])
  const [isLoading, setIsLoading]   = useState(false)
  const [isSeeding, setIsSeeding]   = useState(false)
  const [loadError, setLoadError]   = useState(false)
  const [enabled, setEnabled]       = useState(new Set(SOURCES.map(s => s.id)))
  const [filterMode, setFilterMode] = useState('ai')
  const [sortMode, setSortMode]     = useState('newest')
  const [refreshKey, setRefreshKey] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const toggleHeart = async (article) => {
    const newVal = !article.hearted
    setArticles(prev => prev.map(a => a.id === article.id ? { ...a, hearted: newVal } : a))
    await supabase.rpc('toggle_heart', { article_link: article.link, heart_val: newVal })
  }

  useEffect(() => {
    setArticles([])
    setIsLoading(true)
    setIsSeeding(false)
    setLoadError(false)

    async function load() {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

      const query = () => supabase
        .from('articles')
        .select('id, source_id, source_name, title, description, link, published_at, is_ai, is_it, hearted')
        .or(`published_at.gte.${thirtyDaysAgo},hearted.eq.true`)
        .order('published_at', { ascending: false })
        .limit(1000)

      let { data, error } = await query()
      if (error) throw error

      if (data.length === 0) {
        setIsLoading(false)
        setIsSeeding(true)
        try {
          await fetch('/.netlify/functions/rss-collector')
        } catch {
          // seeding call failed — continue and show empty state
        } finally {
          setIsSeeding(false)
          setIsLoading(true)
        }
        ;({ data, error } = await query())
        if (error) throw error
      }

      setArticles((data || []).map(rowToArticle))
    }

    load()
      .catch(() => setLoadError(true))
      .finally(() => setIsLoading(false))
  }, [refreshKey])

  const displayed = useMemo(() => {
    const list = filterMode === 'hearted'
      ? articles.filter(a => a.hearted)
      : articles
          .filter(a => enabled.has(a.sourceId))
          .filter(a => filterMode === 'all' || (filterMode === 'ai' ? a.isAI : a.isIT))

    if (sortMode === 'saved') {
      return [...list].sort((a, b) =>
        (b.hearted - a.hearted) || (b.date.getTime() - a.date.getTime())
      )
    }
    return list
  }, [articles, enabled, filterMode, sortMode])

  const totalEnabled  = articles.filter(a => enabled.has(a.sourceId)).length
  const aiCount       = articles.filter(a => enabled.has(a.sourceId) && a.isAI).length
  const itCount       = articles.filter(a => enabled.has(a.sourceId) && a.isIT).length
  const heartedCount  = articles.filter(a => a.hearted).length

  const toggleSource = id => {
    setEnabled(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <section style={{ padding: '100px 0 120px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 960 }}>

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          style={{ marginBottom: 36 }}>

          {/* Filters toggle + refresh */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => setFiltersOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 16px', borderRadius: 20, cursor: 'pointer',
                background: filtersOpen ? 'linear-gradient(135deg, #7a5230, #b07850)' : 'rgba(110,78,42,0.05)',
                border: filtersOpen ? 'none' : '1px solid rgba(110,78,42,0.14)',
                color: filtersOpen ? '#f7f2ea' : '#9b7c5a',
                fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
              }}
            >
              <SlidersHorizontal size={13} />
              Filters
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setRefreshKey(k => k + 1)}
              style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 16px', borderRadius: 20, cursor: 'pointer',
                background: 'rgba(110,78,42,0.05)', border: '1px solid rgba(110,78,42,0.14)',
                color: '#9b7c5a', fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
              }}
            >
              <motion.span animate={isLoading || isSeeding ? { rotate: 360 } : { rotate: 0 }}
                transition={isLoading || isSeeding ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}>
                <RefreshCw size={13} />
              </motion.span>
              Refresh
            </motion.button>
          </div>

          {/* Collapsible filters panel */}
          <AnimatePresence initial={false}>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 20 }}>
                  <FilterGroup label="Sources">
                    {SOURCES.map(s => (
                      <SourceChip
                        key={s.id}
                        source={s}
                        enabled={enabled.has(s.id)}
                        onToggle={() => toggleSource(s.id)}
                      />
                    ))}
                  </FilterGroup>

                  <FilterGroup label="Filter">
                    {[
                        { mode: 'ai',      label: 'AI / ML only' },
                        { mode: 'it',      label: 'IT only' },
                        { mode: 'all',     label: 'All articles' },
                        { mode: 'hearted', label: '♥ Saved', count: heartedCount },
                      ].map(({ mode, label, count }) => (
                        <motion.button key={mode} whileTap={{ scale: 0.93 }} onClick={() => setFilterMode(mode)}
                          style={{
                            padding: '7px 16px', borderRadius: 20, cursor: 'pointer',
                            background: filterMode === mode
                              ? (mode === 'hearted' ? 'linear-gradient(135deg, #c0524a, #e07060)' : 'linear-gradient(135deg, #7a5230, #b07850)')
                              : 'rgba(110,78,42,0.05)',
                            border: filterMode === mode ? 'none' : '1px solid rgba(110,78,42,0.14)',
                            color: filterMode === mode ? '#f7f2ea' : (mode === 'hearted' ? '#c0524a' : '#9b7c5a'),
                            fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                          }}>
                          {label}{count > 0 && mode === 'hearted' ? ` ${count}` : ''}
                        </motion.button>
                      ))}
                  </FilterGroup>

                  <FilterGroup label="Sort">
                    {[
                        { mode: 'newest', label: 'Newest first' },
                        { mode: 'saved',  label: '♥ Saved first' },
                      ].map(({ mode, label }) => (
                        <motion.button key={mode} whileTap={{ scale: 0.93 }} onClick={() => setSortMode(mode)}
                          style={{
                            padding: '7px 16px', borderRadius: 20, cursor: 'pointer',
                            background: sortMode === mode ? 'linear-gradient(135deg, #7a5230, #b07850)' : 'rgba(110,78,42,0.05)',
                            border: sortMode === mode ? 'none' : '1px solid rgba(110,78,42,0.14)',
                            color: sortMode === mode ? '#f7f2ea' : '#9b7c5a',
                            fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                          }}>
                          {label}
                        </motion.button>
                      ))}
                  </FilterGroup>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28,
          fontSize: 13, color: '#b09870', fontFamily: "'Inter', sans-serif",
        }}>
          <span>
            {filterMode === 'ai'      && <><strong style={{ color: '#7a5230' }}>{aiCount}</strong> AI/ML articles</>}
            {filterMode === 'it'      && <><strong style={{ color: '#7a5230' }}>{itCount}</strong> IT articles</>}
            {filterMode === 'all'     && <><strong style={{ color: '#2a1a0a' }}>{totalEnabled}</strong> total articles</>}
            {filterMode === 'hearted' && <><strong style={{ color: '#c0524a' }}>{heartedCount}</strong> saved articles</>}
          </span>
          {isSeeding && <span style={{ color: '#9b7c5a', fontStyle: 'italic' }}>First run — collecting articles, this may take a moment…</span>}
          {isLoading && !isSeeding && <span style={{ color: '#9b7c5a', fontStyle: 'italic' }}>Loading…</span>}
          {loadError && (
            <span style={{ color: '#b07850', display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertCircle size={12} /> Failed to load articles
            </span>
          )}
        </div>

        {/* Article grid */}
        <motion.div layout style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          <AnimatePresence mode="popLayout">
            {displayed.map(a => <ArticleCard key={a.id} article={a} onHeart={toggleHeart} />)}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {!isLoading && !loadError && displayed.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 20px', color: '#b09870', fontFamily: "'Inter', sans-serif" }}>
            {filterMode === 'ai'
              ? 'No AI/ML articles found in the last 30 days — try switching to all articles.'
              : 'No articles found. Try enabling more sources.'}
          </motion.div>
        )}

        {/* Loading skeleton */}
        {isLoading && displayed.length === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                background: 'rgba(235,226,212,0.5)', border: '1px solid rgba(110,78,42,0.1)',
                borderRadius: 14, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div style={{ height: 10, borderRadius: 5, background: 'rgba(110,78,42,0.08)', width: '40%' }} />
                <div style={{ height: 14, borderRadius: 5, background: 'rgba(110,78,42,0.08)', width: '90%' }} />
                <div style={{ height: 14, borderRadius: 5, background: 'rgba(110,78,42,0.06)', width: '70%' }} />
                <div style={{ height: 10, borderRadius: 5, background: 'rgba(110,78,42,0.06)', width: '55%' }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
