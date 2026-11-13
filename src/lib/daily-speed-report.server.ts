import { centralReportTime, checkPageLoading, DAILY_REPORT_PATHS, DAILY_REPORT_RECIPIENT } from './daily-speed-report'

export async function sendDailySpeedReport(now = new Date()) {
  const timing = centralReportTime(now)
  if (!timing.due) return { skipped: true }
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  const { sendTemplateEmail } = await import('./email-templates/send-email')
  const [checks, snapshot] = await Promise.all([
    Promise.all(DAILY_REPORT_PATHS.map(path => checkPageLoading(path))),
    supabaseAdmin.from('freeestimate_availability').select('times, updated_at, monitor_state, speed_state').eq('id', 1).single(),
  ])
  const row = snapshot.error ? null : snapshot.data
  const health = row?.monitor_state as { status?: string } | undefined
  const speed = row?.speed_state as { lastAlertAt?: string } | undefined
  const format = (value?: string | null) => value ? new Date(value).toLocaleString('en-US', { timeZone: 'America/Chicago', timeZoneName: 'short' }) : 'Unknown'
  const result = await sendTemplateEmail('daily-speed-report', DAILY_REPORT_RECIPIENT, {
    idempotencyKey: `scheduled-daily-speed-report:${timing.date}:${timing.slot}`,
    templateData: { date: timing.date, checks, futureSlots: Array.isArray(row?.times) ? row.times.filter(time => typeof time === 'string' && Date.parse(time) > now.getTime()).length : 0, snapshotAt: format(row?.updated_at), calendarStatus: health?.status ?? 'Unknown — availability status could not be read', lastSlowAlert: speed?.lastAlertAt ? format(speed.lastAlertAt) : 'None recorded' },
  })
  return { skipped: false, sent: result.sent }
}