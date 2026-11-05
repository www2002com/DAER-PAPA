// 모듈 7 승인 지점. 승인은 사람만 기록한다(CLI가 터미널에서 이름과 확인을 받는다).
// 각 승인은 대상 파일의 SHA-256에 묶인다. 승인 후 파일이 바뀌면 승인은 무효다.
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT } from './store.mjs';

export const GATES = {
  plan: '기획서 승인 (샘플 생성 전)',
  sample: '샘플 컨펌 (사용자가 직접 시청)',
  publish: '게시 승인 (오가닉 게시 직전)',
};
export const LEDGER = process.env.DP_LEDGER ?? path.join(ROOT, 'approvals/ledger.jsonl');

export async function readLedger(ledger = LEDGER) {
  try {
    return (await readFile(ledger, 'utf8')).split('\n').filter(Boolean).map((line) => JSON.parse(line));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

export async function recordApproval({ gate, subject, hash, by, note = '' }, ledger = LEDGER) {
  if (!GATES[gate]) throw new Error(`알 수 없는 승인 지점: ${gate}`);
  if (!by?.trim()) throw new Error('승인자 이름이 필요합니다.');
  const entry = { gate, subject, hash, by: by.trim(), note, at: new Date().toISOString() };
  await mkdir(path.dirname(ledger), { recursive: true });
  await appendFile(ledger, `${JSON.stringify(entry)}\n`);
  return entry;
}

export async function findApproval(gate, subject, hash, ledger = LEDGER) {
  const entries = await readLedger(ledger);
  return entries.findLast((e) => e.gate === gate && e.subject === subject && e.hash === hash) ?? null;
}

export async function requireApproval(gate, subject, hash, ledger = LEDGER) {
  const entry = await findApproval(gate, subject, hash, ledger);
  if (!entry) {
    throw new Error(`${GATES[gate]}이(가) 없습니다: ${subject} (sha256 ${hash.slice(0, 12)}…). `
      + `내용을 확인한 뒤 \`npm run dp -- approve ${gate} ${subject}\`로 승인하세요.`);
  }
  return entry;
}
