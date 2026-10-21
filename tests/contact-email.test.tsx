import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ContactEmail } from '@/components/ContactEmail';

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

beforeEach(() => {
  vi.useFakeTimers();
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard);
  else Reflect.deleteProperty(navigator, 'clipboard');
});

async function copyAddress() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /^(이메일 )?주소 복사( 완료)?$/ }));
  });
}

describe('inquiry email feedback', () => {
  it('returns to the copy action and default guidance after showing success briefly', async () => {
    render(<ContactEmail />);
    const defaultGuidance = screen.getByRole('status').textContent;
    await copyAddress();
    expect(screen.getByRole('button', { name: '주소 복사 완료' })).toBeTruthy();
    expect(screen.getByRole('status').textContent).not.toBe(defaultGuidance);
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.queryByRole('button', { name: '주소 복사 완료' })).toBeNull();
    expect(screen.getByRole('status').textContent).toBe(defaultGuidance);
  });

  it('keeps the acknowledgement visible for a fresh interval when the address is copied again', async () => {
    render(<ContactEmail />);
    await copyAddress();
    act(() => vi.advanceTimersByTime(2000));
    await copyAddress();
    act(() => vi.advanceTimersByTime(1500));
    expect(screen.getByRole('button', { name: '주소 복사 완료' })).toBeTruthy();
    act(() => vi.advanceTimersByTime(1500));
    expect(screen.queryByRole('button', { name: '주소 복사 완료' })).toBeNull();
  });

  it('keeps the manual-copy fallback available when a later copy attempt is denied', async () => {
    render(<ContactEmail />);
    await copyAddress();
    navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('Permission denied'));
    await copyAddress();
    const address = screen.getByRole('textbox', { name: '복사할 문의 이메일 주소' }) as HTMLInputElement;
    expect(address.value).toBe('hello@dearpapa.kr');
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByRole('textbox', { name: '복사할 문의 이메일 주소' })).toBe(address);
    expect(screen.queryByRole('button', { name: '주소 복사 완료' })).toBeNull();
  });
});
