import { createFileRoute, Link } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { freeEstimateSchema } from '@/lib/freeestimate-schema'
import { submitFreeEstimate } from '@/lib/freeestimate.functions'
import { captureAttribution, getAttribution } from '@/lib/tracking'
import { FreeEstimateTimePicker } from '@/components/FreeEstimateTimePicker'
import { cn } from '@/lib/utils'
import logoImg from '@/assets/logo-header.webp'
import heroPhoto from '@/assets/freeestimate-holiday-promo-3.jpg.asset.json'
import sharePhoto from '@/assets/freeestimate-share-christmas.jpg.asset.json'

const estimateIntroTitle: ReactNode = (
  <>Next 10 Appointments Will Get An <span className="whitespace-nowrap font-bold">ADDITIONAL $500.00 OFF</span></>
)
const estimateIntroPoints = [
  'A Free No-Pressure Quote',
  'We Will Work With You To Design Your Dream Shower',
  'Our Quote Is Good For A FULL Year',
]

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

function EstimateIntro({ className, points = estimateIntroPoints, title = estimateIntroTitle }: { className?: string; points?: string[]; title?: ReactNode }) {
  return (
    <div className={cn('font-sans text-navy', className)}>
      <p className="text-base font-bold leading-snug lg:text-[17px]">{title}</p>
      <ul className="mt-2 space-y-1.5 text-sm leading-[1.5] lg:text-[15px]">
        {points.map(point => (
          <li key={point} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-px shrink-0 text-[1.05em] font-bold leading-none text-check">✓</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const Route = createFileRoute('/freeestimate')({
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
  const submit = useServerFn(submitFreeEstimate)
  const [form, setForm] = useState({ desiredUpgrade: '', mainProblem: '', timeframe: '', name: '', email: '', phone: '', address: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [booked, setBooked] = useState(false)
  const submissionId = useRef('')
  const calendar = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => { captureAttribution() }, [])
  const setValue = (key: keyof typeof form, value: string) => setForm(previous => ({ ...previous, [key]: value }))

  async function ensureSaved(): Promise<string | null> {
    if (saved) return submissionId.current
    if (!submissionId.current) submissionId.current = crypto.randomUUID()
    const parsed = freeEstimateSchema.safeParse({ ...form, submissionId: submissionId.current, attribution: getAttribution() })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please fill in every field.')
      formRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      return null
    }
    setBusy(true)
    setError('')
    try {
      const result = await submit({ data: parsed.data })
      if (!result.saved) return null
      setForm(parsed.data)
      setSaved(true)
      return submissionId.current
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save your request. Please try again.')
      return null
    } finally { setBusy(false) }
  }

  return (
    <main className="min-h-screen bg-page-wash text-foreground">
      <div className="bg-background px-5 py-3 sm:px-8">
        <Link to="/" aria-label="Texas Bath Solutions home"><img src={logoImg} alt="Texas Bath Solutions" className="h-12 w-auto sm:h-14" /></Link>
      </div>
      <div className="lg:hidden">
        <img src={heroPhoto.url} alt="San Antonio bathroom remodel with Christmas decorations by Texas Bath Solutions — $0 down, payments from just $115 a month, get installed before Christmas" className="w-full h-auto" />
        <EstimateIntro className="px-4 pt-3 sm:px-8" />
        <TrustBadges badges={['5.0 Google']} className="px-4 pt-2 pb-1 sm:px-8" />
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-8 sm:px-6 lg:max-w-[1180px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start lg:gap-8 lg:px-8 lg:py-5">
      <div className="min-w-0 rounded-2xl border-2 border-navy/15 bg-card p-6 shadow-lift sm:p-9 lg:p-6">
        <header className="mb-5 border-b border-border pb-4 lg:mb-3 lg:pb-3">
<h1 className="text-2xl font-semibold text-navy sm:text-4xl lg:text-2xl tracking-normal">Hey San Antonio!</h1>
        </header>
        <div className="mb-5 space-y-3 font-sans text-sm leading-relaxed text-navy lg:mb-3 lg:text-[15px]">
          <p className="text-base font-medium leading-relaxed lg:text-lg">
            Not only do we give a <span className="font-bold">$250 HEB gift card</span> on every completed project — we also beat other companies’ written quotes by <span className="font-bold">$1,000 or more</span> on the same scope.
          </p>
          <p>We’re a lean local crew of about 22 people with over 100 years of combined experience.</p>
          <p>Want a bathroom remodel from a real local company? We’ve got you. No big-truck overhead — just a local crew that shows up and does the work.</p>
          <p>Prefer to talk or text? Call or text us anytime at <a href="tel:2103734295" className="font-bold underline">(210) 373-4295</a>.</p>
        </div>
        <form ref={formRef} onSubmit={e => e.preventDefault()} className="scroll-mt-6">
          <fieldset disabled={busy || saved} className="space-y-7 lg:space-y-3 disabled:opacity-75">
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
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          </fieldset>
        </form>
        <section ref={calendar} className="mt-8 scroll-mt-6 border-t border-border pt-6 lg:mt-5 lg:pt-4">
          {booked ? <div role="status"><h2 className="text-2xl font-semibold text-navy">Your appointment is confirmed</h2><p className="mt-2 text-base text-muted-foreground">We'll email your confirmation and text you before the visit.</p></div> : (
            <FreeEstimateTimePicker onEnsureSaved={ensureSaved} identity={{ name: form.name, email: form.email, phone: form.phone }} onBooked={() => setBooked(true)} />
          )}
        </section>
      </div>
      <div className="hidden lg:sticky lg:top-5 lg:block">
        <img src={heroPhoto.url} alt="San Antonio bathroom remodel with Christmas decorations by Texas Bath Solutions — $0 down, payments from just $115 a month, get installed before Christmas" className="mx-auto block h-auto max-h-[46vh] w-auto max-w-full rounded-2xl shadow-card ring-1 ring-navy/5" />
        <EstimateIntro className="mt-3" />
        <TrustBadges className="mt-3" />
        <div className="mt-4 rounded-xl border-2 border-gold/60 bg-gold/10 p-4 shadow-card">
          <p className="text-base font-bold tracking-tight text-navy">November Special</p>
          <p className="mt-1 text-sm leading-6 text-navy/90">We cover your first 2 monthly payments on select financing plans.</p>
        </div>
      </div>
      </div>
        <footer className="pb-10 flex justify-center gap-4 text-xs text-muted-foreground">
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/sms-terms" className="hover:underline">SMS Terms</Link>
        </footer>
    </main>
  )
}