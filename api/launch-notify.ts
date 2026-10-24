// Vercel Function (Node.js runtime) for the 출시 알림 신청 form.
// The site itself is a static export (next.config.ts output: 'export'), so Next.js route handlers
// cannot run; Vercel deploys files in the root /api directory as functions alongside the static site.
import { handleLaunchNotify } from '../lib/launch-notify-server';

export function POST(request: Request): Promise<Response> {
  return handleLaunchNotify(request);
}

export function GET(): Response {
  return new Response(null, { status: 405, headers: { Allow: 'POST' } });
}
