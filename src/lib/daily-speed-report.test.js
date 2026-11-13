import { expect, test } from 'bun:test'
import { centralReportTime, checkPageLoading, DAILY_REPORT_RECIPIENT, DAILY_REPORT_PATHS } from './daily-speed-report'

test('daily report targets Josiah and prioritizes freeestimate', () => {
  expect(DAILY_REPORT_RECIPIENT).toBe('josiah@texasbathsolutions.com')
  expect(DAILY_REPORT_PATHS[0]).toBe('/freeestimate')
})
test('report runs at 4:58pm Central in standard time', () => {
  expect(centralReportTime(new Date('2026-11-13T22:58:00Z'))).toEqual({ due: true, date: '2026-11-13' })
  expect(centralReportTime(new Date('2026-11-13T21:58:00Z')).due).toBe(false)
  expect(centralReportTime(new Date('2026-11-13T22:57:00Z')).due).toBe(false)
})
test('report follows Central daylight saving time', () => {
  expect(centralReportTime(new Date('2027-07-13T21:58:00Z')).due).toBe(true)
  expect(centralReportTime(new Date('2027-07-13T22:58:00Z')).due).toBe(false)
})
test('loading check detects missing form and calendar instead of passing a blank page', async () => {
  const result = await checkPageLoading('/freeestimate', async () => new Response('<html></html>'))
  expect(result.formPresent).toBe(false)
  expect(result.calendarPresent).toBe(false)
})
test('loading check records server failures', async () => {
  const result = await checkPageLoading('/', async () => new Response('error', { status: 500 }))
  expect(result.ok).toBe(false)
  expect(result.status).toBe(500)
})