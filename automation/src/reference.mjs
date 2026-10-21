// 모듈 4: 경쟁·카테고리 광고의 구조만 분해한다. 영상·인물·음성·자막 원문은 저장하거나 재사용하지 않는다.
// 원본 영상은 work/에만 두고(커밋 금지), references/에는 구조 분석 결과만 남긴다.
import { execFile } from 'node:child_process';
import { mkdir, readdir, readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';
import { askJson, imageBlock } from './claude.mjs';
import { ffmpeg, probe } from './render.mjs';
import { hashFile, readJson, ROOT, WORK, writeJson } from './store.mjs';

const run = promisify(execFile);
export const REF_DIR = path.join(ROOT, 'references');
const MAX_FRAMES = 16;

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['axis', 'hookType', 'hookStructure', 'copySkeleton', 'sceneFlow', 'whyItWorks', 'applicableToDearPapa'],
  properties: {
    axis: { type: 'string', enum: ['buyer', 'user', 'mixed'] },
    hookType: { type: 'string', enum: ['problem', 'gift_occasion', 'ingredient_trust', 'social_proof', 'other'] },
    hookStructure: { type: 'string' },
    copySkeleton: { type: 'array', items: { type: 'string' } },
    sceneFlow: { type: 'array', items: { type: 'string' } },
    whyItWorks: { type: 'string' },
    applicableToDearPapa: { type: 'string' },
  },
};

export async function addReference({ file, url = '', brand = '', bgm = '', note = '' }) {
  const hash = await hashFile(file);
  const id = `R-${hash.slice(0, 10)}`;
  const record = {
    id, url, brand, bgm: bgm || '미기록', note,
    localFile: path.resolve(file), sha256: hash, addedAt: new Date().toISOString(), analysis: null,
  };
  await writeJson(path.join(REF_DIR, `${id}.json`), record);
  return record;
}

async function cutTimes(file) {
  const { stderr } = await run('ffmpeg', ['-hide_banner', '-i', file, '-vf', "select='gt(scene,0.3)',showinfo",
    '-an', '-f', 'null', '-'], { maxBuffer: 1 << 26 });
  return [...stderr.matchAll(/pts_time:([\d.]+)/g)].map((m) => Number(m[1]));
}

export async function analyzeReference(id) {
  const recordFile = path.join(REF_DIR, `${id}.json`);
  const record = await readJson(recordFile);
  const { duration } = await probe(record.localFile);
  const cuts = await cutTimes(record.localFile);
  const shots = [0, ...cuts, duration];
  const intervals = shots.slice(1).map((t, i) => t - shots[i]);
  // 첫 3초(훅)는 촘촘히, 이후는 장면마다 한 장.
  const moments = [0.2, 1, 2, 2.9, ...shots.slice(1, -1).map((t, i) => (t + shots[i + 2]) / 2)]
    .filter((t) => t < duration).slice(0, MAX_FRAMES);
  const frameDir = path.join(WORK, 'references', id);
  await mkdir(frameDir, { recursive: true });
  const content = [];
  for (const [i, t] of moments.entries()) {
    const out = path.join(frameDir, `f${String(i).padStart(2, '0')}.jpg`);
    await ffmpeg(['-ss', t.toFixed(2), '-i', record.localFile, '-frames:v', '1', '-vf', 'scale=540:-2', out]);
    content.push({ type: 'text', text: `t=${t.toFixed(1)}s` }, imageBlock(await readFile(out)));
  }
  content.push({ type: 'text', text: [
    `광고 브랜드: ${record.brand || '미상'}, 길이 ${duration.toFixed(1)}초, 컷 ${shots.length - 1}개, 평균 컷 길이 ${(duration / (shots.length - 1)).toFixed(2)}초.`,
    '위 프레임으로 광고의 구조만 분해하세요. 대사·자막 원문을 옮겨 적지 말고 [문제 제기] → [제품 등장] 같은 추상 단계로 쓰세요.',
    'axis: buyer(선물하는 사람 소구) / user(사용자 본인 소구) / mixed. hookStructure는 첫 3초에서 시선을 잡는 방식.',
    'applicableToDearPapa: 40~60대 아빠용 올인원·딸의 선물이라는 우리 제품에 이 구조를 적용할 수 있는 방식(효능 주장 없이).',
  ].join('\n') });
  const analysis = await askJson({
    system: '당신은 퍼포먼스 광고 구조 분석가입니다. 결과는 한국어로 씁니다.',
    content,
    schema: ANALYSIS_SCHEMA,
  });
  record.analysis = {
    ...analysis,
    durationSec: Number(duration.toFixed(1)),
    sceneCount: shots.length - 1,
    avgCutSec: Number((duration / (shots.length - 1)).toFixed(2)),
    longestCutSec: Number(Math.max(...intervals).toFixed(2)),
    analyzedAt: new Date().toISOString(),
  };
  await writeJson(recordFile, record);
  return record;
}

export async function listReferences() {
  const files = (await readdir(REF_DIR).catch(() => [])).filter((f) => f.endsWith('.json'));
  return Promise.all(files.map((f) => readJson(path.join(REF_DIR, f))));
}

// 완료 기준(모듈 4): 소구 축 2종(사용자형·구매자형) 각각 최소 3편.
export function referenceReport(records) {
  const done = records.filter((r) => r.analysis);
  const count = (axis) => done.filter((r) => r.analysis.axis === axis || r.analysis.axis === 'mixed').length;
  const rows = done.map((r) => `| ${r.id} | ${r.brand} | ${r.analysis.axis} | ${r.analysis.hookType} | `
    + `${r.analysis.sceneCount} / ${r.analysis.avgCutSec}s | ${r.analysis.durationSec}s | ${r.analysis.copySkeleton.join(' → ')} | ${r.analysis.whyItWorks} |`);
  return [
    '# 레퍼런스 구조 분석서',
    '',
    '| ID | 브랜드 | 소구 축 | 훅 유형 | 장면 수 / 평균 컷 | 길이 | 카피 골격 | 추정 성과 이유 |',
    '|---|---|---|---|---|---|---|---|',
    ...rows,
    '',
    `구매자형 ${count('buyer')}편, 사용자형 ${count('user')}편 — 완료 기준(각 3편) ${count('buyer') >= 3 && count('user') >= 3 ? '충족' : '미충족'}.`,
    `분석 대기: ${records.length - done.length}편.`,
  ].join('\n');
}
