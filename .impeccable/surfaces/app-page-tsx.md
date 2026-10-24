---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["components/home/Hero.tsx","app/globals.css"]
---

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
