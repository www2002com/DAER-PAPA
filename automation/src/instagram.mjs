// 게시(오가닉): Instagram Graph API 릴스 재개형 업로드. 승인 3(게시 승인) 없이는 호출되지 않는다.
import { readFile } from 'node:fs/promises';
import { need, sleep } from './store.mjs';

const GRAPH = process.env.IG_GRAPH_HOST ?? 'https://graph.facebook.com';
const VERSION = process.env.IG_GRAPH_VERSION ?? 'v23.0';

async function graph(method, pathname, params) {
  const url = new URL(`${GRAPH}/${VERSION}/${pathname}`);
  for (const [k, v] of Object.entries({ ...params, access_token: need('IG_ACCESS_TOKEN') })) url.searchParams.set(k, v);
  const response = await fetch(url, { method });
  const body = await response.json();
  if (!response.ok || body.error) throw new Error(`Instagram ${response.status}: ${JSON.stringify(body.error ?? body)}`);
  return body;
}

export async function publishReel(videoFile, caption) {
  const user = need('IG_USER_ID');
  const bytes = await readFile(videoFile);
  const container = await graph('POST', `${user}/media`, {
    media_type: 'REELS', upload_type: 'resumable', caption, share_to_feed: 'true',
  });
  const upload = await fetch(container.uri ?? `https://rupload.facebook.com/ig-api-upload/${VERSION}/${container.id}`, {
    method: 'POST',
    headers: { Authorization: `OAuth ${need('IG_ACCESS_TOKEN')}`, offset: '0', file_size: String(bytes.length) },
    body: bytes,
  });
  if (!upload.ok) throw new Error(`업로드 실패 ${upload.status}: ${await upload.text()}`);
  for (let i = 0; i < 60; i += 1) {
    const { status_code: status } = await graph('GET', container.id, { fields: 'status_code' });
    if (status === 'FINISHED') {
      const published = await graph('POST', `${user}/media_publish`, { creation_id: container.id });
      const { permalink } = await graph('GET', published.id, { fields: 'permalink' });
      return { mediaId: published.id, permalink };
    }
    if (status === 'ERROR' || status === 'EXPIRED') throw new Error(`Instagram 처리 상태: ${status}`);
    await sleep(10000);
  }
  throw new Error('Instagram 처리 대기 시간 초과 (10분)');
}
