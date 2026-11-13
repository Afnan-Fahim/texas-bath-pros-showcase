import { expect, test } from 'bun:test'
import { shouldAlertSlowPage, processSpeedReport, speedReportSchema } from './freeestimate-speed'
import { issueSpeedToken, verifySpeedToken } from './freeestimate-speed-token.server'

const now = Date.parse('2026-11-13T02:35:00Z')
test('only loading strictly longer than 2.5 seconds triggers an alert', () => {
  expect(shouldAlertSlowPage(2499, { lastAlertAt: null }, now)).toBe(false)
  expect(shouldAlertSlowPage(2500, { lastAlertAt: null }, now)).toBe(false)
  expect(shouldAlertSlowPage(2501, { lastAlertAt: null }, now)).toBe(true)
})
test('repeated slow visits are deduplicated for four hours', () => {
  const previous = { lastAlertAt: new Date(now).toISOString() }
  expect(shouldAlertSlowPage(3200, previous, now + 14399999)).toBe(false)
  expect(shouldAlertSlowPage(3200, previous, now + 14400000)).toBe(true)
})
test('concurrent slow visitors notify only Justin once', async () => {
  let state = { lastAlertAt: null }
  const sent = []
  const report = { token: 'not-used-by-unit-test', durationMs: 3200, device: 'phone', calendarReady: true }
  const deps = {
    now, read: async () => state,
    claim: async (previous, next) => { if (previous !== state) return false; state = next; return true },
    send: async (to, report) => { sent.push({ to, durationMs: report.durationMs }) },
    rollback: async (next, previous) => { state = previous },
  }
  await Promise.all([processSpeedReport(report, deps), processSpeedReport(report, deps)])
  expect(sent).toEqual([{ to: 'justin@texasbathsolutions.com', durationMs: 3200 }])
})
test('fast visits cause no database reads or sends', async () => {
  let reads = 0
  await processSpeedReport({ durationMs: 2500 }, { now, read: async () => { reads++; return { lastAlertAt: null } } })
  expect(reads).toBe(0)
})
test('reports reject arbitrary recipients and invalid durations', () => {
  const report = { token: 'a'.repeat(30), durationMs: 3000, device: 'phone', calendarReady: true }
  expect(speedReportSchema.safeParse({ ...report, to: 'other@example.com' }).success).toBe(false)
  expect(speedReportSchema.safeParse({ ...report, durationMs: -1 }).success).toBe(false)
})
test('signed reports reject tampering and expire after fifteen minutes', async () => {
  const key = 'unit-test-only-key-not-a-production-secret'
  const token = await issueSpeedToken(key, now)
  expect(await verifySpeedToken(token, key, now)).toBe(true)
  expect(await verifySpeedToken(token, key, now + 900001)).toBe(false)
  expect(await verifySpeedToken(token.slice(0, -1) + (token.endsWith('0') ? '1' : '0'), key, now)).toBe(false)
})