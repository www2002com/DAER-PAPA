# Skill 02: 대본 작성·청크 분할·프롬프트

## 목적
가설(H1~H3)과 레퍼런스 구조로 약 1분 대본을 쓰고, 1~2초 컷 단위 청크와 장면별 영문 이미지·영상 프롬프트를 붙인다.

## 입력
- `outputs/customized_brand_core.json` (Skill 00)
- `outputs/references/<id>/01_reverse_engineered_script.json` (Skill 01, 선택)
- `plans/H#.json` — 저장소의 기획서 원본. 새 가설이면 같은 형식으로 새로 쓴다.

## 기획서 형식 (보고서 필드와의 대응)
```jsonc
{
  "id": "H1", "title": "...", "targetSeconds": 55, "voice": "...", "bgm": "...",
  "style": "모든 이미지 프롬프트 뒤에 붙는 공통 스타일(영문)",
  "scenes": [{
    "n": 1,                          // scene_number
    "line": "장면 대사",              // script_chunk의 원문
    "chunks": [{ "text": "..." }],   // script_chunk (생략하면 도구가 자동 분할)
    "overlay": "화면 문구(선택)",
    "visual": "장면 설명", "camera": "카메라",   // visual_description
    "image_prompt": "영문, GPT 이미지용",       // image_prompt
    "video_prompt": "영문, 움직임만 서술"        // video_prompt (생략하면 정지 이미지 + 구도 전환)
  }],
  "post": { "caption": "...", "hashtags": [] },
  "variationAxes": { "hook": [], "firstScene": [], "copyOrder": [], "bgm": [] }
}
```
- 시안 자산 장면은 `"asset": "bottle-draft" | "carton-draft" | "endcard"`를 쓰고 프롬프트를 넣지 않는다.

## 대본 규칙
1. 길이 50~60초, 장면 14~17개. 첫 장면(3초 안)에 질문형 후킹.
2. 10~15초마다 시각적 전환(장소·인물·시점 바뀜)을 둔다.
3. 청크는 약 2초(한국어 12자 안팎). 문장·쉼표 경계에서 자른다. 청크를 공백으로 이으면 대사와 같아야 한다(도구가 검사).
4. 주장 상태표를 따른다. 효능·가격·성분·전문가·순위·구매 유도 표현 금지. 사이트 공개 사실만 쓴다.
5. 마지막 장면은 엔드카드: "출시 준비 중" + "프로필에서 소식 받기" 또는 "편지 먼저 써두기".
6. 편지 카드는 글자 없는 카드로만 연출한다. 손글씨처럼 보이게 하지 않는다.

## 프롬프트 규칙 (영문)
- 인물: "Korean woman in her late twenties", "Korean man in his fifties"처럼 나이·국적만. 실존 인물·연예인 이름 금지.
- 화면 속 휴대폰·쇼핑 화면·카드는 "blurred, unreadable"로 글자를 없앤다.
- 제품 용기·포장을 AI로 그리지 않는다(시안 자산 장면만 사용).
- 손 클로즈업은 왜곡 위험이 크다. 꼭 필요한 장면에만 쓴다.
- video_prompt는 이미지에 이미 있는 것을 다시 설명하지 말고 움직임과 카메라만 쓴다(4~8초 분량).

## 실행
```bash
npm run dp -- init plans/H1.json [--ref outputs/references/<id>/01_reverse_engineered_script.json]
npm run dp -- check <run>          # 주장 상태표 대조 (reject면 고친다)
npm run dp -- crosscheck <run>     # GPT 교차 검증 → 02_crosscheck.json
```
- init은 `outputs/<run>/02_prompts_and_chunks.json`을 만든다. 프롬프트가 빠진 장면이 있으면 거절한다.
- 대본을 고칠 때는 `plans/H#.json`을 고치고 다시 init 한다(실행 폴더 파일을 직접 고치면 승인 해시가 바뀐다).

## GPT 교차 검증 처리
- issues를 하나씩 읽고, 맞는 지적은 plans를 고쳐 반영한다. 반영하지 않는 지적은 이유를 사용자 보고에 적는다.
- GPT 판정은 참고 의견이다. 통과 기준은 `check` 결과와 사람 승인이다.

## 사용자에게 넘기기
대본 요약(후킹, 장면 수, 청크 수, 예상 길이), check 결과, 교차 검증 요약을 보내고 승인을 요청한다:
```bash
npm run dp -- approve plan <run>    # 사용자가 직접 터미널에서
```
