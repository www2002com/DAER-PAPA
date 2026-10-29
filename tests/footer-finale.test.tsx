import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FooterLogo } from '@/components/FooterLogo';

const props = {
  slogan: '아빠의 매일에, 딸의 마음을.',
  definition: '아빠를 위한 올인원 스킨케어. 딸의 한 줄 편지와 함께 건네는 선물.',
  explanation: '로고 · d(Dear)를 180° 돌리면 p(Papa)가 됩니다. 딸과 아빠가 가운데의 원 하나를 함께 쥔 모양입니다.',
};

let intersect: (ratio: number) => void;
let media: EventTarget & { matches: boolean };

beforeEach(() => {
  vi.useFakeTimers();
  media = Object.assign(new EventTarget(), { matches: false });
  window.matchMedia = vi.fn(() => media as MediaQueryList);
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: IntersectionObserverCallback) {
      intersect = (ratio) => callback([{ isIntersecting: ratio > 0, intersectionRatio: ratio } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
    }
    observe() {}
    disconnect() {}
  });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

function mount() {
  const view = render(<FooterLogo {...props} />);
  return { ...view, stage: view.container.querySelector('#brand-finale')!, replay: screen.getByRole('button', { name: '디어파파 로고 모션 다시 보기' }) };
}

describe('footer finale playback', () => {
  it('ships the complete brand and copy in the server HTML without requiring animation', () => {
    const html = renderToString(<FooterLogo {...props} />);
    expect(html).toContain('data-playing="false"');
    Object.values(props).forEach((copy) => expect(html).toContain(copy));
  });

  it('plays only after enough of the stage is visible, then stays finished on re-entry', () => {
    const { stage } = mount();
    act(() => intersect(0.3));
    expect(stage.getAttribute('data-playing')).toBe('false');
    act(() => intersect(0.7));
    expect(stage.getAttribute('data-playing')).toBe('true');
    act(() => vi.advanceTimersByTime(3000));
    expect(stage.getAttribute('data-playing')).toBe('false');
    act(() => { intersect(0); intersect(0.8); });
    expect(stage.getAttribute('data-playing')).toBe('false');
  });

  it('honors reduced motion both before entry and when changed during playback', () => {
    media.matches = true;
    const { stage, replay } = mount();
    act(() => intersect(0.8));
    fireEvent.click(replay, { detail: 1 });
    expect(stage.getAttribute('data-playing')).toBe('false');
    act(() => { media.matches = false; media.dispatchEvent(new Event('change')); });
    fireEvent.click(replay, { detail: 1 });
    expect(stage.getAttribute('data-playing')).toBe('true');
    act(() => { media.matches = true; media.dispatchEvent(new Event('change')); });
    expect(stage.getAttribute('data-playing')).toBe('false');
  });

  it('shows the final lockup for keyboard navigation and can replay again with a pointer', () => {
    const { stage, replay } = mount();
    fireEvent.keyDown(document, { key: 'Tab' });
    act(() => intersect(0.8));
    fireEvent.click(replay, { detail: 0 });
    expect(stage.getAttribute('data-playing')).toBe('false');
    fireEvent.pointerDown(replay);
    fireEvent.click(replay, { detail: 1 });
    expect(stage.getAttribute('data-playing')).toBe('true');
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(stage.getAttribute('data-playing')).toBe('false');
  });

  it('restarts the finish timer on replay and settles when the tab is hidden', () => {
    const { stage, replay } = mount();
    act(() => intersect(0.8));
    act(() => vi.advanceTimersByTime(2000));
    fireEvent.click(replay, { detail: 1 });
    act(() => vi.advanceTimersByTime(1000));
    expect(stage.getAttribute('data-playing')).toBe('true');
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    expect(stage.getAttribute('data-playing')).toBe('false');
  });
});
