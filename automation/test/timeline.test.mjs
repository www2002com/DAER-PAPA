import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildNarration, captionChunks, linearAlignment, sceneTimings } from '../src/timeline.mjs';

const scenes = [{ line: '아빠한테 마지막으로 편지 쓴 게 언제였더라.' }, { line: '씻고, 덜고, 바르고.' }];

test('장면 경계는 각 장면 첫 글자의 타임스탬프다', () => {
  const { text, spans } = buildNarration(scenes);
  assert.equal(text, `${scenes[0].line} ${scenes[1].line}`);
  const alignment = linearAlignment(text, 0.1);
  const timings = sceneTimings(spans, alignment, alignment.seconds, 0.5);
  assert.equal(timings[0].start, 0);
  assert.ok(Math.abs(timings[1].start - spans[1].start * 0.1) < 1e-9);
  const total = timings[1].start + timings[1].duration;
  assert.ok(Math.abs(total - (alignment.seconds + 0.5)) < 1e-9);
});

test('자막은 장면을 넘지 않고 최대 글자 수 안에서 끊긴다', () => {
  const { text, spans } = buildNarration(scenes);
  const chunks = captionChunks(text, spans, linearAlignment(text), 12);
  assert.ok(chunks.every((c) => c.text.length <= 12 || !c.text.includes(' ')));
  assert.equal(chunks.map((c) => c.text).join(' '), text);
  assert.ok(chunks.every((c, i) => i === 0 || c.start >= chunks[i - 1].start));
});
