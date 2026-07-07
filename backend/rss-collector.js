import { XMLParser } from 'fast-xml-parser'
import { createClient } from '@supabase/supabase-js'

const SOURCES = [
  { id: 'n1',       name: 'N1 Info',  url: 'https://n1info.rs/feed/' },
  { id: 'blic',     name: 'Blic',     url: 'https://www.blic.rs/rss/IT' },
  { id: 'telegraf', name: 'Telegraf', url: 'https://www.telegraf.rs/rss' },
  { id: 'novosti',  name: 'Novosti',  url: 'https://www.novosti.rs/rss/vesti' },
  { id: 'kurir',    name: 'Kurir',    url: 'https://www.kurir.rs/rss' },
  { id: 'rts',      name: 'RTS',      url: 'https://www.rts.rs/page/stories/sr/story/11/Srbija-danas/rss.html' },
  { id: 'b92',      name: 'B92',      url: 'https://www.b92.net/rss/b92/info' },
  { id: 'naslovi',  name: 'Naslovi',  url: 'https://naslovi.net/rss/' },
]

// ── AI keyword matching ────────────────────────────────────────────────────
const AI_KEYWORDS = [
  'veštačka inteligencija', 'veštačke inteligencije',
  'vestacka inteligencija', 'vestacke inteligencije',
  'mašinsko učenje', 'masinsko ucenje',
  'neuronska mreža', 'neuronske mreže', 'neuronska mreza', 'neuronske mreze',
  'duboko učenje', 'duboko ucenje',
  'generativna veštačka', 'generativna vestacka',
  'chatgpt', 'openai', 'deepmind', 'anthropic', 'midjourney',
  'stable diffusion', 'dall-e', 'dall·e',
  'artificial intelligence', 'machine learning', 'deep learning',
  'neural network', 'large language model', 'generative ai', 'chatbot', 'AI',
]
const AI_WORD_PATTERNS = [/\bai\b/i, /\bgpt[\s-]?\d/i, /\bllm\b/i, /\bgemini\b/i, /\bgrok\b/i]

// ── IT keyword matching ────────────────────────────────────────────────────
const IT_KEYWORDS = [
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
  'apple', 'google', 'microsoft', 'meta', 'amazon', 'samsung',
  'huawei', 'nvidia', 'intel', 'qualcomm', 'spacex',
  'facebook', 'instagram', 'tiktok', 'youtube', 'whatsapp',
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

function matchesIT(title, desc) {
  const raw = `${title} ${desc}`
  const lower = raw.toLowerCase()
  const norm = normalize(lower)
  if (IT_KEYWORDS.some(kw => lower.includes(kw) || norm.includes(normalize(kw)))) return true
  return IT_WORD_PATTERNS.some(re => re.test(raw))
}

// ── XML helpers ────────────────────────────────────────────────────────────
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  cdataPropName: '__cdata',
  isArray: name => name === 'item' || name === 'entry',
  textNodeName: '#text',
})

function getVal(val) {
  if (!val && val !== 0) return ''
  if (typeof val === 'string') return val.trim()
  if (typeof val === 'object') {
    if (val.__cdata) return val.__cdata.trim()
    if (val['#text']) return String(val['#text']).trim()
  }
  return String(val).trim()
}

function stripHTML(str) {
  return str
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseDate(val) {
  const raw = getVal(val)
  if (!raw) return new Date().toISOString()
  const d = new Date(raw)
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

function parseRSS(xmlText, source) {
  let data
  try {
    data = parser.parse(xmlText)
  } catch {
    return []
  }

  let items = []

  if (data.rss?.channel) {
    const channel = Array.isArray(data.rss.channel) ? data.rss.channel[0] : data.rss.channel
    items = (channel.item || []).map(item => {
      const title = stripHTML(getVal(item.title))
      const description = stripHTML(getVal(item.description) || getVal(item.summary) || '').slice(0, 500)

      let link = ''
      if (item.link) {
        link = (typeof item.link === 'object' && item.link['@_href'])
          ? item.link['@_href']
          : getVal(item.link)
      }
      if (!link && item.guid) {
        const g = getVal(item.guid)
        if (g.startsWith('http')) link = g
      }

      return { title, description, link, published_at: parseDate(item.pubDate) }
    })
  }

  if (data.feed) {
    items = (data.feed.entry || []).map(entry => {
      const title = stripHTML(getVal(entry.title))
      const description = stripHTML(getVal(entry.summary) || getVal(entry.content) || '').slice(0, 500)

      let link = ''
      if (entry.link) {
        const links = Array.isArray(entry.link) ? entry.link : [entry.link]
        const alt = links.find(l => l['@_rel'] === 'alternate') || links[0]
        link = alt?.['@_href'] || getVal(alt) || ''
      }

      return {
        title,
        description,
        link,
        published_at: parseDate(entry.updated || entry.published),
      }
    })
  }

  return items
    .filter(item => item.title && item.link)
    .map(item => ({
      ...item,
      source_id: source.id,
      source_name: source.name,
      is_ai: matchesAI(item.title, item.description),
      is_it: matchesIT(item.title, item.description),
    }))
}

// ── Main collector ─────────────────────────────────────────────────────────
export async function collectAll() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const results = await Promise.allSettled(
    SOURCES.map(async source => {
      const res = await fetch(source.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RSS-Collector/1.0)' },
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status} from ${source.id}`)
      const text = await res.text()
      return parseRSS(text, source)
    })
  )

  const articles = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)

  const errors = results.filter(r => r.status === 'rejected').map(r => r.reason?.message)
  console.log(`Collected ${articles.length} articles. Errors:`, errors)

  if (articles.length === 0) return { inserted: 0, errors }

  const BATCH = 100
  let inserted = 0
  for (let i = 0; i < articles.length; i += BATCH) {
    const { error } = await supabase
      .from('articles')
      .upsert(articles.slice(i, i + BATCH), { onConflict: 'link', ignoreDuplicates: true })
    if (error) console.error('Upsert error:', error.message)
    else inserted += Math.min(BATCH, articles.length - i)
  }

  // Prune articles older than 30 days, but keep hearted ones forever
  await supabase
    .from('articles')
    .delete()
    .lt('published_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .eq('hearted', false)

  return { inserted, errors }
}

export default async () => {
  try {
    const result = await collectAll()
    return Response.json(result)
  } catch (err) {
    console.error('RSS collector failed:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export const config = {
  schedule: '0 5 * * *',
}
