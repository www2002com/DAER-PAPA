// 모듈 5: 가설 정의서 + 제품 프로필 + 주장 상태표 + 레퍼런스 분석으로 기획서(스크립트·장면·변형 축)를 만든다.
// 결과는 항상 status "draft"이며, 주장 대조를 통과하고 사용자가 승인해야 샘플 생성에 쓸 수 있다.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { askJson } from './claude.mjs';
import { checkPlan } from './claims.mjs';
import { listReferences } from './reference.mjs';
import { readJson, ROOT, writeJson } from './store.mjs';

const str = { type: 'string' };
const strings = { type: 'array', items: str };
const PLAN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'targetSeconds', 'voice', 'bgm', 'scenes', 'post', 'variationAxes'],
  properties: {
    title: str,
    targetSeconds: { type: 'integer' },
    voice: str,
    bgm: str,
    scenes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['n', 'line', 'overlay', 'asset', 'visual', 'camera'],
        properties: {
          n: { type: 'integer' }, line: str, overlay: str, visual: str, camera: str,
          asset: { type: 'string', enum: ['', 'bottle-draft', 'carton-draft', 'endcard'] },
        },
      },
    },
    post: {
      type: 'object', additionalProperties: false, required: ['caption', 'hashtags'],
      properties: { caption: str, hashtags: strings },
    },
    variationAxes: {
      type: 'object', additionalProperties: false, required: ['hook', 'firstScene', 'copyOrder', 'bgm'],
      properties: { hook: strings, firstScene: strings, copyOrder: strings, bgm: strings },
    },
  },
};

export async function generatePlan(hypothesisId) {
  const { hypotheses } = await readJson(path.join(ROOT, 'data/hypotheses.json'));
  const hypothesis = hypotheses.find((h) => h.id === hypothesisId);
  if (!hypothesis) throw new Error(`가설 ${hypothesisId}가 data/hypotheses.json에 없습니다.`);
  if (hypothesis.status !== 'active') throw new Error(`가설 ${hypothesisId}는 보류 상태입니다: ${hypothesis.holdReason}`);
  const references = (await listReferences()).filter((r) => r.analysis).map((r) => ({ brand: r.brand, ...r.analysis }));
  const content = [
    `# 가설\n${JSON.stringify(hypothesis, null, 2)}`,
    `# 제품 프로필(공개 가능 범위)\n${await readFile(path.join(ROOT, 'data/product.json'), 'utf8')}`,
    `# 주장 상태표 — 아래 패턴에 걸리는 표현은 쓰지 마세요(conditional은 allowIf 문맥일 때만)\n${await readFile(path.join(ROOT, 'data/claims.json'), 'utf8')}`,
    `# 레퍼런스 구조 분석(구조만 참고, 문구 재사용 금지)\n${references.length ? JSON.stringify(references, null, 2) : '아직 없음'}`,
    `# 형식 예시(승인 전 초안)\n${await readFile(path.join(ROOT, 'plans/H1.json'), 'utf8')}`,
    '# 요청\n이 가설을 검증할 1분 내외 세로 릴스 기획서를 쓰세요. 장면 14~18개, 모든 장면에 짧은 대사(line)가 있어야 합니다.',
    '제품 용기·단상자는 asset(bottle-draft/carton-draft)으로만 보여 주고, 마지막 장면은 asset "endcard"입니다. 해당 없으면 asset은 빈 문자열.',
    'AI 생성 장면(visual)에는 제품·로고·글자를 넣지 말고, 휴대폰 화면은 흐릿하게 처리하세요. overlay가 없으면 빈 문자열.',
  ].join('\n\n');
  const draft = await askJson({
    system: '당신은 DEAR PAPA(디어파파)의 광고 기획자입니다. 허용 주장 범위 안에서만 씁니다.',
    content,
    schema: PLAN_SCHEMA,
  });
  const plan = {
    id: `${hypothesisId}-${Date.now().toString(36)}`,
    hypothesis: hypothesisId,
    status: 'draft',
    ...draft,
    scenes: draft.scenes.map(({ asset, overlay, ...scene }) => ({
      ...scene, ...(overlay ? { overlay } : {}), ...(asset ? { asset } : {}),
    })),
  };
  const file = path.join(ROOT, 'plans', `${plan.id}.json`);
  await writeJson(file, plan);
  return { file, plan, claims: checkPlan(plan) };
}
