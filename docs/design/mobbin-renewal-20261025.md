# Mobbin 리뉴얼 · 2026-10-25

대상: app/page.tsx 및 공유 디자인 토큰. 방문 모드: Persuade.
사용자 확인: 디어파파, 이미지 시안 없이 바로 구현하고 PC·모바일 검증.

## 참고 화면

- [Face Formula 브랜드 소개](https://mobbin.com/sites/sections/ac5e58b2-68d4-4ade-bbb2-23ff9123c657): 여백과 서로 다른 크기의 이미지로 시선 순서를 만든다.
- [Face Formula 제품 소개](https://mobbin.com/sites/sections/f250562a-e07a-4040-a93a-06ae26fa0d33): 제품을 밝은 단색 면에 크게 놓고 이름과 설명을 가까이 둔다.
- [Dollar Shave Club](https://mobbin.com/sites/sections/aee0f6cd-d1db-4ebf-9267-69b883639afa): 짧은 대형 제목과 명확한 스킨케어 이미지의 위계.

이미지를 직접 확인한 뒤 배치 원칙만 적용한다. Mobbin 이미지·브랜드 카피·코드는 사이트에 복제하지 않는다.

## Direction contract

THESIS: 아빠의 일상에 놓일 스킨케어와 보내는 사람의 편지를 같은 시야에 둔다. 겹친 링·격자·장식 그림자로 제품을 둘러싸던 구성을 넓은 제품 장면으로 바꾼다.

OWN-WORLD: 파우더 블루의 넓은 면, 진한 잉크 블루 글자, 흰색 정보 영역, 옅은 로즈의 편지 영역. 기존 로고·Pretendard·손편지 서체와 토끼를 유지한다. 메뉴는 평평한 텍스트, 행동은 채운 버튼으로 구분한다.

STORY: 스킨케어 브랜드임을 이해하고 제품 개발 상태를 확인한 뒤 편지를 작성한다. 기존 제품·이야기·편지·선물·FAQ 순서와 보존 문구를 유지한다. 편지 진입과 제품 상세 링크가 첫 화면에 있다.

FIRST VIEWPORT: 왼쪽 큰 한국어 슬로건과 행동, 오른쪽 가리지 않은 용기·단상자와 하단 편지. 배경 전체가 한 장면이며 모서리 장식은 없다. 모바일은 슬로건→행동→제품→설명 순서로 전환한다. 토끼 인사 인터랙션은 편지 안에서 유지한다.

FORM: Mobbin 레퍼런스에 기반한 제품 룩북. seed d9d59e52는 실행했으며, 사용자 요청인 레퍼런스 기반 즉시 구현과 기존 승인 자산이 방향을 결정한다. 임의의 새 테마보다 제품 가독성을 우선한다. 대표 크기 1440×1000, 390×844, 좁은 화면 320px.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## 자산 출처

신규 래스터 없음. public/images/letter-all-in-one-deep-green-logo-v4.webp 및 letter-all-in-one-carton-sage-v1.webp는 기존 승인 제품 시안. letter-bunny-grid-v1.webp는 기존 승인 일러스트이며 docs/rabbit-image-source.md를 따른다. 원본 바이트는 수정하지 않는다.

## 검증 결과

- `npm run build`: 성공. 사전 테스트 10개 파일·81개 테스트 통과. TypeScript와 정적 내보내기 성공.
- 보존 검사: 9개 경로·10개 head JSON-LD·facts 본문·FAQ·기존 메타·루트 파일 9개·승인된 스토리 파일 보존. 기준값 수정 없음.
- 정적 출력 브라우저 검사: 1440×1000, 768×1024, 390×844, 320×800. 가로 넘침·깨진 이미지·JavaScript 오류 없음.
- 편지 CTA의 textarea 포커스, 토끼 인사, 용기/단상자 탭, FAQ 열기, 메뉴 열기/Escape 닫기 확인.
- 제품과 편지는 서로 다른 grid 행에 배치. 네 너비×세 인사 상태에서 제품 행과 편지 행 사이 16px 간격 유지.
- 독립 마감 검토: 태블릿 제품 가림 한 건 발견 후 수정. 동일 화면 재검토 결과 해당 수정 **resolved / ship**. 최초 전체 화면 검토에서 추가 중대 지적 없음.
- 원본 화면 캡처와 `checks.json`은 로컬 `.impeccable/review/`에 보관한다. 문서와 캡처는 공개 페이지에 추가하지 않는다.
- 운영 배포는 수행하지 않았다. 작업 브랜치: `design/mobbin-renewal-20261025`. 로컬 정적 미리보기: `http://127.0.0.1:3131`.
