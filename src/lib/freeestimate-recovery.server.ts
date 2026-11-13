import { fetchEstimateAvailability } from './freeestimate-availability.server'

const EVENT_TYPE = 'https://api.calendly.com/event_types/fade14bc-6fea-43a5-9df1-91afe922dbec'

// Called after hydration or an alert, never by the cached first-paint path.
export async function refreshEstimateAvailability(recovery = false): Promise<{ times: string[] }> {
  const checkedAt = new Date().toISOString()
  const { CALENDLY_TOKEN } = await import('./calendly.server')
  const result = await fetchEstimateAvailability(EVENT_TYPE, (path, init) => fetch(`https://api.calendly.com${path}`, {
    ...init, headers: { Authorization: `Bearer ${CALENDLY_TOKEN}`, 'Content-Type': 'application/json' },
  }), Date.now(), recovery)
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  // A partial/error response must never erase the last complete snapshot.
  if (result.status !== 'failed') {
    const { error } = await supabaseAdmin.from('freeestimate_availability')
      .upsert({ id: 1, times: result.times, updated_at: new Date().toISOString() })
    if (error) console.error('[freeestimate] Could not save refreshed availability', error.message)
  }
  try {
    const { recordCalendarHealth } = await import('./freeestimate-calendar-health.server')
    await recordCalendarHealth({ status: result.status, detail: result.detail, checkedAt }, !recovery)
  } catch (error) {
    console.error('[freeestimate] Calendar monitoring failed', error instanceof Error ? error.message : 'Unknown failure')
  }
  // Read again: an alert's recovery attempt may have refreshed the snapshot.
  if (result.status === 'failed' || !recovery) {
    const { data } = await supabaseAdmin.from('freeestimate_availability').select('times').eq('id', 1).maybeSingle()
    const saved = ((data?.times as string[] | null) ?? []).filter(t => Date.parse(t) > Date.now() + 300000)
    if (saved.length) return { times: saved }
  }
  return { times: result.times }
}