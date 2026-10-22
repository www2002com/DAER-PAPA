# Skill 00: 브랜드 코어 (brand_product_customization)

## 목적
DEAR PAPA의 공개 가능한 제품 사실, 고객, 톤앤매너, 금지 표현을 한 파일로 묶어 01·02 스킬의 상위 가이드라인으로 쓴다.

## 입력
- `inputs/brand_info.json`: 제품·상태·브랜드 문구·고객·채널·시안 자산
- `inputs/claims.json`: 주장 상태표(금지·개발 목표·증빙 대기·조건부)
- `inputs/hypotheses.json`: 소구 가설 H1~H5 (H4·H5는 보류)

## 출력
`outputs/customized_brand_core.json`
```json
{
  "facts": ["사이트에 공개된 사실만, 출처 문장과 함께"],
  "unknown": ["가격, 전성분, 출시일 등 미확정 항목"],
  "personas": [{ "who": "딸(구매자)", "pain": "...", "desire": "...", "hypothesis": "H1" }],
  "hooks": [{ "hypothesis": "H1", "line": "첫 3초 질문", "visual": "공감 상황" }],
  "tone": { "do": ["차분한 독백", "구어체"], "dont": ["쇼핑몰 톤", "과장"] },
  "replacements": [{ "from": "촉촉한", "to": "(쓰지 않음 — 증빙 대기)" }],
  "promptGuide": "영문 이미지 프롬프트 공통 스타일 (plans/*.json의 style과 같게)"
}
```

## 절차
1. brand_info.json과 claims.json을 읽는다. 다른 출처(웹, 추측)로 사실을 보태지 않는다.
2. 페르소나는 구매자(딸·아들·배우자)와 사용자(40~60대 아빠)로 나누고, 고통·욕구를 각각 최대 3개로 정리한다. 연령대는 가설로 표시한다.
3. 활성 가설(H1~H3)마다 첫 3초 후킹 질문과 화면을 1개 이상 만든다. 효능·성분·가격으로 후킹하지 않는다.
4. claims.json의 reject·hold 표현마다 대체 표현을 적는다. 대체할 공개 사실이 없으면 "쓰지 않음"으로 둔다.
5. hooks와 tone의 문장을 claims.json 패턴과 대조한다. 02 스킬에서 `check`가 대본 전체를 다시 검사한다.

## 예외 처리
- **제품 정보가 비어 있으면 추론하지 않는다.** `unknown`에 적고 사용자에게 묻는다. (보고서의 "유사 셀링포인트 추론"은 적용하지 않음)
- 톤이 딱딱한 쇼핑몰 톤이면 차분한 구어체 독백으로 다시 쓴다.
- 브랜드 정보가 바뀌면 이 파일을 다시 만들고, 이미 승인된 02 파일은 다시 승인받는다.
