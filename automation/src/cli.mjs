#!/usr/bin/env node
// DEAR PAPA 광고 자동화 2단계 MVP — 레퍼런스 분석 → 기획 → 승인 → 샘플 생성 → 검수 → 승인 → 게시.
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { findApproval, GATES, recordApproval } from './approvals.mjs';
import { checkPlan, checkText, formatFindings, verdictOf } from './claims.mjs';
import { hashFile, readJson, ROOT, RUNS, writeJson } from './store.mjs';

const HELP = `사용법: npm run dp -- <명령>

  ref add <영상파일> --brand <이름> [--url <주소>] [--bgm <설명>] [--note <메모>]
  ref analyze <R-id>          장면 전환 측정 + Claude 비전으로 구조 분해 (모듈 4)
  ref report                  레퍼런스 구조 분석서 출력
  plan new <H#>               가설로 기획서 초안 생성 (모듈 5, Claude)
  plan check <기획서.json>     주장-근거 대조
  approve plan <기획서.json>   승인 1 — 기획서 승인 (사람만, 터미널에서)
  produce <기획서.json> [--mock] [--motion ai|still]
                              샘플 1편 생성 (모듈 6 경로 A)
  review <run-id>             자동 검수 다시 실행 (모듈 7)
  approve sample <run-id>     승인 — 샘플 컨펌 (영상을 직접 본 뒤)
  approve publish <run-id>    승인 — 게시 승인
  publish <run-id>            인스타그램 @dearpapa.kr 릴스 게시
  status                      기획서·실행 상태 요약`;

const planPath = (arg) => path.resolve(arg);
const runPath = (runId, file = '') => path.join(RUNS, runId, file);

async function confirmHuman(summary) {
  if (!process.stdin.isTTY) throw new Error('승인은 사람이 터미널에서 직접 해야 합니다(비대화형 실행 불가).');
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log(summary);
    const by = await rl.question('승인자 이름: ');
    const answer = await rl.question('위 내용을 확인했고 승인합니까? (yes 입력): ');
    if (answer.trim() !== 'yes') throw new Error('승인하지 않았습니다.');
    const note = await rl.question('메모(선택): ');
    return { by, note };
  } finally {
    rl.close();
  }
}

async function approve(gate, target) {
  if (!GATES[gate]) throw new Error(`승인 지점은 ${Object.keys(GATES).join(', ')} 중 하나입니다.`);
  let subject; let hash; let summary;
  if (gate === 'plan') {
    const file = planPath(target);
    const plan = await readJson(file);
    const claims = checkPlan(plan);
    if (claims.verdict === 'reject') throw new Error(formatFindings(claims));
    subject = plan.id;
    hash = await hashFile(file);
    summary = `[${GATES.plan}] ${plan.id} — ${plan.title}\n파일: ${file}\n${formatFindings(claims)}`;
  } else {
    const meta = await readJson(runPath(target, 'metadata.json'));
    const review = await readJson(runPath(target, 'review.json'));
    if (meta.mock) throw new Error('목업 실행은 승인·게시 대상이 아닙니다.');
    if (review.verdict === 'reject') throw new Error('자동 검수에서 거절된 소재는 승인할 수 없습니다.');
    if (gate === 'publish') {
      const sample = await findApproval('sample', target, meta.contentHash);
      if (!sample) throw new Error('샘플 컨펌이 먼저 필요합니다.');
    }
    subject = target;
    hash = await hashFile(runPath(target, 'final.mp4'));
    if (hash !== meta.contentHash) throw new Error('영상 파일이 생성 후 바뀌었습니다. 다시 생성하세요.');
    summary = `[${GATES[gate]}] ${target}\n영상: ${runPath(target, 'final.mp4')} (${meta.durationSec.toFixed(1)}초)\n`
      + `자동 검수: ${review.verdict}\n사람 확인 항목:\n${review.humanChecks.map((c) => `  - ${c}`).join('\n')}`;
  }
  const { by, note } = await confirmHuman(summary);
  const entry = await recordApproval({ gate, subject, hash, by, note });
  console.log(`승인 기록: ${entry.gate} ${entry.subject} by ${entry.by} at ${entry.at}`);
}

