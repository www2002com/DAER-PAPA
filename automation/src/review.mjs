// 스킬 04 자동 검사. 승인은 하지 않는다 — 결과서만 남기고 사람이 샘플을 직접 시청한 뒤 승인한다.
import { MAX_CUT_SECONDS } from './chunks.mjs';
import { checkPlan, verdictOf } from './claims.mjs';
import { probe } from './render.mjs';
import { planFile } from './script.mjs';
import { hashFile, projectDir, readJson, runDir, writeJson } from './store.mjs';

export const finalFile = (runId) => projectDir(runId, 'render/final.mp4');

export async function reviewRun(runId) {
  const meta = await readJson(runDir(runId, 'metadata.json'));
  const plan = await readJson(planFile(runId));
  const video = finalFile(runId);
  const media = await probe(video);
  const claims = checkPlan(plan);
  const technical = [];
  const flag = (ok, text) => { if (!ok) technical.push({ verdict: 'hold', reason: text }); };
  flag(media.width === 1080 && media.height === 1920, `해상도 ${media.width}x${media.height} (기준 1080x1920)`);
  flag(media.hasAudio, '오디오 트랙 없음');
  flag(media.duration >= 15 && media.duration <= 90, `길이 ${media.duration.toFixed(1)}초 (릴스 기준 15~90초)`);
  flag(await hashFile(video) === meta.contentHash, '영상 해시가 메타데이터와 다름 — 생성 후 파일이 바뀜');
  flag(await hashFile(planFile(runId)) === meta.planHash, '02 파일이 조립 후 바뀜 — 다시 조립하세요');
  // 보고서 모듈 6 §5: 1~2초 컷, 1분에 17장면 이상.
  flag(meta.cuts.maxCutSec <= MAX_CUT_SECONDS + 0.01, `가장 긴 컷 ${meta.cuts.maxCutSec.toFixed(2)}초 (기준 ${MAX_CUT_SECONDS}초 이하)`);
  flag(meta.cuts.cutsPerMinute >= 17, `분당 컷 ${meta.cuts.cutsPerMinute.toFixed(1)}개 (기준 17개 이상)`);
  const report = {
    runId,
    verdict: verdictOf([...claims.findings, ...technical]),
    claims,
    technical,
    media,
    cuts: meta.cuts,
    humanChecks: [
      'AI 왜곡: 손·손가락, 얼굴, 글자 뭉개짐이 있는 컷이 없는가',
      '용기·단상자 시안 컷에 "패키지 디자인 시안 · 개발 중" 표시가 보이는가',
      '편지 카드가 실제 손글씨처럼 연출되지 않았는가',
      '내레이션·자막·컷 전환의 싱크, 자막 오타',
      '1~2초 컷 전환이 산만하지 않고 대사 흐름을 따라가는가',
    ],
    reviewedAt: new Date().toISOString(),
  };
  await writeJson(runDir(runId, 'review.json'), report);
  return report;
}
