/** Server/build-time check. No credentials are passed to client components. */
export function launchNotifyReady(env: Record<string, string | undefined> = process.env): boolean {
  return env.LAUNCH_NOTIFY_ENABLED === 'true' && !!env.RESEND_API_KEY?.trim();
}
