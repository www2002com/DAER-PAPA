'use client';

import { useEffect, useRef } from 'react';
import { trackAction } from '@/lib/analytics';
import { clearRememberedCampaign, hasAttributionParams, landingFromPage, rememberCampaign, type LandingId as CampaignId } from '@/lib/campaign-attribution';

const STORAGE_PREFIX = 'dearpapa:campaign-landing:';
const RETRY_MS = 100;
const MAX_WAIT_MS = 10_000;

function wasRecorded(campaign: CampaignId) {
  try {
    return window.sessionStorage.getItem(`${STORAGE_PREFIX}${campaign}`) === '1';
  } catch {
    return false;
  }
}

function markRecorded(campaign: CampaignId) {
  try {
    window.sessionStorage.setItem(`${STORAGE_PREFIX}${campaign}`, '1');
  } catch {
    // Storage can be blocked by privacy settings; the in-memory ref still protects Strict Mode.
  }
}

function analyticsQueueReady() {
  return typeof window.va === 'function';
}

export function CampaignAttribution() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || process.env.NODE_ENV !== 'production') return;
    // Approved campaign tuple, else an AI assistant (utm_source=chatgpt.com or referrer host). Only the fixed id leaves the browser.
    const campaign = landingFromPage(window.location.search, document.referrer);
    if (!campaign) {
      const sameOriginReferrer = (() => {
        if (!document.referrer) return false;
        try { return new URL(document.referrer).origin === window.location.origin; } catch { return false; }
      })();
      if (hasAttributionParams(window.location.search) || !sameOriginReferrer) clearRememberedCampaign();
      return;
    }
    // Bind the current landing id immediately so early follow-up actions cannot
    // inherit a previous campaign while the analytics queue is still booting.
    rememberCampaign(campaign);
    let cancelled = false;
    let retry: number | undefined;
    const startedAt = Date.now();
    const attempt = () => {
      if (cancelled || sent.current) return;
      if (!analyticsQueueReady()) {
        if (Date.now() - startedAt < MAX_WAIT_MS) retry = window.setTimeout(attempt, RETRY_MS);
        return;
      }
      if (wasRecorded(campaign)) {
        sent.current = true;
        return;
      }
      try {
        trackAction('campaign_landing', { campaign });
        markRecorded(campaign);
        sent.current = true;
      } catch {
        // Analytics must never interrupt page rendering or consume the campaign.
      }
    };
    attempt();
    return () => {
      cancelled = true;
      if (retry !== undefined) window.clearTimeout(retry);
    }
  }, []);

  return null;
}
