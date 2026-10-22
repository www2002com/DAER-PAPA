import { createHash } from 'node:crypto';
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const ROOT = fileURLToPath(new URL('../', import.meta.url));
// 보고서 스킬 체인: inputs/ → outputs/<run>/01·02·03 산출물. 실행 산출물은 git에 올리지 않는다.
export const INPUTS = path.join(ROOT, 'inputs');
export const OUTPUTS = process.env.DP_OUTPUTS_DIR ?? path.join(ROOT, 'outputs');
export const runDir = (runId, ...parts) => path.join(OUTPUTS, runId, ...parts);
export const projectDir = (runId, ...parts) => runDir(runId, '03_assembled_project', ...parts);

export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const hashFile = async (file) => sha256(await readFile(file));
export const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

export function need(name) {
  const value = process.env[name];
  if (!value) throw new Error(`환경 변수 ${name}가 필요합니다 (.env.example 참고).`);
  return value;
}

// 생성 실패는 3회까지 재시도하고, 그래도 실패하면 수동 큐로 넘긴다.
export async function withRetry(label, fn, attempts = 3) {
  let lastError;
  for (let i = 1; i <= attempts; i += 1) {
    try { return await fn(i); }
    catch (error) {
      lastError = error;
      console.warn(`  ! ${label} 실패 (${i}/${attempts}): ${error.message}`);
    }
  }
  await mkdir(OUTPUTS, { recursive: true });
  await appendFile(path.join(OUTPUTS, 'manual-queue.jsonl'),
    `${JSON.stringify({ label, error: lastError.message, at: new Date().toISOString() })}\n`);
  throw new Error(`${label}: ${attempts}회 실패 — 수동 큐(outputs/manual-queue.jsonl)로 이관했습니다.`);
}
