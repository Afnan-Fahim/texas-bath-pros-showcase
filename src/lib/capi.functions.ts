import { createServerFn } from '@tanstack/react-start'
import { getRequest, getRequestHeader } from '@tanstack/react-start/server'
import { z } from 'zod'

const capiSchema = z.object({
  eventName: z.enum(['Lead', 'Schedule', 'Contact', 'CompleteRegistration']),
  eventId: z.string().trim().min(1).max(120),
  eventSourceUrl: z.string().trim().max(500).optional().default(''),
  email: z.string().trim().max(160).optional().default(''),
  phone: z.string().trim().max(40).optional().default(''),
  firstName: z.string().trim().max(80).optional().default(''),
  lastName: z.string().trim().max(80).optional().default(''),
  fbc: z.string().trim().max(255).optional().default(''),
  fbp: z.string().trim().max(255).optional().default(''),
  value: z.number().nonnegative().max(100000).optional(),
  currency: z.string().trim().max(8).optional().default('USD'),
  contentName: z.string().trim().max(120).optional().default(''),
})

export const trackServerEvent = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => capiSchema.parse(data))
  .handler(async ({ data }) => {
    const { sendCapiEvent } = await import('./capi.server')

    let ip = ''
    try {
      ip =
        getRequestHeader('cf-connecting-ip') ??
        (getRequestHeader('x-forwarded-for') ?? '').split(',')[0]?.trim() ??
        ''
    } catch {
      ip = ''
    }
    let ua = ''
    try {
      ua = getRequest().headers.get('user-agent') ?? ''
    } catch {
      ua = ''
    }

    return sendCapiEvent({
      eventName: data.eventName,
      eventId: data.eventId,
      eventSourceUrl: data.eventSourceUrl || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      fbc: data.fbc || undefined,
      fbp: data.fbp || undefined,
      clientIpAddress: ip || undefined,
      clientUserAgent: ua || undefined,
      value: data.value,
      currency: data.currency || undefined,
      contentName: data.contentName || undefined,
    })
  })
