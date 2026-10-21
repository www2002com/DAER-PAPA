// 모듈 6 경로 A: 승인된 기획서 → 장면 이미지 → 영상화 → 음성 → 렌더링 → 메타데이터 → 자동 검사.
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { requireApproval } from './approvals.mjs';
import { checkPlan, formatFindings } from './claims.mjs';
import { askJson, imageBlock, usage as claudeUsage } from './claude.mjs';
import * as mock from './providers/mock.mjs';
import { buildAss, probe, renderFinal, renderSegment } from './render.mjs';
import { reviewRun, runDir } from './review.mjs';
import { buildNarration, captionChunks, sceneTimings } from './timeline.mjs';
import { hashFile, readJson, ROOT, withRetry, writeJson } from './store.mjs';

const product = await readJson(path.join(ROOT, 'data/product.json'));

const STYLE = 'Photorealistic cinematic still, vertical 9:16, Korean family in a modern Korean apartment, '
  + 'soft natural light, warm cream and sage green palette, shallow depth of field. '
  + 'No text, no letters, no logos, no brand names, no cosmetic bottles or product packaging, no celebrities.';

const PROMPT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['scenes'],
  properties: {
    scenes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['n', 'imagePrompt', 'motionPrompt'],
        properties: { n: { type: 'integer' }, imagePrompt: { type: 'string' }, motionPrompt: { type: 'string' } },
      },
    },
  },
};

const INSPECT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['ok', 'issues'],
  properties: { ok: { type: 'boolean' }, issues: { type: 'array', items: { type: 'string' } } },
};

export function validatePlan(plan) {
  const errors = [];
  if (!plan.id || !Array.isArray(plan.scenes) || plan.scenes.length === 0) errors.push('id와 scenes가 필요합니다.');
  for (const scene of plan.scenes ?? []) {
    if (!scene.line?.trim()) errors.push(`장면 ${scene.n}: 대사(line)가 비었습니다.`);
    if (scene.asset && !(scene.asset in product.assets)) errors.push(`장면 ${scene.n}: 알 수 없는 자산 ${scene.asset}`);
  }
  if (errors.length) throw new Error(`기획서 형식 오류:\n  ${errors.join('\n  ')}`);
}

async function scenePrompts(plan) {
  const scenes = plan.scenes.filter((s) => !s.asset).map(({ n, visual, camera, line }) => ({ n, visual, camera, line }));
  const { scenes: prompts } = await askJson({
    system: 'You convert Korean ad storyboard scenes into English prompts for an image model and an image-to-video model.',
    content: `Style bible (apply to every imagePrompt): ${STYLE}\n`
      + 'For each scene write imagePrompt (one rich sentence: subject, setting, framing from the camera note, light) '
      + 'and motionPrompt (subtle camera or subject motion for a 5-second clip). Phone and shopping screens must be blurred. '
      + `Keep scene numbers.\n\n${JSON.stringify(scenes, null, 2)}`,
    schema: PROMPT_SCHEMA,
    effort: 'medium',
  });
  return new Map(prompts.map((p) => [p.n, p]));
}

// 모듈 6·7: 손가락·얼굴 왜곡, 글자 뭉개짐, 제품·로고 노출이 있는 이미지는 자동 폐기하고 다시 만든다.
async function inspectImage(file) {
  return askJson({
    system: 'You are a strict QA reviewer for AI-generated ad frames.',
    content: [
      imageBlock(await readFile(file), file.endsWith('.png') ? 'image/png' : 'image/jpeg'),
      { type: 'text', text: 'Reject (ok=false) if any: distorted or extra fingers/hands, deformed faces, garbled or '
        + 'readable text/letters, logos, cosmetic bottles or packaging, celebrity likeness. List issues briefly.' },
    ],
    schema: INSPECT_SCHEMA,
    effort: 'low',
  });
}

async function aiScene(scene, prompt, dir, motion, usage) {
  const fal = await import('./providers/fal.mjs');
  const base = `scene-${String(scene.n).padStart(2, '0')}`;
  const imageUrl = await withRetry(`장면 ${scene.n} 이미지`, async () => {
    const url = await fal.generateImage(`${prompt.imagePrompt} ${STYLE}`);
    usage.images += 1;
    await fal.download(url, path.join(dir, `${base}.jpg`));
    const check = await inspectImage(path.join(dir, `${base}.jpg`));
    if (!check.ok) throw new Error(`왜곡 검사 폐기: ${check.issues.join(', ')}`);
    return url;
  });
  if (motion === 'still') return { kind: 'still', source: `${base}.jpg` };
  await withRetry(`장면 ${scene.n} 영상화`, async () => {
    const url = await fal.imageToVideo(imageUrl, prompt.motionPrompt);
    usage.videoClips += 1;
    await fal.download(url, path.join(dir, `${base}.mp4`));
  });
  return { kind: 'clip', source: `${base}.mp4` };
}

