import { sendTemplateEmail } from './email-templates/send-email'

const RECIPIENTS = [
  'justin@texasbathsolutions.com',
  'josiah@texasbathsolutions.com',
  'contact@texasbathsolutions.com',
]

export interface LeadInput {
  name: string
  phone: string
  email: string
  address: string
  timeframe?: string
  notes?: string
  source?: string
  appointmentDate?: string
}

const PLACEHOLDER_EMAILS = ['calendly@provided.com', 'quiz@provided.com']

function isRealEmail(email?: string) {
  if (!email) return false
  return !PLACEHOLDER_EMAILS.includes(email.toLowerCase())
}

/** Stores the lead so it shows up in the /admin lead list. Never blocks the emails. */
async function storeLead(lead: LeadInput) {
  try {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const booked = Boolean(lead.appointmentDate) || /calendly|scheduled/i.test(lead.source ?? '')
    const { error } = await supabaseAdmin.from('leads').insert({
      name: lead.name ?? '',
      email: isRealEmail(lead.email) ? lead.email : '',
      phone: lead.phone ?? '',
      address: lead.address ?? '',
      timeframe: lead.timeframe ?? '',
      notes: lead.notes ?? '',
      source: lead.source ?? '',
      booked,
      appointment_date: lead.appointmentDate ?? '',
    })
    if (error) console.error('[leads] failed to store lead', error)
  } catch (e) {
    console.error('[leads] failed to store lead', e)
  }
}

export async function notifyLead(lead: LeadInput) {
  await storeLead(lead)

  const submittedAt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date())

  const eventId = `${lead.email.toLowerCase()}-${Date.now().toString(36)}`

  const results = await Promise.allSettled(
    RECIPIENTS.map((to) =>
      sendTemplateEmail('lead-notification', to, {
        templateData: { ...lead, submittedAt },
        idempotencyKey: `lead-notification-${eventId}-${to}`,
        // Only set reply-to when we actually captured the customer's email;
        // placeholder addresses would send replies into a black hole.
        ...(isRealEmail(lead.email) ? { replyTo: lead.email } : {}),
      })
    )
  )

  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`[leads] failed to notify ${RECIPIENTS[i]}:`, r.reason)
    }
  })

  return { ok: results.some((r) => r.status === 'fulfilled') }
}

export interface CustomerConfirmationInput {
  email: string
  name?: string
  phone?: string
  address?: string
  appointmentDate?: string
  rescheduleUrl?: string
  eventUri?: string
}

/** Sends the booked customer their own appointment confirmation. */
export async function sendCustomerConfirmation(input: CustomerConfirmationInput) {
  if (!isRealEmail(input.email)) return { ok: false }

  const key = (input.eventUri || input.email).replace(/[^a-zA-Z0-9]/g, '').slice(-40)

  try {
    const result = await sendTemplateEmail('appointment-confirmation', input.email, {
      templateData: {
        name: input.name,
        phone: input.phone,
        address: input.address,
        appointmentDate: input.appointmentDate,
        rescheduleUrl: input.rescheduleUrl,
      },
      idempotencyKey: `appointment-confirmation-${key}`,
      replyTo: 'contact@texasbathsolutions.com',
    })
    return { ok: result.sent }
  } catch (e) {
    console.error('[leads] failed to send customer confirmation:', e)
    return { ok: false }
  }
}
