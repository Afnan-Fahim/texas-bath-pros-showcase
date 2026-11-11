import { expect, test } from 'bun:test'
import { fetchEstimateAvailability } from './freeestimate-availability.server'

test('both calendar weeks start concurrently and preserve open time order', async () => {
  const pending = []
  const result = fetchEstimateAvailability('https://api.calendly.com/event_types/test', (path, init) => new Promise(resolve => pending.push({ path, init, resolve })), Date.parse('2026-11-11T04:00:00Z'))
  expect(pending.length).toBe(2)
  expect(new URL(`https://api.calendly.com${pending[0].path}`).searchParams.get('start_time')).toBe('2026-11-11T04:05:00.000Z')
  expect(new URL(`https://api.calendly.com${pending[1].path}`).searchParams.get('start_time')).toBe('2026-11-18T04:05:00.000Z')
  pending[1].resolve(Response.json({ collection: [{ start_time: '2026-11-18T16:00:00Z', status: 'available' }] }))
  pending[0].resolve(Response.json({ collection: [{ start_time: '2026-11-11T16:00:00Z', status: 'available' }, { start_time: '2026-11-11T17:00:00Z', status: 'unavailable' }] }))
  expect((await result).times).toEqual(['2026-11-11T16:00:00Z', '2026-11-18T16:00:00Z'])
})