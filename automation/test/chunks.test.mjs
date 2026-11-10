import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { cutStats, MAX_CUT_SECONDS, planCuts, splitLine, withChunks } from '../src/chunks.mjs';
import { readJson, ROOT } from '../src/store.mjs';

test('대사는 문장·쉼표 경계에서 2초 분량 청크로 나뉘고, 이으면 원문이 된다', () => {
  assert.deepEqual(splitLine('선물도 그래요. 고르다 보면 늘 비슷한 것만.'), ['선물도 그래요.', '고르다 보면 늘 비슷한 것만.']);
  assert.deepEqual(splitLine('디어파파 레터 올인원.'), ['디어파파 레터 올인원.']);
  const line = '편지 카드와 함께 건네는 아빠의 매일 한 병을 준비하고 있어요.';
  const chunks = splitLine(line);
  assert.ok(chunks.length >= 2);
  assert.equal(chunks.join(' '), line);
});

test('직접 쓴 청크가 대사와 다르면 거절한다', () => {
  const plan = { scenes: [{ n: 1, line: '아빠, 오늘도 고마워요.', chunks: [{ text: '아빠,' }, { text: '고마워요.' }] }] };
  assert.throws(() => withChunks(plan), /대사와 다릅니다/);
});

test('2.2초를 넘는 청크는 같은 자막으로 컷만 나누고, 장면 안에서 구도를 바꾼다', () => {
  const cuts = planCuts([
    { scene: 1, chunk: 0, start: 0, duration: 1.5 },
    { scene: 1, chunk: 1, start: 1.5, duration: 3.0 },
    { scene: 2, chunk: 0, start: 4.5, duration: 1.0 },
  ]);
  assert.equal(cuts.length, 4);
  assert.deepEqual(cuts.map((c) => c.chunk), [0, 1, 1, 0]);
  assert.ok(cuts.every((c) => c.duration <= MAX_CUT_SECONDS));
  assert.deepEqual(cuts.map((c) => c.framing), ['wide', 'tight', 'left', 'wide']);
  assert.ok(Math.abs(cutStats(cuts).cutsPerMinute - 4 / 5.5 * 60) < 1e-9);
});

test('저장소 기획서는 모두 청크로 나뉜다', async () => {
  for (const f of (await readdir(path.join(ROOT, 'plans'))).filter((x) => x.endsWith('.json'))) {
    const plan = withChunks(await readJson(path.join(ROOT, 'plans', f)));
    assert.ok(plan.scenes.every((s) => s.chunks.length >= 1), f);
  }
});