async function publish(runId) {
  if (existsSync(runPath(runId, 'published.json'))) throw new Error('이미 게시된 소재입니다.');
  const meta = await readJson(runPath(runId, 'metadata.json'));
  const plan = await readJson(runPath(runId, 'plan.json'));
  const hash = await hashFile(runPath(runId, 'final.mp4'));
  if (meta.mock) throw new Error('목업 실행은 게시할 수 없습니다.');
  if (hash !== meta.contentHash) throw new Error('영상 파일이 생성 후 바뀌었습니다.');
  const sample = await findApproval('sample', runId, hash);
  const approval = await findApproval('publish', runId, hash);
  if (!sample || !approval) throw new Error('샘플 컨펌과 게시 승인이 모두 필요합니다.');
  const caption = [plan.post.caption, plan.post.hashtags.join(' ')].join('\n\n');
  const findings = checkText(caption, '게시 캡션');
  if (verdictOf(findings) === 'reject') throw new Error(formatFindings({ verdict: 'reject', findings }));
  const { publishReel } = await import('./instagram.mjs');
  const result = await publishReel(runPath(runId, 'final.mp4'), caption);
  await writeJson(runPath(runId, 'published.json'), { ...result, channel: 'instagram', approval, at: new Date().toISOString() });
  console.log(`게시 완료: ${result.permalink ?? result.mediaId}`);
}

async function status() {
  const plans = (await readdir(path.join(ROOT, 'plans'))).filter((f) => f.endsWith('.json'));
  console.log('기획서');
  for (const f of plans) {
    const file = path.join(ROOT, 'plans', f);
    const plan = await readJson(file);
    const approved = await findApproval('plan', plan.id, await hashFile(file));
    console.log(`  ${plan.id.padEnd(14)} 주장대조 ${checkPlan(plan).verdict.padEnd(6)} 승인 ${approved ? `${approved.by} ${approved.at}` : '대기'}`);
  }
  const runs = existsSync(RUNS) ? await readdir(RUNS) : [];
  console.log('샘플 실행');
  for (const runId of runs) {
    if (!existsSync(runPath(runId, 'metadata.json'))) { console.log(`  ${runId} (미완료)`); continue; }
    const meta = await readJson(runPath(runId, 'metadata.json'));
    const review = existsSync(runPath(runId, 'review.json')) ? await readJson(runPath(runId, 'review.json')) : null;
    const gates = await Promise.all(['sample', 'publish'].map((g) => findApproval(g, runId, meta.contentHash)));
    console.log(`  ${runId}  ${meta.durationSec.toFixed(1)}s  검수 ${review?.verdict ?? '-'}  샘플컨펌 ${gates[0] ? 'O' : '-'}  `
      + `게시승인 ${gates[1] ? 'O' : '-'}  게시 ${existsSync(runPath(runId, 'published.json')) ? 'O' : '-'}${meta.mock ? '  (목업)' : ''}`);
  }
}

async function main() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      brand: { type: 'string' }, url: { type: 'string' }, bgm: { type: 'string' }, note: { type: 'string' },
      mock: { type: 'boolean' }, motion: { type: 'string', default: 'ai' }, help: { type: 'boolean' },
    },
  });
  const [command, sub, arg] = positionals;
  if (!command || values.help) return console.log(HELP);
  if (command === 'ref') {
    const ref = await import('./reference.mjs');
    if (sub === 'add') return console.log(await ref.addReference({ file: arg, ...values }));
    if (sub === 'analyze') return console.log(JSON.stringify((await ref.analyzeReference(arg)).analysis, null, 2));
    if (sub === 'report') return console.log(ref.referenceReport(await ref.listReferences()));
  }
  if (command === 'plan' && sub === 'new') {
    const { generatePlan } = await import('./plan.mjs');
    const { file, claims } = await generatePlan(arg);
    return console.log(`기획서 초안: ${file}\n${formatFindings(claims)}`);
  }
  if (command === 'plan' && sub === 'check') {
    const claims = checkPlan(await readJson(planPath(arg)));
    console.log(formatFindings(claims));
    process.exitCode = claims.verdict === 'reject' ? 1 : 0;
    return;
  }
  if (command === 'approve') return approve(sub, arg);
  if (command === 'produce') {
    if (!['ai', 'still'].includes(values.motion)) throw new Error('--motion은 ai 또는 still입니다.');
    const { produce } = await import('./produce.mjs');
    const { runId, dir, review } = await produce(planPath(sub), { mockMode: values.mock, motion: values.motion });
    console.log(`\n완료: ${path.join(dir, 'final.mp4')}\n자동 검수: ${review.verdict}\n${formatFindings(review.claims)}`);
    for (const t of review.technical) console.log(`  - [hold] ${t.reason}`);
    if (!values.mock) console.log(`\n영상을 직접 시청한 뒤: npm run dp -- approve sample ${runId}`);
    return;
  }
  if (command === 'review') {
    const { reviewRun } = await import('./review.mjs');
    return console.log(JSON.stringify(await reviewRun(sub), null, 2));
  }
  if (command === 'publish') return publish(sub);
  if (command === 'status') return status();
  console.log(HELP);
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(`오류: ${error.message}`);
  process.exitCode = 1;
});
