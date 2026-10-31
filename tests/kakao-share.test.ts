import { afterEach, describe, expect, it, vi } from 'vitest';
import { isKakaoReady, kakaoLetterTemplate, prepareKakaoShare, sendLetterToKakao } from '@/components/letter/kakao-share';
import { KAKAO_SHARE_ORIGINS } from '@/lib/kakao-share-config';

const letter = { text: '아빠, 늘 고마워요.', from: '민지', date: '2026.10.29' };

afterEach(() => {
  Reflect.deleteProperty(window, 'Kakao');
  document.querySelectorAll('script[src*="kakao"]').forEach(node => node.remove());
});

describe('Kakao SDK hand-off (real module, stubbed SDK object)', () => {
  it('passes the feed template to sendDefault and only adds throughTalk:false for the web route', () => {
    const sendDefault = vi.fn();
    window.Kakao = { init: vi.fn(), isInitialized: () => true, Share: { sendDefault } };
    expect(isKakaoReady()).toBe(true);

    sendLetterToKakao(letter);
    expect(sendDefault).toHaveBeenCalledTimes(1);
    expect(sendDefault.mock.calls[0][0]).toEqual(kakaoLetterTemplate(letter));
    expect('throughTalk' in sendDefault.mock.calls[0][0]).toBe(false);

    sendLetterToKakao(letter, { web: true });
    expect(sendDefault.mock.calls[1][0]).toEqual({ ...kakaoLetterTemplate(letter), throughTalk: false });
  });

  it('throws before touching the SDK when it is not initialised, so callers fall back', () => {
    window.Kakao = { init: vi.fn(), isInitialized: () => false, Share: { sendDefault: vi.fn() } };
    expect(() => sendLetterToKakao(letter)).toThrow();
    expect(window.Kakao.Share.sendDefault).not.toHaveBeenCalled();
    Reflect.deleteProperty(window, 'Kakao');
    expect(isKakaoReady()).toBe(false);
  });

  it('does not load the SDK on an origin Kakao has not registered (it would replace the page with an error screen)', async () => {
    expect(KAKAO_SHARE_ORIGINS).toContain('https://dearpapa.kr');
    expect(KAKAO_SHARE_ORIGINS).not.toContain(window.location.origin);
    await expect(prepareKakaoShare()).resolves.toBe(false);
    expect(document.querySelector('script[src*="kakao_js_sdk"]')).toBeNull();
  });
});
