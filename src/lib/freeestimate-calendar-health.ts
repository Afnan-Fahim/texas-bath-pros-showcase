export const CALENDAR_ALERT_COOLDOWN_MS = 4 * 60 * 60 * 1000
export const CALENDAR_ALERT_RECIPIENTS = ['justin@texasbathsolutions.com', 'josiah@texasbathsolutions.com'] as const
export type CalendarStatus = 'healthy' | 'failed' | 'empty'
export type CalendarHealthState = {
  status: CalendarStatus
  incidentAt: string | null
  lastAlertAt: string | null
  checkedAt?: string
}
export type CalendarObservation = { status: CalendarStatus; checkedAt: string; detail: string }
export type CalendarNotice = { kind: 'warning' | 'recovery'; eventId: string; detail: string; checkedAt: string }

export function calendarHealthTransition(previous: CalendarHealthState, observation: CalendarObservation): { state: CalendarHealthState; notice: CalendarNotice | null } {
  const now = Date.parse(observation.checkedAt)
  if (previous.checkedAt && now <= Date.parse(previous.checkedAt)) return { state: previous, notice: null }
  const recovered = observation.status === 'healthy' && previous.status !== 'healthy'
  const incidentAt = observation.status === 'healthy' ? null : previous.incidentAt ?? observation.checkedAt
  const warningDue = observation.status !== 'healthy' && (!previous.lastAlertAt || now - Date.parse(previous.lastAlertAt) >= CALENDAR_ALERT_COOLDOWN_MS)
  const state: CalendarHealthState = {
    status: observation.status,
    incidentAt,
    lastAlertAt: warningDue ? observation.checkedAt : recovered ? null : previous.lastAlertAt,
    checkedAt: observation.checkedAt,
  }
  const kind = recovered ? 'recovery' : warningDue ? 'warning' : null
  return {
    state,
    notice: kind ? { kind, eventId: `${previous.incidentAt ?? incidentAt}-${kind}-${kind === 'warning' ? Math.floor(now / CALENDAR_ALERT_COOLDOWN_MS) : ''}`, detail: observation.detail, checkedAt: observation.checkedAt } : null,
  }
}

// Dependencies are injected so failure/recovery and concurrent requests can be
// exercised without causing a real outage or emailing customers.
export async function processCalendarObservation(observation: CalendarObservation, dependencies: {
  read: () => Promise<CalendarHealthState>
  claim: (previous: CalendarHealthState, next: CalendarHealthState) => Promise<boolean>
  send: (recipient: string, notice: CalendarNotice) => Promise<unknown>
  rollback: (next: CalendarHealthState, previous: CalendarHealthState) => Promise<void>
  recover?: () => Promise<void>
}) {
  const previous = await dependencies.read()
  const { state, notice } = calendarHealthTransition(previous, observation)
  if (state === previous || !await dependencies.claim(previous, state)) return
  if (!notice) return
  // Each operational event has two fixed owners; no browser-provided addresses.
  const results = await Promise.allSettled([
    dependencies.send(CALENDAR_ALERT_RECIPIENTS[0], notice),
    dependencies.send(CALENDAR_ALERT_RECIPIENTS[1], notice),
  ])
  if (notice.kind === 'warning' && dependencies.recover) {
    try { await dependencies.recover() }
    catch (error) { console.error('[freeestimate] Automatic calendar recovery failed', error instanceof Error ? error.message : 'Unknown failure') }
  }
  if (results.some(result => result.status === 'rejected')) {
    // Preserve the event key on retry: the managed sender deduplicates any
    // recipient already accepted. Next availability check retries the event.
    await dependencies.rollback(state, { ...previous, incidentAt: state.incidentAt ?? previous.incidentAt })
    throw new Error('Calendar health notification was not accepted; retry on next check.')
  }
}