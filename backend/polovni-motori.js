import { createClient } from '@supabase/supabase-js'

const LISTING_PATH = /\/motori\/\d+\/[^"'?#<>\s]+/i

function clean(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
}

function parseListings(html, origin) {
  const anchors = []
  const re = /<a\s[^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi
  let m
  while ((m = re.exec(html))) {
    if (LISTING_PATH.test(m[1])) anchors.push({ index: m.index, html: m[0], url: new URL(m[1], origin).toString() })
  }
  const byUrl = new Map()
  anchors.forEach((anchor, i) => {
    const next = anchors.slice(i + 1).find(other => other.url !== anchor.url)
    const block = html.slice(anchor.index, Math.min(next ? next.index : html.length, anchor.index + 3000))
    const item = byUrl.get(anchor.url) || { id: anchor.url, url: anchor.url, title: '', price: '', details: '', image: '' }
    const title = clean(anchor.html.replace(/<img[^>]*>/gi, '')).slice(0, 120)
    if (!item.title && title.length >= 3) item.title = title
    const src = (anchor.html + block).match(/<img[^>]*?(?:srcSet|srcset|data-src|src)=["'](https?:[^"'\s,]+)/i)?.[1]
    if (!item.image && src) item.image = new URL(src, origin).toString()
    const text = clean(block)
    if (!item.price) item.price = text.match(/\d[\d.]*\s*€/)?.[0] || ''
    if (!item.details && title) item.details = text.replace(title, '').replace(item.price, '').trim().slice(0, 110)
    byUrl.set(anchor.url, item)
  })
  return [...byUrl.values()].filter(item => item.title).slice(0, 100)
}

function getDb() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Database is not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  return createClient(url, key)
}

async function fetchHtml(url) {
  let response
  for (let attempt = 0; attempt < 5; attempt++) {
    response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/124' }, signal: AbortSignal.timeout(12000) })
    if (response.status !== 403) break
  }
  if (!response.ok) throw new Error(`PolovniAutomobili returned HTTP ${response.status}.`)
  return response.text()
}

async function scrape(parsed) {
  return parseListings(await fetchHtml(parsed.toString()), parsed.origin)
}

// The search page has no posting date, so it is read from each listing's own page ("Datum objave: 16.10.2026")
async function fetchPostedAt(url) {
  const raw = (await fetchHtml(url)).match(/data-testid="postedDate"[^>]*>(\d{2})\.(\d{2})\.(\d{4})</)
  return raw ? `${raw[3]}-${raw[2]}-${raw[1]}` : null
}

const COLUMNS = 'id, url, title, price, details, image, brand, starred, posted_at, first_seen, last_seen'

async function getState(db) {
  const [bikes, searches, links] = await Promise.all([
    db.from('motorcycles').select(COLUMNS).order('last_seen', { ascending: false }).limit(2000),
    db.from('motor_searches').select('id, url, brand, created_at').order('created_at', { ascending: true }),
    db.from('motor_search_items').select('search_id, motorcycle_id').limit(10000),
  ])
  const failed = [bikes, searches, links].find(result => result.error)
  if (failed) throw new Error(failed.error.message)
  return { motorcycles: bikes.data, searches: searches.data, links: links.data }
}

export default async request => {
  try {
    const db = getDb()

    if (request.method === 'GET') return Response.json(await getState(db))

    const body = await request.json()

    if (request.method === 'PATCH') {
      const { error } = await db.from('motorcycles').update({ starred: !!body.starred }).eq('id', String(body.id))
      if (error) throw new Error(error.message)
      return Response.json({ ok: true })
    }

    if (request.method === 'PUT') {
      const skip = Array.isArray(body.skip) ? body.skip.map(String) : []
      let query = db.from('motorcycles').select('id, url').is('posted_at', null).limit(8)
      if (skip.length) query = query.not('id', 'in', `(${skip.join(',')})`)
      const { data: pending, error } = await query
      if (error) throw new Error(error.message)
      await Promise.all(pending.map(async bike => {
        try {
          const postedAt = await fetchPostedAt(bike.url)
          if (postedAt) await db.from('motorcycles').update({ posted_at: postedAt }).eq('id', bike.id)
        } catch { /* left empty; the client skips it for the rest of this session */ }
      }))
      return Response.json({ ...(await getState(db)), attempted: pending.map(bike => bike.id) })
    }

    if (request.method === 'DELETE') {
      const { error } = await db.from('motor_searches').delete().eq('id', body.id)
      if (error) throw new Error(error.message)
      // Bikes that no remaining search found are dropped, unless starred
      const state = await getState(db)
      const linked = new Set(state.links.map(link => link.motorcycle_id))
      const orphans = state.motorcycles.filter(bike => !bike.starred && !linked.has(bike.id)).map(bike => bike.id)
      if (orphans.length) await db.from('motorcycles').delete().in('id', orphans)
      return Response.json(await getState(db))
    }

    const parsed = new URL(body.url)
    if (!['polovniautomobili.com', 'www.polovniautomobili.com'].includes(parsed.hostname)) return Response.json({ error: 'Only PolovniAutomobili links are supported.' }, { status: 400 })
    const brand = parsed.searchParams.get('brand') || null
    const now = new Date().toISOString()
    const rows = (await scrape(parsed)).map(({ id: url, ...item }) => ({ id: url.match(/\/motori\/(\d+)\//)[1], url, ...item, brand, last_seen: now }))

    const { data: search, error: searchError } = await db.from('motor_searches').upsert({ url: parsed.toString(), brand }, { onConflict: 'url' }).select('id').single()
    if (searchError) throw new Error(searchError.message)
    // starred and first_seen are left out on purpose so re-scraping never resets them
    if (rows.length) {
      const { error } = await db.from('motorcycles').upsert(rows, { onConflict: 'id' })
      if (error) throw new Error(error.message)
      const { error: linkError } = await db.from('motor_search_items').upsert(rows.map(row => ({ search_id: search.id, motorcycle_id: row.id })), { onConflict: 'search_id,motorcycle_id', ignoreDuplicates: true })
      if (linkError) throw new Error(linkError.message)
    }
    return Response.json({ ...(await getState(db)), searchId: search.id, found: rows.length })
  } catch (error) {
    return Response.json({ error: error.message || 'The search could not be loaded.' }, { status: 502 })
  }
}
