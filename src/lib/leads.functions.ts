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
    const { CALENDLY_TOKEN } = await import('./calendly.server')

    let appointmentDate: string | undefined
    let inviteeEmail: string | undefined
    let inviteeName: string | undefined
    let rescheduleUrl: string | undefined

    try {
      if (!data.eventUri) throw new Error('No Calendly event URI provided')
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

    // The customer's real email address is collected by Calendly, not by our form.
    try {
      if (data.eventUri) {
        const inviteeRes = await fetch(`${data.eventUri}/invitees`, {
          headers: {
            Authorization: `Bearer ${CALENDLY_TOKEN}`,
            'Content-Type': 'application/json'
          }
        })
        if (inviteeRes.ok) {
          const invitees = await inviteeRes.json()
          const invitee = invitees.collection?.[0]
          inviteeEmail = invitee?.email
          inviteeName = invitee?.name
          rescheduleUrl = invitee?.reschedule_url ?? invitee?.cancel_url
        } else {
          console.error('Calendly invitee lookup failed', inviteeRes.status, data.eventUri)
        }
      }
    } catch (e) {
      console.error('Failed to fetch calendly invitee', e)
    }

    const { notifyLead, sendCustomerConfirmation } = await import('./leads.server')

    if (inviteeEmail) {
      await sendCustomerConfirmation({
        email: inviteeEmail,
        name: inviteeName ?? data.leadData.name,
        phone: data.leadData.phone,
        address: data.leadData.address,
        eventUri: data.eventUri,
        ...(appointmentDate ? { appointmentDate } : {}),
        ...(rescheduleUrl ? { rescheduleUrl } : {}),
      })
    }

    return notifyLead({
      ...data.leadData,
      ...(inviteeEmail ? { email: inviteeEmail } : {}),
      source: 'Calendly Scheduled Appt',
      ...(appointmentDate
        ? { appointmentDate }
        : { notes: `${data.leadData.notes ?? ''}\nAppointment time unavailable — Calendly event: ${data.eventUri}`.trim() }),
    })
  })
