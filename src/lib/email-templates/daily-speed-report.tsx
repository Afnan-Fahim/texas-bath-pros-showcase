import { Body, Container, Head, Heading, Html, Link, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import type { PageSpeedCheck } from '../daily-speed-report'
import { DAILY_REPORT_RECIPIENT } from '../daily-speed-report'

interface Props { date?: string; checks?: PageSpeedCheck[]; futureSlots?: number; snapshotAt?: string; calendarStatus?: string; lastSlowAlert?: string }
function DailySpeedReport({ date = '', checks = [], futureSlots = 0, snapshotAt = 'Unknown', calendarStatus = 'Unknown', lastSlowAlert = 'None recorded' }: Props) {
  return <Html lang="en"><Head /><Preview>Daily website loading checks, with special attention to your free estimate page.</Preview>
    <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', color: '#12263F' }}>
      <Container style={{ maxWidth: '600px', padding: '28px' }}>
        <Text style={{ fontWeight: 'bold' }}>Texas Bath Solutions</Text>
        <Heading style={{ fontSize: '22px' }}>Daily website speed report — {date}</Heading>
        <Text>Scheduled for 4:58 p.m. Central Time. Measurements below are live checks made for this report.</Text>
        {checks.map(check => <Text key={check.path}><strong>{check.path === '/' ? 'Homepage' : check.path}</strong>: {(check.durationMs / 1000).toFixed(2)} seconds to download page HTML. {check.ok ? 'Page answered successfully.' : `Problem: ${check.status ? `HTTP ${check.status}` : 'request failed or timed out'}.`}{check.path === '/freeestimate' ? ` Form included: ${check.formPresent ? 'yes' : 'no'}. Calendar included: ${check.calendarPresent ? 'yes' : 'no'}.` : ''}</Text>)}
        <Heading style={{ fontSize: '18px' }}>Free estimate booking and slow-load alerts</Heading>
        <Text>Saved future appointment times: {futureSlots}. Last saved availability: {snapshotAt}. Last observed live calendar health: {calendarStatus}.</Text>
        <Text>Most recent recorded slow-load alert: {lastSlowAlert}. Visitor alerts use the 2.5-second limit and a four-hour cooldown; this is not a count of all slow visits.</Text>
        <Text style={{ fontSize: '13px' }}>These checks measure server response and HTML download, not phone rendering, image completion, JavaScript errors, or every visitor’s connection. Form/calendar inclusion does not prove a completed booking. Under 2 seconds on every phone cannot be guaranteed. No new visitor tracking is added for this daily report.</Text>
        <Link href="https://texasbathsolutions.com/freeestimate">Open the free estimate page</Link>
      </Container>
    </Body>
  </Html>
}
export const template = { component: DailySpeedReport, subject: (data: Record<string, unknown>) => `Texas Bath Solutions: daily website speed report — ${data.date ?? ''}`, displayName: 'Daily website speed report', to: DAILY_REPORT_RECIPIENT, previewData: { date: '2026-11-13', checks: [{ path: '/freeestimate', durationMs: 850, status: 200, ok: true, formPresent: true, calendarPresent: true }], futureSlots: 80, calendarStatus: 'healthy' } } satisfies TemplateEntry