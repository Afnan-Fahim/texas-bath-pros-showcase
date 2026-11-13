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

test('automatic recovery retries transient failures and refreshes real times', async () => {
  let calls = 0
  const result = await fetchEstimateAvailability('test', async () => {
    calls++
    return calls <= 2 ? new Response('Temporary error', { status: 503 }) : Response.json({ collection: [{ start_time: '2026-11-20T16:00:00Z', status: 'available' }] })
  }, Date.now(), true)
  expect(calls).toBe(4)
  expect(result.status).toBe('healthy')
  expect(result.times).toHaveLength(2)
})

test('automatic recovery does not loop on account errors or empty availability', async () => {
  let calls = 0
  const result = await fetchEstimateAvailability('test', async () => { calls++; return new Response('Account error', { status: 400 }) }, Date.now(), true)
  expect(calls).toBe(2)
  expect(result.status).toBe('failed')
  const empty = await fetchEstimateAvailability('test', async () => { calls++; return Response.json({ collection: [] }) }, Date.now(), true)
  expect(calls).toBe(4)
  expect(empty.times).toEqual([])
})

test('recovery respects long provider cooldown without immediately retrying', async () => {
  let calls = 0
  await fetchEstimateAvailability('test', async () => { calls++; return new Response('Wait', { status: 429, headers: { 'Retry-After': '60' } }) }, Date.now(), true)
  expect(calls).toBe(2)
})

test('persistent transient failure stops at three attempts per week', async () => {
  let calls = 0
  const result = await fetchEstimateAvailability('test', async () => { calls++; return new Response('Temporary error', { status: 503 }) }, Date.now(), true)
  expect(calls).toBe(6)
  expect(result.status).toBe('failed')
  expect(result.times).toEqual([])
})