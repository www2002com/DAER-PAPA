// 보고서 모듈 6 §5: 1분에 17장면 이상, 컷은 1~2초, 대본 청크와 컷은 1:1.
// 장면 대사를 약 2초 분량(한국어 내레이션 초당 6~7자 기준 12자 안팎)의 청크로 나누고, TTS 시간으로 컷을 확정한다.
export const MAX_CHUNK_CHARS = 12;
export const MAX_CUT_SECONDS = 2.2;
export const FRAMINGS = ['wide', 'tight', 'left', 'right'];

const chars = (s) => s.replace(/\s/g, '').length;

// 문장 단위로 먼저 나누고, 긴 문장은 단어 경계에서 균등하게(쉼표 뒤 우선) 자른다. 청크를 공백으로 이으면 원래 대사가 된다.
export function splitLine(line, max = MAX_CHUNK_CHARS) {
  const sentences = line.trim().split(/(?<=[.!?])\s+/);
  return sentences.flatMap((sentence) => splitSentence(sentence, max));
}

function splitSentence(sentence, max) {
  const words = sentence.split(/\s+/);
  const total = chars(sentence);
  const k = Math.ceil((total - 2) / max); // 2자 여유: 14자 문장까지는 한 컷
  if (k <= 1) return [words.join(' ')];
  const cumulative = [];
  words.reduce((sum, w, i) => { cumulative[i] = sum + chars(w); return cumulative[i]; }, 0);
  const cuts = [];
  for (let part = 1; part < k; part += 1) {
    const target = (total * part) / k;
    let best = null;
    for (let i = (cuts.at(-1) ?? -1) + 1; i < words.length - 1; i += 1) {
      const cost = Math.abs(cumulative[i] - target) - (/,$/.test(words[i]) ? 3 : 0);
      if (best === null || cost < best.cost) best = { i, cost };
    }
    if (best) cuts.push(best.i);
  }
  const chunks = [];
  let from = 0;
  for (const i of [...cuts, words.length - 1]) {
    chunks.push(words.slice(from, i + 1).join(' '));
    from = i + 1;
  }
  return chunks;
}

// 기획서의 장면마다 chunks가 없으면 채우고, 있으면 대사와 일치하는지 확인한다.
export function withChunks(plan) {
  const scenes = plan.scenes.map((scene) => {
    const chunks = scene.chunks ?? splitLine(scene.line).map((text) => ({ text }));
    const joined = chunks.map((c) => c.text.trim()).join(' ');
    if (joined !== scene.line.trim().replace(/\s+/g, ' ')) {
      throw new Error(`장면 ${scene.n}: 청크를 이은 문장이 대사와 다릅니다.\n  대사: ${scene.line}\n  청크: ${joined}`);
    }
    return { ...scene, chunks };
  });
  return { ...plan, scenes };
}

// 생성 단계로 넘어가기 전 필수 항목 확인. 시안 자산 장면은 이미지 생성을 하지 않는다.
export function productionGaps(plan) {
  const gaps = [];
  for (const scene of plan.scenes) {
    if (!scene.asset && !scene.image_prompt) gaps.push(`장면 ${scene.n}: image_prompt 없음`);
    if (scene.asset && scene.video_prompt) gaps.push(`장면 ${scene.n}: 시안 자산 장면은 AI 영상화하지 않습니다(video_prompt 제거)`);
  }
  return gaps;
}

// 청크 시간(초) → 컷 목록. 2.2초를 넘는 청크는 같은 자막을 유지한 채 화면만 둘로 나눈다(구도 전환).
export function planCuts(chunkTimings, maxCut = MAX_CUT_SECONDS) {
  const cuts = [];
  const perScene = new Map();
  for (const t of chunkTimings) {
    const parts = Math.max(1, Math.ceil(t.duration / maxCut));
    for (let p = 0; p < parts; p += 1) {
      const index = perScene.get(t.scene) ?? 0;
      perScene.set(t.scene, index + 1);
      cuts.push({
        scene: t.scene, chunk: t.chunk, part: p,
        start: t.start + (t.duration * p) / parts, duration: t.duration / parts,
        framing: FRAMINGS[index % FRAMINGS.length], sceneCut: index,
      });
    }
  }
  return cuts;
}

export function cutStats(cuts) {
  const total = cuts.reduce((s, c) => s + c.duration, 0);
  return {
    cuts: cuts.length,
    avgCutSec: total / cuts.length,
    maxCutSec: Math.max(...cuts.map((c) => c.duration)),
    cutsPerMinute: (cuts.length / total) * 60,
  };
}
