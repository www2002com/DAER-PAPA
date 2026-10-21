// 대사 전체를 한 흐름으로 TTS한 뒤, 글자 단위 타임스탬프로 장면 길이와 자막 구간을 정한다(모듈 6 §4·5).

export function buildNarration(scenes) {
  let text = '';
  const spans = scenes.map((scene) => {
    if (text) text += ' ';
    const start = text.length;
    text += scene.line.trim();
    return { start, end: text.length };
  });
  return { text, spans };
}

// alignment: { starts: number[], ends: number[] } — narration 텍스트의 글자마다 하나씩.
export function sceneTimings(spans, alignment, audioSeconds, tail = 0.8) {
  const starts = spans.map((span, i) => (i === 0 ? 0 : alignment.starts[span.start]));
  return spans.map((_, i) => {
    const start = starts[i];
    const end = i + 1 < spans.length ? starts[i + 1] : audioSeconds + tail;
    return { start, duration: Math.max(end - start, 0.5) };
  });
}

export function captionChunks(text, spans, alignment, maxChars = 16) {
  const chunks = [];
  for (const span of spans) {
    const words = [...text.slice(span.start, span.end).matchAll(/\S+/g)].map((m) => {
      const first = span.start + m.index;
      const last = first + m[0].length - 1;
      return { text: m[0], start: alignment.starts[first], end: alignment.ends[last] };
    });
    let current = null;
    for (const word of words) {
      if (current && current.text.length + 1 + word.text.length > maxChars) {
        chunks.push(current);
        current = null;
      }
      current = current
        ? { text: `${current.text} ${word.text}`, start: current.start, end: word.end }
        : { ...word };
    }
    if (current) chunks.push(current);
  }
  return chunks;
}

// 목업·검증용: 글자당 일정 시간으로 정렬값을 만든다.
export function linearAlignment(text, secondsPerChar = 0.15) {
  const starts = [...text].map((_, i) => i * secondsPerChar);
  return { starts, ends: starts.map((s) => s + secondsPerChar), seconds: text.length * secondsPerChar };
}
