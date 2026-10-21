import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Vercel builds set NODE_ENV=production; React's test renderer needs its test/development exports.
// Scope this override to the test child process so the following Next build stays production.
const result = spawnSync(process.execPath, [
  fileURLToPath(new URL('../node_modules/vitest/vitest.mjs', import.meta.url)),
  'run', ...process.argv.slice(2),
], { env: { ...process.env, NODE_ENV: 'test' }, stdio: 'inherit' });
if (result.error) console.error(result.error.message);
process.exitCode = result.status ?? 1;
