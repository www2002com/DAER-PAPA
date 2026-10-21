// Claude 호출: 기획서 생성, 레퍼런스 비전 분석, 장면 프롬프트 변환, 생성 이미지 왜곡 검사.
import Anthropic from '@anthropic-ai/sdk';

const MODEL = process.env.DP_CLAUDE_MODEL ?? 'claude-opus-5-5';
let client;

export const usage = { input_tokens: 0, output_tokens: 0 };

export const imageBlock = (bytes, mediaType = 'image/jpeg') =>
  ({ type: 'image', source: { type: 'base64', media_type: mediaType, data: bytes.toString('base64') } });

export async function askJson({ system, content, schema, effort = 'high' }) {
  client ??= new Anthropic();
  const message = await client.beta.messages.stream({
    model: MODEL,
    max_tokens: 64000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort, format: { type: 'json_schema', schema } },
    system,
    messages: [{ role: 'user', content }],
  }).finalMessage();
  usage.input_tokens += message.usage.input_tokens;
  usage.output_tokens += message.usage.output_tokens;
  if (message.stop_reason === 'refusal') {
    throw new Error(`Claude가 요청을 거절했습니다: ${message.stop_details?.explanation ?? '사유 없음'}`);
  }
  if (message.stop_reason === 'max_tokens') throw new Error('Claude 응답이 max_tokens에서 잘렸습니다.');
  const text = message.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  return JSON.parse(text);
}
