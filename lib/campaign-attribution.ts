export const CAMPAIGN_IDS = ['ig_letter', 'ig_product', 'yt_letter', 'naver_product'] as const;
export type CampaignId = (typeof CAMPAIGN_IDS)[number];

type AttributionTuple = {
  utm_campaign: 'prelaunch_202610';
  utm_source: 'instagram' | 'youtube' | 'naver';
  utm_medium: 'organic_social' | 'blog';
  utm_content: 'reel_letter_a' | 'reel_product_b' | 'short_letter_a' | 'blog_product_questions';
};

const KEYS = ['utm_campaign', 'utm_source', 'utm_medium', 'utm_content'] as const;

const APPROVED: ReadonlyArray<readonly [AttributionTuple, CampaignId]> = [
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'instagram', utm_medium: 'organic_social', utm_content: 'reel_letter_a' }, 'ig_letter'],
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'instagram', utm_medium: 'organic_social', utm_content: 'reel_product_b' }, 'ig_product'],
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'youtube', utm_medium: 'organic_social', utm_content: 'short_letter_a' }, 'yt_letter'],
  [{ utm_campaign: 'prelaunch_202610', utm_source: 'naver', utm_medium: 'blog', utm_content: 'blog_product_questions' }, 'naver_product'],
];

function tupleEquals(a: AttributionTuple, b: AttributionTuple) {
  return KEYS.every((key) => a[key] === b[key]);
}

/**
 * Convert only the four approved UTM tuples into a fixed identifier.
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
