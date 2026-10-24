import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LaunchNotify } from '@/components/LaunchNotify';
import { LAUNCH_NOTIFY_COPY as COPY } from '@/lib/launch-notify';

// Analytics is an external transport: inspect what the real form emits, without sending data.
const { emitted } = vi.hoisted(() => ({ emitted: vi.fn() }));
vi.mock('@/lib/analytics', () => ({ trackAction: emitted }));
let observeCallback: IntersectionObserverCallback;
const disconnect = vi.fn();
beforeEach(() => {
  emitted.mockClear();
  disconnect.mockClear();
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: IntersectionObserverCallback) { observeCallback = callback; }
    observe() {}
    disconnect = disconnect;
    unobserve() {}
  });
});
afterEach(() => vi.unstubAllGlobals());

function submit() {
  fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'private@example.com' } });
  fireEvent.click(screen.getByLabelText(COPY.consent));
  fireEvent.click(screen.getByRole('button', { name: COPY.submit }));
}

describe('marketing funnel measurement', () => {
  it('does not count a honeypot response as a real signup attempt or success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"ok":true}', { status: 200 }));
    render(<LaunchNotify placement="home" />);
    fireEvent.change(screen.getByLabelText('Website'), { target: { value: 'https://spam.example' } });
    submit();
    await screen.findByText(COPY.success);
    expect(emitted).not.toHaveBeenCalled();
  });
  it('does not count the initial intersection below 50%, and counts one qualifying view', () => {
    render(<LaunchNotify placement="home" />);
    const entry = (ratio: number) => ({ isIntersecting: true, intersectionRatio: ratio } as IntersectionObserverEntry);
    act(() => observeCallback([entry(.1)], {} as IntersectionObserver));
    expect(emitted).not.toHaveBeenCalled();
    act(() => observeCallback([entry(.5)], {} as IntersectionObserver));
    act(() => observeCallback([entry(.9)], {} as IntersectionObserver));
    expect(emitted.mock.calls).toEqual([['launch_notify_viewed', { placement: 'home' }]]);
  });

  it('records an accepted submission separately from an attempt without personal data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"ok":true}', { status: 200 }));
    render(<LaunchNotify placement="product" />);
    submit();
    await screen.findByText(COPY.success);
    expect(emitted.mock.calls).toEqual([
      ['launch_notify_attempted', { placement: 'product' }],
      ['launch_notify_submitted', { placement: 'product' }],
    ]);
  });

  it.each(['not_configured', 'rate_limited', 'server_error'])('records %s without counting success', async (code) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ ok: false, error: code }), { status: 503 }));
    render(<LaunchNotify placement="home" />);
    submit();
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe(COPY.errors[code as keyof typeof COPY.errors]));
    expect(emitted.mock.calls).toEqual([
      ['launch_notify_attempted', { placement: 'home' }],
      ['launch_notify_failed', { placement: 'home', reason: code }],
    ]);
  });

  it('maps untrusted server error keys to a fixed safe category', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"error":"toString"}', { status: 502 }));
    render(<LaunchNotify placement="home" />);
    submit();
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe(COPY.errors.server_error));
    expect(emitted).toHaveBeenLastCalledWith('launch_notify_failed', { placement: 'home', reason: 'server_error' });
  });

  it('records a network failure and permits a retry', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('private transport error'));
    render(<LaunchNotify placement="home" />);
    submit();
    await screen.findByText(COPY.errors.server_error);
    expect(screen.getByRole('button', { name: COPY.submit }).hasAttribute('disabled')).toBe(false);
    expect(emitted).toHaveBeenLastCalledWith('launch_notify_failed', { placement: 'home', reason: 'server_error' });
    expect(JSON.stringify(emitted.mock.calls)).not.toContain('private');
  });
});
