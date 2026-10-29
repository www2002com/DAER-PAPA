import { KAKAO_JAVASCRIPT_KEY } from '@/lib/kakao-share-config';
import { SODAM_LETTER_STICKER_PNG } from './share-assets';
import { createLetterShareUrl } from './share-link';
import type { LetterInput } from './card';

type KakaoSDK = {
  init(key: string): void;
  isInitialized(): boolean;
  Share: { sendDefault(template: ReturnType<typeof kakaoLetterTemplate>): void };
};
declare global { interface Window { Kakao?: KakaoSDK } }
let pending: Promise<boolean> | null = null;

export function kakaoLetterTemplate(letter: LetterInput) {
  const url = createLetterShareUrl(letter);
  const link = { mobileWebUrl: url, webUrl: url };
  return {
    objectType: 'feed' as const,
    content: {
      title: '당신에게 도착한 편지',
      description: letter.from ? `${letter.from}의 마음을 담은 편지예요.` : '마음을 담아 보낸 편지예요.',
      imageUrl: `https://dearpapa.kr${SODAM_LETTER_STICKER_PNG}`,
      imageWidth: 1254, imageHeight: 1254, link,
    },
    buttons: [{ title: '편지 읽기', link }],
  };
}

export function prepareKakaoShare(): Promise<boolean> {
  if (!KAKAO_JAVASCRIPT_KEY) return Promise.resolve(false);
  if (window.Kakao) {
    if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_JAVASCRIPT_KEY);
    return Promise.resolve(true);
  }
  if (pending) return pending;
  pending = new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.4/kakao.min.js';
    script.integrity = 'sha384-BGX7Wb16GmRFagri4bLJV2DgipVZaU2AI812GZtHtHzzDQJnfHasDXN5houxv45w';
    script.crossOrigin = 'anonymous';
    script.async = true;
    let settled = false;
    const finish = (ready: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      if (!ready) { pending = null; script.remove(); }
      resolve(ready);
    };
    const timer = window.setTimeout(() => finish(false), 8000);
    script.onload = () => {
      try {
        if (!window.Kakao) return finish(false);
        window.Kakao.init(KAKAO_JAVASCRIPT_KEY);
        finish(true);
      } catch { finish(false); }
    };
    script.onerror = () => finish(false);
    document.head.appendChild(script);
  });
  return pending;
}

/** Invoke synchronously in the click handler after preloading the SDK. */
export function sendLetterToKakao(letter: LetterInput) {
  if (!window.Kakao?.isInitialized()) throw new Error('카카오톡 공유 연결을 다시 확인해 주세요.');
  window.Kakao.Share.sendDefault(kakaoLetterTemplate(letter));
}
