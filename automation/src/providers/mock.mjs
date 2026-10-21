// API 키 없이 파이프라인 전체를 검증하기 위한 목업 공급자. 결과물은 게시·승인 대상이 아니다.
import { ffmpeg } from '../render.mjs';
import { linearAlignment } from '../timeline.mjs';

const COLORS = ['0x8FA88A', '0xC9B79C', '0x6E8B74', '0xD8CBB5', '0x50685A'];

export async function image(n, out, cwd) {
  await ffmpeg(['-f', 'lavfi', '-i', `color=c=${COLORS[n % COLORS.length]}:s=1080x1920`,
    '-frames:v', '1', out], cwd);
}

export async function synthesize(text, out, cwd) {
  const alignment = linearAlignment(text);
  await ffmpeg(['-f', 'lavfi', '-i', `sine=frequency=220:duration=${alignment.seconds}`,
    '-af', 'volume=0.05', '-c:a', 'libmp3lame', out], cwd);
  return alignment;
}
