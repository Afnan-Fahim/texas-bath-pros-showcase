import { Body, Container, Head, Heading, Html, Link, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import type { PageSpeedCheck } from '../daily-speed-report'
import { DAILY_REPORT_RECIPIENT } from '../daily-speed-report'

interface Props { date?: string; checks?: PageSpeedCheck[]; futureSlots?: number; snapshotAt?: string; calendarStatus?: string; lastSlowAlert?: string }

function summarize(checks: PageSpeedCheck[], futureSlots: number) {
  const fe = checks.find(c => c.path === '/freeestimate')
  const siteDown = checks.some(c => !c.ok)
  const formBroken = !fe || !fe.ok || !fe.formPresent || !fe.calendarPresent
  const noTimes = futureSlots <= 0
  const secs = fe ? fe.durationMs / 1000 : 0
  const problems: string[] = []
  if (siteDown) problems.push('One or more pages did not load.')
  if (formBroken) problems.push('The free estimate form or calendar is not showing.')
  if (noTimes) problems.push('No appointment times are open for customers to book.')
  if (problems.length) return { color: '#C0392B', headline: '⚠️ Something needs attention', problems, secs }
  if (secs > 2) return { color: '#D68910', headline: '🟡 Everything is working — the speed is a little slow', problems, secs }
  return { color: '#1E8449', headline: '✅ Everything is working — running perfect', problems, secs }
}

function DailySpeedReport({ date = '', checks = [], futureSlots = 0 }: Props) {
  const s = summarize(checks, futureSlots)
  const fe = checks.find(c => c.path === '/freeestimate')
  const yes = (ok: boolean) => (ok ? '✅ Working' : '❌ Not working')
  return <Html lang="en"><Head /><Preview>{s.headline}</Preview>
    <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', color: '#12263F' }}>
      <Container style={{ maxWidth: '560px', padding: '28px' }}>
        <Text style={{ fontWeight: 'bold', margin: 0 }}>Texas Bath Solutions — {date}</Text>
        <Heading style={{ fontSize: '24px', color: s.color }}>{s.headline}</Heading>
        {s.problems.map(p => <Text key={p} style={{ fontSize: '16px' }}>• {p}</Text>)}
        <Text style={{ fontSize: '16px', lineHeight: '28px' }}>
          Website: {yes(!checks.some(c => !c.ok))}<br />
          Free estimate form: {yes(!!fe?.ok && !!fe?.formPresent)}<br />
          Calendar: {yes(!!fe?.calendarPresent && futureSlots > 0)}<br />
          Speed: {fe ? `${s.secs.toFixed(1)} seconds` : 'Unknown'} {fe ? (s.secs <= 2 ? '(fast)' : '(a little slow)') : ''}
        </Text>
        <Link href="https://texasbathsolutions.com/freeestimate">Open the free estimate page</Link>
      </Container>
    </Body>
  </Html>
}
export const template = { component: DailySpeedReport, subject: (data: Record<string, unknown>) => `Website check ${data.date ?? ''}: ${summarize((data.checks as PageSpeedCheck[]) ?? [], Number(data.futureSlots ?? 0)).headline.replace(/^\S+\s/, '')}`, displayName: 'Daily website speed report', to: DAILY_REPORT_RECIPIENT, previewData: { date: '2026-11-13', checks: [{ path: '/freeestimate', durationMs: 850, status: 200, ok: true, formPresent: true, calendarPresent: true }], futureSlots: 80, calendarStatus: 'healthy' } } satisfies TemplateEntry
