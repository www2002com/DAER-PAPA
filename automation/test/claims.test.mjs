import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { checkPlan, checkText, verdictOf } from '../src/claims.mjs';
import { readJson, ROOT } from '../src/store.mjs';

const verdict = (text) => verdictOf(checkText(text, 't'));

test('사용 금지·개발 목표·증빙 대기 표현은 거절한다', () => {
  for (const text of ['여드름 치료에 좋아요.', '피부과 추천 올인원', '국내 1위 올인원', '미백과 주름 개선을 한 번에',
    '세라마이드가 들어 있어요.', '촉촉한 보습감', '토리든보다 좋아요.', '19,900원에 만나보세요.', '지금 구매하기']) {
    assert.equal(verdict(text), 'reject', text);
  }
});

test('무향료·무에탄올은 기획 방향 문맥에서만 허용한다', () => {
  assert.equal(verdict('향료와 에탄올은 넣지 않는 방향으로 기획했어요.'), 'pass');
  assert.equal(verdict('무향료 무에탄올 올인원.'), 'hold');
});

test('손글씨·최종 제품 오인 표현은 사람 확인으로 보류한다', () => {
  assert.equal(verdict('아빠에게 손글씨 카드를 함께.'), 'hold');
  assert.equal(verdict('실제 제품을 공개합니다.'), 'hold');
});

test('사이트 공개 사실은 통과한다', () => {
  assert.equal(verdict('아빠의 매일에, 딸의 마음을.'), 'pass');
  assert.equal(verdict('가입 없이, 내 기기에만 저장돼요.'), 'pass');
  assert.equal(verdict('디어파파는 출시 준비 중이에요.'), 'pass');
});

test('저장소의 샘플 기획서는 모두 주장 대조를 통과한다', async () => {
  const files = (await readdir(path.join(ROOT, 'plans'))).filter((f) => f.endsWith('.json'));
  assert.ok(files.length >= 3);
  for (const f of files) {
    const result = checkPlan(await readJson(path.join(ROOT, 'plans', f)));
    assert.equal(result.verdict, 'pass', `${f}: ${JSON.stringify(result.findings)}`);
  }
});
