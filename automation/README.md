# DEAR PAPA 광고 자동화 — 2단계 MVP 파이프라인

사이트(`dearpapa.kr`) 빌드와 분리된 로컬 CLI입니다. Vercel 빌드·보존 검사에 포함되지 않습니다.

2단계 범위(계획 문서 `SKILL.md` "다음 단계"):

1. **레퍼런스 분석** (모듈 4) — 영상 파일을 등록하면 장면 전환을 측정하고 Claude 비전으로 구조(훅·카피 골격·장면 흐름)만 분해합니다.
2. **가설·기획서** (모듈 5) — `data/hypotheses.json`의 가설 5종(활성 3, 보류 2)과 샘플 기획서 3편(`plans/H1~H3.json`).
3. **샘플 1편 생성** (모듈 6 경로 A) — 장면 이미지 → 영상화 → 내레이션(글자 단위 타임스탬프) → FFmpeg 렌더 → 1080x1920 MP4.
4. **검수·승인** (모듈 7) — 주장-근거 자동 대조, 기술 검사, 사람 확인 항목. 승인은 사람만, 파일 해시에 묶어 기록.
5. **게시** — 인스타그램 @dearpapa.kr 릴스(오가닉). 샘플 컨펌과 게시 승인이 모두 있어야 실행됩니다.

대량 변형·자동 업로드(3단계), 성과 수집·룰 엔진(4단계), 유료 집행은 범위 밖입니다. 이 도구에는 광고비를 쓰는 기능이 없습니다.

## 흐름과 승인 지점

```
ref add/analyze → plan new|check → [승인] approve plan → produce → review
                                         → [승인] approve sample → [승인] approve publish → publish
```

- 승인은 `approvals/ledger.jsonl`에 승인자·시각·대상 SHA-256으로 쌓입니다. 승인 뒤 기획서나 영상이 한 글자라도 바뀌면 승인은 무효입니다.
- `approve`는 터미널에서 이름과 `yes` 입력을 받아야만 기록됩니다(스크립트·자동 승인 불가).
- 주장 상태표(`data/claims.json`)의 사용 금지·개발 목표·증빙 대기 표현은 **거절**, 무향료·손글씨·시안 같은 조건부 표현은 **보류**(사람 확인)입니다. 거절이 있으면 생성·승인·게시가 모두 막힙니다.
- 용기·단상자는 AI로 만들지 않고 사이트에 공개된 시안 이미지만 쓰며, 화면에 "패키지 디자인 시안 · 개발 중"을 자동 표시합니다.
- 생성 이미지는 Claude가 손·얼굴 왜곡, 글자·로고·제품 노출을 검사해 걸리면 폐기 후 재생성합니다. 3회 실패하면 `work/manual-queue.jsonl`로 넘기고 멈춥니다.
- 편지 작성 기능의 편지 본문·보관함은 어떤 단계에서도 읽지 않습니다.

## 준비

Node 22.9 이상, FFmpeg(libass 포함).

```bash
cd automation
npm install
cp .env.example .env   # 키 입력
npm test               # 주장 대조·승인·타임라인 단위 테스트
```

| 키 | 용도 |
|---|---|
| `ANTHROPIC_API_KEY` | 기획서 생성, 레퍼런스 분석, 장면 프롬프트, 왜곡 검사 |
| `FAL_KEY` | 장면 이미지·영상 생성 (`DP_IMAGE_MODEL`, `DP_VIDEO_MODEL`로 모델 교체) |
| `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID` | 한국어 내레이션 |
| `IG_USER_ID`, `IG_ACCESS_TOKEN` | 인스타그램 프로페셔널 계정, `instagram_content_publish` 권한 |

## 사용

```bash
npm run dp -- plan check plans/H1.json          # 주장 대조
npm run dp -- produce plans/H1.json --mock      # 키 없이 파이프라인 검증(색 화면 + 무음 톤, 승인·게시 불가)
npm run dp -- approve plan plans/H1.json        # 기획서 승인
npm run dp -- produce plans/H1.json             # 실제 샘플 생성 (--motion still: 영상화 없이 정지 이미지 줌)
npm run dp -- approve sample <run-id>           # 영상을 직접 본 뒤
npm run dp -- approve publish <run-id>
npm run dp -- publish <run-id>
npm run dp -- status

npm run dp -- ref add ~/Downloads/ad.mp4 --brand "브랜드" --url "https://..." --bgm "잔잔한 피아노"
npm run dp -- ref analyze R-xxxxxxxxxx
npm run dp -- ref report                        # 소구 축별 3편 완료 기준 확인
npm run dp -- plan new H2                       # 레퍼런스 반영 기획서 초안 생성
```

결과물은 `work/runs/<run-id>/`(커밋 제외)에 `final.mp4`, `metadata.json`(가설 ID·모델·사용량·콘텐츠 해시), `review.json`(검수 결과서)으로 남습니다. 레퍼런스 원본 영상과 프레임은 `work/`에만 두고, `references/`에는 구조 분석 결과만 커밋합니다.

## 검증 상태

- 단위 테스트와 `--mock` 전체 실행(H1, 16장면, 58.1초, 1080x1920, 자막·시안 표시 포함)은 확인했습니다.
- 실제 외부 API(Claude, fal.ai, ElevenLabs, Instagram) 호출은 키가 없어 아직 실행하지 않았습니다. 첫 실제 실행에서 fal 모델 ID와 Instagram Graph API 버전이 현재 값인지 확인하세요.
- 레퍼런스 자동 수집은 넣지 않았습니다. 메타 광고 라이브러리 API는 한국 일반 광고를 제공하지 않으므로, 영상 파일을 직접 받아 등록합니다.
