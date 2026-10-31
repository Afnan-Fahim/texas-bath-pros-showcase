import { createFileRoute, Link } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { fetchQuizConfig, resolveConfigImages } from '@/lib/quiz-content'
import { freeEstimateSchema, PROJECT_OPTIONS } from '@/lib/freeestimate-schema'
import { submitFreeEstimate } from '@/lib/freeestimate.functions'
import { captureAttribution, getAttribution } from '@/lib/tracking'
import { FreeEstimateTimePicker } from '@/components/FreeEstimateTimePicker'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import logoImg from '@/assets/logo-header.webp'
import showerPhoto from '@/assets/freeestimate-shower-christmas.jpg.asset.json'
import sharePhoto from '@/assets/freeestimate-share-christmas.jpg.asset.json'

const configQuery = queryOptions({ queryKey: ['freeestimate-options'], queryFn: async () => resolveConfigImages(await fetchQuizConfig()) })
const estimateIntro = 'San Antonio & surrounding areas — we offer $0 down financing and can install before the holidays, or we’ll cover your first payment. We’ll also beat any same-scope written estimate by $1,000. Appointments are free, no-obligation, and no hassle.'

const TRUST_BADGES = ['5.0 Google', 'BBB A+', 'Insured', 'Warranty', 'Local']

function TrustBadges({ badges = TRUST_BADGES, className }: { badges?: string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {badges.map((badge, index) => (
        <li key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-navy/10 bg-card px-3 py-1.5 text-xs font-semibold text-navy shadow-sm">
          {index === 0 && <span aria-hidden="true" className="text-gold-bright">★★★★★</span>}
          {badge}
        </li>
      ))}
    </ul>
  )
}

