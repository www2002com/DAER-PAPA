import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

beforeEach(() => {
  localStorage.clear();
  // jsdom has no canvas renderer or media preferences; persistence tests do not need either.
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  window.matchMedia = vi.fn().mockImplementation((media: string) => ({
    matches: true, media, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return true; },
  }));
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
