// API 키 없이 파이프라인 전체를 검증하기 위한 목업 공급자. 결과물은 승인·게시 대상이 아니다.
import { ffmpeg } from '../render.mjs';
import { linearAlignment } from '../timeline.mjs';

const COLORS = ['0x8FA88A', '0xC9B79C', '0x6E8B74', '0xD8CBB5', '0x50685A'];

export async function image(n, out) {
  await ffmpeg(['-f', 'lavfi', '-i', `color=c=${COLORS[n % COLORS.length]}:s=1024x1536`,
    '-vf', `drawbox=x=200+${n * 40}:y=500:w=400:h=400:color=white@0.5:t=fill`, '-frames:v', '1', out]);
}

// 움직임이 보이도록 이미지 위를 천천히 훑는 4초 클립.
export async function video(imagePath, out) {
  await ffmpeg(['-loop', '1', '-i', imagePath, '-t', '4', '-vf',
    "scale=1300:-2,crop=1024:1536:'(iw-ow)*t/4':0,fps=24", '-pix_fmt', 'yuv420p', out]);
}

export async function synthesize(text, out) {
  const alignment = linearAlignment(text);
  await ffmpeg(['-f', 'lavfi', '-i', `sine=frequency=220:duration=${alignment.seconds}`,
    '-af', 'volume=0.05', '-c:a', 'libmp3lame', out]);
  return alignment;
}
