import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const manyChatSchema = z.object({
  homeowner: z.string().optional().default(''),
  upgrade: z.string().optional().default(''),
  problem: z.string().optional().default(''),
  timeline: z.string().optional().default(''),
  firstName: z.string().optional().default('Facebook User'),
})

export const Route = createFileRoute('/api/manychat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed
        try {
          parsed = manyChatSchema.parse(await request.json())
        } catch (e) {
          return Response.json({ ok: false, error: 'invalid_payload' }, { status: 400 })
        }

        const { notifyLead } = await import('@/lib/leads.server')

        const notes = [
          `Homeowner: ${parsed.homeowner}`,
          `Upgrade: ${parsed.upgrade}`,
          `Problem: ${parsed.problem}`,
          `Timeline: ${parsed.timeline}`
        ].join('\n');

        const leadData = {
          name: parsed.firstName,
          email: "calendly-will-capture@example.com",
          phone: "Check Calendly for Phone",
          address: "Check Calendly for Address",
          timeframe: parsed.timeline,
          notes: notes,
          source: "Facebook/Messenger Quiz",
        }

        const result = await notifyLead(leadData)

        return Response.json(result, { status: result.ok ? 200 : 500 })
      },
    },
  },
})
