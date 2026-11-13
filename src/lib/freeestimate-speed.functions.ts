import { createServerFn } from '@tanstack/react-start'
import { speedReportSchema } from './freeestimate-speed'

export const getSpeedReportToken = createServerFn({ method: 'GET' }).handler(async () => {
  const secret = process.env['FREEESTIMATE_SPEED_SIGNING_KEY']
  if (!secret) return { token: null }
  const { issueSpeedToken } = await import('./freeestimate-speed-token.server')
  return { token: await issueSpeedToken(secret) }
})

export const reportEstimateSpeed = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => speedReportSchema.parse(input))
  .handler(async ({ data }) => {
    const secret = process.env['FREEESTIMATE_SPEED_SIGNING_KEY']
    if (!secret) throw new Error('Speed monitoring unavailable')
    const { verifySpeedToken } = await import('./freeestimate-speed-token.server')
    if (!await verifySpeedToken(data.token, secret)) throw new Error('Invalid speed report')
    const { processSpeedReport } = await import('./freeestimate-speed')
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { sendTemplateEmail } = await import('./email-templates/send-email')
    return processSpeedReport(data, {
      now: Date.now(),
      read: async () => {
        const { data: row, error } = await supabaseAdmin.from('freeestimate_availability').select('speed_state').eq('id', 1).single()
        if (error || !row) throw new Error('Speed monitor state unavailable')
        return row.speed_state as { lastAlertAt: string | null }
      },
      claim: async (previous, next) => {
        const { data: rows, error } = await supabaseAdmin.from('freeestimate_availability').update({ speed_state: next }).eq('id', 1).eq('speed_state', JSON.stringify(previous)).select('id')
        if (error) throw new Error('Speed monitor update failed')
        return !!rows?.length
      },
      send: async (to, report, eventId) => {
        const result = await sendTemplateEmail('slow-estimate-page', to, {
          templateData: { durationMs: report.durationMs, device: report.device, calendarReady: report.calendarReady }, idempotencyKey: eventId,
        })
        if (!result.sent) console.warn('[freeestimate] Speed alert suppressed; no retry attempted.')
        return result
      },
      rollback: async (next, previous) => {
        await supabaseAdmin.from('freeestimate_availability').update({ speed_state: previous }).eq('id', 1).eq('speed_state', JSON.stringify(next))
      },
    })
  })