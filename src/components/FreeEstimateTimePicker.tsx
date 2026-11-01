import { useEffect, useMemo, useRef, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { trackLeadEvent, trackScheduleEvent } from '@/lib/tracking'
import { bookFreeEstimate, getFreeEstimateTimes } from '@/lib/freeestimate-booking.functions'

const TZ = 'America/Chicago'
const BOOKING_TRACKED_KEY = 'tbs_booking_tracked'
const dayKey = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone: TZ })
const dayLabel = (iso: string) => new Date(iso).toLocaleDateString('en-US', { timeZone: TZ, weekday: 'short', month: 'short', day: 'numeric' })
const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' })

export function FreeEstimateTimePicker({ submissionId, identity, onBooked, ready = true, onNeedForm }: { submissionId: string; identity: { name: string; email: string; phone: string }; onBooked: (startTime: string) => void; ready?: boolean; onNeedForm?: () => void }) {
  const loadTimes = useServerFn(getFreeEstimateTimes)
  const book = useServerFn(bookFreeEstimate)
  const [times, setTimes] = useState<string[] | null>(null)
  const [day, setDay] = useState('')
  const [picked, setPicked] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const tracked = useRef(false)

  const refresh = () => loadTimes().then(r => { setTimes(r.times); setDay(d => d && r.times.some(t => dayKey(t) === d) ? d : '') }).catch(() => setTimes([]))
  useEffect(() => { refresh() }, [])

  const days = useMemo(() => {
    const map = new Map<string, string>()
    for (const t of times ?? []) if (!map.has(dayKey(t))) map.set(dayKey(t), t)
    return [...map.entries()]
  }, [times])

  async function schedule() {
    if (!picked || busy) return
    if (!ready) { onNeedForm?.(); return }
    setBusy(true); setError('')
    try {
      await book({ data: { submissionId, startTime: picked } })
      if (!tracked.current) {
        tracked.current = true
        let already = false
        try { already = !!sessionStorage.getItem(BOOKING_TRACKED_KEY); sessionStorage.setItem(BOOKING_TRACKED_KEY, '1') } catch { /* ignore */ }
        if (!already) { trackScheduleEvent(identity); trackLeadEvent(`calendly:${identity.email}:${identity.phone}`, identity) }
      }
      onBooked(picked)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please pick another time.')
      setPicked(''); refresh()
    } finally { setBusy(false) }
  }

  if (times === null) return <p className="text-base text-muted-foreground">Loading open times…</p>
  if (!times.length) return <p className="text-base text-navy">No open times right now. Please call or text (210) 373-4295 and we'll get you scheduled.</p>
  return (
    <div>
      <h2 className="text-2xl font-semibold text-navy">Pick a time for your free estimate</h2>
      <p className="mt-1 text-sm text-muted-foreground">All times are Central Time. Visits take 30–45 minutes.</p>
      <MonthGrid available={new Set(days.map(([k]) => k))} selected={day} onSelect={(k) => { setDay(k); setPicked('') }} />
      {day && <p className="mt-5 text-sm font-semibold text-navy">Open times for {dayLabel(days.find(([k]) => k === day)?.[1] ?? times[0])}</p>}
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {times.filter(t => dayKey(t) === day).map(t => (
          <button key={t} type="button" onClick={() => setPicked(t)} className={cn('min-h-12 rounded-lg border text-base font-medium', picked === t ? 'border-navy bg-navy text-navy-foreground' : 'border-primary/40 bg-card text-primary')}>{timeLabel(t)}</button>
        ))}
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      <Button type="button" onClick={schedule} disabled={!picked || busy} className="mt-6 h-auto min-h-12 w-full text-base">
        {busy ? 'Scheduling…' : picked && !ready ? 'Fill in your details above to book this time' : picked ? `Schedule Event · ${dayLabel(picked)}, ${timeLabel(picked)}` : 'Schedule Event'}
      </Button>
    </div>
  )
}

function MonthGrid({ available, selected, onSelect }: { available: Set<string>; selected: string; onSelect: (key: string) => void }) {
  const first = [...available].sort()[0] ?? new Date().toLocaleDateString('en-CA', { timeZone: TZ })
  const [month, setMonth] = useState(() => first.slice(0, 7))
  const [y, m] = month.split('-').map(Number)
  const startDow = new Date(Date.UTC(y, m - 1, 1)).getUTCDay()
  const count = new Date(Date.UTC(y, m, 0)).getUTCDate()
  const keys = [...available].sort()
  const minMonth = keys[0]?.slice(0, 7) ?? month
  const maxMonth = keys[keys.length - 1]?.slice(0, 7) ?? month
  const shift = (n: number) => { const d = new Date(Date.UTC(y, m - 1 + n, 1)); setMonth(d.toISOString().slice(0, 7)) }
  const title = new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const cells: (number | null)[] = [...Array(startDow).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)]
  return (
    <div className="mx-auto mt-5 max-w-sm rounded-xl border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" aria-label="Previous month" disabled={month <= minMonth} onClick={() => shift(-1)} className="h-9 w-9 rounded-full text-lg text-navy hover:bg-muted disabled:opacity-30">‹</button>
        <span className="text-base font-semibold text-navy">{title}</span>
        <button type="button" aria-label="Next month" disabled={month >= maxMonth} onClick={() => shift(1)} className="h-9 w-9 rounded-full text-lg text-navy hover:bg-muted disabled:opacity-30">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d} className="py-1">{d}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />
          const key = `${month}-${String(d).padStart(2, '0')}`
          const open = available.has(key)
          return (
            <button key={key} type="button" disabled={!open} onClick={() => onSelect(key)} className={cn('mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm', selected === key ? 'bg-navy font-semibold text-navy-foreground' : open ? 'bg-primary/10 font-semibold text-primary hover:bg-primary/20' : 'text-muted-foreground/40')}>{d}</button>
          )
        })}
      </div>
    </div>
  )
}
