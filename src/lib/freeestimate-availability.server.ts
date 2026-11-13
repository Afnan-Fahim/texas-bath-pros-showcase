/** Read both Calendly weeks concurrently and retain failures for health checks. */
export async function fetchEstimateAvailability(
  eventType: string,
  request: (path: string, init?: RequestInit) => Promise<Response>,
  now = Date.now(),
  recovery = false,
) {
  const startAt = now + 5 * 60 * 1000
  const weeks = await Promise.all([0, 1].map(async week => {
    const start = new Date(startAt + week * 7 * 864e5).toISOString()
    const end = new Date(startAt + (week + 1) * 7 * 864e5 - 60000).toISOString()
    for (let attempt = 0; attempt < (recovery ? 3 : 1); attempt++) {
    try {
      const response = await request(`/event_type_available_times?event_type=${encodeURIComponent(eventType)}&start_time=${start}&end_time=${end}`, { signal: AbortSignal.timeout(20000) })
      if (!response.ok) {
        const body = await response.text()
        console.error('[freeestimate] Availability lookup failed', response.status, body)
        if (recovery && attempt < 2 && (response.status === 429 || response.status >= 500)) {
          const header = response.headers.get('Retry-After')
          const seconds = header ? Number(header) : NaN
          const retryAfter = Number.isFinite(seconds) ? seconds * 1000 : header ? Date.parse(header) - Date.now() : NaN
          const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 1000 * 2 ** attempt
          // Stop rather than ignore a provider-requested long cooldown.
          if (delay <= 4000) { await new Promise(resolve => setTimeout(resolve, delay)); continue }
        }
        return { times: [] as string[], error: `Week ${week + 1}: Calendly returned HTTP ${response.status}.` }
      }
      const body = await response.json() as { collection?: { start_time: string; status: string }[] }
      if (!Array.isArray(body.collection)) throw new Error('Invalid availability response')
      return { times: body.collection.filter(slot => slot.status === 'available').map(slot => slot.start_time), error: null }
    } catch (error) {
      console.error('[freeestimate] Availability lookup failed', error instanceof Error ? error.message : 'Request failed')
      if (recovery && attempt < 2) { await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** attempt)); continue }
      return { times: [] as string[], error: `Week ${week + 1}: availability request failed or timed out.` }
    }
    }
    return { times: [] as string[], error: `Week ${week + 1}: recovery attempts exhausted.` }
  }))
  const times = weeks.flatMap(week => week.times)
  const errors = weeks.flatMap(week => week.error ? [week.error] : [])
  return {
    times,
    status: errors.length ? 'failed' as const : times.length ? 'healthy' as const : 'empty' as const,
    detail: errors.length ? errors.join(' ') : times.length ? `${times.length} open times found in the next 14 days.` : 'Calendly returned no open times for the next 14 days.',
  }
}