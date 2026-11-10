// 모듈 2·7: 사람에게 보이고 들리는 모든 문구(대사·화면 문구·게시 캡션)를 주장 상태표와 대조한다.
// 자동 검사는 무결성을 보증하지 않는다. 사람 샘플링 검수와 승인을 대신하지 않는다.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { INPUTS } from './store.mjs';

const table = JSON.parse(readFileSync(path.join(INPUTS, 'claims.json'), 'utf8'));
const rules = table.rules.map((rule) => ({
  ...rule,
  regexes: rule.patterns.map((p) => new RegExp(p, 'i')),
  allow: rule.allowIf ? new RegExp(rule.allowIf) : null,
}));
const RANK = { pass: 0, hold: 1, reject: 2 };

const sentences = (text) => text.split(/(?<=[.!?。])\s+|\n+/).map((s) => s.trim()).filter(Boolean);

export function checkText(text, where) {
  const findings = [];
  for (const sentence of sentences(text)) {
    for (const rule of rules) {
      const hit = rule.regexes.map((r) => sentence.match(r)).find(Boolean);
      if (!hit) continue;
      if (rule.allow?.test(sentence)) continue;
      findings.push({
        where, sentence, match: hit[0], rule: rule.id, status: rule.status,
        verdict: table.statusVerdict[rule.status], reason: rule.reason,
      });
    }
  }
  return findings;
}

export function verdictOf(findings) {
  return findings.reduce((worst, f) => (RANK[f.verdict] > RANK[worst] ? f.verdict : worst), 'pass');
}

export function copyOf(plan) {
  const items = [];
  for (const scene of plan.scenes) {
    items.push([`장면 ${scene.n} 대사`, scene.line]);
    // 청크는 대사를 나눈 것이지만, 사람이 손으로 고친 청크도 따로 대조한다.
    for (const [i, chunk] of (scene.chunks ?? []).entries()) items.push([`장면 ${scene.n} 청크 ${i + 1}`, chunk.text]);
    if (scene.overlay) items.push([`장면 ${scene.n} 화면 문구`, scene.overlay]);
  }
  if (plan.post) items.push(['게시 캡션', [plan.post.caption, ...(plan.post.hashtags ?? [])].join('\n')]);
  return items;
}

export function checkPlan(plan) {
  const findings = copyOf(plan).flatMap(([where, text]) => checkText(text, where));
  return { verdict: verdictOf(findings), findings };
}

export function formatFindings({ verdict, findings }) {
  const label = { pass: '통과', hold: '보류(사람 확인 필요)', reject: '거절' }[verdict];
  const lines = [`주장-근거 대조: ${label}`];
  for (const f of findings) {
    lines.push(`  - [${f.verdict}] ${f.where}: "${f.match}" — ${f.reason}\n      ${f.sentence}`);
  }
  return lines.join('\n');
}
