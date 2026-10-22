// OpenAI(REST). 보고서 지정 도구: 장면 이미지 생성(GPT 이미지)과 Claude 기획의 교차 검증(GPT).
import { writeFile } from 'node:fs/promises';
import { need } from '../store.mjs';

async function post(endpoint, body) {
  const response = await fetch(`https://api.openai.com/v1/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${need('OPENAI_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`OpenAI ${response.status}: ${await response.text()}`);
  return response.json();
}

// 세로(2:3) 이미지 1장. 렌더 단계에서 9:16으로 잘라 쓴다.
export async function image(prompt, out) {
  const body = await post('images/generations', { model: need('DP_GPT_IMAGE_MODEL'), prompt, size: '1024x1536', n: 1 });
  const b64 = body.data?.[0]?.b64_json;
  if (!b64) throw new Error('OpenAI 이미지 응답에 b64_json이 없습니다.');
  await writeFile(out, Buffer.from(b64, 'base64'));
}

// 구조화된 JSON 응답. schema는 strict JSON Schema.
export async function reviewJson(system, user, name, schema) {
  const body = await post('chat/completions', {
    model: need('DP_GPT_REVIEW_MODEL'),
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    response_format: { type: 'json_schema', json_schema: { name, schema, strict: true } },
  });
  return JSON.parse(body.choices[0].message.content);
}
