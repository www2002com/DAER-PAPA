# dearpapa.kr

## 2026-10-24 출시 알림 공개 상태

현재 기본값은 이메일 수집 비활성입니다. 홈·제품 페이지에는 공식 소식 경로를 안내합니다.
폼과 발송을 활성화하려면 `LAUNCH_NOTIFY_ENABLED=true`와 `RESEND_API_KEY`를 같은 환경에 설정하고 재배포해야 합니다.
정적 HTML은 빌드 시, API는 런타임에 이 조건을 확인합니다. 담당 정보·처리방침·발신 도메인과 실제 수신을 먼저 검증하세요.
키만 추가해서 수집이 우연히 시작되지 않습니다. 비활성 API는 저장·메일 전송 없이 503을 반환합니다.
런타임은 ESM을 사용합니다. API에서 참조하는 상대 모듈은 컴파일 결과의 `.js` 확장자를 명시합니다.

DEAR PAPA(디어파파) 공식 사이트 — 아빠의 매일에, 딸의 마음을.

Next.js(App Router) 정적 내보내기로 만든 사이트입니다. 서버 없이 `out/`의 HTML만으로 동작하며, Vercel이 빌드·배포합니다.

## 개발

Node.js 24 LTS를 사용합니다. `npm run build`는 편지 보존 회귀 테스트를 먼저 실행합니다.

출시 소식 신청 칸(`/api/launch-notify`)은 Vercel Function이라 `next dev`에서는 동작하지 않고 항상 "처리하지 못했어요" 오류가 보입니다. 로컬에서 신청 흐름까지 확인하려면 `vercel dev`를 쓰거나 프리뷰 배포에서 확인합니다. 서버 로직은 `npm test`의 `tests/launch-notify.test.tsx`로 검증합니다.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # out/ 생성 후 원문·주소·검색 데이터 보존 검사
npm run typecheck
npm test           # 빠른 페이지 이동·초과 저장·기존 편지 복원 회귀 검사
npm run verify:preservation
```

## 구조

| 경로 | 내용 |
|---|---|
| `lib/facts.ts` | 홈·FAQ에서 사용하는 공식 문구. 구조화 데이터는 아래 동기화 목록을 따릅니다. |
| `app/page.tsx` | 홈: 히어로 → 제품 → 브랜드 이야기 → 편지 쓰기 → 선물의 의미 → FAQ → 공식 채널 |
| `components/letter/` | 편지 쓰기. `card.ts`의 같은 좌표로 화면 미리보기와 PNG를 그립니다. |
| `components/home/` | 홈 섹션 |
| `components/article/` | 공식 정보·자료실 등 글 페이지 레이아웃 |
| `app/about/facts`, `app/journal`, `app/press`, `app/letter-all-in-one` | 글 페이지 (기존 URL 유지) |
| `public/` | 아이콘, `llm.md`·`llms.txt`·`facts.json` 등 AI용 공식 자료, sitemap, rss |
| `lib/preserved-site.json` | dearpapa.kr 원본 메타·JSON-LD·facts 본문·공식 문장 및 보호 파일 해시 |
| `app/@structuredData/` | 경로별 JSON-LD를 루트 `<head>`에 서버 렌더링 |
| `scripts/verify-preservation.mjs` | 초기 HTML과 공개 파일을 검사하는 빌드 보호 장치 |
| `automation/` | 광고 자동화 2단계 MVP 파이프라인(로컬 CLI). 사이트 빌드와 분리 — [automation/README.md](automation/README.md) |

## 문구와 검색 데이터 보존

먼저 [PRESERVATION.md](PRESERVATION.md)를 읽습니다. 새 디자인·새 문구는 유지하면서 기존 공식 문장과 제품 정보를 원문 그대로 함께 보존합니다. facts 본문은 원본 HTML을 직접 렌더링하며, 승인된 브랜드 이야기와 사진 제거 상태도 보호합니다.

원본은 2026-10-20 운영 사이트와 main `9faa32a`를 직접 대조했습니다. 페이지 9개와 루트 파일 9개를 기존 주소로 제공하고, JSON-LD 10개 블록을 각 페이지 `<head>`에 원문 그대로 넣습니다. 기준 원문과 해시는 사용자의 명시적인 변경 지시가 있을 때만 갱신합니다.

main 변경은 연결된 Vercel 프로젝트 `dearpapa`의 운영 배포를 실행합니다. 리뉴얼은 `codex/office-renewal-20261020` 브랜치에서 검토했고, 사용자가 2026-10-21 GitHub 저장과 운영 배포를 명시적으로 요청했습니다. `vercel.json`의 빌드 명령은 보존 검사까지 포함한 `npm run build`입니다.

## 확정 디자인 시트

[2026-10-21 디자인 기준](docs/design/2026-10-21/README.md)에 10쪽 PDF, 전체 디자인 키트, 디자인 값과 원본 파일 해시를 보관합니다. 웹 시트는 ZIP을 풀어 `index.html`로 열 수 있습니다. 이 문서 폴더는 사이트의 공개 페이지에 추가하지 않습니다.

## 편지 저장

편지는 브라우저 `localStorage`에만 저장되고 서버로 보내지 않습니다. 키와 형식은 이전 사이트와 같아서, 예전에 보관한 편지도 그대로 불러옵니다.

- `dearpapa.draft.v1` — 쓰던 편지 `{ text, from, editingId? }`
- `dearpapa.letters.v1` — 보관함 `[{ id, date, text, from }]` (최대 20통)

입력은 화면에 반영되는 즉시 저장합니다. 20통이 가득 차면 새 보관을 안내하며 기존 편지를 자동 삭제하지 않습니다. 이전 기기에 20통을 넘는 기록이 있으면 모두 불러오고, 사용자가 직접 정리하도록 유지합니다.

## 문의와 행동 측정

문의는 `/#contact`로 연결하며 전체 메뉴와 푸터에서 같은 이메일 복사 기능을 제공합니다. 메뉴의 복사 안내도 선택한 언어에 맞춥니다.

Vercel Web Analytics는 페이지 조회와 고정된 행동 이름만 측정합니다: `letter_entry_clicked`, `letter_started`, `letter_card_exported`, `contact_email_copied`, `social_channel_opened`. 편지 내용·보내는 사람·메일 내용은 전송하지 않으며 URL의 검색 조건과 해시는 제거합니다. Custom Events는 연결된 Pro/Enterprise 요금제에서 확인합니다.

주소 이동 검증은 배포 후 `node scripts/verify-legacy-redirects.mjs --url https://dearpapa.kr`로 실행합니다. Vercel이 `.html`과 끝 슬래시를 301로 정리하며 `/product/`도 최종 제품 주소로 바로 보냅니다.

## 서체

- 본문: Pretendard (SIL OFL) — `pretendard` 패키지의 동적 서브셋
- 편지: 나눔 펜 스크립트 (SIL OFL) — `next/font/google`로 빌드 시 자체 호스팅

## 리뉴얼 이미지

현재 화면은 `letter-all-in-one-deep-green-logo-v4.webp` 용기와 `letter-all-in-one-carton-sage-v1.webp` 단상자를 사용합니다. 용기와 단상자에 인쇄된 로고는 기존 상태이며, 웹 UI에는 확정한 통합 가로 로고를 사용합니다. 이전 시안과 링컨 합성 이미지는 복원용 자산으로 보관하지만 현재 페이지에서 렌더링하지 않습니다. Mobbin 참고 화면의 이미지나 코드는 복제하지 않았습니다.
