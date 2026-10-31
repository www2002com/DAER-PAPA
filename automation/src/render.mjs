// 보고서 모듈 6 §5: 컷 클립을 1080x1920 세로 영상으로 배치하고, 내레이션·자막·화면 문구를 합쳐 MP4로 렌더링한다.
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';
import { ROOT } from './store.mjs';

const run = promisify(execFile);
const W = 1080;
const H = 1920;
const FPS = 30;
const CREAM = '0xF6F1E7';
const ENCODE = ['-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(FPS)];

export async function ffmpeg(args, cwd) {
  await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { cwd, maxBuffer: 1 << 26 });
}

export async function probe(file) {
  const { stdout } = await run('ffprobe', ['-v', 'error', '-show_entries',
    'format=duration:stream=codec_type,width,height', '-of', 'json', file]);
  const info = JSON.parse(stdout);
  const video = info.streams.find((s) => s.codec_type === 'video');
  return {
    duration: Number(info.format.duration),
    width: video?.width, height: video?.height,
    hasAudio: info.streams.some((s) => s.codec_type === 'audio'),
  };
}

export function fontsDir() {
  const candidates = [
    process.env.DP_FONT_DIR,
    path.join(ROOT, 'node_modules/pretendard/dist/public/static'),
    path.join(ROOT, '../node_modules/pretendard/dist/public/static'),
  ].filter(Boolean);
  return candidates.find((dir) => existsSync(dir)) ?? null;
}

// 같은 장면 안에서 컷마다 구도를 바꿔 1~2초 컷이 같은 화면의 반복으로 보이지 않게 한다.
const FRAMES = {
  wide: { f: 1, px: 0.5, py: 0.5, fit: 0.86 },
  tight: { f: 1.18, px: 0.5, py: 0.42, fit: 0.9 },
  left: { f: 1.12, px: 0.2, py: 0.5, fit: 0.8 },
  right: { f: 1.12, px: 0.8, py: 0.55, fit: 0.84 },
};

// kind: 'clip'(AI 영상) | 'still'(AI 이미지, 꽉 채움) | 'asset'(시안 이미지, 잘리지 않게 여백) | 'endcard'
// clip은 offset(원본 초)부터 speed(0.85~1.15, 보고서의 ±15% 보정) 배속으로 쓴다.
export async function renderCut({ kind, source, duration, out, framing = 'wide', offset = 0, speed = 1 }) {
  const { f, px, py, fit } = FRAMES[framing] ?? FRAMES.wide;
  const fill = `scale=${Math.round(W * f)}:${Math.round(H * f)}:force_original_aspect_ratio=increase,`
    + `crop=${W}:${H}:(iw-ow)*${px}:(ih-oh)*${py}`;
  const pad = `scale=${Math.round(W * fit)}:${Math.round(H * 0.62 * fit)}:force_original_aspect_ratio=decrease,`
    + `pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=${CREAM}`;
  const t = duration.toFixed(3);
  const args = {
    clip: ['-stream_loop', '-1', '-ss', offset.toFixed(3), '-i', source, '-vf', `setpts=PTS/${speed.toFixed(4)},${fill},fps=${FPS}`],
    still: ['-loop', '1', '-framerate', String(FPS), '-i', source, '-vf', fill],
    asset: ['-loop', '1', '-framerate', String(FPS), '-i', source, '-vf', pad],
    endcard: ['-f', 'lavfi', '-i', `color=c=${CREAM}:s=${W}x${H}:r=${FPS}`],
  }[kind];
  if (!args) throw new Error(`알 수 없는 컷 종류: ${kind}`);
  await ffmpeg([...args, '-t', t, '-an', ...ENCODE, out]);
}

const assTime = (t) => {
  const cs = Math.max(0, Math.round(t * 100));
  const h = Math.floor(cs / 360000);
  const m = Math.floor((cs % 360000) / 6000);
  const s = Math.floor((cs % 6000) / 100);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs % 100).padStart(2, '0')}`;
};
const assText = (t) => t.replace(/[{}]/g, '').replace(/\n/g, '\\N');

// events: [{ style: 'Caption'|'Overlay'|'Label'|'End', start, end, text }]
export function buildAss(events, font = process.env.DP_FONT_NAME ?? 'Pretendard') {
  const style = (name, size, primary, outline, border, align, marginV, bold = 0) =>
    `Style: ${name},${font},${size},${primary},&H000000FF,${outline},&H64000000,${bold},0,0,0,100,100,0,0,${border},4,1,${align},70,70,${marginV},1`;
  return [
    '[Script Info]', 'ScriptType: v4.00+', `PlayResX: ${W}`, `PlayResY: ${H}`, 'WrapStyle: 0', '',
    '[V4+ Styles]',
    'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
    style('Caption', 64, '&H00FFFFFF', '&H00202A22', 1, 2, 300, 1),
    style('Overlay', 78, '&H00FFFFFF', '&H00203A2B', 1, 8, 260, 1),
    style('Label', 40, '&H00203A2B', '&H00E7F1F6', 3, 8, 150),
    style('End', 84, '&H00203A2B', '&H00E7F1F6', 1, 5, 0, 1),
    '',
    '[Events]',
    'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
    ...events.map((e) => `Dialogue: 0,${assTime(e.start)},${assTime(e.end)},${e.style},,0,0,0,,${assText(e.text)}`),
    '',
  ].join('\n');
}

export async function renderFinal({ segments, audio, ass, total, out, cwd }) {
  await writeFile(path.join(cwd, 'segments.txt'), segments.map((s) => `file '${s}'`).join('\n'));
  await ffmpeg(['-f', 'concat', '-safe', '0', '-i', 'segments.txt', '-c', 'copy', 'video.mp4'], cwd);
  await writeFile(path.join(cwd, 'captions.ass'), ass);
  const dir = fontsDir();
  const subtitles = `subtitles=captions.ass${dir ? `:fontsdir='${dir}'` : ''}`;
  await ffmpeg(['-i', 'video.mp4', '-i', audio, '-map', '0:v', '-map', '1:a', '-vf', subtitles,
    '-af', 'apad', '-t', total.toFixed(3), ...ENCODE, '-c:a', 'aac', '-b:a', '160k',
    '-movflags', '+faststart', out], cwd);
}
