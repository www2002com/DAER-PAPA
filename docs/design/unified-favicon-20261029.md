# DEAR PAPA 파비콘 통일 · 2026-10-29

사용자는 일부 브라우저에서 P로 보이는 아이콘이 남아 있다고 보고했습니다. 점검 당시 운영 사이트의 SVG/ICO/PNG는 d/p 심볼이었으나 갈색·아이보리 색상과 버전 없는 경로를 사용했습니다. 특정 방문자의 기존 캐시가 P였는지는 직접 확인하지 않았습니다.

현재 헤더의 공식 d/p 심볼을 components/Logo.tsx에서 읽어 남색 #203c50, 파우더 블루 #e9f1f5로 SVG·PNG·ICO를 생성합니다. 각 브라우저가 어떤 형식을 선택하더라도 같은 심볼이 보입니다.

- 새 공통 경로: /brand/icons-r2/. 모든 페이지에 SVG(any), ICO(16/32/48), PNG(32), shortcut icon, Apple(180), manifest를 지정했습니다.
- 홈 화면: 192/512 PNG와 512 maskable. manifest 시작 경로·범위는 /로 고정해 하위 페이지에서 추가해도 같은 앱으로 열립니다.
- 기존 /favicon.ico·/favicon.svg·Apple·홈 화면 PNG·manifest도 동일한 파일로 갱신합니다. 버전 경로와 기존 경로 모두 재검증하도록 캐시 헤더를 지정했습니다.
- 이전 원본은 public/brand/icons-before-r2/ 및 작업 묶음 before/에 보존했습니다.
- 재생성: npm run icons:generate. 향후 디자인을 바꾸면 새 버전 경로로 만들고 메타데이터·검사를 함께 갱신합니다.
- 검증: npm run build에 verify:icons를 추가했습니다. 21개 HTML의 링크 일치, 모든 참조 파일 존재, 기존 경로의 바이트 일치, manifest 크기, ICO 각 프레임과 PNG 일치, maskable 안전 영역·불투명 배경을 검사합니다.

165개 기존 테스트·TypeScript·정적 빌드·공식 콘텐츠 보존 및 새 아이콘 검사 통과. Maskable 심볼의 최대 반경 193.81px로 204.8px 안전 원 안에 있습니다. www.dearpapa.kr은 dearpapa.kr로 308 리디렉션됨을 확인했습니다.

이전 즐겨찾기·설치된 홈 화면·검색 결과의 저장된 아이콘 갱신 시점은 각 브라우저와 서비스가 결정합니다. 이 변경은 운영 HTML/manifest/파일을 통일하고 새 아이콘 경로를 제공하며, 모든 외부 캐시를 즉시 삭제하지는 않습니다.

작업 묶음: exports/DEAR-PAPA-favicon-r2/. 새로운 AI 이미지 생성이나 유료 크레딧 사용 없이 기존 공식 벡터를 사용했습니다.
