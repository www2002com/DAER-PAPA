import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import Privacy from '@/app/privacy/page';
import { storeFromEnv } from '@/lib/launch-notify-server';
import { LaunchNotifySection } from '@/components/LaunchNotifySection';

afterEach(() => vi.unstubAllEnvs());

describe('unconfigured production release', () => {
  it('renders the form only with explicit enablement and a key, without exposing the key', () => {
    vi.stubEnv('LAUNCH_NOTIFY_ENABLED', 'true');
    vi.stubEnv('RESEND_API_KEY', 'private-test-key');
    const { container } = render(<LaunchNotifySection placement="product" />);
    expect(container.querySelector('input[type=email]')).not.toBeNull();
    expect(container.innerHTML).not.toContain('private-test-key');
  });
  it('does not request an email before collection is explicitly enabled', () => {
    vi.stubEnv('LAUNCH_NOTIFY_ENABLED', '');
    vi.stubEnv('RESEND_API_KEY', '');
    const { container } = render(<Home />);
    expect(container.querySelector('input[type=email]')).toBeNull();
    expect(screen.getByText('출시 소식은 공식 채널에서 확인해 주세요')).toBeTruthy();
  });
  it('does not activate delivery merely because a key was added', () => {
    expect(storeFromEnv({ RESEND_API_KEY: 'test-key' })).toBeNull();
  });
  it('explains the current non-collection state on the privacy page', () => {
    vi.stubEnv('LAUNCH_NOTIFY_ENABLED', '');
    vi.stubEnv('RESEND_API_KEY', '');
    render(<Privacy />);
    expect(screen.getByText(/현재 출시 알림 신청을 위한 이메일을 수집하지 않습니다/)).toBeTruthy();
  });
});