export const Route = createFileRoute('/freeestimate')({
  loader: ({ context }) => context.queryClient.ensureQueryData(configQuery),
  component: FreeEstimatePage,
  head: () => ({
    meta: [
      { title: 'Free in-home estimate | Texas Bath Solutions' },
      { name: 'description', content: 'Request your free in-home bathroom estimate with Texas Bath Solutions. Booking online takes about 30 seconds. No obligation.' },
      { property: 'og:title', content: 'Just in Time for the HOLIDAYS! Free Estimate' },
      { property: 'og:description', content: 'Request your free in-home bathroom estimate. Booking online takes about 30 seconds. No obligation.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: `https://texasbathsolutions.com${sharePhoto.url}` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Just in Time for the HOLIDAYS! Free Estimate' },
      { name: 'twitter:description', content: 'Request your free in-home bathroom estimate. Booking online takes about 30 seconds. No obligation.' },
      { name: 'twitter:image', content: `https://texasbathsolutions.com${sharePhoto.url}` },
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
  const [isDesktop, setIsDesktop] = useState(true)
  const submissionId = useRef('')
  const calendar = useRef<HTMLDivElement>(null)
  useEffect(() => { captureAttribution() }, [])
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
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
  ].filter(question => isDesktop || question.key !== 'mainProblem')
  return (
    <main className="min-h-screen bg-page-wash text-foreground">
      <div className="bg-background px-5 py-3 sm:px-8">
        <Link to="/" aria-label="Texas Bath Solutions home"><img src={logoImg} alt="Texas Bath Solutions" className="h-12 w-auto sm:h-14" /></Link>
      </div>
      <div className="hidden bg-navy px-5 py-2.5 text-center text-xs font-medium text-navy-foreground sm:px-8 sm:text-sm lg:block">
        Proudly Serving San Antonio &amp; Surrounding Areas · We beat written quotes by $1,000+ on the same project and materials.
      </div>
      <div className="lg:hidden">
        <img src={showerPhoto.url} alt="Walk-in shower remodel with marble walls, brass fixtures and Christmas decorations by Texas Bath Solutions — $0 down, payments from just $115 a month" className="w-full h-auto" />
        <p className="px-4 pt-3 text-sm font-medium leading-5 text-navy sm:px-8">{estimateIntro}</p>
        <TrustBadges badges={['5.0 Google']} className="px-4 pt-2 pb-1 sm:px-8" />
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-8 sm:px-6 lg:max-w-[1180px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start lg:gap-8 lg:px-8 lg:py-5">
      <div className="min-w-0 rounded-2xl border-2 border-navy/15 bg-card p-6 shadow-lift sm:p-9 lg:p-6">
        <header className="mb-5 border-b border-border pb-4 lg:mb-3 lg:pb-3">
<h1 className="text-2xl font-semibold text-navy sm:text-4xl lg:text-2xl tracking-normal">Free In-Home Estimate for Facebook Visitors</h1>
          <p className="mt-2 text-base text-muted-foreground lg:mt-1 lg:text-sm">You found us on Facebook. Booking takes about 30 seconds. No obligation.</p>
        </header>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={busy || saved} className="space-y-7 lg:space-y-3 disabled:opacity-75">
            {questions.map((question, index) => (
              <div key={question.key} className={index > 0 ? 'border-t border-border pt-6 lg:pt-3' : ''}>
                <fieldset>
                  <legend className="mb-3 text-lg font-bold tracking-tight lg:mb-1.5 lg:text-[15px] text-navy">{question.title}</legend>
                  <div className="grid gap-3 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-1.5">
                    {question.options.map(option => (
                      <label key={option} className="flex cursor-pointer items-start gap-3 text-base lg:gap-2 lg:text-sm">
                        <input required type="radio" name={question.key} value={option} checked={form[question.key] === option} onChange={() => setValue(question.key, option)} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border border-navy/40 bg-card outline-none transition checked:border-navy checked:bg-[radial-gradient(circle_at_center,var(--navy)_0_34%,transparent_36%)] focus-visible:ring-2 focus-visible:ring-ring" />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            ))}
            <div className="grid gap-4 border-t border-border pt-7 sm:grid-cols-2 lg:gap-3 lg:pt-3">
              {([
                ['name', 'Name', 'text', 'name', 120],
                ['email', 'Email', 'email', 'email', 160],
                ['phone', 'Phone', 'tel', 'tel', 32],
                ['address', 'Address', 'text', 'street-address', 240],
              ] as const).map(([key, label, type, autoComplete, maxLength]) => (
                <label key={key} className="grid gap-2 lg:gap-1 text-sm font-medium text-navy">
                  {label}
                  <input required type={type} autoComplete={autoComplete} maxLength={maxLength} value={form[key]} onChange={e => setValue(key, e.target.value)} className="h-12 lg:h-10 min-w-0 rounded-md border border-input bg-card px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </label>
              ))}
            </div>
            <fieldset>
              <legend className="mb-3 lg:mb-1.5 text-sm font-bold text-navy">Are you the homeowner?</legend>
              <div className="flex gap-8">
                {['Yes', 'No'].map(option => (
                  <label key={option} className="flex cursor-pointer items-center gap-3">
                    <input required type="radio" name="homeowner" value={option} checked={form.homeowner === option} onChange={() => setValue('homeowner', option)} className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border border-navy/40 bg-card outline-none transition checked:border-navy checked:bg-[radial-gradient(circle_at_center,var(--navy)_0_34%,transparent_36%)] focus-visible:ring-2 focus-visible:ring-ring" />{option}
                  </label>
                ))}
              </div>
            </fieldset>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy || saved} className="h-auto min-h-12 w-full whitespace-normal px-4 py-3 text-base lg:min-h-10 lg:py-2">{busy ? 'Saving…' : 'Pick Your Time'}</Button>
          </fieldset>
        </form>
        {saved && (
          <section ref={calendar} className="mt-10 scroll-mt-6 border-t border-border pt-7">
            {booked ? <div role="status"><h2 className="text-2xl font-semibold text-navy">Your appointment is confirmed</h2><p className="mt-2 text-base text-muted-foreground">We'll email your confirmation and text you before the visit.</p></div> : (
              <FreeEstimateTimePicker submissionId={submissionId.current} identity={{ name: form.name, email: form.email, phone: form.phone }} onBooked={() => setBooked(true)} />
            )}
          </section>
        )}
      </div>
      <div className="hidden lg:sticky lg:top-5 lg:block">
        <img src={showerPhoto.url} alt="Walk-in shower remodel with marble walls, brass fixtures and Christmas decorations by Texas Bath Solutions — $0 down, payments from just $115 a month" className="mx-auto block h-auto max-h-[46vh] w-auto max-w-full rounded-2xl shadow-card ring-1 ring-navy/5" />
        <p className="mt-3 font-sans text-base font-medium leading-[1.55] text-navy">{estimateIntro}</p>
        <TrustBadges className="mt-3" />
      </div>
      </div>
        <footer className="pb-10 flex justify-center gap-4 text-xs text-muted-foreground">
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/sms-terms" className="hover:underline">SMS Terms</Link>
        </footer>
    </main>
  )
}