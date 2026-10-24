export const CAMPAIGN_IDS = ['ig_letter', 'ig_product', 'yt_letter', 'naver_product'] as const;
export type CampaignId = (typeof CAMPAIGN_IDS)[number];

/**
 * AI assistants that link to the site. Only the fixed identifier is ever sent to analytics;
 * the referrer URL and any query values stay in the browser.
 * ChatGPT appends utm_source=chatgpt.com to links it shows; the others are recognised by referrer host.
 */
export const AI_SOURCE_IDS = ['ai_chatgpt', 'ai_perplexity', 'ai_gemini', 'ai_claude', 'ai_copilot'] as const;
export type AiSourceId = (typeof AI_SOURCE_IDS)[number];
export type LandingId = CampaignId | AiSourceId;

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

/** Exact hosts (and their subdomains) that count as an AI assistant referral. */
const AI_HOSTS: ReadonlyArray<readonly [string, AiSourceId]> = [
  ['chatgpt.com', 'ai_chatgpt'],
  ['perplexity.ai', 'ai_perplexity'],
  ['gemini.google.com', 'ai_gemini'],
  ['claude.ai', 'ai_claude'],
  ['copilot.microsoft.com', 'ai_copilot'],
];

function tupleEquals(a: AttributionTuple, b: AttributionTuple) {
  return KEYS.every((key) => a[key] === b[key]);
}

function parseSearch(search: string): URLSearchParams | null {
  try {
    return new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  } catch {
    return null;
  }
}

function aiIdForHost(host: string): AiSourceId | null {
  const h = host.trim().toLowerCase();
  if (!h) return null;
  return AI_HOSTS.find(([allowed]) => h === allowed || h.endsWith(`.${allowed}`))?.[1] ?? null;
}

/**
 * Convert only the four approved UTM tuples into a fixed identifier.
 * Unrelated query keys are ignored; duplicate attribution keys and unknown values are rejected.
 */
export function campaignFromSearch(search: string): CampaignId | null {
  const params = parseSearch(search);
  if (!params) return null;

  const values = Object.fromEntries(KEYS.map((key) => [key, params.getAll(key)])) as Record<(typeof KEYS)[number], string[]>;
  if (KEYS.some((key) => values[key].length !== 1)) return null;

  const tuple = Object.fromEntries(KEYS.map((key) => [key, values[key][0]])) as AttributionTuple;
  return APPROVED.find(([approved]) => tupleEquals(approved, tuple))?.[1] ?? null;
}

/** utm_source set by an AI assistant (today only ChatGPT does this: utm_source=chatgpt.com). Exactly one value required. */
export function aiSourceFromSearch(search: string): AiSourceId | null {
  const params = parseSearch(search);
  if (!params) return null;
  const sources = params.getAll('utm_source');
  if (sources.length !== 1) return null;
  return aiIdForHost(sources[0]);
}

/** AI assistant recognised from the document referrer host. Nothing from the referrer path or query is used. */
export function aiSourceFromReferrer(referrer: string): AiSourceId | null {
  if (!referrer) return null;
  try {
    return aiIdForHost(new URL(referrer).hostname);
  } catch {
    return null;
  }
}

/**
 * One fixed landing identifier for this page load, in priority order:
 * approved campaign tuple → AI utm_source → AI referrer. Anything else (search engines, direct, unknown
 * campaigns) yields null and sends no event, so "direct" is read as the remainder.
 */
export function landingFromPage(search: string, referrer: string): LandingId | null {
  return campaignFromSearch(search) ?? aiSourceFromSearch(search) ?? aiSourceFromReferrer(referrer);
}
