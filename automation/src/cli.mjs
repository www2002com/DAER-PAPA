#!/usr/bin/env node
// DEAR PAPA 광고 소재 자동화 — 보고서의 스킬 체인(skills/*.md)이 호출하는 결정적 도구 모음.
// 판단(대본·프롬프트·왜곡 검사)은 Claude Code가 스킬을 따라 하고, 외부 API 호출·검사·승인 기록은 이 CLI가 한다.
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { findApproval, GATES, recordApproval } from './approvals.mjs';
import { checkPlan, checkText, formatFindings, verdictOf } from './claims.mjs';
import { finalFile } from './review.mjs';
import { planFile, runInfo } from './script.mjs';
import { hashFile, OUTPUTS, readJson, runDir, writeJson } from './store.mjs';

const HELP = `사용법: npm run dp -- <명령>   (각 단계의 판단 기준은 skills/*.md)

  analyze <영상파일|YouTube URL>       01 레퍼런스 역기획 (Gemini) → outputs/references/…/01_reverse_engineered_script.json
  init <plans/H#.json> [--ref <01.json>] [--mock]
                                      02 실행 폴더 생성 + 대사를 1~2초 청크로 분할 → outputs/<run>/02_prompts_and_chunks.json
  check <run|파일.json>                주장 상태표 대조
  crosscheck <run>                    02 대본 GPT 교차 검증 → 02_crosscheck.json (참고 의견)
  approve plan <run>                  승인 — 02 파일 (이후 유료 생성 가능)
  images <run> [--redo 3,7]           03 장면 이미지 (GPT 이미지). 왜곡 장면은 --redo로 1회 재생성
  videos <run> [--redo 3,7]           03 이미지→영상 (Veo/Omni)
  tts <run>                           03 내레이션 + 청크별 음성 (ElevenLabs)
  assemble <run>                      03 컷 조립·자막·MP4 렌더 + 자동 검수
  review <run>                        자동 검수 다시 실행
  approve sample <run>                승인 — 샘플 컨펌 (영상을 직접 본 뒤)
  approve publish <run>               승인 — 게시 승인
  publish <run>                       인스타그램 @dearpapa.kr 릴스 게시 (오가닉, 광고비 없음)
  status                              실행 상태 요약`;

const list = (value) => (value ? value.split(',').map(Number).filter(Number.isInteger) : []);

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

async function approve(gate, runId) {
  if (!GATES[gate]) throw new Error(`승인 지점은 ${Object.keys(GATES).join(', ')} 중 하나입니다.`);
  const run = await runInfo(runId);
  if (run.mock) throw new Error('목업 실행은 승인·게시 대상이 아닙니다.');
  let hash; let summary;
  if (gate === 'plan') {
    const plan = await readJson(planFile(runId));
    const claims = checkPlan(plan);
    if (claims.verdict === 'reject') throw new Error(formatFindings(claims));
    hash = await hashFile(planFile(runId));
    const cross = existsSync(runDir(runId, '02_crosscheck.json')) ? await readJson(runDir(runId, '02_crosscheck.json')) : null;
    const crossLine = !cross ? 'GPT 교차 검증: 실행 안 함'
      : cross.planHash !== hash ? 'GPT 교차 검증: 이전 버전 기준(다시 실행 권장)'
        : `GPT 교차 검증: ${cross.verdict} — ${cross.summary}`;
    summary = `[${GATES.plan}] ${runId} — ${plan.title}\n파일: ${planFile(runId)}\n${formatFindings(claims)}\n${crossLine}`;
  } else {
    const meta = await readJson(runDir(runId, 'metadata.json'));
    const review = await readJson(runDir(runId, 'review.json'));
    if (review.verdict === 'reject') throw new Error('자동 검수에서 거절된 소재는 승인할 수 없습니다.');
    if (gate === 'publish' && !(await findApproval('sample', runId, meta.contentHash))) throw new Error('샘플 컨펌이 먼저 필요합니다.');
    hash = await hashFile(finalFile(runId));
    if (hash !== meta.contentHash) throw new Error('영상 파일이 생성 후 바뀌었습니다. 다시 조립하세요.');
    summary = `[${GATES[gate]}] ${runId}\n영상: ${finalFile(runId)} (${meta.durationSec.toFixed(1)}초, 컷 ${meta.cuts.cuts}개)\n`
      + `자동 검수: ${review.verdict}\n사람 확인 항목:\n${review.humanChecks.map((c) => `  - ${c}`).join('\n')}`;
  }
  const { by, note } = await confirmHuman(summary);
  const entry = await recordApproval({ gate, subject: runId, hash, by, note });
  console.log(`승인 기록: ${entry.gate} ${entry.subject} by ${entry.by} at ${entry.at}`);
}

