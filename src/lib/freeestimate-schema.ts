import { z } from 'zod'

export const FREE_ESTIMATE_RECIPIENTS = ['justin@texasbathsolutions.com', 'josiah@texasbathsolutions.com'] as const
export const PROJECT_OPTIONS = ['I Want A Walk In Shower', 'I Want A New Tub', "I'm Not Sure, But I Want To See Options!"] as const

export const freeEstimateSchema = z.object({
  submissionId: z.string().uuid(),
  desiredUpgrade: z.enum(PROJECT_OPTIONS),
  mainProblem: z.string().trim().max(160),
  timeframe: z.string().trim().min(1, 'Choose your timing.').max(80),
  name: z.string().trim().min(1, 'Enter your name.').max(120),
  email: z.string().trim().email('Enter a valid email.').max(160),
  phone: z.string().trim().max(32).refine(v => /^(\+?1)?\D*\d/.test(v) && [10, 11].includes(v.replace(/\D/g, '').length), 'Enter a valid phone number.'),
  address: z.string().trim().min(1, 'Enter your address.').max(240),
  homeowner: z.enum(['Yes', 'No']),
  attribution: z.record(z.string().max(500)).optional().default({}),
})
export type FreeEstimateInput = z.infer<typeof freeEstimateSchema>

export function choicesAreValid(input: FreeEstimateInput, problems: string[], timings: string[]) {
  return (!input.mainProblem || problems.includes(input.mainProblem)) && timings.includes(input.timeframe)
}