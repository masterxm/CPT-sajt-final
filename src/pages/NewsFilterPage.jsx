import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RefreshCw, ExternalLink, Rss, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

// ── Sources ───────────────────────────────────────────────────────────────
// To add/change a source: update this array and add its proxy in vite.config.js
const SOURCES = [
  { id: 'n1',       name: 'N1 Info',  path: '/news/n1/feed/',      color: '#7a5230' },
  { id: 'blic',     name: 'Blic',     path: '/news/blic/rss/IT',   color: '#9b5030' },
  { id: 'telegraf', name: 'Telegraf', path: '/news/telegraf/rss',  color: '#5a7a5a' },
  { id: 'novosti',  name: 'Novosti',  path: '/news/novosti/rss/vesti', color: '#4a6a8a' },
  { id: 'kurir',    name: 'Kurir',    path: '/news/kurir/rss',     color: '#8a5a30' },
  { id: 'rts',     name: 'RTS',     path: '/news/rts/page/stories/sr/story/11/Srbija-danas/rss.html', color: '#306a4a' },
  { id: 'b92',     name: 'B92',     path: '/news/b92/rss/b92/info',     color: '#6a3a7a' },
  { id: 'naslovi', name: 'Naslovi', path: '/news/naslovi/rss/',          color: '#7a4a6a' },
]

// ── AI/ML keyword matching ────────────────────────────────────────────────
const AI_KEYWORDS = [
  // Serbian terms
  'veštačka inteligencija',
  'veštačke inteligencije',
  'vestacka inteligencija',
  'vestacke inteligencije',
  'mašinsko učenje',
  'masinsko ucenje',
  'neuronska mreža',
  'neuronske mreže',
  'neuronska mreza',
  'neuronske mreze',
  'duboko učenje',
  'duboko ucenje',
  'generativna veštačka',
  'generativna vestacka',
  // English brands/models (specific enough to not false-positive)
  'chatgpt',
  'openai',
  'deepmind',
  'anthropic',
  'midjourney',
  'stable diffusion',
  'dall-e',
  'dall·e',
  // General English terms used in Serbian tech journalism
  'artificial intelligence',
  'machine learning',
  'deep learning',
  'neural network',
  'large language model',
  'generative ai',
  'chatbot',
  'AI'
]

// Short terms matched as whole words via regex
const AI_WORD_PATTERNS = [/\bai\b/i, /\bgpt[\s-]?\d/i, /\bllm\b/i, /\bgemini\b/i, /\bgrok\b/i]

// ── IT keyword matching ───────────────────────────────────────────────────
const IT_KEYWORDS = [
  // Serbian terms
  'tehnologija', 'tehnologij', 'informatika', 'informacione tehnologije',
  'sajber', 'cyber', 'digitalizacija', 'digitalna transformacija',
  'softver', 'hardver', 'programiranje', 'programer', 'developer',
  'aplikacija', 'mobilna aplikacija', 'pametni telefon',
  'kriptovaluta', 'blockchain', 'bitcoin', 'ethereum',
  'hakerski', 'hakovani', 'hakovan', 'ransomware', 'malware', 'phishing',
  'start-up', 'startup', 'tech kompanija',
  'virtuelna realnost', 'proširena realnost', 'metaverse',
  'oblak', 'cloud computing', 'server', 'datacenter',
  'e-commerce', 'onlajn kupovina', 'online kupovina',
  'društvene mreže', 'drustvene mreze',
  // Tech brands prominent in Serbian press
  'apple', 'google', 'microsoft', 'meta', 'amazon', 'samsung',
  'huawei', 'nvidia', 'intel', 'qualcomm', 'spacex',
  'facebook', 'instagram', 'tiktok', 'youtube', 'whatsapp',
  // General English IT terms used in Serbian journalism
  'software', 'hardware', 'smartphone', 'laptop', 'tablet',
  'cybersecurity', 'hacker', 'data breach', 'privacy',
  'artificial intelligence', 'machine learning',
  'cloud', 'app store', 'gaming', 'esport',
  '5g', 'wi-fi', 'broadband', 'fiber',
]

const IT_WORD_PATTERNS = [
  /\bit\b/i, /\bpc\b/i, /\bvr\b/i, /\bar\b/i,
  /\biphone\b/i, /\bandroid\b/i, /\bwindows\b/i, /\blinux\b/i, /\bmacos\b/i,
  /\bios\s*\d/i, /\bapi\b/i, /\bsaas\b/i, /\biot\b/i,
]

function matchesIT(title, desc) {
  const raw = `${title} ${desc}`
  const lower = raw.toLowerCase()
  const norm = normalize(lower)
  if (IT_KEYWORDS.some(kw => lower.includes(kw) || norm.includes(normalize(kw)))) return true
  return IT_WORD_PATTERNS.some(re => re.test(raw))
}

