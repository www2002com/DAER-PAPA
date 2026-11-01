import { KAKAO_JAVASCRIPT_KEY, KAKAO_SHARE_ORIGINS } from '@/lib/kakao-share-config';
import { LETTER_SHARE_CARD } from './share-assets';
import { createLetterShareUrl } from './share-link';
import type { LetterInput } from './card';

type KakaoSDK = {
  init(key: string): void;
  isInitialized(): boolean;
  Share: { sendDefault(settings: ReturnType<typeof kakaoLetterTemplate> & { throughTalk?: boolean }): void };
};
declare global { interface Window { Kakao?: KakaoSDK } }
let pending: Promise<boolean> | null = null;

const SITE = 'https://dearpapa.kr';

/**
 * The KakaoTalk card. It names the sender and the date but never carries the letter itself,
 * so the chat list and notifications do not reveal it; the letter opens from the link.
 */
export function kakaoLetterTemplate(letter: LetterInput) {
  const url = createLetterShareUrl(letter);
  const link = { mobileWebUrl: url, webUrl: url };
  const write = { mobileWebUrl: `${SITE}/#letter`, webUrl: `${SITE}/#letter` };
  const from = letter.from.trim();
  return {
    objectType: 'feed' as const,
    content: {
      title: from ? `${from}의 편지가 도착했어요` : '편지가 도착했어요',
      description: '봉투를 열면 마음을 담은 한 줄이 있어요.',
      imageUrl: `${SITE}${LETTER_SHARE_CARD}`,
      imageWidth: 800, imageHeight: 800, link,
    },
    itemContent: {
      profileText: 'DEAR PAPA',
      items: [
        ...(from ? [{ item: '보낸 사람', itemOp: from }] : []),
        { item: '쓴 날', itemOp: letter.date },
      ],
    },
    buttons: [
      { title: '편지 열어보기', link },
      { title: '나도 편지 쓰기', link: write },
    ],
  };
}

export function isKakaoReady(): boolean {
  return typeof window !== 'undefined' && !!window.Kakao?.isInitialized();
}

export function prepareKakaoShare(): Promise<boolean> {
  if (!KAKAO_JAVASCRIPT_KEY || !KAKAO_SHARE_ORIGINS.includes(window.location.origin)) return Promise.resolve(false);
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

/**
 * Invoke synchronously in the click handler after preloading the SDK. `web` asks the pinned SDK
 * (2.8.4 `throughTalk`) to use Kakao's web share page instead of launching the KakaoTalk app,
 * for phones where the app does not open; it is only ever chosen by the visitor.
 */
export function sendLetterToKakao(letter: LetterInput, { web = false }: { web?: boolean } = {}) {
  if (!window.Kakao?.isInitialized()) throw new Error('카카오톡 공유 연결을 다시 확인해 주세요.');
  window.Kakao.Share.sendDefault({ ...kakaoLetterTemplate(letter), ...(web ? { throughTalk: false } : {}) });
}
