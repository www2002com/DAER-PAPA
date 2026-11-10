// 스킬 02: 대본 청크·프롬프트 파일(02_prompts_and_chunks.json)을 실행 폴더에 만들고, GPT로 교차 검증한다.
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { productionGaps, withChunks } from './chunks.mjs';
import { checkPlan } from './claims.mjs';
import { hashFile, INPUTS, readJson, runDir, writeJson } from './store.mjs';

const stamp = () => new Date().toISOString().replace(/[-:]/g, '').slice(0, 15);
export const planFile = (runId) => runDir(runId, '02_prompts_and_chunks.json');
export const runInfo = (runId) => readJson(runDir(runId, 'run.json'));

export async function initRun(planPath, { mock = false, reference = null } = {}) {
  const plan = withChunks(await readJson(path.resolve(planPath)));
  const gaps = productionGaps(plan);
  if (gaps.length) throw new Error(`생성에 필요한 항목이 비었습니다(스킬 02로 채우세요):\n  ${gaps.join('\n  ')}`);
  if (reference && !existsSync(reference)) throw new Error(`레퍼런스 분석 파일이 없습니다: ${reference}`);
  const runId = `${plan.id}-${stamp()}${mock ? '-mock' : ''}`;
  await writeJson(planFile(runId), { ...plan, reference: reference ? path.resolve(reference) : plan.reference ?? null });
  await writeJson(runDir(runId, 'run.json'), { runId, planId: plan.id, mock, createdAt: new Date().toISOString(), redo: {} });
  return { runId, claims: checkPlan(plan) };
}

const CROSSCHECK_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['verdict', 'issues', 'summary'],
  properties: {
    verdict: { type: 'string', enum: ['pass', 'hold', 'reject'] },
    summary: { type: 'string' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['scene', 'kind', 'problem', 'suggestion'],
        properties: {
          scene: { type: 'integer' },
          kind: { type: 'string', enum: ['claim', 'fact', 'flow', 'prompt', 'timing'] },
          problem: { type: 'string' },
          suggestion: { type: 'string' },
        },
      },
    },
  },
};

// GPT 교차 검증은 참고 의견이다. 통과 판정의 기준은 주장 상태표 검사(claims.mjs)와 사람 승인이다.
export async function crosscheck(runId) {
  const { reviewJson } = await import('./providers/openai.mjs');
  const plan = await readJson(planFile(runId));
  const brand = await readFile(path.join(INPUTS, 'brand_info.json'), 'utf8');
  const claims = await readFile(path.join(INPUTS, 'claims.json'), 'utf8');
  const system = '너는 화장품 광고 심의 검토자이자 숏폼 편집 감독이다. Claude가 쓴 광고 대본을 독립적으로 검토한다. '
    + '브랜드 정보에 없는 사실, 주장 상태표에서 금지·보류된 표현, 장면 흐름의 비약, 영문 이미지·영상 프롬프트가 장면 설명과 어긋나는 곳, '
    + '컷이 2초를 넘을 만큼 긴 청크를 찾아라. 문제가 없으면 issues를 비워라. 한국어로 답한다.';
  const user = `## 브랜드 정보\n${brand}\n\n## 주장 상태표\n${claims}\n\n## 검토할 대본(02_prompts_and_chunks.json)\n${JSON.stringify(plan, null, 2)}`;
  const result = await reviewJson(system, user, 'crosscheck', CROSSCHECK_SCHEMA);
  const report = { ...result, model: process.env.DP_GPT_REVIEW_MODEL, planHash: await hashFile(planFile(runId)), at: new Date().toISOString() };
  await writeJson(runDir(runId, '02_crosscheck.json'), report);
  return report;
}
