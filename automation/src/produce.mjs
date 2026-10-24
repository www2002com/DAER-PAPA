// 스킬 03: 소스 생성(GPT 이미지 → Veo 영상화 → ElevenLabs 청크 음성)과 FFmpeg 조립.
// 실제 생성은 비용이 들므로 승인된 02 파일(해시 일치)로만 실행한다. 목업 실행은 승인 없이 돌지만 승인·게시 대상이 아니다.
import { existsSync } from 'node:fs';
import { appendFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { requireApproval } from './approvals.mjs';
import { cutStats, planCuts } from './chunks.mjs';
import { buildAss, ffmpeg, probe, renderCut, renderFinal } from './render.mjs';
import { planFile, runInfo } from './script.mjs';
import { buildNarration, sceneTimings } from './timeline.mjs';
import { hashFile, INPUTS, OUTPUTS, projectDir, readJson, ROOT, runDir, withRetry, writeJson } from './store.mjs';

const pad = (n, w = 2) => String(n).padStart(w, '0');
const imageFile = (runId, key) => projectDir(runId, 'assets/images', `${key}.png`);
const videoFile = (runId, n) => projectDir(runId, 'assets/videos', `scene_${pad(n)}.mp4`);
const audioDir = (runId) => projectDir(runId, 'assets/audio');

async function context(runId) {
  const run = await runInfo(runId);
  const plan = await readJson(planFile(runId));
  const planHash = await hashFile(planFile(runId));
  if (!run.mock) await requireApproval('plan', runId, planHash);
  return { run, plan, planHash };
}

// 보고서: 왜곡 발견 시 1회 재생성. 두 번째 요청은 사람 작업 큐로 넘긴다.
async function allowRedo(runId, run, key) {
  const count = run.redo[key] ?? 0;
  if (count >= 1) {
    await mkdir(OUTPUTS, { recursive: true });
    await appendFile(path.join(OUTPUTS, 'manual-queue.jsonl'),
      `${JSON.stringify({ runId, key, reason: '재생성 1회 후에도 왜곡', at: new Date().toISOString() })}\n`);
    console.warn(`  ! ${key}: 이미 1회 재생성했습니다. 수동 큐로 넘겼습니다(outputs/manual-queue.jsonl).`);
    return false;
  }
  run.redo[key] = count + 1;
  await writeJson(runDir(runId, 'run.json'), run);
  return true;
}

function imageTargets(plan) {
  return plan.scenes.filter((s) => !s.asset).flatMap((scene) => [
    { n: scene.n, key: `scene_${pad(scene.n)}`, prompt: scene.image_prompt },
    ...scene.chunks.flatMap((chunk, i) => (chunk.image_prompt
      ? [{ n: scene.n, key: `scene_${pad(scene.n)}_c${i + 1}`, prompt: chunk.image_prompt }] : [])),
  ]);
}

export async function images(runId, { redo = [] } = {}) {
  const { run, plan } = await context(runId);
  await mkdir(projectDir(runId, 'assets/images'), { recursive: true });
  const provider = run.mock ? await import('./providers/mock.mjs') : await import('./providers/openai.mjs');
  for (const target of imageTargets(plan)) {
    const out = imageFile(runId, target.key);
    const again = redo.includes(target.n);
    if (existsSync(out) && !(again && await allowRedo(runId, run, `image:${target.key}`))) continue;
    const prompt = [target.prompt, plan.style].filter(Boolean).join('\n\n');
    console.log(`  이미지 ${target.key}`);
    await withRetry(`이미지 ${runId} ${target.key}`, () => (run.mock ? provider.image(target.n, out) : provider.image(prompt, out)));
  }
}

export async function videos(runId, { redo = [] } = {}) {
  const { run, plan } = await context(runId);
  await mkdir(projectDir(runId, 'assets/videos'), { recursive: true });
  const provider = run.mock ? await import('./providers/mock.mjs') : await import('./providers/gemini.mjs');
  for (const scene of plan.scenes.filter((s) => s.video_prompt)) {
    const still = imageFile(runId, `scene_${pad(scene.n)}`);
    if (!existsSync(still)) throw new Error(`장면 ${scene.n} 이미지가 없습니다. images를 먼저 실행하고 왜곡 검사를 마치세요.`);
    const out = videoFile(runId, scene.n);
    if (existsSync(out) && !(redo.includes(scene.n) && await allowRedo(runId, run, `video:${scene.n}`))) continue;
    console.log(`  영상 장면 ${scene.n}`);
    await withRetry(`영상 ${runId} 장면 ${scene.n}`,
      () => (run.mock ? provider.video(still, out) : provider.imageToVideo(still, scene.video_prompt, out)));
  }
}

// 전체 내레이션을 한 번에 합성(톤 일관성)하고, 글자 타임스탬프로 청크별 시간·음성 파일을 만든다.
export async function tts(runId) {
  const { run, plan, planHash } = await context(runId);
  const items = plan.scenes.flatMap((s) => s.chunks.map((c, i) => ({ scene: s.n, chunk: i, line: c.text })));
  const { text, spans } = buildNarration(items);
  const dir = audioDir(runId);
  await mkdir(dir, { recursive: true });
  const narration = path.join(dir, 'narration.mp3');
  const provider = run.mock ? await import('./providers/mock.mjs') : await import('./providers/elevenlabs.mjs');
  const alignment = await withRetry(`TTS ${runId}`, () => provider.synthesize(text, narration));
  const timings = sceneTimings(spans, alignment, alignment.seconds);
  const chunkTimings = items.map((item, i) => ({ scene: item.scene, chunk: item.chunk, text: item.line, ...timings[i] }));
  for (const [i, t] of chunkTimings.entries()) {
    await ffmpeg(['-ss', t.start.toFixed(3), '-t', t.duration.toFixed(3), '-i', narration, '-c:a', 'libmp3lame',
      path.join(dir, `chunk_${pad(i + 1, 3)}.mp3`)]);
  }
  await writeJson(path.join(dir, 'tts.json'), { planHash, text, seconds: alignment.seconds, chunkTimings });
  return chunkTimings;
}

function sceneSource(runId, scene, chunkIndex, brand) {
  const chunkImage = imageFile(runId, `scene_${pad(scene.n)}_c${chunkIndex + 1}`);
  if (existsSync(chunkImage)) return { kind: 'still', source: chunkImage };
  if (scene.asset === 'endcard') return { kind: 'endcard', source: null };
  if (scene.asset) {
    const asset = brand.assets[scene.asset];
    if (!asset?.file) throw new Error(`장면 ${scene.n}: 브랜드 자산 ${scene.asset} 파일이 없습니다.`);
    return { kind: 'asset', source: path.resolve(ROOT, asset.file), label: asset.draft ? asset.label : null };
  }
  if (existsSync(videoFile(runId, scene.n))) return { kind: 'clip', source: videoFile(runId, scene.n) };
  const still = imageFile(runId, `scene_${pad(scene.n)}`);
  if (!existsSync(still)) throw new Error(`장면 ${scene.n} 소스가 없습니다. images를 먼저 실행하세요.`);
  return { kind: 'still', source: still };
}

const srtTime = (t) => {
  const ms = Math.round(t * 1000);
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`;
};

export async function assemble(runId) {
  const { run, plan, planHash } = await context(runId);
  const ttsInfo = await readJson(path.join(audioDir(runId), 'tts.json'));
  if (ttsInfo.planHash !== planHash) throw new Error('02 파일이 TTS 이후 바뀌었습니다. tts를 다시 실행하세요.');
  const brand = await readJson(path.join(INPUTS, 'brand_info.json'));
  const scenes = new Map(plan.scenes.map((s) => [s.n, s]));
  const cuts = planCuts(ttsInfo.chunkTimings);
  const total = cuts.at(-1).start + cuts.at(-1).duration;

  // 영상 소스는 장면 길이에 맞춰 ±15% 안에서 속도를 보정하고, 컷마다 이어지는 구간을 쓴다.
  const clipPlan = new Map();
  for (const scene of plan.scenes) {
    const src = sceneSource(runId, scene, -1, brand);
    if (src.kind !== 'clip') continue;
    const length = (await probe(src.source)).duration;
    const sceneSeconds = cuts.filter((c) => c.scene === scene.n).reduce((s, c) => s + c.duration, 0);
    clipPlan.set(scene.n, { length, speed: Math.min(1, Math.max(0.85, length / sceneSeconds)), used: 0 });
  }

  const renderDir = projectDir(runId, 'render');
  await mkdir(path.join(renderDir, 'segments'), { recursive: true });
  const timeline = [];
  for (const [i, cut] of cuts.entries()) {
    const scene = scenes.get(cut.scene);
    const src = sceneSource(runId, scene, cut.chunk, brand);
    const clip = src.kind === 'clip' ? clipPlan.get(scene.n) : null;
    const offset = clip ? clip.used % clip.length : 0;
    if (clip) clip.used += cut.duration * clip.speed;
    const segment = `segments/cut_${pad(i + 1, 3)}.mp4`;
    await renderCut({ ...src, duration: cut.duration, framing: cut.framing, offset, speed: clip?.speed ?? 1, out: path.join(renderDir, segment) });
    timeline.push({ cut: i + 1, ...cut, kind: src.kind, source: src.source && path.relative(runDir(runId), src.source),
      sourceIn: offset, speed: clip?.speed ?? 1, segment, caption: scene.chunks[cut.chunk].text });
  }

  const sceneSpan = (n) => {
    const own = cuts.filter((c) => c.scene === n);
    return { start: own[0].start, end: own.at(-1).start + own.at(-1).duration };
  };
  const events = [];
  for (const t of ttsInfo.chunkTimings) {
    events.push({ style: 'Caption', start: t.start, end: t.start + t.duration, text: t.text });
  }
  for (const scene of plan.scenes) {
    const { start, end } = sceneSpan(scene.n);
    if (scene.overlay) events.push({ style: scene.asset === 'endcard' ? 'End' : 'Overlay', start, end, text: scene.overlay });
    const label = scene.asset && brand.assets[scene.asset]?.draft ? brand.assets[scene.asset].label : null;
    if (label) events.push({ style: 'Label', start, end, text: label });
  }
  const ass = buildAss(events);
  const final = path.join(renderDir, 'final.mp4');
  await renderFinal({ segments: timeline.map((t) => t.segment), audio: path.join(audioDir(runId), 'narration.mp3'), ass, total, out: final, cwd: renderDir });

  // 편집 툴로 넘길 프로젝트 파일. 형식(CapCut/Premiere)이 정해질 때까지 중립 타임라인 JSON과 자막 파일을 남긴다.
  const projDir = projectDir(runId, 'project');
  await mkdir(projDir, { recursive: true });
  await writeJson(path.join(projDir, 'timeline.json'), {
    runId, planId: plan.id, fps: 30, width: 1080, height: 1920, durationSec: total,
    audio: 'assets/audio/narration.mp3', cuts: timeline,
  });
  await writeFile(path.join(projDir, 'captions.ass'), ass);
  await writeFile(path.join(projDir, 'captions.srt'), ttsInfo.chunkTimings
    .map((t, i) => `${i + 1}\n${srtTime(t.start)} --> ${srtTime(t.start + t.duration)}\n${t.text}\n`).join('\n'));

  const meta = {
    runId, planId: plan.id, planHash, mock: run.mock, durationSec: (await probe(final)).duration,
    contentHash: await hashFile(final), cuts: cutStats(cuts), createdAt: new Date().toISOString(),
  };
  await writeJson(runDir(runId, 'metadata.json'), meta);
  const { reviewRun } = await import('./review.mjs');
  return { meta, review: await reviewRun(runId), final };
}
