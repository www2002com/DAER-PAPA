// 스킬 01: 레퍼런스 영상 역기획. Gemini가 영상(파일 또는 YouTube URL)을 보고 대본·컷 구조를 JSON으로 분해한다.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { analyzeVideo, isYouTube } from './providers/gemini.mjs';
import { OUTPUTS, ROOT, withRetry, writeJson } from './store.mjs';

const stamp = () => new Date().toISOString().replace(/[-:]/g, '').slice(0, 15);

export async function analyze(source) {
  if (!isYouTube(source)) source = path.resolve(source);
  const instruction = await readFile(path.join(ROOT, 'prompts/01_reverse_engineer.md'), 'utf8');
  const result = await withRetry(`역기획 ${source}`, () => analyzeVideo(source, instruction));
  const slug = isYouTube(source)
    ? `yt-${new URL(source).searchParams.get('v') ?? path.basename(new URL(source).pathname)}`
    : path.basename(source, path.extname(source));
  const file = path.join(OUTPUTS, 'references', `${slug}-${stamp()}`, '01_reverse_engineered_script.json');
  await writeJson(file, { source, model: process.env.DP_GEMINI_MODEL, analyzedAt: new Date().toISOString(), ...result });
  return { file, result };
}
