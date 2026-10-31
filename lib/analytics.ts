import { track } from '@vercel/analytics';
import type { LaunchNotifyErrorCode } from './launch-notify';
import { campaignForCurrentLocation, type LandingId } from './campaign-attribution';

export const ACTIONS = [
  'letter_entry_clicked', 'letter_started', 'letter_card_exported', 'contact_email_copied', 'social_channel_opened',
  'product_details_after_letter_clicked', 'journal_product_box_clicked',
  'campaign_landing',
  // 출시 알림 신청 conversion: form seen vs accepted submission, split by placement (home | product).
  'launch_notify_viewed', 'launch_notify_attempted', 'launch_notify_submitted', 'launch_notify_failed',
  // Shown only after a successful launch-notify submission (same gate as the form).
  'family_link_shared',
] as const;
export type SiteAction = (typeof ACTIONS)[number];

/** Fixed, non-personal event properties only. */
export type ActionData = {
  placement?: 'home' | 'product';
  reason?: LaunchNotifyErrorCode;
  /** Approved campaign ids or AI assistant ids from lib/campaign-attribution; never a raw UTM or referrer value. */
  campaign?: LandingId;
  /** Which letter action revealed the product link: export (card saved), share (system share sheet), archive (saved letter exported). */
  source?: 'export' | 'share' | 'archive';
};

const CAMPAIGN_SCOPED_ACTIONS: ReadonlySet<SiteAction> = new Set([
  'campaign_landing', 'letter_entry_clicked', 'letter_started', 'letter_card_exported',
  'product_details_after_letter_clicked', 'social_channel_opened',
]);

// Only fixed action names, placement, campaign codes and error categories are sent.
// Letter text, sender names and email addresses never enter analytics.
// NEXT_PUBLIC_LAUNCH_NOTIFY_ANALYTICS=off turns the launch_notify_* events off without a code change.
export function trackAction(action: SiteAction, data?: ActionData) {
  if (process.env.NODE_ENV !== 'production') return;
  if (action.startsWith('launch_notify_') && process.env.NEXT_PUBLIC_LAUNCH_NOTIFY_ANALYTICS === 'off') return;
  try {
    const campaign = data?.campaign ?? (CAMPAIGN_SCOPED_ACTIONS.has(action) ? campaignForCurrentLocation() : null);
    const payload = campaign ? { ...data, campaign } : data;
    if (payload) track(action, payload);
    else track(action);
  } catch { /* Analytics must never interrupt writing or copying. */ }
}