function normalize(str) {
  return str
    .replace(/š/g, 's').replace(/Š/g, 'S')
    .replace(/č/g, 'c').replace(/Č/g, 'C')
    .replace(/ć/g, 'c').replace(/Ć/g, 'C')
    .replace(/ž/g, 'z').replace(/Ž/g, 'Z')
    .replace(/đ/g, 'dj').replace(/Đ/g, 'Dj')
}

function matchesAI(title, desc) {
  const raw = `${title} ${desc}`
  const lower = raw.toLowerCase()
  const norm = normalize(lower)
  if (AI_KEYWORDS.some(kw => lower.includes(kw) || norm.includes(normalize(kw)))) return true
  return AI_WORD_PATTERNS.some(re => re.test(raw))
}

// ── RSS parsing ───────────────────────────────────────────────────────────
function getText(node, tag) {
  return node.getElementsByTagName(tag)[0]?.textContent?.trim() || ''
}

function parseRSS(xmlString, source) {
  const xml = new DOMParser().parseFromString(xmlString, 'text/xml')
  if (xml.querySelector('parsererror')) throw new Error('Invalid XML')

  // Support both RSS 2.0 (<item>) and Atom (<entry>)
  const items = [
    ...Array.from(xml.getElementsByTagName('item')),
    ...Array.from(xml.getElementsByTagName('entry')),
  ]

  return items.map(item => {
    const title = getText(item, 'title').replace(/<!\[CDATA\[|\]\]>/g, '').trim()

    const rawDesc = getText(item, 'description') || getText(item, 'summary') || getText(item, 'content')
    const desc = rawDesc.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim().slice(0, 240)

    // <link> can be text content (RSS) or an href attribute (Atom)
    const linkEl = item.getElementsByTagName('link')[0]
    const link =
      linkEl?.getAttribute('href') ||
      linkEl?.textContent?.trim() ||
      getText(item, 'guid') || ''

    const rawDate = getText(item, 'pubDate') || getText(item, 'updated') || getText(item, 'published')
    const date = rawDate ? new Date(rawDate) : new Date(0)

    return {
      id: link || title,
      title,
      desc,
      link,
      date,
      source: source.name,
      sourceId: source.id,
      sourceColor: source.color,
      isAI: matchesAI(title, desc),
      isIT: matchesIT(title, desc),
    }
  }).filter(a => a.title)
}

async function fetchSource(source) {
  const res = await fetch(source.path)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const text = await res.text()
  return parseRSS(text, source)
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
function SourceChip({ source, enabled, onToggle, status }) {
  const isLoading = status === 'loading'
  const isError   = status === 'error'
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onToggle}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', borderRadius: 20, cursor: 'pointer', border: 'none',
        background: enabled
          ? `${source.color}18`
          : 'rgba(110, 78, 42, 0.04)',
        outline: enabled
          ? `1.5px solid ${source.color}50`
          : '1px solid rgba(110, 78, 42, 0.14)',
        color: enabled ? source.color : '#b09870',
        fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
        transition: 'all 0.2s', opacity: isError ? 0.5 : 1,
      }}
    >
      {isLoading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
            border: `1.5px solid ${source.color}`, borderTopColor: 'transparent' }}
        />
      ) : isError ? (
        <AlertCircle size={10} />
      ) : (
        <span style={{ width: 7, height: 7, borderRadius: '50%',
          background: enabled ? source.color : 'rgba(110,78,42,0.25)', display: 'inline-block' }} />
      )}
      {source.name}
    </motion.button>
  )
}

