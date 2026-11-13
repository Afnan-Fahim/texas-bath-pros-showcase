import { processCalendarObservation, type CalendarHealthState, type CalendarObservation } from './freeestimate-calendar-health'

export async function recordCalendarHealth(observation: CalendarObservation) {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  const { sendTemplateEmail } = await import('./email-templates/send-email')
  await processCalendarObservation(observation, {
    read: async () => {
      const { data, error } = await supabaseAdmin.from('freeestimate_availability').select('monitor_state').eq('id', 1).single()
      if (error || !data) throw new Error('Cannot read calendar health state')
      return data.monitor_state as CalendarHealthState
    },
    claim: async (previous, next) => {
      const { data, error } = await supabaseAdmin.from('freeestimate_availability')
        .update({ monitor_state: next }).eq('id', 1).eq('monitor_state', JSON.stringify(previous)).select('id')
      if (error) throw new Error('Cannot update calendar health state')
      return !!data?.length
    },
    send: async (recipient, notice) => {
      const result = await sendTemplateEmail('calendar-health', recipient, {
        templateData: notice, idempotencyKey: `calendar-health-${notice.eventId}-${recipient}`,
      })
      if (!result.sent) console.warn('[freeestimate] Calendar alert recipient is suppressed; no retry attempted.')
      return result
    },
    rollback: async (next, previous) => {
      const { error } = await supabaseAdmin.from('freeestimate_availability')
        .update({ monitor_state: previous }).eq('id', 1).eq('monitor_state', JSON.stringify(next))
      if (error) throw new Error('Cannot restore calendar health state after send failure')
    },
  })
}