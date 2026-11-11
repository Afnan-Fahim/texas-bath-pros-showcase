/** Read both Calendly weeks concurrently; never cache booking availability. */
export async function fetchEstimateAvailability(
  eventType: string,
  request: (path: string, init?: RequestInit) => Promise<Response>,
  now = Date.now(),
) {
  const startAt = now + 5 * 60 * 1000
  const weeks = await Promise.all([0, 1].map(async week => {
    const start = new Date(startAt + week * 7 * 864e5).toISOString()
    const end = new Date(startAt + (week + 1) * 7 * 864e5 - 60000).toISOString()
    const response = await request(`/event_type_available_times?event_type=${encodeURIComponent(eventType)}&start_time=${start}&end_time=${end}`, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) {
      console.error('[freeestimate] Availability lookup failed', response.status)
      return []
    }
    const body = await response.json() as { collection?: { start_time: string; status: string }[] }
    return (body.collection ?? []).filter(slot => slot.status === 'available').map(slot => slot.start_time)
  }))
  return { times: weeks.flat() }
}