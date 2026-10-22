// Gemini API(REST). 보고서 지정 도구: 레퍼런스 영상 역기획(Gemini 비전)과 영상 생성(Veo).
// 모델 ID는 기본값 없이 .env에서만 받는다 — 프리뷰 모델은 예고 후 종료되므로 추측한 이름을 코드에 두지 않는다.
import { readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { need, sleep } from '../store.mjs';

const BASE = 'https://generativelanguage.googleapis.com';
const MIME = { '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.webm': 'video/webm', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
const headers = (extra = {}) => ({ 'x-goog-api-key': need('GEMINI_API_KEY'), ...extra });
export const isYouTube = (source) => /^https?:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//.test(source);

async function call(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`Gemini ${response.status}: ${await response.text()}`);
  return response;
}

// Files API 재개 가능 업로드 → ACTIVE가 될 때까지 대기.
async function uploadFile(file) {
  const mimeType = MIME[path.extname(file).toLowerCase()];
  if (!mimeType) throw new Error(`지원하지 않는 파일 형식: ${file}`);
  const bytes = await readFile(file);
  const start = await call(`${BASE}/upload/v1beta/files`, {
    method: 'POST',
    headers: headers({
      'X-Goog-Upload-Protocol': 'resumable', 'X-Goog-Upload-Command': 'start',
      'X-Goog-Upload-Header-Content-Length': String((await stat(file)).size),
      'X-Goog-Upload-Header-Content-Type': mimeType, 'Content-Type': 'application/json',
    }),
    body: JSON.stringify({ file: { display_name: path.basename(file) } }),
  });
  const uploadUrl = start.headers.get('x-goog-upload-url');
  const { file: info } = await (await call(uploadUrl, {
    method: 'POST',
    headers: { 'X-Goog-Upload-Offset': '0', 'X-Goog-Upload-Command': 'upload, finalize' },
    body: bytes,
  })).json();
  let current = info;
  for (let i = 0; current.state === 'PROCESSING'; i += 1) {
    if (i > 60) throw new Error('Gemini 파일 처리가 5분 안에 끝나지 않았습니다.');
    await sleep(5000);
    current = await (await call(`${BASE}/v1beta/${info.name}`, { headers: headers() })).json();
  }
  if (current.state !== 'ACTIVE') throw new Error(`Gemini 파일 상태: ${current.state}`);
  return { file_uri: current.uri, mime_type: mimeType };
}

// 영상(로컬 파일 또는 YouTube URL) + 지시문 → JSON 응답.
export async function analyzeVideo(source, instruction) {
  const fileData = isYouTube(source) ? { file_uri: source } : await uploadFile(source);
  const body = await (await call(`${BASE}/v1beta/models/${need('DP_GEMINI_MODEL')}:generateContent`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      contents: [{ parts: [{ file_data: fileData }, { text: instruction }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  })).json();
  const text = body.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('');
  if (!text) throw new Error(`Gemini 응답이 비었습니다: ${JSON.stringify(body.promptFeedback ?? body)}`);
  return JSON.parse(text);
}

// Veo 이미지→영상 (predictLongRunning). 시작 프레임은 승인된 기획서로 만든 장면 이미지다.
async function veo(image, prompt, out) {
  const parameters = { aspectRatio: '9:16', ...(process.env.DP_VEO_DURATION ? { durationSeconds: process.env.DP_VEO_DURATION } : {}) };
  const { name } = await (await call(`${BASE}/v1beta/models/${need('DP_VEO_MODEL')}:predictLongRunning`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      instances: [{ prompt, image: { inlineData: { mimeType: 'image/png', data: (await readFile(image)).toString('base64') } } }],
      parameters,
    }),
  })).json();
  let op;
  for (let i = 0; !op?.done; i += 1) {
    if (i > 60) throw new Error('Veo 작업이 10분 안에 끝나지 않았습니다.');
    await sleep(10000);
    op = await (await call(`${BASE}/v1beta/${name}`, { headers: headers() })).json();
  }
  if (op.error) throw new Error(`Veo 오류: ${JSON.stringify(op.error)}`);
  const uri = op.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
  if (!uri) throw new Error(`Veo 결과에 영상이 없습니다(안전 필터 가능): ${JSON.stringify(op.response)}`);
  await writeFile(out, Buffer.from(await (await call(uri, { headers: headers(), redirect: 'follow' })).arrayBuffer()));
}

// Gemini Omni Flash 이미지→영상 (Interactions API, 동기 응답의 inline 영상).
async function omni(image, prompt, out) {
  const body = await (await call(`${BASE}/v1beta/interactions`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      model: need('DP_VEO_MODEL'),
      input: [{ type: 'image', data: (await readFile(image)).toString('base64'), mime_type: 'image/png' }, { type: 'text', text: prompt }],
      response_format: { type: 'video', aspect_ratio: '9:16' },
      background: false, store: false, stream: false,
    }),
  })).json();
  const video = body.steps?.filter((s) => s.type === 'model_output').flatMap((s) => s.content ?? []).find((c) => c.type === 'video');
  if (!video?.data) throw new Error(`Omni 결과에 영상이 없습니다: ${JSON.stringify(body).slice(0, 500)}`);
  await writeFile(out, Buffer.from(video.data, 'base64'));
}

export async function imageToVideo(image, prompt, out) {
  const backend = need('DP_VIDEO_BACKEND');
  if (backend === 'veo') return veo(image, prompt, out);
  if (backend === 'omni') return omni(image, prompt, out);
  throw new Error('DP_VIDEO_BACKEND는 veo 또는 omni입니다.');
}
