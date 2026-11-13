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

// Calendly's availability API can take 6–8s, so the page renders from the last
// saved copy instantly; the browser then asks for fresh times, which also
// updates the saved copy. Booking still validates the slot with Calendly.
async function liveTimes() {
  const { refreshEstimateAvailability } = await import('./freeestimate-recovery.server')
  return refreshEstimateAvailability()
}

export const getFreeEstimateTimes = createServerFn({ method: 'GET' })
  .inputValidator((input: unknown) => z.object({ fresh: z.boolean().optional() }).optional().parse(input))
  .handler(async ({ data }) => {
    if (!data?.fresh) {
      const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
      const { data: row } = await supabaseAdmin.from('freeestimate_availability').select('times').eq('id', 1).maybeSingle()
      const now = Date.now()
      const times = ((row?.times as string[] | null) ?? []).filter(t => Date.parse(t) > now + 5 * 60 * 1000)
      if (times.length) return { times }
      // Never hold the first page load on a slow Calendly; the browser refreshes after.
      const live = liveTimes()
      return Promise.race([live, new Promise<{ times: string[] }>(r => setTimeout(() => r({ times: [] }), 1500))])
    }
    return liveTimes()
  })

export const bookFreeEstimate = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => z.object({ submissionId: z.string().uuid(), startTime: z.string().datetime() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { data: lead } = await supabaseAdmin.from('leads').select('id,name,email,phone,address,homeowner,desired_upgrade,main_problem,timeframe,booked,notes,source').eq('id', data.submissionId).maybeSingle()
    if (!lead || lead.source !== 'Free estimate form') throw new Error('Please fill in the form again.')
    if (lead.booked) return { booked: true }
    // Calendly marks all three questions required; the page no longer asks about homeowner.
    const questionsAndAnswers = [
      { question: 'What is the Address?', answer: lead.address || 'Not provided', position: 0 },
      { question: 'Phone Number?', answer: lead.phone || 'Not provided', position: 1 },
      { question: 'Are you the Homeowner?', answer: lead.homeowner || 'Not asked', position: 2 },
    ]
    const res = await calendly('/invitees', {
      method: 'POST',
      body: JSON.stringify({
        event_type: EVENT_TYPE,
        start_time: data.startTime,
        invitee: { name: lead.name.trim(), email: lead.email.trim(), timezone: 'America/Chicago' },
        questions_and_answers: questionsAndAnswers,
      }),
    })
    if (!res.ok) {
      const detail = await res.text()
      console.error('freeestimate booking failed', res.status, detail)
      const taken = res.status === 409 || /no longer available|not available|unavailable|already (booked|taken)/i.test(detail)
      throw new Error(taken
        ? 'That time was just taken. Please pick another time.'
        : "We couldn't book that time. Please try again, or call or text (210) 373-4295.")
    }
    const bookedNotes = (lead.notes ?? '').replace('FORM SUBMITTED — NOT BOOKED YET', `BOOKED ${data.startTime}`)
    await supabaseAdmin.from('leads').update({ booked: true, notes: bookedNotes }).eq('id', lead.id)
    const appointmentDate = `${new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(data.startTime))} (Central Time)`
    const { sendTemplateEmail } = await import('./email-templates/send-email')
    const { FREE_ESTIMATE_RECIPIENTS } = await import('./freeestimate-schema')
    const submittedAt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' }).format(new Date())
    const results = await Promise.allSettled(FREE_ESTIMATE_RECIPIENTS.map(to => sendTemplateEmail('lead-notification', to, {
      templateData: {
        name: lead.name, email: lead.email, phone: lead.phone, address: lead.address,
        homeowner: lead.homeowner, desiredUpgrade: lead.desired_upgrade, mainProblem: lead.main_problem,
        timeframe: lead.timeframe, notes: bookedNotes, source: 'Free estimate form',
        submittedAt, appointmentDate, appointmentAtTop: true,
      },
      replyTo: lead.email, idempotencyKey: `freeestimate-booked-${lead.id}-${to}`,
    })))
    if (results.some(r => r.status !== 'fulfilled' || !r.value.sent)) {
      console.error('[freeestimate] Booking notification email failed; booking itself remains confirmed.')
    }
    return { booked: true }
  })
