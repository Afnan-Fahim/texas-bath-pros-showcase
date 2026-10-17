import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

// /freeestimate books directly through the Calendly API so visitors never
// re-type their details inside Calendly. The lead row saved by our form is the
// only source of the invitee's name, email, phone, address and homeowner answer.
const EVENT_TYPE = 'https://api.calendly.com/event_types/fade14bc-6fea-43a5-9df1-91afe922dbec'

async function calendly(path: string, init?: RequestInit) {
  const { CALENDLY_TOKEN } = await import('./calendly.server')
  return fetch(`https://api.calendly.com${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${CALENDLY_TOKEN}`, 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
}

export const getFreeEstimateTimes = createServerFn({ method: 'GET' }).handler(async () => {
  const times: string[] = []
  const now = Date.now() + 5 * 60 * 1000
  for (let week = 0; week < 2; week++) {
    const start = new Date(now + week * 7 * 864e5).toISOString()
    const end = new Date(now + (week + 1) * 7 * 864e5 - 60000).toISOString()
    const res = await calendly(`/event_type_available_times?event_type=${encodeURIComponent(EVENT_TYPE)}&start_time=${start}&end_time=${end}`)
    if (!res.ok) continue
    const body = (await res.json()) as { collection?: { start_time: string; status: string }[] }
    for (const slot of body.collection ?? []) if (slot.status === 'available') times.push(slot.start_time)
  }
  return { times }
})

export const bookFreeEstimate = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => z.object({ submissionId: z.string().uuid(), startTime: z.string().datetime() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { data: lead } = await supabaseAdmin.from('leads').select('id,name,email,phone,address,homeowner,booked,notes,source').eq('id', data.submissionId).maybeSingle()
    if (!lead || lead.source !== 'Free estimate form') throw new Error('Please fill in the form again.')
    if (lead.booked) return { booked: true }
    const res = await calendly('/invitees', {
      method: 'POST',
      body: JSON.stringify({
        event_type: EVENT_TYPE,
        start_time: data.startTime,
        invitee: { name: lead.name.trim(), email: lead.email.trim(), timezone: 'America/Chicago' },
        questions_and_answers: [
          { question: 'What is the Address?', answer: lead.address ?? '', position: 0 },
          { question: 'Phone Number?', answer: lead.phone ?? '', position: 1 },
          { question: 'Are you the Homeowner?', answer: lead.homeowner ?? '', position: 2 },
        ],
      }),
    })
    if (!res.ok) {
      console.error('freeestimate booking failed', res.status, await res.text())
      throw new Error('That time was just taken. Please pick another time.')
    }
    await supabaseAdmin.from('leads').update({ booked: true, notes: (lead.notes ?? '').replace('FORM SUBMITTED — NOT BOOKED YET', `BOOKED ${data.startTime}`) }).eq('id', lead.id)
    return { booked: true }
  })
