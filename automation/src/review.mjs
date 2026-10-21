// 모듈 7 자동 검사. 승인은 하지 않는다 — 결과서만 남기고 사람이 샘플을 직접 시청한 뒤 승인한다.
import path from 'node:path';
import { checkPlan, verdictOf } from './claims.mjs';
import { probe } from './render.mjs';
import { hashFile, readJson, writeJson, RUNS } from './store.mjs';

export const runDir = (runId) => path.join(RUNS, runId);

export async function reviewRun(runId) {
  const dir = runDir(runId);
  const meta = await readJson(path.join(dir, 'metadata.json'));
  const plan = await readJson(path.join(dir, 'plan.json'));
  const video = path.join(dir, 'final.mp4');
  const media = await probe(video);
  const claims = checkPlan(plan);
  const technical = [];
  const flag = (ok, text) => { if (!ok) technical.push({ verdict: 'hold', reason: text }); };
  flag(media.width === 1080 && media.height === 1920, `해상도 ${media.width}x${media.height} (기준 1080x1920)`);
  flag(media.hasAudio, '오디오 트랙 없음');
  flag(media.duration >= 15 && media.duration <= 90, `길이 ${media.duration.toFixed(1)}초 (릴스 기준 15~90초)`);
  flag(await hashFile(video) === meta.contentHash, '영상 해시가 메타데이터와 다름 — 생성 후 파일이 바뀜');
  const report = {
    runId,
    verdict: verdictOf([...claims.findings, ...technical]),
    claims,
    technical,
    media,
    humanChecks: [
      'AI 왜곡: 손·손가락, 얼굴, 글자 뭉개짐이 있는 장면이 없는가',
      '용기·단상자 시안 장면에 "패키지 디자인 시안 · 개발 중" 표시가 보이는가',
      '편지 카드가 실제 손글씨처럼 연출되지 않았는가',
      '내레이션·자막·장면 전환의 싱크, 자막 오타',
    ],
    reviewedAt: new Date().toISOString(),
  };
  await writeJson(path.join(dir, 'review.json'), report);
  return report;
}
