import { Body, Container, Head, Heading, Html, Link, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

function SlowEstimatePage({ durationMs = 0, device = 'phone', calendarReady = false }: { durationMs?: number; device?: string; calendarReady?: boolean }) {
  return <Html lang="en"><Head /><Preview>The estimate page exceeded your 2.5-second loading limit.</Preview>
    <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', color: '#12263F' }}>
      <Container style={{ maxWidth: '600px', padding: '28px' }}>
        <Text style={{ fontWeight: 'bold' }}>Texas Bath Solutions</Text>
        <Heading style={{ color: '#0D3B66', fontSize: '22px' }}>Estimate page loading is slow</Heading>
        <Text>A visitor’s {device} reported that /freeestimate took {(durationMs / 1000).toFixed(2)} seconds to display the form and calendar and become interactive. Your alert limit is longer than 2.5 seconds.</Text>
        <Text>{calendarReady ? 'Available calendar days were present when measured.' : 'Available calendar days were not present when measured; check the calendar too.'}</Text>
        <Text>This measures navigation through the first frame after the page becomes interactive; it includes connection and device delays. It is not a measurement of every image or third-party script finishing.</Text>
        <Text><Link href="https://texasbathsolutions.com/freeestimate">Check the estimate page</Link></Text>
        <Text style={{ fontSize: '13px' }}>Repeated slow visits produce at most one warning every four hours. No visitor contact details are collected by this alert.</Text>
      </Container>
    </Body>
  </Html>
}
export const template = { component: SlowEstimatePage, subject: 'Texas Bath Solutions: estimate page took over 2.5 seconds', displayName: 'Slow estimate page', previewData: { durationMs: 3200, device: 'phone', calendarReady: true } } satisfies TemplateEntry