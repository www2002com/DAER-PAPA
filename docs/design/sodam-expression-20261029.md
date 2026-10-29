# Sodam 표정 연출 r1 · 2026-10-29

사용자는 기존 얼굴이 딱딱하다며 김연아 선수의 연기처럼 감정이 살아 있는 표정 연출을 요청했습니다. 참고한 것은 인물의 외모가 아니라 시선·눈매·입꼬리·고개가 함께 감정을 전달하는 방식입니다.

- 환영: 미세하게 비대칭인 눈웃음, 작게 열린 미소, 올라간 볼과 편안한 손 인사.
- 경청: 작은 파란 눈썹의 비대칭, 집중하는 눈빛, 약 7도 기울인 고개와 모은 손.
- 기존 3D 정체성, 귀 방향, 스카프와 초록 스티치, 봉투의 분리, 발 접지를 보존했습니다.
- 기존 동작 상태에 새 표정을 연결합니다. 홈페이지 정지 초대/경청, 카카오톡 공유 이미지, Instagram 카드, 수신 페이지와 OG에 적용합니다.
- 기존 춤 영상은 보존합니다. 이번 작업은 표정 이미지 2종 교체이며 새 얼굴 애니메이션·영상·효과음 생성은 아닙니다.
- 감탄 발성과 효과음은 허용하지만 단어·문장 대사와 글자 장식은 제외합니다. 실제 편지·브랜드 설명·상담 답변·접근성 안내는 유지합니다.

## 파일

내장 image_gen 편집 모드, 투명 배경으로 제작했습니다. 원본 PNG는 1254×1254 RGBA, 웹용 WebP는 768×768입니다. 원본 알파 범위 0–255를 실제 검사했습니다.

- source/Sodam-welcome-smile-r1.png
- source/Sodam-attentive-listen-r1.png
- web/Sodam-welcome-smile-r1.webp
- web/Sodam-attentive-listen-r1.webp

작업 묶음: exports/Sodam-expression-r1/. 이전 이미지 파일은 보존합니다. 웹 배포 폴더: public/media/sodam-expression-r1/.

## 최종 프롬프트

### 환영
참조: exports/Sodam-nonverbal-r1/source/Sodam-letter-wave-r1.png

Use case: identity-preserve. Asset: production transparent 3D character cutout for DEAR PAPA website. Edit the supplied existing Sodam welcome image, preserving this exact recognizable character and the overall camera, full-body composition, blue material and proportions. The current face looks stiff: give Sodam a clear, expressive, graceful moment of joyful recognition. Both tiny dark navy eyes become smiling curved crescent eyes with slightly different relaxed lid arcs, cheeks lift subtly through face shape WITHOUT pink blush, and the little mouth becomes a small open joyful smile below the existing little nose, dark interior, NO teeth or tongue. The expression must be readable at a small 100px display size but remain restrained and warmly adult-friendly, not a generic huge anime face. Add a gentle 4-degree head inclination and a relaxed shoulder asymmetry to make gaze, face and body feel like one emotionally intentional performance. Keep the viewer-left rounded paw lifted in a tender welcome wave and the other holding the plain ivory envelope at belly height. Preserve a blue gap between the separate held envelope and the ivory neck scarf. Preserve cornflower-blue matte soft texture, broad asymmetric head, viewer LEFT folded ear, viewer RIGHT upright ear, tiny green stitch at viewer-right scarf edge, two unequal ivory scarf tails at viewer-right shoulder. Keep short rounded connected limbs, stable planted feet, coherent anatomy, no intersections. Square canvas, entire ears and feet visible with 8 percent breathing margin. Transparent alpha background. Soft studio shading on subject only. No words, letters, numbers, captions, speech balloon, symbols, heart, sparkles, makeup, eyelashes, human facial features, floor, shadow plane or watermark. This is an expressive adaptation of Sodam, no depiction of a human athlete. Only the facial expression and slight coordinated head/shoulder gesture should change.

### 경청
참조: exports/Sodam-nonverbal-r1/source/Sodam-quiet-listening-r1.png

Use case: identity-preserve. Edit the supplied approved 3D Sodam listening cutout. Create the SAME character with a visibly more expressive and emotionally present listening face, a graceful tender feeling of 'I am really with you' communicated without any text. Keep the seated posture, joined little paws resting below the scarf, short feet, camera and full-body proportions. Preserve the navy simple eye shapes but soften their upper eyelid contours, make the outer corners gently relaxed and inner eye area subtly lifted, with a tiny asymmetry that suggests focused compassionate attention. Add two very small soft blue sculpted brow ridges above the eyes, not black cartoon eyebrows, so expression lives in the face. Eyes remain small navy ovals, no large anime eyes, eyelashes or human whites. A tiny closed relaxed smile with one corner slightly lifted, neutral-compassionate rather than laughing, crying or looking sleepy. Head tilts 7 degrees toward viewer-left and leans very slightly toward the viewer; shoulders and paws relax coherently. The facial expression should be immediately legible at 100px size, distinctly different from a rigid neutral toy. Preserve blue matte texture and broad asymmetric head, viewer LEFT folded ear and viewer RIGHT upright ear, ivory envelope-fold scarf with the viewer-right green stitch and two unequal scarf tails. Paws anatomically separate and connected, no body or fabric penetration. Ears and feet entirely in frame, square transparent alpha canvas with 8 percent clear margin. Soft studio shading on character only. No pink cheeks, big glossy eyes, new accessories, heart, symbols, speech bubble, lettering, caption, watermark, floor or baked shadow. Maintain Sodam's own identity, not a human likeness. Change only facial expression and small coordinated head and shoulder gesture.

## 검증

- 165개 테스트·TypeScript·21개 정적 페이지 생성·9개 경로/10개 JSON-LD 및 공식 콘텐츠 보존 검사 통과.
- 실제 Chrome 수신 화면에서 환영 표정과 편지 열기 확인. 390px 모바일에서 상담 열기/닫기, 경청 이미지 로딩(768px), 가로 넘침 없음 확인.
- 원본 이미지 파일은 변경하지 않았으며 새 PNG 2종과 WebP 2종의 알파·크기·해시를 assets-verified.json에 기록했습니다.
