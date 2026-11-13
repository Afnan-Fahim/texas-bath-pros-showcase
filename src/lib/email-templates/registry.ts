import type { ComponentType } from 'react'
import { template as leadNotificationTemplate } from './lead-notification'
import { template as appointmentConfirmationTemplate } from './appointment-confirmation'
import { template as calendarHealthTemplate } from './calendar-health'
import { template as slowEstimatePageTemplate } from './slow-estimate-page'
import { template as dailySpeedReportTemplate } from './daily-speed-report'


export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'lead-notification': leadNotificationTemplate,
  'appointment-confirmation': appointmentConfirmationTemplate,
  'calendar-health': calendarHealthTemplate,
  'slow-estimate-page': slowEstimatePageTemplate,
  'daily-speed-report': dailySpeedReportTemplate,
}
