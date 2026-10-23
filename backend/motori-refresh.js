import { getDb, saveSearch, fillPostedDates } from './polovni-motori.js'

// Scheduled functions are cut off after about 30 seconds, so stop starting new work before that
const BUDGET_MS = 24000

export default async () => {
  const started = Date.now()
  const outOfTime = () => Date.now() - started > BUDGET_MS
  try {
    const db = getDb()
    const { data: searches, error } = await db.from('motor_searches').select('id, url').order('created_at', { ascending: true })
    if (error) throw new Error(error.message)

    const errors = []
    let refreshed = 0
    for (const search of searches) {
      if (outOfTime()) break
      try {
        await saveSearch(db, new URL(search.url))
        refreshed++
      } catch (err) {
        errors.push(`${search.url}: ${err.message}`)
      }
    }

    const skip = []
    while (!outOfTime()) {
      const attempted = await fillPostedDates(db, skip)
      if (!attempted.length) break
      skip.push(...attempted)
    }

    console.log(`Motori refresh: ${refreshed}/${searches.length} searches, ${skip.length} dates tried, ${errors.length} errors`)
    return Response.json({ refreshed, total: searches.length, errors })
  } catch (err) {
    console.error('Motori refresh failed:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export const config = {
  schedule: '0 * * * *',
}
