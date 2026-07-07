import { collectAll } from './backend/rss-collector.js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.')
  process.exit(1)
}

console.log('Fetching all RSS feeds and seeding database…')
const result = await collectAll()
console.log(`Done. Inserted: ${result.inserted}`)
if (result.errors.length) console.warn('Feed errors:', result.errors)
