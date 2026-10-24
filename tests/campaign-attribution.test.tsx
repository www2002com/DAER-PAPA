import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render } from '@testing-library/react';
import { CampaignAttribution } from '@/components/CampaignAttribution';
import { campaignForCurrentLocation, campaignFromSearch, campaignFromSession, type CampaignId } from '@/lib/campaign-attribution';
import { trackAction } from '@/lib/analytics';

vi.mock('@/lib/analytics', () => ({ trackAction: vi.fn() }));

const validSearches: Array<[string, CampaignId]> = [
  ['?utm_campaign=prelaunch_202610&utm_source=instagram&utm_medium=organic_social&utm_content=reel_letter_a', 'ig_letter'],
  ['?utm_source=instagram&utm_content=reel_product_b&utm_medium=organic_social&utm_campaign=prelaunch_202610', 'ig_product'],
  ['?utm_campaign=prelaunch_202610&utm_source=youtube&utm_medium=organic_social&utm_content=short_letter_a', 'yt_letter'],
  ['?utm_campaign=prelaunch_202610&utm_source=naver&utm_medium=blog&utm_content=blog_product_questions', 'naver_product'],
];

beforeEach(() => {
  sessionStorage.clear();
  vi.mocked(trackAction).mockClear();
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubGlobal('va', vi.fn());
  window.history.replaceState({}, '', '/');
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('campaignFromSearch', () => {
  it.each(validSearches)('accepts the approved tuple %s', (search, expected) => {
    expect(campaignFromSearch(search)).toBe(expected);
  });

  it.each([
    '?utm_campaign=prelaunch_202610&utm_source=alice@example.com&utm_medium=organic_social&utm_content=reel_letter_a',
    '?utm_campaign=prelaunch_202610&utm_source=tiktok&utm_medium=organic_social&utm_content=reel_letter_a',
    '?utm_campaign=other&utm_source=instagram&utm_medium=organic_social&utm_content=reel_letter_a',
    '?utm_campaign=prelaunch_202610&utm_source=instagram&utm_medium=organic_social&utm_content=unknown',
    '?utm_campaign=prelaunch_202610&utm_source=instagram&utm_medium=organic_social',
  ])('rejects an unapproved or incomplete query %s', (search) => {
    expect(campaignFromSearch(search)).toBeNull();
  });

  it.each([
    '?utm_campaign=prelaunch_202610&utm_campaign=prelaunch_202610&utm_source=instagram&utm_medium=organic_social&utm_content=reel_letter_a',
    '?utm_campaign=prelaunch_202610&utm_source=instagram&utm_source=instagram&utm_medium=organic_social&utm_content=reel_letter_a',
    '?utm_campaign=prelaunch_202610&utm_source=instagram&utm_medium=organic_social&utm_content=reel_letter_a&utm_content=reel_letter_a',
  ])('rejects duplicate attribution keys %s', (search) => {
    expect(campaignFromSearch(search)).toBeNull();
  });
});

describe('CampaignAttribution', () => {
  it('sends one fixed campaign event in Strict Mode', () => {
    window.history.replaceState({}, '', validSearches[0][0]);
    render(<StrictMode><CampaignAttribution /></StrictMode>);
    expect(trackAction).toHaveBeenCalledTimes(1);
    expect(trackAction).toHaveBeenCalledWith('campaign_landing', { campaign: 'ig_letter' });
    expect(JSON.stringify(vi.mocked(trackAction).mock.calls)).not.toContain('reel_letter_a');
  });

  it('ignores unrelated click identifiers without sending the raw query', () => {
    window.history.replaceState({}, '', `${validSearches[0][0]}&fbclid=personal-looking-value`);
    render(<CampaignAttribution />);
    expect(trackAction).toHaveBeenCalledWith('campaign_landing', { campaign: 'ig_letter' });
    expect(JSON.stringify(vi.mocked(trackAction).mock.calls)).not.toContain('fbclid');
    expect(JSON.stringify(vi.mocked(trackAction).mock.calls)).not.toContain('personal-looking-value');
  });

  it('deduplicates the same campaign across component mounts but records another valid campaign', () => {
    window.history.replaceState({}, '', validSearches[0][0]);
    const first = render(<CampaignAttribution />);
    first.unmount();
    render(<CampaignAttribution />);
    expect(trackAction).toHaveBeenCalledTimes(1);

    window.history.replaceState({}, '', validSearches[1][0]);
    render(<CampaignAttribution />);
    expect(trackAction).toHaveBeenCalledTimes(2);
    expect(trackAction).toHaveBeenLastCalledWith('campaign_landing', { campaign: 'ig_product' });
  });

  it('does not crash or duplicate when session storage is unavailable', () => {
    window.history.replaceState({}, '', validSearches[2][0]);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(() => render(<StrictMode><CampaignAttribution /></StrictMode>)).not.toThrow();
    expect(trackAction).toHaveBeenCalledTimes(1);
  });

  it('waits for the analytics queue before sending or marking a campaign', () => {
    vi.useFakeTimers();
    vi.stubGlobal('va', undefined);
    window.history.replaceState({}, '', validSearches[2][0]);
    render(<CampaignAttribution />);
    expect(trackAction).not.toHaveBeenCalled();
    expect(campaignFromSession()).toBe('yt_letter');
    expect(sessionStorage.getItem('dearpapa:campaign-landing:yt_letter')).toBeNull();

    const queue = vi.fn();
    vi.stubGlobal('va', queue);
    act(() => { vi.advanceTimersByTime(100); });
    expect(trackAction).toHaveBeenCalledTimes(1);
    expect(trackAction).toHaveBeenCalledWith('campaign_landing', { campaign: 'yt_letter' });
    expect(sessionStorage.getItem('dearpapa:campaign-landing:yt_letter')).toBe('1');
    expect(campaignFromSession()).toBe('yt_letter');
  });

  it('clears a stale campaign on a fresh organic entry', () => {
    sessionStorage.setItem('dearpapa:campaign-current', 'ig_letter');
    window.history.replaceState({}, '', '/');
    render(<CampaignAttribution />);
    expect(campaignFromSession()).toBeNull();
  });

  it('rejects a forged stored campaign code', () => {
    sessionStorage.setItem('dearpapa:campaign-current', 'alice@example.com');
    expect(campaignFromSession()).toBeNull();
  });

  it('prefers the approved URL campaign while a new landing is initializing', () => {
    sessionStorage.setItem('dearpapa:campaign-current', 'ig_letter');
    window.history.replaceState({}, '', validSearches[1][0]);
    expect(campaignForCurrentLocation()).toBe('ig_product');
  });

  it('does not reuse a stored campaign when attribution keys are invalid', () => {
    sessionStorage.setItem('dearpapa:campaign-current', 'ig_letter');
    window.history.replaceState({}, '', '?utm_source=unknown');
    expect(campaignForCurrentLocation()).toBeNull();
  });

  it('does not mark or send when the analytics queue never becomes available', () => {
    vi.useFakeTimers();
    vi.stubGlobal('va', undefined);
    window.history.replaceState({}, '', validSearches[3][0]);
    render(<CampaignAttribution />);
    act(() => { vi.advanceTimersByTime(10_100); });
    expect(trackAction).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('dearpapa:campaign-landing:naver_product')).toBeNull();
  });

  it('cancels a pending queue retry when unmounted', () => {
    vi.useFakeTimers();
    vi.stubGlobal('va', undefined);
    window.history.replaceState({}, '', validSearches[0][0]);
    const page = render(<CampaignAttribution />);
    page.unmount();
    vi.stubGlobal('va', vi.fn());
    act(() => { vi.advanceTimersByTime(10_100); });
    expect(trackAction).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('dearpapa:campaign-landing:ig_letter')).toBeNull();
  });

  it('does not send campaign events outside production', () => {
    vi.stubEnv('NODE_ENV', 'test');
    window.history.replaceState({}, '', validSearches[3][0]);
    render(<StrictMode><CampaignAttribution /></StrictMode>);
    expect(trackAction).not.toHaveBeenCalled();
  });
});
