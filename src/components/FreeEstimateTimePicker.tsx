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

export function FreeEstimateTimePicker({ submissionId, identity, onBooked }: { submissionId: string; identity: { name: string; email: string; phone: string }; onBooked: (startTime: string) => void }) {
  const loadTimes = useServerFn(getFreeEstimateTimes)
  const book = useServerFn(bookFreeEstimate)
  const [times, setTimes] = useState<string[] | null>(null)
  const [day, setDay] = useState('')
  const [picked, setPicked] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const tracked = useRef(false)

  const refresh = () => loadTimes().then(r => { setTimes(r.times); setDay(d => d && r.times.some(t => dayKey(t) === d) ? d : (r.times[0] ? dayKey(r.times[0]) : '')) }).catch(() => setTimes([]))
  useEffect(() => { refresh() }, [])

  const days = useMemo(() => {
    const map = new Map<string, string>()
    for (const t of times ?? []) if (!map.has(dayKey(t))) map.set(dayKey(t), t)
    return [...map.entries()]
  }, [times])

  async function schedule() {
    if (!picked || busy) return
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
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {days.map(([key, iso]) => (
          <button key={key} type="button" onClick={() => { setDay(key); setPicked('') }} className={cn('shrink-0 rounded-lg border px-4 py-2.5 text-sm font-medium', day === key ? 'border-navy bg-navy text-navy-foreground' : 'border-border bg-card text-navy')}>{dayLabel(iso)}</button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {times.filter(t => dayKey(t) === day).map(t => (
          <button key={t} type="button" onClick={() => setPicked(t)} className={cn('min-h-12 rounded-lg border text-base font-medium', picked === t ? 'border-navy bg-navy text-navy-foreground' : 'border-primary/40 bg-card text-primary')}>{timeLabel(t)}</button>
        ))}
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      <Button type="button" onClick={schedule} disabled={!picked || busy} className="mt-6 h-auto min-h-12 w-full text-base">
        {busy ? 'Scheduling…' : picked ? `Schedule Event · ${dayLabel(picked)}, ${timeLabel(picked)}` : 'Schedule Event'}
      </Button>
    </div>
  )
}
