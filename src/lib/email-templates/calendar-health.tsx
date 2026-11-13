import { Body, Container, Head, Heading, Html, Link, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props { kind?: 'warning' | 'recovery'; detail?: string; checkedAt?: string }

function CalendarHealthEmail({ kind = 'warning', detail = '', checkedAt }: Props) {
  const recovered = kind === 'recovery'
  const checked = checkedAt ? new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short',
  }).format(new Date(checkedAt)) : ''
  return (
    <Html lang="en">
      <Head />
      <Preview>{recovered ? 'Open estimate times are available again.' : 'The estimate calendar needs attention.'}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', color: '#12263F' }}>
        <Container style={{ maxWidth: '600px', padding: '28px' }}>
          <Text style={{ fontWeight: 'bold' }}>Texas Bath Solutions</Text>
          <Heading style={{ fontSize: '22px', color: '#0D3B66' }}>{recovered ? 'Booking calendar is working again' : 'Booking calendar needs attention'}</Heading>
          <Text>{recovered
            ? 'Both weeks were checked successfully and open appointment times are available again.'
            : 'A check of the /freeestimate booking calendar found a problem. Visitors may still see previously saved times, but those times may not reflect current availability.'}</Text>
          <Text>{detail}</Text>
          {!recovered && <Text>Please open the Hassle Free Bath Estimate event in Calendly and check its availability and calendar connection. If Calendly shows open times but the website does not, the website needs investigation.</Text>}
          <Text><Link href="https://texasbathsolutions.com/freeestimate">View the estimate page</Link> · <Link href="https://calendly.com/rugsafari/texas-bath-solutions">View Calendly</Link></Text>
          {checked && <Text>Checked: {checked} (Central Time)</Text>}
          <Text style={{ fontSize: '13px' }}>Checks run when visitors open or refresh the estimate calendar. While a problem continues, warning emails are limited to one every four hours. A recovery email follows a successful check with open times.</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: CalendarHealthEmail,
  displayName: 'Estimate calendar health',
  subject: (data: Record<string, unknown>) => data['kind'] === 'recovery'
    ? 'Texas Bath Solutions: booking calendar is working again'
    : 'Texas Bath Solutions: booking calendar needs attention',
  previewData: { kind: 'warning', detail: 'Calendly returned no open times for the next 14 days.', checkedAt: '2026-11-13T02:29:00Z' },
} satisfies TemplateEntry