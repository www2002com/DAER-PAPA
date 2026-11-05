# 스킬 체인 (보고서 "대규모 광고 소재 자동 제작 및 운용 전략" 기준)

Claude Code가 이 폴더의 스킬을 순서대로 읽고 실행한다. 앞 스킬의 출력 파일이 다음 스킬의 입력이다.
판단(대본, 프롬프트, 왜곡 검사)은 Claude가 스킬을 따라 하고, 외부 API 호출·주장 검사·승인 기록은 `npm run dp --` 도구가 한다.

| 순서 | 스킬 | 입력 | 출력 |
|---|---|---|---|
| 00 | `00_brand_core.md` | `inputs/brand_info.json`, `inputs/claims.json` | `outputs/customized_brand_core.json` |
| 01 | `01_reference_reverse_engineer.md` | 레퍼런스 영상 파일 또는 YouTube URL | `outputs/references/<id>/01_reverse_engineered_script.json` |
| 02 | `02_script_chunking_and_prompt.md` | 01 결과, 브랜드 코어, `plans/H#.json` | `outputs/<run>/02_prompts_and_chunks.json`, `02_crosscheck.json` |
| 03 | `03_source_generation_and_assembly.md` | 승인된 02 파일 | `outputs/<run>/03_assembled_project/{assets,project,render}` |
| 04 | `04_review_and_publish.md` | 03 결과 | `review.json`, 승인 기록, 게시 |
| 05 | `05_performance_management_and_variation.md` | 게시·광고 성과 | `outputs/performance_report.json` (유료 개시 전까지 잠김) |

## 모든 스킬에 공통으로 적용되는 규칙

1. **사람 승인 3곳**: 02 파일 승인(유료 생성 전) → 샘플 컨펌(영상을 직접 본 뒤) → 게시 승인. 승인은 사람이 터미널에서만 기록하며, Claude는 승인 명령을 대신 실행하지 않는다.
2. **광고비 집행·캠페인 활성화는 하지 않는다.** 05 스킬은 사용자가 유료 개시를 따로 승인하기 전까지 문서로만 존재한다.
3. **편지(사용자가 쓴 편지) 내용은 어떤 단계에서도 읽거나 프롬프트·광고에 넣지 않는다.**
4. 출시 전이다. 효능·가격·구매 유도 문구, 실제 손글씨 연출, 최종 제품처럼 보이는 연출을 쓰지 않는다. CTA는 "프로필에서 소식 받기", "편지 먼저 써두기"만 쓴다.
5. 용기·단상자 이미지는 공개된 시안만 쓰고 "패키지 디자인 시안 · 개발 중" 표시를 붙인다(도구가 자동으로 붙인다).
6. 사이트(`../app`, `../public`)의 보존 파일은 수정하지 않는다.
7. 각 스킬 문서는 150줄 이하로 유지한다.

## 따르지 않는 보고서 항목

보고서의 다음 내용은 법규·플랫폼 정책·사이트 사실과 충돌해 적용하지 않는다: 윤리 가드레일 우회와 자극적 문구, 출시 전 효능·구매 유도 장면, 소재 삭제(일시정지로 대체), 사람 승인 없는 150슬롯 자동 교체·광고비 집행, 연예인·인플루언서 원천 소스, 제품 정보 누락 시 셀링포인트 추론.
