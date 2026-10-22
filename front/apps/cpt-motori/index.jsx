import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bike, ExternalLink, Link2, LoaderCircle, Search, Star, Trash2 } from 'lucide-react'

const EXAMPLE_URL = 'https://www.polovniautomobili.com/motori/pretraga?brand=Honda&engineVolumeFrom=300&engineVolumeTo=701&sort=basic&type[]=naked,sport,supermoto&yearFrom=2015'
const API = '/.netlify/functions/polovni-motori'
const ALL = 'all'

const BRANDS = {
  honda:    { name: 'Honda',    color: '#cc0000' },
  kawasaki: { name: 'Kawasaki', color: '#2f9e2f' },
  yamaha:   { name: 'Yamaha',   color: '#2a2f8f' },
  cfmoto:   { name: 'CFMoto',   color: '#e8730c' },
}

function readSummary(value) {
  try {
    const params = new URL(value).searchParams
    const brand = params.get('brand')
    const from = params.get('engineVolumeFrom'), to = params.get('engineVolumeTo'), year = params.get('yearFrom')
    const engine = from && to ? `${from}cc–${to}cc` : from ? `${from}cc+` : to ? `up to ${to}cc` : ''
    return {
      brand,
      text: [brand, engine, year && `${year}+`].filter(Boolean).join(' ') || 'All motorcycles',
      types: params.get('type[]')?.split(',').filter(Boolean) || [],
    }
  } catch {
    return null
  }
}

const SORTS = {
  postedNew: { label: 'Posted: newest first', compare: (a, b) => dateOf(b, -Infinity) - dateOf(a, -Infinity) },
  postedOld: { label: 'Posted: oldest first', compare: (a, b) => dateOf(a, Infinity) - dateOf(b, Infinity) },
  priceLow:  { label: 'Price: low to high', compare: (a, b) => priceOf(a, Infinity) - priceOf(b, Infinity) },
  priceHigh: { label: 'Price: high to low', compare: (a, b) => priceOf(b, -Infinity) - priceOf(a, -Infinity) },
}

// "9.990 €" -> 9990; bikes without a readable price sort last
function priceOf(bike, fallback) {
  const digits = (bike.price || '').replace(/[^\d]/g, '')
  return digits ? Number(digits) : fallback
}

// Bikes whose posting date has not been read yet sort last
function dateOf(bike, fallback) {
  return bike.posted_at ? Date.parse(bike.posted_at) : fallback
}

function formatDate(value) {
  const [year, month, day] = value.split('-')
  return `${day}.${month}.${year}`
}

