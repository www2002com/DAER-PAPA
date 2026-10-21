import { track } from '@vercel/analytics';

export const ACTIONS = ['letter_entry_clicked', 'letter_started', 'letter_card_exported', 'contact_email_copied', 'social_channel_opened'] as const;
export type SiteAction = (typeof ACTIONS)[number];

// Only fixed action names are accepted. Letter text, sender names and email contents never enter analytics.
export function trackAction(action: SiteAction) {
  if (process.env.NODE_ENV !== 'production') return;
  try { track(action); } catch { /* Analytics must never interrupt writing or copying. */ }
}
