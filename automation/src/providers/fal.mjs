// 장면 이미지·영상 생성: fal.ai 큐 API. 모델은 몇 개월 단위로 바뀌므로 환경 변수로 교체한다(모듈 6 §3).
import { writeFile } from 'node:fs/promises';
import { need, sleep } from '../store.mjs';

export const IMAGE_MODEL = process.env.DP_IMAGE_MODEL ?? 'fal-ai/flux-pro/v1.1';
export const VIDEO_MODEL = process.env.DP_VIDEO_MODEL ?? 'fal-ai/kling-video/v2.1/standard/image-to-video';
const TIMEOUT_MS = 15 * 60 * 1000;

async function call(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: { Authorization: `Key ${need('FAL_KEY')}`, 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`fal ${response.status}: ${await response.text()}`);
  return response.json();
}

async function runModel(model, input) {
  const job = await call(`https://queue.fal.run/${model}`, { method: 'POST', body: JSON.stringify(input) });
  const deadline = Date.now() + TIMEOUT_MS;
  while (Date.now() < deadline) {
    const { status } = await call(job.status_url);
    if (status === 'COMPLETED') return call(job.response_url);
    if (status !== 'IN_QUEUE' && status !== 'IN_PROGRESS') throw new Error(`fal 작업 상태: ${status}`);
    await sleep(4000);
  }
  throw new Error(`fal 작업 시간 초과: ${model}`);
}

export async function download(url, out) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`다운로드 실패 ${response.status}: ${url}`);
  await writeFile(out, Buffer.from(await response.arrayBuffer()));
}

export async function generateImage(prompt) {
  const result = await runModel(IMAGE_MODEL, { prompt, image_size: 'portrait_16_9', num_images: 1 });
  return result.images[0].url;
}

export async function imageToVideo(imageUrl, prompt) {
  const result = await runModel(VIDEO_MODEL, { prompt, image_url: imageUrl, duration: '5' });
  return result.video.url;
}
