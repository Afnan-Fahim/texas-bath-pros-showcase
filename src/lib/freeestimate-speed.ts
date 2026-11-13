import { z } from 'zod'

export const SLOW_PAGE_THRESHOLD_MS = 2500
export const SPEED_ALERT_COOLDOWN_MS = 4 * 60 * 60 * 1000
export const SPEED_ALERT_RECIPIENT = 'josiah@texasbathsolutions.com'
export const speedReportSchema = z.object({
  token: z.string().min(20).max(512),
  durationMs: z.number().finite().min(0).max(600000),
  device: z.enum(['phone', 'computer']),
  calendarReady: z.boolean(),
}).strict()
export type SpeedReport = z.infer<typeof speedReportSchema>
export type SpeedAlertState = { lastAlertAt: string | null }

export function shouldAlertSlowPage(durationMs: number, previous: SpeedAlertState, now: number) {
  return durationMs > SLOW_PAGE_THRESHOLD_MS && (!previous.lastAlertAt || now - Date.parse(previous.lastAlertAt) >= SPEED_ALERT_COOLDOWN_MS)
}

export async function processSpeedReport(report: SpeedReport, dependencies: {
  now: number
  read: () => Promise<SpeedAlertState>
  claim: (previous: SpeedAlertState, next: SpeedAlertState) => Promise<boolean>
  send: (to: string, report: SpeedReport, eventId: string) => Promise<unknown>
  rollback: (next: SpeedAlertState, previous: SpeedAlertState) => Promise<void>
  recover?: () => Promise<void>
}) {
  if (report.durationMs <= SLOW_PAGE_THRESHOLD_MS) return { alerted: false }
  const previous = await dependencies.read()
  if (!shouldAlertSlowPage(report.durationMs, previous, dependencies.now)) return { alerted: false }
  const next = { lastAlertAt: new Date(dependencies.now).toISOString() }
  if (!await dependencies.claim(previous, next)) return { alerted: false }
  try {
    await dependencies.send(SPEED_ALERT_RECIPIENT, report, `slow-estimate-${Math.floor(dependencies.now / SPEED_ALERT_COOLDOWN_MS)}`)
    return { alerted: true }
  } catch (error) {
    await dependencies.rollback(next, previous)
    throw error
  } finally {
    // Recovery is independent of email delivery and cannot turn a sent alert
    // into a failed report or cause duplicate warnings.
    if (dependencies.recover) {
      try { await dependencies.recover() }
      catch (error) { console.error('[freeestimate] Automatic speed-alert recovery failed', error instanceof Error ? error.message : 'Unknown failure') }
    }
  }
}