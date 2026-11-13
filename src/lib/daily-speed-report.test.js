import { expect, test } from 'bun:test'
import { centralReportTime, checkPageLoading, DAILY_REPORT_RECIPIENT, DAILY_REPORT_PATHS } from './daily-speed-report'

test('daily report targets Josiah and prioritizes freeestimate', () => {
  expect(DAILY_REPORT_RECIPIENT).toBe('josiah@texasbathsolutions.com')
  expect(DAILY_REPORT_PATHS[0]).toBe('/freeestimate')
})
test('report runs at 4:58pm Central in standard time', () => {
  expect(centralReportTime(new Date('2026-11-13T22:58:00Z'))).toEqual({ due: true, date: '2026-11-13', slot: '16:58' })
  expect(centralReportTime(new Date('2026-11-13T21:58:00Z')).due).toBe(false)
  expect(centralReportTime(new Date('2026-11-13T22:57:00Z')).due).toBe(false)
})
test('report follows Central daylight saving time', () => {
  expect(centralReportTime(new Date('2027-07-13T21:58:00Z')).due).toBe(true)
  expect(centralReportTime(new Date('2027-07-13T22:58:00Z')).due).toBe(false)
})
test('report also runs at 7:58pm Central in both standard and daylight time', () => {
  expect(centralReportTime(new Date('2026-11-14T01:58:00Z')).due).toBe(true)
  expect(centralReportTime(new Date('2027-07-14T00:58:00Z')).due).toBe(true)
  expect(centralReportTime(new Date('2026-11-14T00:58:00Z')).due).toBe(false)
  expect(centralReportTime(new Date('2026-11-14T01:57:00Z')).due).toBe(false)
})
test('loading check detects missing form and calendar instead of passing a blank page', async () => {
  const result = await checkPageLoading('/freeestimate', async () => new Response('<html></html>'))
  expect(result.formPresent).toBe(false)
  expect(result.calendarPresent).toBe(false)
  expect(result.withinLimit).toBe(true)
})
test('freeestimate check flags loads over the 2.5 second limit', async () => {
  const slow = await checkPageLoading('/freeestimate', async () => {
    await new Promise(resolve => setTimeout(resolve, 2600))
    return new Response('<html><form></form><button aria-label="Next month"></button></html>')
  })
  expect(slow.withinLimit).toBe(false)
  const fast = await checkPageLoading('/freeestimate', async () => new Response('<html><form></form><button aria-label="Next month"></button></html>'))
  expect(fast.withinLimit).toBe(true)
})
test('both daily reports have distinct delivery identities while retries match', () => {
  const afternoon = centralReportTime(new Date('2026-11-13T22:58:00Z'))
  const evening = centralReportTime(new Date('2026-11-14T01:58:00Z'))
  expect(afternoon.date).toBe(evening.date)
  expect(afternoon.slot).toBe('16:58')
  expect(evening.slot).toBe('19:58')
  expect(`${afternoon.date}:${afternoon.slot}`).not.toBe(`${evening.date}:${evening.slot}`)
  expect(centralReportTime(new Date('2026-11-14T01:58:25Z'))).toEqual(evening)
})
test('loading check records server failures', async () => {
  const result = await checkPageLoading('/', async () => new Response('error', { status: 500 }))
  expect(result.ok).toBe(false)
  expect(result.status).toBe(500)
})