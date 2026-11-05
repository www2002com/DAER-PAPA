# Skill 01: 레퍼런스 영상 역기획

## 목적
성과가 검증된 숏폼 영상의 후킹·컷 구조·내레이션을 Gemini 비전으로 분해하고, DEAR PAPA 가설에 옮길 수 있는 구조만 골라낸다.

## 입력
- 레퍼런스 영상: 로컬 파일(mp4/mov/webm) 또는 YouTube URL (공개 영상)
- `outputs/customized_brand_core.json` (Skill 00)

## 실행
```bash
npm run dp -- analyze <영상파일|YouTube URL>
```
- Gemini(`DP_GEMINI_MODEL`)가 `prompts/01_reverse_engineer.md` 지시대로 분석한다.
- 결과: `outputs/references/<id>-<시각>/01_reverse_engineered_script.json`
  - durationSec, cutCount, avgCutSec, cutsPerMinute, hook, structure, scenes[], audio, captionStyle, cta, claimsUsed, transferable, notTransferable

## Claude가 할 일 (도구 실행 후)
1. JSON을 읽고 사용자에게 5줄 이내로 요약한다: 첫 3초 후킹, 분당 컷 수, 구성(문제 제기 → 전환 → 해결 → CTA 등), 10~15초마다 반전 지점.
2. `claimsUsed`의 주장(효능, 가격, 순위, 전문가 추천)은 **옮기지 않는다**. 구조만 옮긴다.
3. `transferable` 중 브랜드 코어의 활성 가설(H1~H3)에 맞는 것을 고르고, 02 스킬에서 쓸 매핑을 적는다:
   - 레퍼런스 장면 역할 → DEAR PAPA 장면 (예: "문제 제기" → "서랍 속 안 쓰는 선물")
4. 분당 컷 수가 17 미만이면 그 사실을 적는다. 우리 기준(1~2초 컷, 분당 17컷 이상)은 바뀌지 않는다.

## 수집 범위
- 지금은 사용자가 고른 영상 파일이나 URL만 분석한다. 자동 수집(검색·크롤링)은 도구가 정해질 때까지 하지 않는다.
- 연예인·인플루언서가 나오는 영상은 구조 분석에만 쓰고, 얼굴·목소리·문구를 소스로 쓰지 않는다.
- 다운로드 권한이 없는 영상을 내려받지 않는다. YouTube는 URL을 Gemini에 직접 넘긴다.

## 예외 처리
- Gemini 실패는 도구가 3회 재시도 후 `outputs/manual-queue.jsonl`에 남긴다. 원인(키, 모델 ID, 비공개 영상)을 확인해 사용자에게 알린다.
- 응답 JSON이 형식과 다르면 한 번 다시 실행하고, 그래도 다르면 원문을 저장해 두고 사용자에게 알린다.