async function publish(runId) {
  if (existsSync(runDir(runId, 'published.json'))) throw new Error('이미 게시된 소재입니다.');
  const run = await runInfo(runId);
  if (run.mock) throw new Error('목업 실행은 게시할 수 없습니다.');
  const meta = await readJson(runDir(runId, 'metadata.json'));
  const plan = await readJson(planFile(runId));
  const hash = await hashFile(finalFile(runId));
  if (hash !== meta.contentHash) throw new Error('영상 파일이 생성 후 바뀌었습니다.');
  const sample = await findApproval('sample', runId, hash);
  const approval = await findApproval('publish', runId, hash);
  if (!sample || !approval) throw new Error('샘플 컨펌과 게시 승인이 모두 필요합니다.');
  const caption = [plan.post.caption, plan.post.hashtags.join(' ')].join('\n\n');
  const findings = checkText(caption, '게시 캡션');
  if (verdictOf(findings) === 'reject') throw new Error(formatFindings({ verdict: 'reject', findings }));
  const { publishReel } = await import('./instagram.mjs');
  const result = await publishReel(finalFile(runId), caption);
  await writeJson(runDir(runId, 'published.json'), { ...result, channel: 'instagram', approval, at: new Date().toISOString() });
  console.log(`게시 완료: ${result.permalink ?? result.mediaId}`);
}

async function status() {
  const runs = existsSync(OUTPUTS) ? (await readdir(OUTPUTS)).filter((d) => existsSync(runDir(d, 'run.json'))) : [];
  if (!runs.length) console.log('실행 없음. 시작: npm run dp -- init plans/H1.json');
  for (const runId of runs) {
    const run = await runInfo(runId);
    const planHash = await hashFile(planFile(runId));
    const planOk = run.mock || await findApproval('plan', runId, planHash);
    const meta = existsSync(runDir(runId, 'metadata.json')) ? await readJson(runDir(runId, 'metadata.json')) : null;
    const review = existsSync(runDir(runId, 'review.json')) ? await readJson(runDir(runId, 'review.json')) : null;
    const gates = meta ? await Promise.all(['sample', 'publish'].map((g) => findApproval(g, runId, meta.contentHash))) : [];
    console.log(`  ${runId}${run.mock ? ' (목업)' : ''}  기획승인 ${planOk ? 'O' : '-'}  `
      + `${meta ? `${meta.durationSec.toFixed(1)}s 컷 ${meta.cuts.cuts}개 평균 ${meta.cuts.avgCutSec.toFixed(2)}s` : '미조립'}  `
      + `검수 ${review?.verdict ?? '-'}  샘플컨펌 ${gates[0] ? 'O' : '-'}  게시승인 ${gates[1] ? 'O' : '-'}  `
      + `게시 ${existsSync(runDir(runId, 'published.json')) ? 'O' : '-'}`);
  }
}

async function check(target) {
  const file = existsSync(target) ? path.resolve(target) : planFile(target);
  const claims = checkPlan(await readJson(file));
  console.log(formatFindings(claims));
  process.exitCode = claims.verdict === 'reject' ? 1 : 0;
}

async function main() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: { ref: { type: 'string' }, mock: { type: 'boolean' }, redo: { type: 'string' }, help: { type: 'boolean' } },
  });
  const [command, a, b] = positionals;
  if (!command || values.help) return console.log(HELP);
  const produce = () => import('./produce.mjs');
  switch (command) {
    case 'analyze': {
      const { analyze } = await import('./analyze.mjs');
      const { file, result } = await analyze(a);
      return console.log(`역기획 저장: ${file}\n컷 ${result.cutCount}개, 평균 ${result.avgCutSec}초, 분당 ${result.cutsPerMinute}컷`);
    }
    case 'init': {
      const { initRun } = await import('./script.mjs');
      const { runId, claims } = await initRun(a, { mock: values.mock, reference: values.ref });
      return console.log(`실행 생성: ${runId}\n파일: ${planFile(runId)}\n${formatFindings(claims)}`);
    }
    case 'check': return check(a);
    case 'crosscheck': {
      const { crosscheck } = await import('./script.mjs');
      const report = await crosscheck(a);
      console.log(`GPT 교차 검증: ${report.verdict} — ${report.summary}`);
      for (const i of report.issues) console.log(`  - 장면 ${i.scene} [${i.kind}] ${i.problem}\n      제안: ${i.suggestion}`);
      return;
    }
    case 'approve': return approve(a, b);
    case 'images': return (await produce()).images(a, { redo: list(values.redo) });
    case 'videos': return (await produce()).videos(a, { redo: list(values.redo) });
    case 'tts': {
      const timings = await (await produce()).tts(a);
      return console.log(`청크 ${timings.length}개, ${(timings.at(-1).start + timings.at(-1).duration).toFixed(1)}초`);
    }
    case 'assemble': {
      const { meta, review, final } = await (await produce()).assemble(a);
      console.log(`\n완료: ${final}\n${meta.durationSec.toFixed(1)}초, 컷 ${meta.cuts.cuts}개 (평균 ${meta.cuts.avgCutSec.toFixed(2)}초, `
        + `최장 ${meta.cuts.maxCutSec.toFixed(2)}초, 분당 ${meta.cuts.cutsPerMinute.toFixed(1)}컷)\n자동 검수: ${review.verdict}\n${formatFindings(review.claims)}`);
      for (const t of review.technical) console.log(`  - [hold] ${t.reason}`);
      if (!meta.mock) console.log(`\n영상을 직접 시청한 뒤: npm run dp -- approve sample ${a}`);
      return;
    }
    case 'review': {
      const { reviewRun } = await import('./review.mjs');
      return console.log(JSON.stringify(await reviewRun(a), null, 2));
    }
    case 'publish': return publish(a);
    case 'status': return status();
    default:
      console.log(HELP);
      process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`오류: ${error.message}`);
  process.exitCode = 1;
});
