# 출시 전 티저 이미지의 사이트 적용 · 2026-10-25

사용자 요청: 기준 이미지 네 장을 제시한 후 “사이트에 적용해봐”. 적용 범위는 홈페이지와 제품 상세 페이지의 이미지다. Seedance 영상 생성이나 운영 배포는 이 작업에서 수행하지 않았다.

## 적용

- 첫 화면: 용기·단상자·편지가 함께 놓인 장면. 기존 편지 토끼, 공식 슬로건, 편지/제품 CTA와 개발 시안 고지 유지.
- 제품 갤러리: 정면 용기, 기존 단상자 원본, 새 캡 접사, 나란히 놓인 패키지. 네 개 탭의 클릭·방향키·Home/End 탐색 유지. 로고와 시안 표기는 이미지 위의 별도 행에 둬 제품을 가리지 않게 했다.
- `/letter-all-in-one`: 패키지 이미지와 개발 시안 안내 추가. 본문·메타·JSON-LD·기존 앵커 보존.
- 기존 용기·단상자·토끼 원본 파일은 수정하지 않았다. 새 파일만 `public/images/campaign/`에 추가했다.

## 자산 출처와 변환

원본: 공식 사이트의 `letter-all-in-one-deep-green-logo-v4.webp`, `letter-all-in-one-carton-sage-v1.webp`. 모두 개발 중인 제품 렌더 시안이다. 실물 촬영 사진이나 확정된 소재·치수·판매 구성으로 설명하지 않는다.

제작: 2026-10-25 GPT 내장 imagegen으로 기준 이미지 생성, 실제 Claude Code 세션의 사실·연출 검토 반영. Seedance 작업 없음. 생성 문안은 작업 폴더 `outputs/dearpapa-seedance-20261025/image-prompts.json`, 제작 근거는 동일 폴더의 `production-notes-ko.md`와 `claude-factcheck.md`에 보관했다.

| 웹 파일 | 생성 원본 | 사용 위치 | 바이트 |
|---|---|---|---:|
| bottle.webp | shot-01-product.png | 갤러리 용기 | 23,980 |
| cap.webp | shot-02-cap-v2.png | 갤러리 캡 디테일 | 74,706 |
| packaging.webp | shot-03-packaging.png | 갤러리 함께 보기, 제품 상세 | 50,252 |
| letter-gift.webp | shot-04-letter-v3.png | 첫 화면 | 51,180 |

합계 200,118바이트(약 195KiB). 모두 1672×941을 유지한 WebP 품질 88 변환이며, 추가 생성·색 보정·내용 변경은 하지 않았다. 카드의 “Dear Papa,”는 공식 편지 인사말이다. 원본 비율은 유지하고, 사이트에서는 object-fit으로 주변 배경 일부만 크롭한다. 기존 로고 도형과 제품 인쇄를 별도로 다시 만들지 않았다.

## 확인

- `npm.cmd run build`: 10개 파일·81개 테스트 통과, TypeScript·정적 내보내기·보존 검사 통과.
- 실제 HTTP 보존 검사: 9개 경로·10개 head JSON-LD·공식 본문·메타·루트 파일 유지. 기준 파일 수정 없음.
- Chromium: 1440×1000, 768×1024, 390×844, 320×800에서 가로 넘침 없음, 콘솔 pageerror 없음. 네 갤러리 이미지 decode 성공.
- 갤러리 클릭, 오른쪽 방향키 끝→처음 이동, Home/End, 편지 입력 포커스, 토끼 응답, 메뉴/Escape 확인.
- JavaScript 비활성 상태에서 첫 화면 이미지·시안 고지·추가 갤러리 설명 확인.
- 네 화면의 첫 화면과 제품 갤러리, 상세 이미지를 직접 캡처로 확인. 시안 표기가 패키지 상단을 가리던 부분을 별도 행으로 옮긴 뒤 재검증했다.
- 확인 자료: 작업 폴더 `outputs/dearpapa-seedance-20261025/site-review/`. 브라우저 점검 스크립트 `outputs/verify-teaser-site.mjs`.

로컬 미리보기: http://127.0.0.1:51898
