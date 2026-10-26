import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import Privacy from '@/app/privacy/page';
import SkincareGuide from '@/app/journal/dad-gift-skincare-guide/page';
import AfterShave from '@/app/journal/after-shave-gift/page';
import { LAUNCH_NOTIFY_ENABLED_COPY } from '@/lib/launch-notify';
import { LETTER_STORY_PRIVACY, LETTER_STORY_PRIVACY_ENABLED } from '@/lib/privacy-copy';
import { RETENTION } from '@/lib/privacy-retention';
import { LetterStoryNotice } from '@/components/privacy/LetterStoryNotice';
import { STARTERS } from '@/components/letter/starters';
import { getJournalEntry } from '@/lib/journal';

afterEach(() => vi.unstubAllEnvs());
const off = () => { vi.stubEnv('LAUNCH_NOTIFY_ENABLED', ''); vi.stubEnv('RESEND_API_KEY', ''); };
const on = () => { vi.stubEnv('LAUNCH_NOTIFY_ENABLED', 'true'); vi.stubEnv('RESEND_API_KEY', 'private-test-key'); };

describe('copy tied to the launch-notify gate', () => {
  it('gate off: home and privacy keep the current wording, no gate-on strings', () => {
    off();
    const home = render(<Home />);
    expect(screen.getByText('출시 소식은 공식 채널에서 확인해 주세요')).toBeTruthy();
    expect(screen.queryByText(LAUNCH_NOTIFY_ENABLED_COPY.homeIntro)).toBeNull();
    home.unmount();
    render(<Privacy />);
    expect(screen.getByText('현재 출시 알림 신청을 위한 이메일을 수집하지 않습니다.')).toBeTruthy();
    expect(screen.queryByText(LAUNCH_NOTIFY_ENABLED_COPY.privacySummaryTitle)).toBeNull();
  });

  it('gate on: home shows the email line and privacy shows the email summary', () => {
    on();
    const home = render(<Home />);
    expect(screen.getByText(LAUNCH_NOTIFY_ENABLED_COPY.homeIntro)).toBeTruthy();
    expect(screen.queryByText('출시 소식은 공식 채널에서 확인해 주세요')).toBeNull();
    home.unmount();
    const { container } = render(<Privacy />);
    expect(screen.queryByText('현재 출시 알림 신청을 위한 이메일을 수집하지 않습니다.')).toBeNull();
    const summary = container.querySelector('#launch-email-summary')!;
    expect(summary.textContent).toContain(LAUNCH_NOTIFY_ENABLED_COPY.privacySummaryTitle);
    for (const [k, v] of LAUNCH_NOTIFY_ENABLED_COPY.privacySummary) {
      expect(summary.textContent).toContain(k);
      expect(summary.textContent).toContain(v);
    }
    expect(container.innerHTML).not.toContain('private-test-key');
  });

  it('new gated copy avoids application/benefit wording', () => {
    const all = JSON.stringify(LAUNCH_NOTIFY_ENABLED_COPY);
    for (const w of ['신청', '사전 예약', '혜택', '가격', '출시일']) expect(all).not.toContain(w);
  });
});

describe('letter story privacy section (own flag, off until retention is confirmed)', () => {
  it('flag is off by default', () => expect(LETTER_STORY_PRIVACY_ENABLED).toBe(false));
  for (const [label, setup] of [['gate off', off], ['gate on', on]] as const) {
    it(`is hidden on /privacy with ${label} while the flag is off`, () => {
      setup();
      const { container } = render(<Privacy />);
      expect(container.querySelector('#letter-stories')).toBeNull();
      expect(container.textContent).not.toContain('사연 모집');
    });
  }
  it('renders every row when the flag is on', () => {
    const { container } = render(<LetterStoryNotice enabled />);
    expect(container.querySelector('#letter-stories')?.textContent).toBe(LETTER_STORY_PRIVACY.title);
    for (const [k, v] of LETTER_STORY_PRIVACY.rows) {
      expect(container.textContent).toContain(k);
      expect(container.textContent).toContain(v);
    }
    const text = container.textContent!;
    expect(text).toContain('편지 사진, 한 줄 사연, 회신용 인스타그램 계정 이름 또는 이메일 주소');
    expect(text).toContain('만 14세 미만은 보호자(아빠)가 대신 보내 주세요.');
    expect(text).toContain('편지 사진에 아이의 이름이나 학교가 보이면 소개하기 전에 가립니다.');
    expect(text).toContain('7일 안에 게시물을 내리고');
    for (const v of [RETENTION.unusedStory, RETENTION.publishedStory, RETENTION.consentRecord]) expect(text).toContain(v);
  });
  it('has no prize or application wording', () => {
    const all = JSON.stringify(LETTER_STORY_PRIVACY);
    for (const w of ['사례품', '경품', '증정', '혜택', '신청']) expect(all).not.toContain(w);
  });
});

describe('letter example lines', () => {
  it('shows the approved example lines first in the composer', () => {
    off();
    expect(STARTERS[0].lines).toEqual([
      '아빠, 말은 잘 못 해도 늘 고마워요.',
      '요즘 내가 아빠 닮았다는 말 자주 들어. 그게 좋더라.',
      '이번 주말엔 내가 먼저 전화할게요, 아빠.',
      '아빠라는 직함이 제일 멋있어요.',
    ]);
    render(<Home />);
    for (const line of STARTERS[0].lines) expect(screen.getByRole('button', { name: line })).toBeTruthy();
  });
});

describe('content bot letter lines (10/26)', () => {
  it('adds the new lines to the gratitude and daily tabs', () => {
    const thanks = STARTERS.find((s) => s.id === 'thanks')!;
    const daily = STARTERS.find((s) => s.id === 'daily')!;
    expect(thanks.label).toBe('고마운 마음');
    expect(daily.label).toBe('일상의 안부');
    expect(thanks.lines).toContain('언제나 든든한 아빠 딸이라 참 행복해요. 말로 다 못한 마음을 이 편지에 담아요.');
    expect(daily.lines).toContain('아빠의 매일을 늘 응원해요. 오늘도 거울 앞에서 한 번 웃고 시작해요!');
  });
});

describe('Kumar & Epley paragraph in the two journal pages', () => {
  for (const [slug, Page] of [['dad-gift-skincare-guide', SkincareGuide], ['after-shave-gift', AfterShave]] as const) {
    it(slug, () => {
      const { container } = render(<Page />);
      const text = container.textContent!;
      expect(text).toContain('잘 쓰지 않아도 괜찮아요.');
      expect(text).toContain('예상 2.95, 실제 1.95');
      expect(text).toContain('예상 3.11, 실제 4.12');
      expect(text).toContain('이 연구는 미국 성인을 대상으로 했고 아빠와 자녀만 따로 살펴본 것은 아니에요.');
      expect(container.querySelector('a[href="https://doi.org/10.1177/0956797618772506"]')).not.toBeNull();
      expect(container.querySelector('a[href*="webflow"]')).toBeNull();
      expect(container.querySelector('a[href*="chicagobooth"]')).not.toBeNull();
      expect(getJournalEntry(slug).modified).toBe('2026-10-26');
    });
  }
});
