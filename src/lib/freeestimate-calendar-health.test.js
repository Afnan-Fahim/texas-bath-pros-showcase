import { expect, test } from 'bun:test'
import { calendarHealthTransition, processCalendarObservation, CALENDAR_ALERT_COOLDOWN_MS, CALENDAR_ALERT_RECIPIENTS } from './freeestimate-calendar-health'
import { fetchEstimateAvailability } from './freeestimate-availability.server'

const initial = { status: 'healthy', incidentAt: null, lastAlertAt: null }
const at = '2026-11-13T02:29:00.000Z'
const observe = (status, checkedAt = at) => ({ status, checkedAt, detail: status })

test('Calendly error triggers warning even when the other week has open times', async () => {
  let calls = 0
  const result = await fetchEstimateAvailability('test', async () => ++calls === 1
    ? new Response('Calendar connection failed', { status: 400 })
    : Response.json({ collection: [{ status: 'available', start_time: '2026-11-20T16:00:00Z' }] }))
  expect(result.status).toBe('failed')
  expect(result.times.length).toBe(1)
  expect(calendarHealthTransition(initial, observe(result.status)).notice.kind).toBe('warning')
})

test('successful but empty two-week calendar triggers a warning', async () => {
  const result = await fetchEstimateAvailability('test', async () => Response.json({ collection: [] }))
  expect(result.status).toBe('empty')
  expect(calendarHealthTransition(initial, observe(result.status)).notice.kind).toBe('warning')
})

test('warnings are suppressed for four hours, including changed failure reasons', () => {
  const first = calendarHealthTransition(initial, observe('failed')).state
  expect(CALENDAR_ALERT_COOLDOWN_MS).toBe(14400000)
  expect(calendarHealthTransition(first, observe('empty', '2026-11-13T06:28:59.999Z')).notice).toBeNull()
  expect(calendarHealthTransition(first, observe('failed', '2026-11-13T06:29:00.000Z')).notice.kind).toBe('warning')
})

test('recovery sends once only after both weeks succeed with open times', () => {
  const failed = calendarHealthTransition(initial, observe('failed')).state
  const recovery = calendarHealthTransition(failed, observe('healthy', '2026-11-13T02:30:00.000Z'))
  expect(recovery.notice.kind).toBe('recovery')
  expect(calendarHealthTransition(recovery.state, observe('healthy', '2026-11-13T02:31:00.000Z')).notice).toBeNull()
})

test('concurrent checks send one warning and one recovery to only the two owners', async () => {
  let state = initial
  const accepted = []
  const deps = {
    read: async () => state,
    claim: async (previous, next) => { if (state !== previous) return false; state = next; return true },
    send: async (to, notice) => { accepted.push({ to, kind: notice.kind }) },
    rollback: async (next, previous) => { if (state === next) state = previous },
  }
  await Promise.all([processCalendarObservation(observe('failed'), deps), processCalendarObservation(observe('failed'), deps)])
  await processCalendarObservation(observe('empty', '2026-11-13T02:30:00.000Z'), deps)
  await processCalendarObservation(observe('healthy', '2026-11-13T02:31:00.000Z'), deps)
  expect(accepted).toEqual([
    { to: 'justin@texasbathsolutions.com', kind: 'warning' },
    { to: 'josiah@texasbathsolutions.com', kind: 'warning' },
    { to: 'justin@texasbathsolutions.com', kind: 'recovery' },
    { to: 'josiah@texasbathsolutions.com', kind: 'recovery' },
  ])
  expect(CALENDAR_ALERT_RECIPIENTS).toEqual(['justin@texasbathsolutions.com', 'josiah@texasbathsolutions.com'])
})

test('send failure restores state for retry and does not report recovery', async () => {
  let state = initial
  const deps = {
    read: async () => state,
    claim: async (previous, next) => { state = next; return true },
    send: async () => { throw new Error('sending unavailable') },
    rollback: async (next, previous) => { state = previous },
  }
  await expect(processCalendarObservation(observe('failed'), deps)).rejects.toThrow('retry on next check')
  expect(state.status).toBe('healthy')
  expect(state.lastAlertAt).toBeNull()
  expect(state.incidentAt).toBe(at)
})

test('older concurrent observations cannot reverse newer health', () => {
  const current = { ...initial, checkedAt: '2026-11-13T02:31:00.000Z' }
  expect(calendarHealthTransition(current, observe('failed')).notice).toBeNull()
})

test('warning triggers one recovery attempt, recovery emails never trigger another', async () => {
  let state = initial
  let recoveries = 0
  const deps = {
    read: async () => state,
    claim: async (previous, next) => { if (previous !== state) return false; state = next; return true },
    send: async () => {}, rollback: async () => {}, recover: async () => { recoveries++ },
  }
  await Promise.all([processCalendarObservation(observe('failed'), deps), processCalendarObservation(observe('failed'), deps)])
  await processCalendarObservation(observe('healthy', '2026-11-13T02:30:00.000Z'), deps)
  expect(recoveries).toBe(1)
})