import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/public/daily-speed-report')({
  server: { handlers: { POST: async ({ request }) => {
    const { authenticateCronRequest } = await import('@/integrations/supabase/cron-auth')
    const rejection = await authenticateCronRequest(request)
    if (rejection) return rejection
    const { sendDailySpeedReport } = await import('@/lib/daily-speed-report.server')
    return Response.json(await sendDailySpeedReport(), { headers: { 'Cache-Control': 'no-store' } })
  } } },
})