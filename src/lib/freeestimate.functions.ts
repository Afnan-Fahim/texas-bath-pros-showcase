import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@supabase/supabase-js'
import { freeEstimateSchema, choicesAreValid, FREE_ESTIMATE_RECIPIENTS } from './freeestimate-schema'
import { normalizeQuizConfig } from './quiz-content'

export const submitFreeEstimate = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => freeEstimateSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env['SUPABASE_PUBLISHABLE_KEY']
    const url = process.env['SUPABASE_URL']
    if (!key || !url) throw new Error('Unable to save your request. Please try again.')
    const publicClient = createClient(url, key, {
      auth: { persistSession: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers)
        if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization')
        headers.set('apikey', key)
        return fetch(input, { ...init, headers })
      } },
    })
    const { data: saved, error: configError } = await publicClient.from('quiz_content').select('config').eq('id', 'default').maybeSingle()
    if (configError) throw new Error('Please refresh the page and try again.')
    const config = normalizeQuizConfig(saved?.config)
    if (!choicesAreValid(data, config.steps.find(s => s.key === 'mainProblem')?.options.map(o => o.label) ?? [], config.steps.find(s => s.key === 'timeline')?.options.map(o => o.label) ?? [])) {
      throw new Error('Please refresh the page and select the current options.')
    }
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { data: existing } = await supabaseAdmin.from('leads').select('id').eq('id', data.submissionId).maybeSingle()
    if (existing) return { saved: true, emailed: true }
    const { count, error: countError } = await supabaseAdmin.from('leads').select('id', { count: 'exact', head: true }).eq('source', 'Free estimate form').eq('phone', data.phone).gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
    if (countError) throw new Error('Unable to save your request. Please try again.')
    if ((count ?? 0) >= 3) throw new Error('Please wait a few minutes before sending another request.')
    const notes = `Homeowner: ${data.homeowner}\nUpgrade: ${data.desiredUpgrade}\nProblem: ${data.mainProblem}\nStatus: FORM SUBMITTED — NOT BOOKED YET`
    const { error } = await supabaseAdmin.from('leads').insert({
      id: data.submissionId, name: data.name, email: data.email, phone: data.phone,
      address: data.address, desired_upgrade: data.desiredUpgrade, main_problem: data.mainProblem,
      timeframe: data.timeframe, homeowner: data.homeowner, notes, source: 'Free estimate form',
      page_url: 'https://texasbathsolutions.com/freeestimate', attribution: data.attribution, booked: false,
    })
    if (error) throw new Error('Unable to save your request. Please try again.')
    const { sendTemplateEmail } = await import('./email-templates/send-email')
    const submittedAt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' }).format(new Date())
    const results = await Promise.allSettled(FREE_ESTIMATE_RECIPIENTS.map(to => sendTemplateEmail('lead-notification', to, {
      templateData: { ...data, notes, source: 'Free estimate form', submittedAt },
      replyTo: data.email, idempotencyKey: `freeestimate-${data.submissionId}-${to}`,
    })))
    const emailed = results.every(r => r.status === 'fulfilled' && r.value.sent)
    if (!emailed) console.error('[freeestimate] Owner email failed; submission remains saved.')
    return { saved: true, emailed }
  })