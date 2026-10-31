# DEAR PAPA 광고 소재 자동화 — 스킬 체인

사이트(`dearpapa.kr`) 빌드와 분리된 로컬 도구입니다. Vercel 빌드·보존 검사에 포함되지 않습니다.
구현 기준은 보고서 「AI 에이전트와 매체 API 연동 기반 대규모 광고 소재 자동 제작 및 운용 전략」입니다.

## 구조

```
skills/      Claude Code가 순서대로 따르는 스킬 문서 (각 150줄 이하) — 흐름과 판단 기준은 skills/README.md
inputs/      brand_info.json (공개 가능한 제품·브랜드 정보), claims.json (주장 상태표), hypotheses.json
plans/       가설별 기획서 원본 H1~H3 (H1은 청크·영문 프롬프트까지 작성됨)
prompts/     외부 모델에 보내는 지시문 (01 역기획)
src/         결정적 도구: 외부 API 호출, 주장 검사, 승인 기록, FFmpeg 조립
outputs/     실행 산출물 (git 제외)
approvals/   승인 기록 ledger.jsonl
```

| 스킬 | 도구 | 외부 서비스 | 출력 |
|---|---|---|---|
| 00 브랜드 코어 | — (Claude) | — | `outputs/customized_brand_core.json` |
| 01 레퍼런스 역기획 | `analyze` | Gemini | `outputs/references/<id>/01_reverse_engineered_script.json` |
| 02 대본·청크·프롬프트 | `init`, `check`, `crosscheck` | GPT (교차 검증) | `outputs/<run>/02_prompts_and_chunks.json` |
| 03 소스 생성·조립 | `images`, `videos`, `tts`, `assemble` | GPT 이미지, Veo/Omni, ElevenLabs, FFmpeg | `outputs/<run>/03_assembled_project/` |
| 04 검수·게시 | `review`, `approve`, `publish` | Instagram Graph API | `review.json`, `published.json` |
| 05 성과 관리·변주 | 없음 (잠김) | — | 유료 개시 승인 전 실행 금지 |

## 컷 규칙 (보고서 모듈 6 §5)

- 대사를 약 2초(12자 안팎) 청크로 나누고 **청크 1개 = 컷 1개**. 2.2초를 넘는 청크는 자막을 유지한 채 화면만 나눕니다.
- 같은 장면 안에서 컷마다 구도(wide/tight/left/right)를 바꿉니다.
- 영상 소스는 ±15% 안에서 속도를 보정합니다(0.85배속까지 늦춤).
- 자동 검수: 최장 컷 2.2초 이하, 분당 17컷 이상.

## 승인과 금지 사항

```
init → check → crosscheck → [승인] approve plan → images → videos → tts → assemble(+review)
     → [승인] approve sample → [승인] approve publish → publish
```

- 승인은 사람만 터미널에서 기록합니다(이름 + `yes`). 대상 파일 SHA-256에 묶여, 승인 뒤 파일이 바뀌면 무효입니다.
- 유료 생성(이미지·영상·TTS)은 승인된 02 파일로만 실행됩니다. 목업(`--mock`)은 승인 없이 돌지만 승인·게시할 수 없습니다.
- 주장 상태표의 사용 금지·개발 목표·증빙 대기 표현은 거절, 조건부 표현은 보류입니다.
- 용기·단상자는 공개된 시안 이미지만 쓰고 "패키지 디자인 시안 · 개발 중"을 자동 표시합니다.
- 광고비 집행·캠페인 생성·활성화 기능은 없습니다. 게시는 @dearpapa.kr 오가닉 릴스만입니다.
- 편지 작성 기능의 편지 본문은 어떤 단계에서도 읽지 않습니다.

## 준비

```bash
cd automation
npm install
cp .env.example .env   # 키와 모델 ID를 채웁니다 (모델 ID 기본값 없음)
```
Node 22.9 이상, `ffmpeg`/`ffprobe`가 필요합니다. 자막 글꼴은 `pretendard` 패키지를 씁니다.

## 실행 예

```bash
npm run dp -- analyze "https://www.youtube.com/watch?v=..."      # 01
npm run dp -- init plans/H1.json --ref outputs/references/.../01_reverse_engineered_script.json
npm run dp -- check <run>
npm run dp -- crosscheck <run>
npm run dp -- approve plan <run>                                  # 사람
npm run dp -- images <run>        # Claude가 이미지 왜곡 검사 → 필요 시 --redo 3,8 (1회)
npm run dp -- videos <run>
npm run dp -- tts <run>
npm run dp -- assemble <run>
npm run dp -- approve sample <run> && npm run dp -- approve publish <run>   # 사람
npm run dp -- publish <run>
npm run dp -- status
```

키 없이 전체 흐름 확인: `npm run dp -- init plans/H1.json --mock` 후 같은 순서로 `images`~`assemble`.

## 미정 항목

- 자동 수집 도구(지금은 사용자가 고른 파일·URL만 분석)
- 편집 툴 프로젝트 파일 형식(CapCut / Premiere) — 지금은 `project/timeline.json`과 자막 파일
- Typecast 사용 여부(지금은 ElevenLabs)
- 각 모델 ID와 영상 생성 경로(Veo / Gemini Omni)

## 테스트

```bash
npm test
```
