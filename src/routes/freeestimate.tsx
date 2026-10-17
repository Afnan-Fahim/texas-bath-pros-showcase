import { createFileRoute, Link } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { fetchQuizConfig, DEFAULT_CALENDLY_URL } from '@/lib/quiz-content'
import { freeEstimateSchema, PROJECT_OPTIONS } from '@/lib/freeestimate-schema'
import { submitFreeEstimate } from '@/lib/freeestimate.functions'
import { captureAttribution, getAttribution } from '@/lib/tracking'
import { CalendlyEmbed } from '@/components/CalendlyEmbed'
import { Button } from '@/components/ui/button'

const configQuery = queryOptions({ queryKey: ['freeestimate-options'], queryFn: fetchQuizConfig })

export const Route = createFileRoute('/freeestimate')({
  loader: ({ context }) => context.queryClient.ensureQueryData(configQuery),
  component: FreeEstimatePage,
  head: () => ({
    meta: [
      { title: 'Free in-home estimate | Texas Bath Solutions' },
      { name: 'description', content: 'Request your free in-home bathroom estimate with Texas Bath Solutions. Booking online takes about 30 seconds. No obligation.' },
      { property: 'og:title', content: 'Free in-home estimate | Texas Bath Solutions' },
      { property: 'og:description', content: 'Request your free in-home bathroom estimate. Booking online takes about 30 seconds. No obligation.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [{ rel: 'canonical', href: 'https://texasbathsolutions.com/freeestimate' }],
  }),
})

function FreeEstimatePage() {
  const { data: config } = useSuspenseQuery(configQuery)
  const submit = useServerFn(submitFreeEstimate)
  const [form, setForm] = useState({ desiredUpgrade: '', mainProblem: '', timeframe: '', name: '', email: '', phone: '', address: '', homeowner: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [booked, setBooked] = useState(false)
  const submissionId = useRef('')
  const calendar = useRef<HTMLDivElement>(null)
  useEffect(() => { captureAttribution() }, [])
  useEffect(() => { if (saved) calendar.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }) }, [saved])
  const setValue = (key: keyof typeof form, value: string) => setForm(previous => ({ ...previous, [key]: value }))

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || saved) return
    if (!submissionId.current) submissionId.current = crypto.randomUUID()
    const parsed = freeEstimateSchema.safeParse({ ...form, submissionId: submissionId.current, attribution: getAttribution() })
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Please fill in every field.'); return }
    setBusy(true)
    setError('')
    try {
      const result = await submit({ data: parsed.data })
      if (result.saved) { setForm(parsed.data); setSaved(true) }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save your request. Please try again.')
    } finally { setBusy(false) }
  }

  const questions = [
    { key: 'desiredUpgrade' as const, title: 'What can we help you with?', options: [...PROJECT_OPTIONS] },
    { key: 'mainProblem' as const, title: "What's the main problem?", options: config.steps.find(s => s.key === 'mainProblem')?.options.map(o => o.label) ?? [] },
    { key: 'timeframe' as const, title: 'When would you like it done?', options: config.steps.find(s => s.key === 'timeline')?.options.map(o => o.label) ?? [] },
  ]
  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground sm:px-8 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-semibold text-navy sm:text-4xl tracking-normal">Free in-home estimate</h1>
          <p className="mt-3 text-base text-muted-foreground">Booking online takes about 30 seconds. No obligation.</p>
        </header>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={busy || saved} className="space-y-7 disabled:opacity-75">
            {questions.map(question => (
              <fieldset key={question.key}>
                <legend className="mb-3 text-lg font-semibold text-navy">{question.title}</legend>
                <div className="grid gap-3">
                  {question.options.map(option => (
                    <label key={option} className="flex cursor-pointer items-start gap-3 text-base">
                      <input required type="radio" name={question.key} value={option} checked={form[question.key] === option} onChange={() => setValue(question.key, option)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <div className="grid gap-4 border-t border-border pt-7 sm:grid-cols-2">
              {([
                ['name', 'Name', 'text', 'name', 120],
                ['email', 'Email', 'email', 'email', 160],
                ['phone', 'Phone', 'tel', 'tel', 32],
                ['address', 'Address', 'text', 'street-address', 240],
              ] as const).map(([key, label, type, autoComplete, maxLength]) => (
                <label key={key} className="grid gap-2 text-sm font-medium text-navy">
                  {label}
                  <input required type={type} autoComplete={autoComplete} maxLength={maxLength} value={form[key]} onChange={e => setValue(key, e.target.value)} className="h-12 min-w-0 rounded-md border border-input bg-card px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </label>
              ))}
            </div>
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-navy">Are you the homeowner?</legend>
              <div className="flex gap-8">
                {['Yes', 'No'].map(option => (
                  <label key={option} className="flex cursor-pointer items-center gap-3">
                    <input required type="radio" name="homeowner" value={option} checked={form.homeowner === option} onChange={() => setValue('homeowner', option)} className="h-4 w-4 accent-primary" />{option}
                  </label>
                ))}
              </div>
            </fieldset>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy || saved} className="h-auto min-h-12 w-full whitespace-normal px-4 py-3 text-base">{busy ? 'Saving…' : 'Continue to pick a time'}</Button>
          </fieldset>
        </form>
        {saved && (
          <section ref={calendar} className="mt-10 scroll-mt-6 border-t border-border pt-7">
            {booked ? <h2 role="status" className="text-2xl text-navy">Your appointment is confirmed</h2> : (
              <CalendlyEmbed url={config.calendlyUrl || DEFAULT_CALENDLY_URL} prefill={{ name: form.name, email: form.email, phone: form.phone }} onBack={() => { submissionId.current = ''; setSaved(false); }} onScheduled={() => setBooked(true)} title="Pick a time for your free estimate" subtitle="Choose any open slot." fireBookingEvents />
            )}
          </section>
        )}
        <footer className="mt-10 flex justify-center gap-4 text-xs text-muted-foreground">
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/sms-terms" className="hover:underline">SMS Terms</Link>
        </footer>
      </div>
    </main>
  )
}