function ArticleCard({ article }) {
  const ago = timeAgo(article.date)
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(235, 226, 212, 0.75)',
        border: '1px solid rgba(110, 78, 42, 0.14)',
        borderRadius: 14,
        padding: '20px 22px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}
    >
      {/* Source + AI badge + date */}
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
        {ago && (
          <span style={{ fontSize: 11, color: '#b09870', marginLeft: 'auto', fontFamily: "'Inter', sans-serif" }}>
            {ago}
          </span>
        )}
      </div>

      {/* Title */}
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

      {/* Description */}
      {article.desc && (
        <p style={{ fontSize: 13, color: '#9b7c5a', lineHeight: 1.65, fontFamily: "'Inter', sans-serif" }}>
          {article.desc}{article.desc.length >= 240 ? '…' : ''}
        </p>
      )}

      {/* Read link */}
      {article.link && (
        <a
          href={article.link} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 2,
            fontSize: 12, fontWeight: 600, color: '#7a5230',
            fontFamily: "'Inter', sans-serif",
            textDecoration: 'none',
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
  const [articles, setArticles]       = useState([])
  const [sourceStates, setSourceStates] = useState(
    Object.fromEntries(SOURCES.map(s => [s.id, 'idle']))
  )
  const [enabled, setEnabled] = useState(new Set(SOURCES.map(s => s.id)))
  const [filterMode, setFilterMode]   = useState('ai')
  const [refreshKey, setRefreshKey]   = useState(0)

  useEffect(() => {
    setArticles([])
    setSourceStates(Object.fromEntries(SOURCES.map(s => [s.id, 'loading'])))

    SOURCES.forEach(source => {
      fetchSource(source)
        .then(items => {
          setArticles(prev => [...prev.filter(a => a.sourceId !== source.id), ...items])
          setSourceStates(prev => ({ ...prev, [source.id]: 'success' }))
        })
        .catch(() => {
          setSourceStates(prev => ({ ...prev, [source.id]: 'error' }))
        })
    })
  }, [refreshKey])

  const displayed = useMemo(() => {
    return articles
      .filter(a => enabled.has(a.sourceId))
      .filter(a => filterMode === 'all' || (filterMode === 'ai' ? a.isAI : a.isIT))
      .sort((a, b) => b.date - a.date)
  }, [articles, enabled, filterMode])

  const totalEnabled  = articles.filter(a => enabled.has(a.sourceId)).length
  const aiCount       = articles.filter(a => enabled.has(a.sourceId) && a.isAI).length
  const itCount       = articles.filter(a => enabled.has(a.sourceId) && a.isIT).length
  const isLoading     = Object.values(sourceStates).some(s => s === 'loading')

  const toggleSource = (id) => {
    setEnabled(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <section style={{ padding: '100px 0 120px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 960 }}>

        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}
          style={{ marginBottom: 40 }}>
          <Link to="/projects" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontSize: 13, fontWeight: 600, color: '#9b7c5a', fontFamily: "'Inter', sans-serif",
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#2a1a0a'}
            onMouseLeave={e => e.currentTarget.style.color = '#9b7c5a'}
          >
            <ArrowLeft size={14} /> All Projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(122, 82, 48, 0.08)', border: '1px solid rgba(122, 82, 48, 0.2)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 18,
          }}>
            <Rss size={12} color="#7a5230" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#7a5230', fontFamily: "'Inter', sans-serif", letterSpacing: 0.4 }}>
              Live RSS Aggregator
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#2a1a0a', marginBottom: 12 }}>
            Serbian AI &amp; ML News
          </h1>
          <p style={{ fontSize: 15, color: '#9b7c5a', lineHeight: 1.7, maxWidth: 540, fontFamily: "'Inter', sans-serif" }}>
            Aggregates multiple Serbian news sources in real time and surfaces only the articles covering artificial intelligence and machine learning.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 32 }}>

          {/* Source toggles */}
          {SOURCES.map(s => (
            <SourceChip
              key={s.id}
              source={s}
              enabled={enabled.has(s.id)}
              onToggle={() => toggleSource(s.id)}
              status={sourceStates[s.id]}
            />
          ))}

          <div style={{ width: 1, height: 22, background: 'rgba(110,78,42,0.15)', margin: '0 4px' }} />

          {/* Filter mode */}
          {[
            { mode: 'ai',  label: 'AI / ML only' },
            { mode: 'it',  label: 'IT only' },
            { mode: 'all', label: 'All articles' },
          ].map(({ mode, label }) => (
            <motion.button key={mode} whileTap={{ scale: 0.93 }} onClick={() => setFilterMode(mode)}
              style={{
                padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                background: filterMode === mode ? 'linear-gradient(135deg, #7a5230, #b07850)' : 'rgba(110,78,42,0.05)',
                border: filterMode === mode ? 'none' : '1px solid rgba(110,78,42,0.14)',
                color: filterMode === mode ? '#f7f2ea' : '#9b7c5a',
                fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
              }}>
              {label}
            </motion.button>
          ))}

          {/* Refresh */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setRefreshKey(k => k + 1)}
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
              background: 'rgba(110,78,42,0.05)', border: '1px solid rgba(110,78,42,0.14)',
              color: '#9b7c5a', fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
            }}
          >
            <motion.span animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
              transition={isLoading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}>
              <RefreshCw size={13} />
            </motion.span>
            Refresh
          </motion.button>
        </motion.div>

        {/* Stats bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28,
          fontSize: 13, color: '#b09870', fontFamily: "'Inter', sans-serif",
        }}>
          <span>
            {filterMode === 'ai'  && <><strong style={{ color: '#7a5230' }}>{aiCount}</strong> AI/ML articles</>}
            {filterMode === 'it'  && <><strong style={{ color: '#7a5230' }}>{itCount}</strong> IT articles</>}
            {filterMode === 'all' && <><strong style={{ color: '#2a1a0a' }}>{totalEnabled}</strong> total articles</>}
          </span>
          {isLoading && (
            <span style={{ color: '#9b7c5a', fontStyle: 'italic' }}>Fetching…</span>
          )}
          {Object.values(sourceStates).some(s => s === 'error') && (
            <span style={{ color: '#b07850', display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertCircle size={12} /> Some sources failed to load
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
            {displayed.map(a => <ArticleCard key={a.id} article={a} />)}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {!isLoading && displayed.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 20px', color: '#b09870', fontFamily: "'Inter', sans-serif" }}>
            {filterMode === 'ai'
              ? 'No AI/ML articles found right now — try refreshing or switching to all articles.'
              : 'No articles found. Try enabling more sources or refreshing.'}
          </motion.div>
        )}

        {/* Loading skeleton when nothing loaded yet */}
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
