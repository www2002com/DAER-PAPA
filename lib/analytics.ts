import { track } from '@vercel/analytics';
import type { LaunchNotifyErrorCode } from './launch-notify';

export const ACTIONS = [
  'letter_entry_clicked', 'letter_started', 'letter_card_exported', 'contact_email_copied', 'social_channel_opened',
  // 출시 알림 신청 conversion: form seen vs accepted submission, split by placement (home | product).
  'launch_notify_viewed', 'launch_notify_attempted', 'launch_notify_submitted', 'launch_notify_failed',
] as const;
export type SiteAction = (typeof ACTIONS)[number];

/** Fixed, non-personal event properties only. */
export type ActionData = { placement?: 'home' | 'product'; reason?: LaunchNotifyErrorCode };

// Vercel Web Analytics is cookieless. Only fixed action names, placement and error categories are sent.
// Letter text, sender names and email addresses never enter analytics.
// NEXT_PUBLIC_LAUNCH_NOTIFY_ANALYTICS=off turns the launch_notify_* events off without a code change.
export function trackAction(action: SiteAction, data?: ActionData) {
  if (process.env.NODE_ENV !== 'production') return;
  if (action.startsWith('launch_notify_') && process.env.NEXT_PUBLIC_LAUNCH_NOTIFY_ANALYTICS === 'off') return;
  try { if (data) track(action, data); else track(action); } catch { /* Analytics must never interrupt writing or copying. */ }
}
