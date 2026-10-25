// Local-only static preview with the same AI handler used by the Vercel Function.
import http from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { Readable } from 'node:stream';
import ts from 'typescript';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = path.join(root, 'out');
const compiled = path.join(root, '.preview-api');
if (existsSync(path.join(root, '.env.local'))) process.loadEnvFile(path.join(root, '.env.local'));
await mkdir(compiled, { recursive: true });
for (const name of ['facts', 'bunny-prepared-reply', 'bunny-chat-server']) {
  const source = await readFile(path.join(root, 'lib', `${name}.ts`), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  await writeFile(path.join(compiled, `${name}.js`), outputText);
}
const { createBunnyChatHandler } = await import(pathToFileURL(path.join(compiled, 'bunny-chat-server.js')).href);
const chat = createBunnyChatHandler({ env: { ...process.env, NODE_ENV: 'development' } });
const port = Number(process.env.PREVIEW_PORT || 51900);
const base = `http://127.0.0.1:${port}`;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml' };

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', base);
    if (url.pathname === '/api/bunny-chat') {
      const controller = new AbortController();
      req.once('aborted', () => controller.abort());
      res.once('close', () => { if (!res.writableEnded) controller.abort(); });
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(',') : value);
      // Ignore client-supplied proxy IP headers in the local preview.
      headers.set('x-forwarded-for', req.socket.remoteAddress || 'local');
      headers.delete('x-vercel-forwarded-for');
      const request = new Request(url, { method: req.method, headers, signal: controller.signal,
        ...(!['GET', 'HEAD'].includes(req.method || 'GET') ? { body: Readable.toWeb(req), duplex: 'half' } : {}),
      });
      const response = await chat(request);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }
    if (!['GET', 'HEAD'].includes(req.method || 'GET')) { res.writeHead(405); res.end(); return; }
    const file = path.resolve(out, `.${decodeURIComponent(url.pathname)}`);
    if (file !== out && !file.startsWith(out + path.sep)) { res.writeHead(403); res.end(); return; }
    const candidates = [file, `${file}.html`, path.join(file, 'index.html')];
    let selected;
    for (const candidate of candidates) {
      try { if ((await stat(candidate)).isFile()) { selected = candidate; break; } } catch { /* Try the next static route. */ }
    }
    if (!selected) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(selected)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : await readFile(selected));
  } catch { if (!res.headersSent) res.writeHead(500); res.end('Preview request failed'); }
}).listen(port, '127.0.0.1', () => {
  console.log(`Preview: ${base}`);
  console.log(`OpenAI configured: ${process.env.BUNNY_AI_ENABLED === 'true' && Boolean(process.env.OPENAI_API_KEY?.trim())}`);
});