export async function produce(planFile, { mockMode = false, motion = 'ai' } = {}) {
  const plan = await readJson(planFile);
  validatePlan(plan);
  const planHash = await hashFile(planFile);
  const claims = checkPlan(plan);
  console.log(formatFindings(claims));
  if (claims.verdict === 'reject') throw new Error('주장 상태표를 벗어난 문구가 있어 생성하지 않습니다.');
  const approval = mockMode ? null : await requireApproval('plan', plan.id, planHash);

  const runId = `${plan.id}-${new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '')}${mockMode ? '-mock' : ''}`;
  const dir = runDir(runId);
  await mkdir(dir, { recursive: true });
  await writeJson(path.join(dir, 'plan.json'), plan);
  const usage = { images: 0, videoClips: 0, ttsChars: 0 };

  console.log(`▶ ${runId}: 음성 생성`);
  const { text, spans } = buildNarration(plan.scenes);
  usage.ttsChars = text.length;
  const alignment = mockMode
    ? await mock.synthesize(text, 'narration.mp3', dir)
    : await withRetry('음성 생성', async () => {
      const { synthesize } = await import('./providers/elevenlabs.mjs');
      return synthesize(text, path.join(dir, 'narration.mp3'));
    });
  const timings = sceneTimings(spans, alignment, alignment.seconds);

  console.log(`▶ 장면 ${plan.scenes.length}개 생성·배치`);
  const prompts = mockMode || plan.scenes.every((s) => s.asset) ? new Map() : await scenePrompts(plan);
  const segments = [];
  const events = [];
  for (const [i, scene] of plan.scenes.entries()) {
    const { start, duration } = timings[i];
    const asset = scene.asset ? product.assets[scene.asset] : null;
    let visual;
    if (asset?.file) visual = { kind: 'asset', source: path.resolve(ROOT, asset.file) };
    else if (asset) visual = { kind: 'endcard' };
    else if (mockMode) {
      await mock.image(scene.n, `scene-${scene.n}.png`, dir);
      visual = { kind: 'still', source: `scene-${scene.n}.png` };
    } else visual = await aiScene(scene, prompts.get(scene.n), dir, motion, usage);
    const out = `seg-${String(scene.n).padStart(2, '0')}.mp4`;
    await renderSegment({ ...visual, duration, out, cwd: dir });
    segments.push(out);
    const end = start + duration;
    if (scene.overlay) events.push({ style: visual.kind === 'endcard' ? 'End' : 'Overlay', start, end, text: scene.overlay });
    if (asset?.draft) events.push({ style: 'Label', start, end, text: asset.label });
  }
  for (const chunk of captionChunks(text, spans, alignment)) events.push({ style: 'Caption', ...chunk });

  console.log('▶ 렌더링');
  const total = timings.at(-1).start + timings.at(-1).duration;
  await renderFinal({ segments, audio: 'narration.mp3', ass: buildAss(events), total, out: 'final.mp4', cwd: dir });

  const final = path.join(dir, 'final.mp4');
  await writeJson(path.join(dir, 'metadata.json'), {
    runId, planId: plan.id, hypothesis: plan.hypothesis, planHash,
    planApproval: approval, mock: mockMode, motion,
    variation: { base: true },
    models: mockMode ? 'mock' : {
      claude: process.env.DP_CLAUDE_MODEL ?? 'claude-opus-5-5',
      image: process.env.DP_IMAGE_MODEL ?? 'fal-ai/flux-pro/v1.1',
      video: motion === 'ai' ? (process.env.DP_VIDEO_MODEL ?? 'fal-ai/kling-video/v2.1/standard/image-to-video') : null,
      tts: process.env.ELEVENLABS_MODEL ?? 'eleven_multilingual_v2',
    },
    usage: { ...usage, claudeTokens: { ...claudeUsage } },
    durationSec: (await probe(final)).duration,
    contentHash: await hashFile(final),
    createdAt: new Date().toISOString(),
  });
  const review = await reviewRun(runId);
  return { runId, dir, review };
}
