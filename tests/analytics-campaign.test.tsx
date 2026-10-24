import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { emitted } = vi.hoisted(() => ({ emitted: vi.fn() }));

vi.mock('@vercel/analytics', () => ({ track: emitted }));

import { trackAction } from '@/lib/analytics';

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'production');
  emitted.mockClear();
  sessionStorage.clear();
  window.history.replaceState({}, '', '/');
});

afterEach(() => vi.unstubAllEnvs());

describe('campaign-scoped analytics actions', () => {
  it('adds only the fixed current campaign to a follow-up action', () => {
    sessionStorage.setItem('dearpapa:campaign-current', 'ig_letter');
    trackAction('letter_started');
    expect(emitted).toHaveBeenCalledWith('letter_started', { campaign: 'ig_letter' });
  });

  it('does not reuse storage when the current URL has an invalid attribution key', () => {
    sessionStorage.setItem('dearpapa:campaign-current', 'ig_letter');
    window.history.replaceState({}, '', '?utm_source=unknown');
    trackAction('letter_started');
    expect(emitted).toHaveBeenCalledWith('letter_started');
  });

  it('keeps an explicit fixed campaign property unchanged', () => {
    sessionStorage.setItem('dearpapa:campaign-current', 'ig_letter');
    trackAction('campaign_landing', { campaign: 'yt_letter' });
    expect(emitted).toHaveBeenCalledWith('campaign_landing', { campaign: 'yt_letter' });
  });

  it('does not add campaign scope to unrelated contact actions', () => {
    sessionStorage.setItem('dearpapa:campaign-current', 'ig_letter');
    trackAction('contact_email_copied');
    expect(emitted).toHaveBeenCalledWith('contact_email_copied');
  });
});