// Monday of the current week as YYYY-MM-DD, comparable with posted_at
function weekStart() {
  const date = new Date()
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7))
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function BrandLogo({ brand }) {
  const known = BRANDS[brand?.toLowerCase().replace(/[^a-z]/g, '')]
  if (!known) return <span style={{ width: 34, height: 34, borderRadius: 8, background: '#e4d6bb', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Bike size={18} color="#7a5230" /></span>
  return <span title={known.name} style={{ height: 34, padding: '0 11px', borderRadius: 8, background: known.color, color: '#fff', display: 'inline-flex', alignItems: 'center', fontSize: 13, fontWeight: 900, letterSpacing: 0.4, textTransform: 'uppercase' }}>{known.name}</span>
}

function MotorcycleCard({ motorcycle, starred, onToggle }) {
  return (
    <motion.article layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', background: '#fffaf2', border: `2px solid ${starred ? '#e4b51d' : 'rgba(110,78,42,0.14)'}`, borderRadius: 12, overflow: 'hidden', boxShadow: starred ? '0 8px 24px rgba(228,181,29,0.16)' : '0 5px 18px rgba(110,78,42,0.06)', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
      <div style={{ height: 170, background: motorcycle.image ? `url(${motorcycle.image}) center/cover` : 'linear-gradient(135deg, #dfd4be, #b8a688)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!motorcycle.image && <Bike size={56} color="rgba(42,26,10,0.35)" strokeWidth={1.2} />}
      </div>
      <div style={{ padding: '18px 18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
          <h3 style={{ color: '#2a1a0a', fontSize: 18, lineHeight: 1.2, marginBottom: 8 }}>{motorcycle.title}</h3>
          <button type="button" aria-label={starred ? 'Remove star' : 'Star motorcycle'} onClick={() => onToggle(motorcycle.id)} style={{ color: starred ? '#d3a100' : '#b9a78b', background: 'none', border: 0, cursor: 'pointer', padding: 0, flexShrink: 0 }}><Star size={22} fill={starred ? 'currentColor' : 'none'} /></button>
        </div>
        <p style={{ color: '#8c7458', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{motorcycle.price || 'Cena na oglasu'}</p>
        <p style={{ color: '#9b7c5a', fontSize: 12, marginBottom: 12 }}>{motorcycle.posted_at ? `Posted ${formatDate(motorcycle.posted_at)}` : 'Posting date loading…'}</p>
        {motorcycle.details && <p style={{ color: '#9b7c5a', fontSize: 13, lineHeight: 1.55, minHeight: 40, marginBottom: 16 }}>{motorcycle.details}</p>}
        <a href={motorcycle.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#7a5230', fontSize: 13, fontWeight: 700 }}>View listing <ExternalLink size={14} /></a>
      </div>
    </motion.article>
  )
}


function SearchChip({ search, count, selected, onSelect, onDelete }) {
  const summary = readSummary(search.url)
  return (
    <div role="button" tabIndex={0} aria-pressed={selected} onClick={() => onSelect(search.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(search.id) } }} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '12px 14px', borderRadius: 12, cursor: 'pointer', background: selected ? '#fffaf2' : 'rgba(255,250,242,0.55)', border: `2px solid ${selected ? '#7a5230' : 'rgba(110,78,42,0.14)'}`, boxShadow: selected ? '0 8px 22px rgba(110,78,42,0.12)' : 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
      <BrandLogo brand={summary?.brand} />
      <strong style={{ color: '#2a1a0a', fontSize: 16 }}>{summary?.text || search.url}</strong>
      {summary?.types.map(type => <span key={type} style={{ border: '1px solid rgba(122,82,48,0.2)', borderRadius: 100, padding: '3px 9px', color: '#7a5230', background: 'rgba(255,250,242,0.65)', fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{type}</span>)}
      <span style={{ marginLeft: 'auto', color: '#9b7c5a', fontSize: 12 }}>{count} bikes</span>
      <button type="button" aria-label="Delete search" onClick={event => { event.stopPropagation(); onDelete(search) }} style={{ border: 0, background: 'none', color: '#a5604f', cursor: 'pointer', padding: 4, display: 'inline-flex' }}><Trash2 size={17} /></button>
    </div>
  )
}

export default function CptMotori() {
  const [url, setUrl] = useState('')
  const [data, setData] = useState({ motorcycles: [], searches: [], links: [] })
  const [selectedId, setSelectedId] = useState(null)
  const [sort, setSort] = useState('postedNew')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const { motorcycles, searches, links } = data

  const starredBikes = motorcycles.filter(item => item.starred)
  const thisWeek = useMemo(() => {
    const start = weekStart()
    return motorcycles.filter(item => item.posted_at && item.posted_at >= start).sort(SORTS.postedNew.compare)
  }, [motorcycles])
  const counts = useMemo(() => links.reduce((all, link) => ({ ...all, [link.search_id]: (all[link.search_id] || 0) + 1 }), {}), [links])
  const visibleBikes = useMemo(() => {
    if (!selectedId) return []
    const ids = new Set(links.filter(link => link.search_id === selectedId).map(link => link.motorcycle_id))
    const bikes = selectedId === ALL ? motorcycles : motorcycles.filter(item => ids.has(item.id))
    return [...bikes].sort(SORTS[sort].compare)
  }, [links, motorcycles, selectedId, sort])

  const request = async (options = {}) => {
    const response = await fetch(API, options)
    const body = await response.json().catch(() => null)
    if (!body) throw new Error('The search service did not respond. Run the site with "netlify dev" (port 8888) so the backend function is available.')
    if (!response.ok) throw new Error(body.error || 'Listings could not be loaded.')
    return body
  }
  const send = (method, payload) => request({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

  // Posting dates live on each listing's own page, so they are filled in small batches in the background
  const fillDates = async () => {
    const skip = []
    for (;;) {
      const body = await send('PUT', { skip })
      setData(current => ({ ...current, motorcycles: body.motorcycles }))
      if (!body.attempted.length) return
      skip.push(...body.attempted)
    }
  }

  useEffect(() => {
    request()
      .then(body => { setData(body); setSelectedId(body.searches.at(-1)?.id || null); setStatus('ready'); return fillDates() })
      .catch(err => { setStatus('error'); setError(err.message) })
  }, [])

  const loadListings = async event => {
    event.preventDefault()
    let parsed
    try {
      parsed = new URL(url.trim())
      if (!['polovniautomobili.com', 'www.polovniautomobili.com'].includes(parsed.hostname)) throw new Error('Use a polovniautomobili.com link.')
    } catch (err) {
      setError(err.message || 'Paste a valid PolovniAutomobili search link.')
      return
    }
    setStatus('loading'); setError('')
    try {
      const body = await send('POST', { url: parsed.toString() })
      setData(body); setSelectedId(body.searchId); setUrl(''); setStatus('ready')
      await fillDates()
    } catch (err) {
      setStatus('error'); setError(err.message || 'Listings could not be loaded right now.')
    }
  }

  const deleteSearch = async search => {
    const summary = readSummary(search.url)
    if (!window.confirm(`Delete "${summary?.text || 'this search'}"? Its bikes are removed too, except starred ones.`)) return
    try {
      setData(await send('DELETE', { id: search.id }))
      if (selectedId === search.id) setSelectedId(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleStar = async id => {
    const starred = !motorcycles.find(item => item.id === id)?.starred
    const mark = value => setData(current => ({ ...current, motorcycles: current.motorcycles.map(item => item.id === id ? { ...item, starred: value } : item) }))
    mark(starred)
    try {
      await send('PATCH', { id, starred })
    } catch (err) {
      mark(!starred)
      setError(err.message)
    }
  }

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 18 }
  const heading = { color: '#2a1a0a', fontSize: 22, margin: '0 0 16px' }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, background: 'linear-gradient(135deg, #f7f2ea 0%, #eee4d2 62%, #e7d6ad 100%)' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '58px 28px 100px' }}>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 'clamp(34px, 5vw, 56px)', color: '#2a1a0a', marginBottom: 34 }}>Pracenje motora</motion.h1>

        {starredBikes.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={heading}>Starred · {starredBikes.length}</h2>
            <motion.div layout style={grid}>{starredBikes.map(motorcycle => <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} starred onToggle={toggleStar} />)}</motion.div>
          </section>
        )}

        {thisWeek.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={heading}>Ove nedelje · {thisWeek.length}</h2>
            <motion.div layout style={grid}>{thisWeek.map(motorcycle => <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} starred={motorcycle.starred} onToggle={toggleStar} />)}</motion.div>
          </section>
        )}

        <form onSubmit={loadListings} style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(255,250,242,0.78)', border: '1px solid rgba(110,78,42,0.2)', borderRadius: 12, padding: 8, maxWidth: 900, boxShadow: '0 12px 30px rgba(110,78,42,0.08)', marginBottom: 14 }}>
          <Link2 size={19} color="#9b7c5a" style={{ marginLeft: 10, flexShrink: 0 }} />
          <input value={url} onChange={event => setUrl(event.target.value)} placeholder="Paste a PolovniAutomobili search link" aria-label="PolovniAutomobili search link" style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent', color: '#2a1a0a', padding: '10px 4px', fontFamily: 'Inter, sans-serif' }} />
          <button type="submit" disabled={status === 'loading'} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: 0, borderRadius: 8, padding: '11px 17px', background: '#7a5230', color: '#fffaf2', fontWeight: 800, cursor: status === 'loading' ? 'wait' : 'pointer', whiteSpace: 'nowrap' }}>{status === 'loading' ? <LoaderCircle size={16} className="cpt-spin" /> : <Search size={16} />} Load bikes</button>
        </form>
        <button type="button" onClick={() => setUrl(EXAMPLE_URL)} style={{ border: 0, background: 'none', padding: 0, color: '#9b7c5a', cursor: 'pointer', fontSize: 12 }}>Use the example search link</button>

        {error && <div role="alert" style={{ marginTop: 24, color: '#8b3e31', background: '#f9e3dc', border: '1px solid #e6b7a9', borderRadius: 10, padding: '12px 14px', maxWidth: 900, fontSize: 14 }}>{error}</div>}

        {searches.length > 0 && (
          <section style={{ margin: '34px 0 30px', maxWidth: 900 }}>
            <h2 style={heading}>Your searches</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              <div role="button" tabIndex={0} aria-pressed={selectedId === ALL} onClick={() => setSelectedId(current => current === ALL ? null : ALL)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedId(current => current === ALL ? null : ALL) } }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, cursor: 'pointer', background: selectedId === ALL ? '#fffaf2' : 'rgba(255,250,242,0.55)', border: `2px solid ${selectedId === ALL ? '#7a5230' : 'rgba(110,78,42,0.14)'}`, boxShadow: selectedId === ALL ? '0 8px 22px rgba(110,78,42,0.12)' : 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
                <span style={{ width: 34, height: 34, borderRadius: 8, background: '#7a5230', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Bike size={18} color="#fffaf2" /></span>
                <strong style={{ color: '#2a1a0a', fontSize: 16 }}>All searches</strong>
                <span style={{ marginLeft: 'auto', color: '#9b7c5a', fontSize: 12 }}>{motorcycles.length} bikes</span>
              </div>
              {searches.map(search => <SearchChip key={search.id} search={search} count={counts[search.id] || 0} selected={search.id === selectedId} onSelect={id => setSelectedId(current => current === id ? null : id)} onDelete={deleteSearch} />)}
            </div>
          </section>
        )}

        {selectedId && visibleBikes.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <span style={{ color: '#9b7c5a', fontSize: 13 }}>{visibleBikes.length} bikes</span>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#7a5230', fontSize: 13, fontWeight: 700 }}>
              Sort by
              <select value={sort} onChange={event => setSort(event.target.value)} style={{ border: '1px solid rgba(110,78,42,0.25)', borderRadius: 8, padding: '7px 10px', background: '#fffaf2', color: '#2a1a0a', fontFamily: 'Inter, sans-serif' }}>
                {Object.entries(SORTS).map(([key, option]) => <option key={key} value={key}>{option.label}</option>)}
              </select>
            </label>
          </div>
        )}
        {selectedId && visibleBikes.length > 0 && <motion.div layout style={grid}>{visibleBikes.map(motorcycle => <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} starred={motorcycle.starred} onToggle={toggleStar} />)}</motion.div>}
        {status === 'ready' && selectedId && visibleBikes.length === 0 && <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9b7c5a' }}>This search has no saved bikes.</div>}
        {status === 'ready' && searches.length === 0 && <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9b7c5a' }}>No searches yet. Paste a link above.</div>}
        {status === 'loading' && motorcycles.length === 0 && <div style={{ marginTop: 64, textAlign: 'center', color: '#9b7c5a' }}><LoaderCircle size={30} className="cpt-spin" /></div>}
      </div>
    </div>
  )
}
