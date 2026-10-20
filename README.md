# dearpapa.kr

DEAR PAPA(디어파파) 공식 사이트 — 아빠의 매일에, 딸의 마음을.

Next.js(App Router) 정적 내보내기로 만든 사이트입니다. 서버 없이 `out/`의 HTML만으로 동작하며, Vercel이 빌드·배포합니다.

## 개발

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 정적 사이트를 out/ 에 생성
npm run typecheck
```

## 구조

| 경로 | 내용 |
|---|---|
| `lib/facts.ts` | 공식 문구의 단일 출처. 홈·FAQ·JSON-LD가 모두 여기서 읽습니다. |
| `app/page.tsx` | 홈: 히어로 → 편지 쓰기 → 이야기 → 제품 → 공식 정보·FAQ → 출시 소식 |
| `components/letter/` | 편지 쓰기. `card.ts`의 같은 좌표로 화면 미리보기와 PNG를 그립니다. |
| `components/home/` | 홈 섹션 |
| `components/article/` | 공식 정보·자료실 등 글 페이지 레이아웃 |
| `app/about/facts`, `app/journal`, `app/press`, `app/letter-all-in-one` | 글 페이지 (기존 URL 유지) |
| `public/` | 아이콘, `llm.md`·`llms.txt`·`facts.json` 등 AI용 공식 자료, sitemap, rss |

## 문구를 바꿀 때

공식 정보가 바뀌면 다음을 함께 고칩니다.

1. `lib/facts.ts`
2. `app/about/facts/page.tsx`
3. `public/llm.md`, `public/llms.txt`, `public/facts.json`, `public/answer.json`, `public/schema.jsonld`, `public/citation.txt`
4. `lib/home-jsonld.json` (홈 구조화 데이터)

"기획하고 만들고 있습니다", "심사를 준비", "출시 후 계획", "디자인 시안" 같은 표현은 확정 전 상태를 정확히 전하기 위한 것이므로 임의로 바꾸지 않습니다.

## 편지 저장

편지는 브라우저 `localStorage`에만 저장되고 서버로 보내지 않습니다. 키와 형식은 이전 사이트와 같아서, 예전에 보관한 편지도 그대로 불러옵니다.

- `dearpapa.draft.v1` — 쓰던 편지 `{ text, from, editingId? }`
- `dearpapa.letters.v1` — 보관함 `[{ id, date, text, from }]` (최대 20통)

## 서체

- 본문: Pretendard (SIL OFL) — `pretendard` 패키지의 동적 서브셋
- 편지: 나눔 펜 스크립트 (SIL OFL) — `next/font/google`로 빌드 시 자체 호스팅
