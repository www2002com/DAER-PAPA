// Standalone Node.js Vercel Function alongside the Next.js static export.
import { createBunnyChatHandler } from '../lib/bunny-chat-server.js';

export const POST = createBunnyChatHandler();
export function GET(): Response {
  return new Response(null, { status: 405, headers: { Allow: 'POST', 'Cache-Control': 'no-store' } });
}
