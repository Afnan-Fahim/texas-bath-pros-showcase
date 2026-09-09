import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface AppointmentConfirmationProps {
  name?: string
  appointmentDate?: string
  address?: string
  phone?: string
  rescheduleUrl?: string
}

const paragraph = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 14px' } as const

function AppointmentConfirmation({
  name,
  appointmentDate,
  address,
  phone,
  rescheduleUrl,
}: AppointmentConfirmationProps) {
  const firstName = name && name.trim() ? name.trim().split(' ')[0] : 'there'

  return (
    <Html>
      <Head />
      <Preview>
        {appointmentDate
          ? `Your free estimate is confirmed for ${appointmentDate}`
          : 'Your free estimate with Texas Bath Solutions is confirmed'}
      </Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif', margin: 0, padding: '32px 0' }}>
        <Container style={{ maxWidth: '600px', padding: '0 24px' }}>
          <Heading style={{ color: '#0D3B66', fontSize: '24px', margin: '0 0 16px' }}>
            Your appointment is confirmed
          </Heading>
          <Text style={paragraph}>Hi {firstName},</Text>
          <Text style={paragraph}>
            Thanks for booking your free in-home estimate with Texas Bath Solutions. Here are your details:
          </Text>

          <Section style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '20px 24px', margin: '0 0 20px' }}>
            {appointmentDate && (
              <Text style={{ ...paragraph, margin: '0 0 8px' }}>
                <strong style={{ color: '#0D3B66' }}>When:</strong> {appointmentDate} (Central Time)
              </Text>
            )}
            {address && (
              <Text style={{ ...paragraph, margin: '0 0 8px' }}>
                <strong style={{ color: '#0D3B66' }}>Where:</strong> {address}
              </Text>
            )}
            {phone && (
              <Text style={{ ...paragraph, margin: 0 }}>
                <strong style={{ color: '#0D3B66' }}>Phone on file:</strong> {phone}
              </Text>
            )}
          </Section>

          <Text style={paragraph}>
            A design consultant will call before arriving. The visit takes about 60–90 minutes and includes
            measurements, product options, and an exact price — no obligation.
          </Text>

          {rescheduleUrl && (
            <Button
              href={rescheduleUrl}
              style={{
                backgroundColor: '#0D3B66',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '12px 22px',
                fontSize: '15px',
                fontWeight: 'bold',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Reschedule or cancel
            </Button>
          )}

          <Hr style={{ borderColor: '#E4E9EF', margin: '28px 0 16px' }} />
          <Text style={{ fontSize: '13px', color: '#5A6B7B', margin: '0 0 6px' }}>
            Questions? Reply to this email or call (210) 702-0753.
          </Text>
          <Text style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
            Texas Bath Solutions • San Antonio, TX
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: AppointmentConfirmation,
  displayName: 'Appointment Confirmation (customer)',
  subject: (data: Record<string, any>) =>
    data?.['appointmentDate']
      ? `You're confirmed for ${data['appointmentDate']} — Texas Bath Solutions`
      : `Your free estimate is confirmed — Texas Bath Solutions`,
  previewData: {
    name: 'John Doe',
    appointmentDate: 'Monday, September 14, 2026 at 10:00 AM',
    address: '123 Main St, San Antonio, TX',
    phone: '(210) 555-0123',
    rescheduleUrl: 'https://calendly.com/reschedulings/abc123',
  },
} satisfies TemplateEntry
