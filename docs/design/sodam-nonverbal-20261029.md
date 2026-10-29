# Sodam 비언어 표현 r1 · 2026-10-29

사용자가 적용 범위를 ‘말풍선·스티커·캐릭터 안내를 표정과 몸짓으로 대체’로 확정했습니다. 편지 본문, 브랜드 설명과 실제 상담 답변은 유지합니다.

- 글쓰기 훈수/인사 대사, 스티커의 말풍선, 목소리 표시를 제거했습니다.
- 초대: 봉투를 들고 손으로 인사. 글쓰기/상담/응답 준비: 손을 모은 경청 자세.
- 말풍선과 안내를 봉투·하트·대기 점·하트가 담긴 대화 아이콘으로 전환했습니다. 키보드와 화면 낭독기의 기능 이름은 유지합니다.
- 홈페이지, 카카오톡 공유 이미지, Instagram 카드, 수신 페이지와 링크 미리보기에 연결했습니다.
- 승인된 149 BPM 춤은 기존 자산을 유지하고 글쓰기/상담 중 멈춥니다. 새 동영상 생성이나 유료 Sunra 크레딧 사용은 없습니다.
- 기존 PNG/WebP는 덮어쓰지 않고 public/media/sodam-nonverbal-r1/에 추가했습니다.

## 생성 및 검증

Built-in image_gen 도구를 사용했습니다. 두 원본 PNG는 1254×1254, RGBA(알파 최솟값 0·최댓값 255), 웹용 WebP는 768×768입니다. 말풍선/글자 없음, 왼쪽 접힌 귀·오른쪽 선 귀, 아이보리 스카프·오른쪽 초록 스티치, 둥근 팔다리, 봉투와 스카프 분리를 직접 확인했습니다.

푸터에 대한 Claude Code 후속 검토도 반영했습니다. 명시적 키보드 재생, 보이는 글자를 포함한 접근성 이름, SVG 자체의 최종 회전, 마운트 이후 재생 버튼, 입력 중인 키 이벤트 제외를 보완했습니다. 키보드 자동 재생 생략과 공식 로고 경로는 유지합니다.

## 최종 프롬프트

### sodam_nonverbal_delivery

참조: Sodam-letter-arrived-r2.png, Sodam-v2-3D-front-r1.png

Edit target: the first reference, the existing 3D Sodam letter-arrival sticker. Supporting identity reference: second reference, approved Sodam v2 3D front. Create one production transparent PNG cutout of the SAME Sodam character. Remove the entire speech balloon and every letter, word, punctuation mark and symbol from the target; replace those areas with genuine transparency. Keep Sodam's standing pose with one rounded paw lifted in a gentle welcome wave and the other holding a small plain ivory envelope at waist height, clearly separate from the ivory neck scarf with a visible band of blue torso between them. Recentre the complete character within a square canvas with 8% clear margin, no empty balloon-sized gap overhead. Preserve broad slightly asymmetric head, tiny dark navy oval eyes at subtly unequal heights, small calm mouth, cornflower-blue matte softly textured body, short bean torso and rounded stubby limbs. Viewer LEFT ear folded and viewer RIGHT ear standing; never mirror. Asymmetric ivory envelope-fold scarf, a tiny green stitch at viewer-right front edge, two unequal tails behind viewer-right shoulder. Gentle restrained adult-friendly emotion. Full ears, feet, waving hand and envelope all in frame. Physically coherent stable planted feet, consistent limb anatomy, hands touching their intended surfaces without penetration. Soft studio 3D shading on subject only. No speech balloon, typography, brand name, watermark, heart, sparkles, movement lines, base, background or baked ground shadow. Preserve real alpha transparency.

### sodam_nonverbal_listen

참조: Sodam-v2-3D-front-r1.png

Use the provided approved Sodam v2 3D front cutout as the identity and rendering reference. Produce a new single transparent PNG cutout of the SAME character silently listening with empathy: seated stable on its short rounded feet, both little paws gently resting together below the neck scarf in front of its blue belly, shoulders relaxed, head inclined only about five degrees, tiny navy oval eyes gently attentive toward the viewer, small closed calm smile. Communicate quiet companionship entirely through posture, not words. Preserve cornflower-blue matte soft texture, broad asymmetric head, restrained adult-friendly proportions, little bean torso, rounded limbs. Viewer LEFT ear folded, viewer RIGHT ear upright. Same asymmetric ivory envelope-fold scarf with tiny green stitch at viewer-right front and two unequal scarf tails behind viewer-right shoulder. Hands must not obscure the scarf or penetrate each other; limbs connected and plausible stable sitting posture. Square canvas full body including both ears and feet, centred with 8% clear margin. Consistent soft studio 3D shading on the character only. True transparent alpha background. Absolutely no writing, lettering, speech balloon, letters, logo, labels, symbols, props, sparkles, tears, pink cheeks, giant shiny eyes, floor, base, or ground shadow. The supplied reference is already the approved 3D adaptation; do not flatten or redraw it as 2D.
