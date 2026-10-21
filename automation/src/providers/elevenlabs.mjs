// 음성 생성: ElevenLabs text-to-speech with-timestamps (글자 단위 타임스탬프 포함).
import { writeFile } from 'node:fs/promises';
import { need } from '../store.mjs';

export async function synthesize(text, out) {
  const voice = need('ELEVENLABS_VOICE_ID');
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': need('ELEVENLABS_API_KEY'), 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model_id: process.env.ELEVENLABS_MODEL ?? 'eleven_multilingual_v2' }),
    },
  );
  if (!response.ok) throw new Error(`ElevenLabs ${response.status}: ${await response.text()}`);
  const body = await response.json();
  const { characters, character_start_times_seconds: starts, character_end_times_seconds: ends } = body.alignment;
  if (characters.length !== text.length) {
    throw new Error(`타임스탬프 글자 수(${characters.length})가 대사 글자 수(${text.length})와 다릅니다.`);
  }
  await writeFile(out, Buffer.from(body.audio_base64, 'base64'));
  return { starts, ends, seconds: ends.at(-1) };
}
