export const DAILY_REPORT_RECIPIENT = 'josiah@texasbathsolutions.com'
export const DAILY_REPORT_PATHS = ['/freeestimate', '/', '/estimate'] as const
export const FREEESTIMATE_LOAD_LIMIT_MS = 2500

export function centralReportTime(now: Date) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now)
  const value = (type: string) => parts.find(part => part.type === type)?.value
  const due = (value('hour') === '16' || value('hour') === '19') && value('minute') === '58'
  return { due, date: `${value('year')}-${value('month')}-${value('day')}`, slot: `${value('hour')}:${value('minute')}` }
}

export interface PageSpeedCheck {
  path: string
  durationMs: number
  status: number | null
  ok: boolean
  formPresent?: boolean
  calendarPresent?: boolean
  withinLimit?: boolean
}

export async function checkPageLoading(path: typeof DAILY_REPORT_PATHS[number], fetcher: typeof fetch = fetch): Promise<PageSpeedCheck> {
  const started = performance.now()
  try {
    const response = await fetcher(`https://texasbathsolutions.com${path}`, { signal: AbortSignal.timeout(12000), headers: { 'User-Agent': 'TexasBathSolutions-DailyHealthCheck/1.0', 'Cache-Control': 'no-cache' }, redirect: 'error' })
    const html = await response.text()
    return { path, durationMs: Math.round(performance.now() - started), status: response.status, ok: response.ok,
      ...(path === '/freeestimate' ? { formPresent: /<form[\s>]/i.test(html), calendarPresent: /aria-label="Next month"/.test(html), withinLimit: response.ok && performance.now() - started <= FREEESTIMATE_LOAD_LIMIT_MS } : {}) }
  } catch {
    return { path, durationMs: Math.round(performance.now() - started), status: null, ok: false }
  }
}