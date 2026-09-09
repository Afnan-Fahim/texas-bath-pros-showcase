import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(7).max(32),
  email: z.string().trim().email().max(160),
  address: z.string().trim().min(1).max(240),
  timeframe: z.string().trim().max(80).optional().default(''),
  notes: z.string().trim().max(2000).optional().default(''),
  source: z.string().trim().max(120).optional().default('Website booking form'),
})

export const submitLead = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    const { notifyLead } = await import('./leads.server')
    return notifyLead(data)
  })

const scheduledLeadSchema = z.object({
  leadData: leadSchema,
  // Calendly does not always hand us an event URI; the notification must still go out.
  eventUri: z.union([z.string().url(), z.literal('')]).optional().default(''),
})

export const scheduleLead = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => scheduledLeadSchema.parse(data))
  .handler(async ({ data }) => {
    const CALENDLY_TOKEN = "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzg4ODIxMDUyLCJqdGkiOiIyZGY4MDVjNi05MTIyLTRmOGItOTBhNS1jZGM1MjIxYTM1ZDEiLCJ1c2VyX3V1aWQiOiI4YjI2NWJhOC1kOGU1LTQ1MjktYjcyMi0wZWU5MWUzNGZjNmQiLCJzY29wZSI6ImF2YWlsYWJpbGl0eTpyZWFkIGF2YWlsYWJpbGl0eTp3cml0ZSBldmVudF90eXBlczpyZWFkIGV2ZW50X3R5cGVzOndyaXRlIGxvY2F0aW9uczpyZWFkIHJvdXRpbmdfZm9ybXM6cmVhZCBzaGFyZXM6d3JpdGUgc2NoZWR1bGVkX2V2ZW50czpyZWFkIHNjaGVkdWxlZF9ldmVudHM6d3JpdGUgc2NoZWR1bGluZ19saW5rczp3cml0ZSBncm91cHM6cmVhZCBvcmdhbml6YXRpb25zOnJlYWQgb3JnYW5pemF0aW9uczp3cml0ZSB1c2VyczpyZWFkIGNvbnRhY3RzOnJlYWQgY29udGFjdHM6d3JpdGUgbWVldGluZ19yZWNhcHM6cmVhZCBtZWV0aW5nX3JlY2Fwczp3cml0ZSBhY3Rpdml0eV9sb2c6cmVhZCBkYXRhX2NvbXBsaWFuY2U6d3JpdGUgb3V0Z29pbmdfY29tbXVuaWNhdGlvbnM6cmVhZCB3ZWJob29rczpyZWFkIHdlYmhvb2tzOndyaXRlIn0.sE3Xb-I4SKszlKQOQrFxwnuVOq0-UO1YcCtbkdmloQL1uCv0-iC9C-hwgqZpgMm6gdjFCJkW5W-biv6bX00q6w"

    let appointmentDate: string | undefined

    try {
      const response = await fetch(data.eventUri, {
        headers: {
          Authorization: `Bearer ${CALENDLY_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const result = await response.json()
        const startTime = result.resource?.start_time

        if (startTime) {
          appointmentDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Chicago',
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          }).format(new Date(startTime))
        } else {
          console.error('Calendly event had no start_time', data.eventUri)
        }
      } else {
        console.error('Calendly lookup failed', response.status, data.eventUri)
      }
    } catch (e) {
      console.error('Failed to fetch calendly details', e)
    }

    const { notifyLead } = await import('./leads.server')
    return notifyLead({
      ...data.leadData,
      source: 'Calendly Scheduled Appt',
      ...(appointmentDate
        ? { appointmentDate }
        : { notes: `${data.leadData.notes ?? ''}\nAppointment time unavailable — Calendly event: ${data.eventUri}`.trim() }),
    })
  })
