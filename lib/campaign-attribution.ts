export const CAMPAIGN_IDS = [
  'ig_letter', 'ig_product', 'yt_letter', 'naver_product',
  // 2026-10-26: evergreen channel links (docs/utm-links.md is the canonical table).
  'ig_bio', 'ig_post', 'ig_story', 'yt_desc', 'naver_blog', 'tistory_blog', 'authon_article',
] as const;
export type CampaignId = (typeof CAMPAIGN_IDS)[number];

const CURRENT_CAMPAIGN_KEY = 'dearpapa:campaign-current';

type AttributionTuple = {
  utm_campaign: 'prelaunch_202610';
  utm_source: 'instagram' | 'youtube' | 'naver' | 'tistory' | 'authonnews';
  utm_medium: 'organic_social' | 'blog' | 'social_profile' | 'video_description' | 'referral';
  utm_content:
    | 'reel_letter_a' | 'reel_product_b' | 'short_letter_a' | 'blog_product_questions'
    | 'bio_link' | 'feed_post' | 'story_link' | 'desc_link' | 'blog_post' | 'article_link';
};

const KEYS = ['utm_campaign', 'utm_source', 'utm_medium', 'utm_content'] as const;

const APPROVED: ReadonlyArray<readonly [AttributionTuple, CampaignId]> = [
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'instagram', utm_medium: 'organic_social', utm_content: 'reel_letter_a' }, 'ig_letter'],
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'instagram', utm_medium: 'organic_social', utm_content: 'reel_product_b' }, 'ig_product'],
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'youtube', utm_medium: 'organic_social', utm_content: 'short_letter_a' }, 'yt_letter'],
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'naver', utm_medium: 'blog', utm_content: 'blog_product_questions' }, 'naver_product'],
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'instagram', utm_medium: 'social_profile', utm_content: 'bio_link' }, 'ig_bio'],
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'instagram', utm_medium: 'organic_social', utm_content: 'feed_post' }, 'ig_post'],
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'instagram', utm_medium: 'organic_social', utm_content: 'story_link' }, 'ig_story'],
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'youtube', utm_medium: 'video_description', utm_content: 'desc_link' }, 'yt_desc'],
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'naver', utm_medium: 'blog', utm_content: 'blog_post' }, 'naver_blog'],
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'tistory', utm_medium: 'blog', utm_content: 'blog_post' }, 'tistory_blog'],
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'authonnews', utm_medium: 'referral', utm_content: 'article_link' }, 'authon_article'],
];

function tupleEquals(a: AttributionTuple, b: AttributionTuple) {
  return KEYS.every((key) => a[key] === b[key]);
}

/**
 * Convert only the approved UTM tuples (APPROVED above) into a fixed identifier.
 * Unrelated query keys are ignored; duplicate attribution keys and unknown values are rejected.
 */
export function campaignFromSearch(search: string): CampaignId | null {
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  } catch {
    return null;
  }

  const values = Object.fromEntries(KEYS.map((key) => [key, params.getAll(key)])) as Record<(typeof KEYS)[number], string[]>;
  if (KEYS.some((key) => values[key].length !== 1)) return null;

  const tuple = Object.fromEntries(KEYS.map((key) => [key, values[key][0]])) as AttributionTuple;
  return APPROVED.find(([approved]) => tupleEquals(approved, tuple))?.[1] ?? null;
}

/** True when a URL carries any attribution key, even if the tuple is invalid. */
export function hasAttributionParams(search: string): boolean {
  try {
    const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
    return KEYS.some((key) => params.has(key));
  } catch {
    return false;
  }
}

function isCampaignId(value: string | null): value is CampaignId {
  return value !== null && (CAMPAIGN_IDS as readonly string[]).includes(value);
}

/** Read only the allowlisted campaign code kept for this browser tab. */
export function campaignFromSession(): CampaignId | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.sessionStorage.getItem(CURRENT_CAMPAIGN_KEY);
    return isCampaignId(value) ? value : null;
  } catch {
    return null;
  }
}

/** Store a fixed campaign code; raw query strings and personal values never enter storage. */
export function rememberCampaign(campaign: CampaignId): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(CURRENT_CAMPAIGN_KEY, campaign);
  } catch {
    // Storage can be blocked; analytics still remains best-effort.
  }
}

/** Clear an old campaign when a fresh organic or unapproved entry is loaded. */
export function clearRememberedCampaign(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(CURRENT_CAMPAIGN_KEY);
  } catch {
    // Storage can be blocked by privacy settings.
  }
}

/** Resolve attribution for an event on this page. A URL tuple wins over storage; invalid UTM never falls back. */
export function campaignForCurrentLocation(): CampaignId | null {
  if (typeof window === 'undefined') return null;
  const direct = campaignFromSearch(window.location.search);
  if (direct) return direct;
  if (hasAttributionParams(window.location.search)) return null;
  return campaignFromSession();
}
